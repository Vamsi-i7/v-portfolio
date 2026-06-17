import { useState } from 'react'
import { useSettings } from '@/hooks/queries/useSettings'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { MagneticButton } from '@/components/ui-custom/MagneticButton'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { trackEvent } from '@/lib/analytics'
import { GitBranch, AtSign, Send, MapPin } from 'lucide-react'
import { RevealText } from '@/components/ui-custom/RevealText'

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

  // Safely parse social links
  const socialLinks = typeof settings?.social_links === 'object' && settings.social_links 
    ? (settings.social_links as Record<string, string>)
    : {}

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
        description: 'There was an issue sending your message. Please try again or connect via LinkedIn.',
      })

      trackEvent('contact_submit', { status: 'failed' })
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
        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/30 mb-4 block">Communication</span>
        <RevealText id="contact-title" text="Initiate Impact" className="text-4xl sm:text-6xl font-display font-black tracking-tightest text-white uppercase" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
        
        {/* LEFT: Availability & Direct Channels */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
              <span className="text-[10px] font-black text-accent-primary uppercase tracking-widest">
                {settings?.availability_status || 'Available for Q3 2026'}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl text-white font-display font-medium leading-tight">
              {settings?.contact_headline || 'Looking for a staff-level partner to lead your next technical breakthrough?'}
            </h3>
            <p className="text-sm text-white/40 leading-relaxed max-w-[400px]">
              {settings?.contact_description || "Whether it's complex distributed systems, autonomous AI integration, or scaling product infrastructure, I'm ready to build."}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Direct Channels</h4>
            <div className="grid grid-cols-1 gap-3">
              {socialLinks.linkedin && (
                <ContactLink icon={<AtSign className="w-4 h-4" />} label="Network" value={socialLinks.linkedin.replace(/https?:\/\/(www\.)?/, '')} href={socialLinks.linkedin} />
              )}
              {socialLinks.github && (
                <ContactLink icon={<GitBranch className="w-4 h-4" />} label="Source" value={socialLinks.github.replace(/https?:\/\/(www\.)?/, '')} href={socialLinks.github} />
              )}
              {socialLinks.twitter && (
                <ContactLink icon={<Send className="w-4 h-4" />} label="Broadcast" value={socialLinks.twitter.replace(/https?:\/\/(www\.)?/, '')} href={socialLinks.twitter} />
              )}
            </div>
          </div>

          <div className="flex items-center gap-8 pt-4">
            <div className="space-y-1">
              <div className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-[0.3em]">Current Hub</div>
              <div className="flex items-center gap-2 text-xs font-bold text-white/60 uppercase">
                <MapPin className="w-3 h-3 text-accent-primary" />
                {settings?.location || 'Global / Remote'}
              </div>
            </div>
            <div className="w-[1px] h-8 bg-white/5" />
            <div className="space-y-1">
              <div className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-[0.3em]">Response Protocol</div>
              <div className="text-xs font-bold text-white/60 uppercase tracking-tight">
                {settings?.response_protocol || 'Under 12 Hours'}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Transactional Interface */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm shadow-2xl space-y-8">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[9px] font-black text-white/20 uppercase tracking-widest">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent-primary transition-colors"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-[9px] font-black text-white/20 uppercase tracking-widest">Digital Mail</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent-primary transition-colors"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-[9px] font-black text-white/20 uppercase tracking-widest">Message Brief</label>
              <textarea
                id="message"
                required
                rows={4}
                placeholder="Describe the system, the challenge, or the opportunity..."
                className="w-full bg-transparent border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent-primary transition-colors resize-none"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <div className="pt-4">
              <MagneticButton strength={15}>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto h-14 px-12 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-accent-primary hover:text-black transition-all rounded-full shadow-2xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Transmitting...
                    </div>
                  ) : (
                    <>
                      Transmit Inquiry
                      <Send className="ml-3 w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </MagneticButton>
            </div>
          </form>
        </div>

      </div>
    </AnimatedSection>
  )
}

interface ContactLinkProps {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}

function ContactLink({ icon, label, value, href }: ContactLinkProps) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-accent-primary/20 transition-all"
    >
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent-primary transition-colors">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{label}</div>
        <div className="text-sm font-bold text-white/80 truncate">{value}</div>
      </div>
    </a>
  )
}
