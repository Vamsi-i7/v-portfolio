import { useSettings } from '@/hooks/queries/useSettings'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#journey', label: 'Journey' },
  { href: '#about', label: 'About' },
]

export function Navbar() {
  const { data: settings } = useSettings()
  
  const siteTitle = settings?.site_title || 'V Portfolio'

  return (
    <header role="banner" className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-border/40 hidden md:flex items-center">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo / Brand */}
        <a 
          href="#home" 
          className="font-display font-bold text-lg tracking-tight text-primary transition-colors hover:text-accent-foreground"
          aria-label="V Portfolio Home"
        >
          {siteTitle}
        </a>

        {/* Desktop Navigation */}
        <nav aria-label="Desktop Navigation" className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          
          <Button asChild variant="default" className="btn-accent ml-4 h-10 px-5">
            <a href="#contact">Let's Talk</a>
          </Button>
        </nav>
      </div>
    </header>
  )
}
