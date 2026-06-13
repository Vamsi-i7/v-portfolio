import { useState } from 'react'
import { useSettings } from '@/hooks/queries/useSettings'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Button } from '@/components/ui/button'
import { Mail, MapPin, Send, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

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

      // Reset form on success
      setFormData({ name: '', email: '', message: '', website: '' })
    } catch (error: unknown) {
      console.error('Contact form error:', error)
      
      toast({
        variant: 'destructive',
        title: 'Send Failed',
        description: 'There was an issue sending your message. Opening your email client instead...',
      })

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
    <AnimatedSection id="contact" className="section-container py-16 md:py-24">
      <div className="mb-10 md:mb-16 max-w-2xl mx-auto text-center">
        <span className="section-label mb-2 justify-center">Get In Touch</span>
        <h2 className="text-section font-display font-bold tracking-tight mb-4">
          Let's Build Something Together
        </h2>
        <p className="text-muted-foreground text-lg">
          Whether you have a question, a project idea, or just want to say hi, my inbox is always open.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto items-start">
        {/* Contact Info */}
        <div className="space-y-8">
          {settings?.email && (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Email</h3>
                <a href={`mailto:${settings.email}`} className="text-muted-foreground hover:text-accent transition-colors">
                  {settings.email}
                </a>
              </div>
            </div>
          )}

          {settings?.location && (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Location</h3>
                <span className="text-muted-foreground">
                  {settings.location}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="card-elevated">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field - hidden from users */}
            <div className="hidden">
              <input 
                id="website" 
                type="text" 
                value={formData.website} 
                onChange={handleChange} 
                tabIndex={-1} 
                autoComplete="off" 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input 
                id="name" 
                type="text" 
                required 
                value={formData.name}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="John Doe" 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input 
                id="email" 
                type="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="john@example.com" 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message" 
                required 
                rows={4} 
                value={formData.message}
                onChange={handleChange}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="Hello..." 
              />
            </div>

            <Button type="submit" className="w-full btn-accent" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </AnimatedSection>
  )
}
