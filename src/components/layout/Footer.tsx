import { useSettings } from '@/hooks/queries/useSettings'
import { ArrowUp, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const { data: settings } = useSettings()

  const socialLinks = settings?.social_links as Record<string, string> | null
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border/40 bg-surface">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              {settings?.site_title || 'V Portfolio'}
            </span>
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} {settings?.full_name || 'Vamsi'}. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks?.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-muted/50 rounded-md hover:bg-muted flex items-center justify-center">
                <i className="devicon-github-original text-xl" />
              </a>
            )}
            {socialLinks?.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-muted/50 rounded-md hover:bg-muted flex items-center justify-center">
                <i className="devicon-linkedin-plain text-xl" />
              </a>
            )}
            {socialLinks?.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-muted/50 rounded-md hover:bg-muted flex items-center justify-center">
                <i className="devicon-twitter-original text-xl" />
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} aria-label="Email" className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-muted/50 rounded-md hover:bg-muted md:hidden flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Back to Top */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={scrollToTop}
            className="text-muted-foreground hover:text-foreground"
          >
            Back to Top <ArrowUp className="ml-2 w-4 h-4" />
          </Button>

        </div>
      </div>
    </footer>
  )
}
