import { useSettings } from '@/hooks/queries/useSettings'
import { ArrowUp, AtSign, Globe, Send } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

export function Footer() {
  const { data: settings } = useSettings()

  // Safely parse social links if they exist in settings
  const socialLinks = typeof settings?.social_links === 'object' && settings.social_links 
    ? (settings.social_links as Record<string, string>)
    : {}

  return (
    <footer className="footer-bar relative overflow-hidden">
      {/* Structural Accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="footer-inner py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 w-full">
          
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
              <span className="text-sm font-display font-black text-white uppercase tracking-widest">
                {settings?.full_name || 'Vamsi Krishna'}
              </span>
            </div>
            <p className="hidden md:block text-xs text-white/30 leading-relaxed max-w-[300px] uppercase font-bold tracking-wider">
              {settings?.footer_tagline || 'Designing architectures. Engineering impact. Shipping excellence since 2020.'}
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Index</h4>
            <nav className="flex flex-row md:flex-col flex-wrap gap-x-6 gap-y-2 md:gap-2">
              <FooterLink href="#projects">Selected Works</FooterLink>
              <FooterLink href="#engineering">Engineering DNA</FooterLink>
              <FooterLink href="#about">Philosophy</FooterLink>
              <FooterLink href="#contact">Contact</FooterLink>
            </nav>
          </div>

          {/* Social / Legal */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Channels</h4>
            <div className="flex flex-row flex-nowrap gap-3 justify-start items-center">
              <SocialIcon icon={<Globe className="w-4 h-4" />} href={socialLinks.github} label="GitHub" />
              <SocialIcon icon={<AtSign className="w-4 h-4" />} href={socialLinks.linkedin} label="LinkedIn" />
              {socialLinks.twitter && (
                <SocialIcon icon={<Send className="w-4 h-4" />} href={socialLinks.twitter} label="Twitter" />
              )}
            </div>
            <div className="pt-8 border-t border-white/[0.03] mt-8">
              <div className="text-[9px] font-mono text-white/10 uppercase tracking-widest">
                © {new Date().getFullYear()} {settings?.copyright_text || 'CORE.SYS OPERATING SYSTEM'}
              </div>
            </div>
          </div>
        </div>

        {/* Back to top float */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute bottom-16 right-8 md:right-16 p-4 rounded-full bg-white/[0.02] border border-white/5 hover:border-accent-primary/40 text-white/20 hover:text-accent-primary transition-all group"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a 
      href={href}
      className="text-[10px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-[0.1em] py-1.5 inline-block"
    >
      {children}
    </a>
  )
}

function SocialIcon({ icon, href, label }: { icon: React.ReactNode, href?: string, label: string }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/20 hover:text-accent-primary hover:border-accent-primary/20 transition-all shrink-0"
      style={{ width: '40px', height: '40px' }}
      aria-label={label}
      onClick={() => trackEvent('footer_social_click', { platform: label })}
    >
      {icon}
    </a>
  )
}
