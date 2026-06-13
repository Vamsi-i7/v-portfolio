import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  website?: string; // Honeypot field
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured.')
    }

    const body: ContactPayload = await req.json()
    const { name, email, message, website } = body

    // 1. Honeypot check (website field should be empty)
    if (website && website.trim() !== '') {
      console.warn('[SECURITY] Spam detected via honeypot:', { name, email, website })
      // Return 200 to trick bots into thinking they succeeded
      return new Response(JSON.stringify({ success: true, message: 'Message sent successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ success: false, error: 'Name, email, and message are required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Get recipient email from settings
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('email')
      .single()

    if (settingsError || !settings?.email) {
      console.error('[ERROR] Settings fetch failed:', settingsError)
      throw new Error('System error: Recipient email not found.')
    }

    // 4. Send email via Resend REST API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: settings.email,
        subject: `New Message from ${name} via Portfolio`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #000; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Message:</strong></p>
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px; line-height: 1.5; white-space: pre-wrap;">${message}</div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #888;">This email was sent from your portfolio contact form.</p>
          </div>
        `,
        reply_to: email,
      }),
    })

    const resData = await res.json()

    if (!res.ok) {
      console.error('[ERROR] Resend API failed:', resData)
      throw new Error(resData.message || 'Failed to send email.')
    }

    return new Response(JSON.stringify({ success: true, id: resData.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    console.error('[ERROR] Contact function:', message)
    
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
