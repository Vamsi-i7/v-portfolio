import { useSettings } from '@/hooks/queries/useSettings'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { href: '#projects', label: 'Work' },
  { href: '#engineering', label: 'Engineering' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
]

export function Navbar() {
  const { data: settings } = useSettings()
  
  const siteTitle = settings?.site_title || 'V Portfolio'

  return (
    <header role="banner" className="fixed top-0 left-0 right-0 z-50 h-20 glass-card border-b border-white/5 hidden md:flex items-center">
      <div className="section-container w-full h-full flex items-center justify-between">
        
        {/* Logo / Brand */}
        <a 
          href="#home" 
          className="font-display font-black text-xl tracking-tightest text-primary transition-all hover:text-accent-primary"
          aria-label="Home"
        >
          {siteTitle.split(' ').map((word, i) => (
            <span key={i} className={i === 0 ? 'text-primary' : 'text-text-muted ml-1'}>{word}</span>
          ))}
        </a>

        {/* Desktop Navigation */}
        <nav aria-label="Desktop Navigation" className="flex items-center gap-12">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-bold uppercase tracking-widest text-text-secondary transition-all hover:text-accent-primary"
            >
              {link.label}
            </a>
          ))}
          
          <Button asChild size="sm" className="ml-4 h-10 px-6 bg-accent-primary text-black font-bold hover:bg-accent-primary-dark rounded-full shadow-lg shadow-accent-primary/10">
            <a href="#contact">Talk</a>
          </Button>
        </nav>
      </div>
    </header>
  )
}
