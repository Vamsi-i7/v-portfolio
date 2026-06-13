import { useSettings } from '@/hooks/queries/useSettings'
import { useExperiences } from '@/hooks/queries/useExperiences'
import { MapPin, Briefcase } from 'lucide-react'

export function Now() {
  const { data: settings } = useSettings()
  const { data: experiences } = useExperiences()

  // Find the current role
  const currentRole = experiences?.find(exp => exp.is_current)

  // Only render if we have either a location or a current role
  if (!settings?.location && !currentRole) {
    return null
  }

  return (
    <div className="section-container pb-16">
      <div className="glass-card rounded-2xl p-6 md:p-8 max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 border-l-4 border-l-accent">
        
        <div className="flex-shrink-0 pt-1">
          <span className="section-label mb-0 whitespace-nowrap">Currently</span>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          
          {/* Location */}
          {settings?.location && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Based in</span>
                <span className="font-medium">{settings.location}</span>
              </div>
            </div>
          )}

          {/* Current Role */}
          {currentRole && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 relative">
                <Briefcase className="w-4 h-4 text-success relative z-10" />
                {/* Pulsing indicator from PRD/CSS tokens */}
                <div className="absolute -top-1 -right-1 pulse-dot" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">{currentRole.company_name}</span>
                <span className="font-medium truncate max-w-[200px]" title={currentRole.role_title}>
                  {currentRole.role_title}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
