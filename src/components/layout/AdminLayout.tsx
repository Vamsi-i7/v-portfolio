import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { 
  LogOut, 
  LayoutDashboard, 
  FolderGit2, 
  Map, 
  Briefcase, 
  Trophy, 
  Award, 
  Code2, 
  Terminal, 
  Settings 
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/projects', icon: FolderGit2, label: 'Projects' },
  { to: '/admin/journey', icon: Map, label: 'Journey' },
  { to: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { to: '/admin/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/admin/certificates', icon: Award, label: 'Certificates' },
  { to: '/admin/skills', icon: Code2, label: 'Skills' },
  { to: '/admin/coding-profiles', icon: Terminal, label: 'Coding Profiles' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function AdminLayout() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-base hidden flex-col md:flex">
        <div className="h-14 flex items-center px-4 border-b border-border">
          <span className="font-display font-bold text-sm tracking-wide uppercase text-accent">V Portfolio</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header (minimal) */}
        <header className="h-14 border-b border-border bg-base flex items-center justify-between px-4 md:hidden">
          <span className="font-display font-bold text-sm tracking-wide uppercase text-accent">V Portfolio</span>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
