import { useSettings } from '@/hooks/queries/useSettings'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Button } from '@/components/ui/button'
import { Mail, MapPin, Send } from 'lucide-react'

export function Contact() {
  const { data: settings } = useSettings()

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

        {/* Contact Form - Redirects to mailto to avoid needing backend */}
        <div className="card-elevated">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              if (settings?.email) {
                window.location.href = `mailto:${settings.email}`
              }
            }} 
            className="space-y-4"
          >
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input id="name" type="text" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea id="message" required rows={4} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Hello..." />
            </div>
            <Button type="submit" className="w-full btn-accent">
              <Send className="w-4 h-4 mr-2" /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </AnimatedSection>
  )
}
