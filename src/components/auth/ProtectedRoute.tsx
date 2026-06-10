import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute() {
  const { session, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Verifying secure session...
          </p>
        </div>
      </div>
    )
  }

  // Redirect to login if there's no active session
  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  // Render the child routes
  return <Outlet />
}
