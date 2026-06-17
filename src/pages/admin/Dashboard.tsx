import { useAuth } from '@/contexts/AuthContext'
import { useProjects } from '@/hooks/queries/useProjects'
import { useJourneyEntries } from '@/hooks/queries/useJourneyEntries'
import { useSkills } from '@/hooks/queries/useSkills'
import { Loader2 } from 'lucide-react'

export function Dashboard() {
  const { user } = useAuth()
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects()
  const { data: journeyEntries = [], isLoading: isLoadingJourney } = useJourneyEntries()
  const { data: skills = [], isLoading: isLoadingSkills } = useSkills()

  const isLoading = isLoadingProjects || isLoadingJourney || isLoadingSkills

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. You are authenticated as {user?.email}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-elevated">
          <h3 className="text-sm font-medium text-muted-foreground">Projects</h3>
          {isLoading ? (
            <div className="h-8 flex items-center mt-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <p className="text-2xl font-bold mt-2">{projects.length}</p>
          )}
        </div>
        <div className="card-elevated">
          <h3 className="text-sm font-medium text-muted-foreground">Journey Entries</h3>
          {isLoading ? (
            <div className="h-8 flex items-center mt-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <p className="text-2xl font-bold mt-2">{journeyEntries.length}</p>
          )}
        </div>
        <div className="card-elevated">
          <h3 className="text-sm font-medium text-muted-foreground">Skills</h3>
          {isLoading ? (
            <div className="h-8 flex items-center mt-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <p className="text-2xl font-bold mt-2">{skills.length}</p>
          )}
        </div>
      </div>
    </div>
  )
}
