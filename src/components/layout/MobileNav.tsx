import { Home, User, FolderGit2, Map, Mail } from 'lucide-react'

const MOBILE_NAV_LINKS = [
  { href: '#home', label: 'Home', icon: Home },
  { href: '#about', label: 'About', icon: User },
  { href: '#projects', label: 'Work', icon: FolderGit2 },
  { href: '#journey', label: 'Journey', icon: Map },
  { href: '#contact', label: 'Contact', icon: Mail },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/40 md:hidden pb-safe">
      <div className="flex items-center justify-around px-2 py-3">
        {MOBILE_NAV_LINKS.map((link) => {
          const Icon = link.icon
          return (
            <a
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center w-16 gap-1 text-muted-foreground transition-colors hover:text-primary active:scale-95"
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
              <span className="text-[10px] font-medium tracking-wide">{link.label}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
