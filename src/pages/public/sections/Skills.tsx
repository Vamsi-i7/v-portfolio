import { useSkills } from '@/hooks/queries/useSkills'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Layout, Server, Database, Wrench, Terminal, Code2 } from 'lucide-react'

// Map categories to generic lucide icons since we don't have a brand icon registry
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Frontend': Layout,
  'Backend': Server,
  'Database': Database,
  'Tools': Wrench,
  'DevOps': Terminal,
  'Language': Code2
}

export function Skills() {
  const { data: skills, isLoading } = useSkills()

  if (isLoading) {
    return (
      <AnimatedSection id="skills" className="section-container bg-surface/30">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted w-32 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </AnimatedSection>
    )
  }

  // Group skills by category
  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  return (
    <AnimatedSection id="skills" className="section-container py-24 relative">
      <div className="mb-12">
        <span className="section-label mb-2">Technical Arsenal</span>
        <h2 className="text-section font-display font-bold tracking-tight">
          Skills & Technologies
        </h2>
      </div>

      {groupedSkills && Object.keys(groupedSkills).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedSkills)
            .sort(([a], [b]) => a.localeCompare(b)) // Alphabetical categories
            .map(([category, categorySkills]) => {
              const Icon = CATEGORY_ICONS[category] || Code2

              return (
                <div key={category} className="card-elevated group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-display font-semibold">{category}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categorySkills
                      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                      .map(skill => (
                        <span 
                          key={skill.id} 
                          className="px-3 py-1.5 text-sm font-medium bg-bg-base border border-border/50 rounded-full text-foreground/90 hover:border-accent/50 transition-colors cursor-default"
                        >
                          {skill.name}
                        </span>
                    ))}
                  </div>
                </div>
              )
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
          No skills to display. Add them in the admin dashboard.
        </div>
      )}
    </AnimatedSection>
  )
}
