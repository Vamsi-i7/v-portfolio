import { useAuth } from '@/contexts/AuthContext'

export function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. You are authenticated as {user?.email}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {/* Placeholder stats cards */}
        <div className="card-elevated">
          <h3 className="text-sm font-medium text-muted-foreground">Projects</h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
        <div className="card-elevated">
          <h3 className="text-sm font-medium text-muted-foreground">Journey Entries</h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
        <div className="card-elevated">
          <h3 className="text-sm font-medium text-muted-foreground">Skills</h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  )
}
