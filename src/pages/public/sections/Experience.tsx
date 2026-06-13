import { useExperiences } from '@/hooks/queries/useExperiences'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Calendar, Building2, MapPin } from 'lucide-react'

export function Experience() {
  const { data: experiences, isLoading } = useExperiences()

  if (isLoading) {
    return (
      <AnimatedSection id="experience" className="section-container bg-surface/30">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted w-48 rounded" />
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-xl w-full max-w-4xl" />
            ))}
          </div>
        </div>
      </AnimatedSection>
    )
  }

  if (!experiences || experiences.length === 0) {
    return null
  }

  const formatMonthYear = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(dateStr))
  }

  return (
    <AnimatedSection id="experience" className="section-container py-24 relative">
      <div className="mb-12">
        <span className="section-label mb-2">Career</span>
        <h2 className="text-section font-display font-bold tracking-tight">
          Professional Experience
        </h2>
      </div>

      <div className="space-y-8 max-w-4xl">
        {experiences.map((exp) => {
          // Safely parse description bullets if it's an array of strings
          const bullets = Array.isArray(exp.description_bullets) 
            ? (exp.description_bullets as string[]) 
            : []

          return (
            <div key={exp.id} className="card-elevated group relative overflow-hidden">
              
              {/* Highlight bar for current role */}
              {exp.is_current && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-success" />
              )}

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                
                {/* Header info */}
                <div className="flex gap-4 items-start">
                  {/* Company Logo or Fallback */}
                  <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {exp.company_logo_path ? (
                      <img 
                        src={exp.company_logo_path} 
                        alt={exp.company_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <Building2 className={`w-6 h-6 text-muted-foreground ${exp.company_logo_path ? 'hidden' : ''}`} />
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-bold group-hover:text-accent transition-colors">
                      {exp.role_title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground font-medium">
                      {exp.company_url ? (
                        <a href={exp.company_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent flex items-center gap-1.5">
                          {exp.company_name}
                        </a>
                      ) : (
                        <span className="flex items-center gap-1.5">{exp.company_name}</span>
                      )}
                      
                      {exp.location && (
                        <span className="flex items-center gap-1.5 border-l border-border pl-4">
                          <MapPin className="w-3.5 h-3.5" />
                          {exp.location} {exp.is_remote ? '(Remote)' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date range */}
                <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground bg-bg-base border border-border/50 px-3 py-1.5 rounded-md shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatMonthYear(exp.start_date)}</span>
                  <span>—</span>
                  <span className={exp.is_current ? 'text-success font-semibold' : ''}>
                    {exp.is_current ? 'Present' : (exp.end_date ? formatMonthYear(exp.end_date) : '')}
                  </span>
                </div>
              </div>

              {/* Description Bullets */}
              {bullets.length > 0 && (
                <ul className="space-y-3 mb-6 text-muted-foreground pl-5 relative">
                  {bullets.map((bullet, idx) => (
                    <li key={idx} className="relative before:content-[''] before:absolute before:left-[-1.25rem] before:top-2.5 before:w-1.5 before:h-1.5 before:bg-accent/50 before:rounded-full">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {/* Tech Stack */}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                  {exp.technologies.map((tech, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-xs font-medium bg-accent/5 border border-accent/10 rounded-md text-accent">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </AnimatedSection>
  )
}
