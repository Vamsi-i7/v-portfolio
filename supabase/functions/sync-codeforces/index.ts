import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CFUserInfo {
  handle: string;
  titlePhoto: string;
  rank?: string;
  maxRank?: string;
  rating?: number;
  maxRating?: number;
}

interface CFRatingChange {
  contestName: string;
  newRating: number;
  oldRating: number;
  ratingUpdateTimeSeconds: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Get Codeforces handle from settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('social_links')
      .single()

    if (settingsError) throw settingsError
    
    const socialLinks = settings.social_links as Record<string, string> | null
    const cfHandle = socialLinks?.codeforces
    if (!cfHandle) {
      throw new Error('Codeforces handle not configured in settings.')
    }

    // 2. Fetch User Info
    const userRes = await fetch(`https://codeforces.com/api/user.info?handles=${cfHandle}`)
    if (!userRes.ok) throw new Error(`Codeforces User Info Fetch Failed: ${userRes.statusText}`)
    const userData = await userRes.json()
    if (userData.status !== 'OK') throw new Error(`Codeforces API Error: ${userData.comment}`)
    const user = userData.result[0] as CFUserInfo

    // 3. Fetch Rating History
    const ratingRes = await fetch(`https://codeforces.com/api/user.rating?handle=${cfHandle}`)
    if (!ratingRes.ok) throw new Error(`Codeforces Rating Fetch Failed: ${ratingRes.statusText}`)
    const ratingData = await ratingRes.json()
    if (ratingData.status !== 'OK') throw new Error(`Codeforces API Error: ${ratingData.comment}`)
    const ratings = ratingData.result as CFRatingChange[]

    const lastContest = ratings.length > 0 ? ratings[ratings.length - 1] : null

    // 4. Construct Payload
    const payload = {
      schema_version: "1.1",
      metadata: {
        platform: 'codeforces',
        last_synced_at: new Date().toISOString(),
        sync_status: 'success'
      },
      profile: {
        handle: user.handle,
        avatar: user.titlePhoto,
        rank: user.rank || 'Unrated',
        max_rank: user.maxRank || 'Unrated'
      },
      stats: {
        rating: user.rating || 0,
        max_rating: user.maxRating || 0,
        contest_count: ratings.length
      },
      activity: {
        last_contest_name: lastContest?.contestName || 'N/A',
        last_rating_change: lastContest ? lastContest.newRating - lastContest.oldRating : 0,
        last_contest_date: lastContest ? new Date(lastContest.ratingUpdateTimeSeconds * 1000).toISOString() : new Date().toISOString()
      }
    }

    // 5. Upsert into coding_cache
    const { error: upsertError } = await supabase
      .from('coding_cache')
      .upsert({
        platform: 'codeforces',
        cache_key: 'profile',
        data: payload,
        fetch_status: 'success',
        fetched_at: new Date().toISOString()
      }, { onConflict: 'platform, cache_key' })

    if (upsertError) throw upsertError

    return new Response(JSON.stringify({ success: true, data: payload }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
