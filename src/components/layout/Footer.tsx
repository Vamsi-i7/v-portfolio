import { useSettings } from '@/hooks/queries/useSettings'
import { ArrowUp } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

export function Footer() {
  const { data: settings } = useSettings()

  const socialLinks = settings?.social_links as Record<string, string> | null
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const getSocialUrl = (platform: string, value: string) => {
    if (!value) return '#'
    if (value.startsWith('http')) return value
    if (value.includes('.com')) return `https://${value}`
    
    switch (platform) {
      case 'github': return `https://github.com/${value}`
      case 'linkedin': return `https://linkedin.com/in/${value}`
      case 'twitter': return `https://twitter.com/${value}`
      default: return `https://${value}`
    }
  }

  return (
    <footer role="contentinfo" className="py-16 border-t border-white/5 bg-bg-base/60 backdrop-blur-md pb-32 md:pb-16 relative z-10">
      <div className="section-container flex flex-col md:flex-row items-center justify-between gap-10">
        
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-text-primary">
              {settings?.full_name || 'Vamsi Krishna'}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">
            © {currentYear} · Engineered to Scale
          </span>
        </div>

        <div className="flex items-center gap-10">
          <div className="flex items-center gap-6">
            {socialLinks?.github && (
              <a
                href={getSocialUrl('github', socialLinks.github)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-text-muted hover:text-accent-primary transition-all hover:scale-110 text-xl"
                onClick={() => trackEvent('social_click', { platform: 'github' })}
              >
                <i className="devicon-github-original" />
              </a>
            )}
            {socialLinks?.linkedin && (
              <a
                href={getSocialUrl('linkedin', socialLinks.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-text-muted hover:text-accent-primary transition-all hover:scale-110 text-xl"
                onClick={() => trackEvent('social_click', { platform: 'linkedin' })}
              >
                <i className="devicon-linkedin-plain" />
              </a>
            )}
            {socialLinks?.twitter && (
              <a
                href={getSocialUrl('twitter', socialLinks.twitter)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-text-muted hover:text-accent-primary transition-all hover:scale-110 text-xl"
                onClick={() => trackEvent('social_click', { platform: 'twitter' })}
              >
                <i className="devicon-twitter-original" />
              </a>
            )}
          </div>

          <button
            onClick={scrollToTop}
            className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-colors group"
            aria-label="Back to top"
          >
            Top <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  )
}
