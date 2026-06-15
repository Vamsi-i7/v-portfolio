import { Home, Briefcase, FolderGit2, Map, Mail } from 'lucide-react'

const MOBILE_NAV_LINKS = [
  { href: '#home', label: 'Home', icon: Home },
  { href: '#projects', label: 'Work', icon: FolderGit2 },
  { href: '#experience', label: 'Exp', icon: Briefcase },
  { href: '#about', label: 'About', icon: Map },
  { href: '#contact', label: 'Talk', icon: Mail },
]

export function MobileNav() {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center md:hidden px-4 sm:px-8 pointer-events-none">
      <nav 
        role="navigation" 
        aria-label="Mobile Navigation" 
        className="bg-bg-surface/80 backdrop-blur-xl border border-white/5 rounded-full px-6 sm:px-8 py-3.5 flex items-center justify-between sm:justify-center gap-6 sm:gap-10 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto"
      >
        {MOBILE_NAV_LINKS.map((link) => {
          const Icon = link.icon
          return (
            <a
              key={link.href}
              href={link.href}
              className="text-text-secondary transition-all hover:text-accent-primary active:scale-75"
              aria-label={link.label}
            >
              <Icon className="w-5 h-5" strokeWidth={2.5} />
            </a>
          )
        })}
      </nav>
    </div>
  )
}
