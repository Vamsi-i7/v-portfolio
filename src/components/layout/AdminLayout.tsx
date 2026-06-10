import { Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AdminLayout() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r border-border bg-base hidden flex-col md:flex">
        <div className="h-14 flex items-center px-4 border-b border-border">
          <span className="font-display font-bold text-sm tracking-wide uppercase text-accent">V Portfolio</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2 bg-surface">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          {/* Add more nav items here in Wave 2 */}
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
