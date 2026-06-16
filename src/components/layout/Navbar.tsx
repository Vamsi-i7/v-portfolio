import { useSettings } from '@/hooks/queries/useSettings'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '#projects', label: 'Systems' },
  { href: '#engineering', label: 'Dashboard' },
  { href: '#experience', label: 'Path' },
  { href: '#about', label: 'Philosophy' },
]

export function Navbar() {
  const { data: settings } = useSettings()
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5, rootMargin: '-10% 0px -80% 0px' }
    )

    const sections = document.querySelectorAll('section[id]')
    sections.forEach((section) => observer.observe(section))

    return () => sections.forEach((section) => observer.unobserve(section))
  }, [])

  return (
    <header role="banner" className="fixed top-0 left-0 right-0 z-50 h-20 bg-black/40 backdrop-blur-md border-b border-white/[0.03] hidden md:flex items-center">
      <div className="section-container w-full h-full flex items-center justify-between">
        
        {/* Logo / Brand */}
        <a 
          href="#home" 
          className="font-display font-black text-xl tracking-tightest text-white uppercase transition-all hover:text-accent-primary flex items-center gap-2 shrink-0"
          aria-label="Home"
        >
          <div className="w-2 h-2 rounded-full bg-accent-primary" />
          <div className="flex items-baseline">
            {(settings?.full_name || 'Vamsi Krishna').split(' ').map((word, i) => (
              <span key={i} className={i === 0 ? 'text-white' : 'text-white/20 ml-1.5'}>{word}</span>
            ))}
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav aria-label="Desktop Navigation" className="flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.substring(1)
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-[9px] font-black uppercase tracking-[0.3em] transition-all hover:text-white ${isActive ? 'text-accent-primary' : 'text-white/40'}`}
              >
                {link.label}
              </a>
            )
          })}
          
          <div className="w-[1px] h-6 bg-white/10 mx-2" />

          <a 
            href="#contact" 
            className="h-10 px-6 inline-flex items-center justify-center bg-white text-black font-black uppercase tracking-widest text-[9px] hover:bg-accent-primary hover:text-black rounded-full shadow-2xl transition-all shrink-0"
          >
            Inquire
          </a>
        </nav>
      </div>
    </header>
  )
}
