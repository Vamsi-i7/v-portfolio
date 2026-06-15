import { useState } from 'react'
import { useSettings } from '@/hooks/queries/useSettings'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { MagneticButton } from '@/components/ui-custom/MagneticButton'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { trackEvent } from '@/lib/analytics'

export function Contact() {
  const { data: settings } = useSettings()
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '', // Honeypot
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase.functions.invoke('contact', {
        body: formData,
      })

      if (error) throw error
      if (data?.success === false) throw new Error(data.error || 'Failed to send message')

      toast({
        title: 'Message Sent',
        description: "Thank you for reaching out! I'll get back to you soon.",
      })

      trackEvent('contact_submit', { status: 'success' })

      // Reset form on success
      setFormData({ name: '', email: '', message: '', website: '' })
    } catch (error: unknown) {
      console.error('Contact form error:', error)

      toast({
        variant: 'destructive',
        title: 'Send Failed',
        description: 'There was an issue sending your message. Opening your email client instead...',
      })

      trackEvent('contact_submit', { status: 'fallback' })

      // Fallback to mailto
      if (settings?.email) {
        const subject = encodeURIComponent(`Message from ${formData.name}`)
        const body = encodeURIComponent(formData.message)
        window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  return (
    <AnimatedSection id="contact" className="section-container relative" aria-labelledby="contact-title">
      <div className="mb-16">
        <span className="section-label">Connect</span>
        <h2 id="contact-title" className="text-section font-display font-bold tracking-tight mt-2">
          Let's ship something.
        </h2>
      </div>

      <div className="contact-grid-premium">
        
        {/* LEFT: PITCH & SOCIAL (60%) */}
        <div className="flex flex-col justify-between py-2">
          <div className="max-w-md space-y-10">
            <p className="text-2xl font-medium text-text-secondary leading-tight">
              Have a high-impact project in mind? I'm currently open to selective engineering roles and high-stakes consulting.
            </p>
            
            <div className="flex flex-col gap-6">
               <p className="text-xl font-bold text-primary">
                 Use the secure form to reach my private inbox directly.
               </p>
            </div>
          </div>

          <div className="mt-16 lg:mt-0 space-y-1">
            <div className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.3em] mb-2">Based In</div>
            <div className="text-base font-bold text-primary">{settings?.location || 'Global / Remote'}</div>
          </div>
        </div>

        {/* RIGHT: MINIMAL FORM (40%) */}
        <form onSubmit={handleSubmit} className="contact-form-premium" noValidate>
          <div className="hidden" aria-hidden="true">
            <input 
              id="website" 
              type="text" 
              value={formData.website} 
              onChange={handleChange} 
              tabIndex={-1} 
              autoComplete="off" 
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="name" className="contact-label-minimal">Name</label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="contact-input-minimal"
              placeholder="What should I call you?"
              autoComplete="name"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="contact-label-minimal">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="contact-input-minimal"
              placeholder="Where should I reply?"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="message" className="contact-label-minimal">Project Details</label>
            <textarea
              id="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="contact-input-minimal resize-none"
              placeholder="Tell me about your project, timeline, and goals..."
            />
          </div>

          <div className="pt-6">
            <MagneticButton strength={15}>
              <Button
                id="contact-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="h-16 px-12 bg-accent-primary text-black font-bold text-lg hover:bg-accent-primary-dark rounded-full shadow-[0_0_30px_rgba(255,149,0,0.15)] group transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send className="ml-4 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </Button>
            </MagneticButton>
          </div>
        </form>

      </div>
    </AnimatedSection>
  )
}
