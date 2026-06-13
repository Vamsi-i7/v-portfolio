import { useSkills } from '@/hooks/queries/useSkills'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Layout, Server, Database, Wrench, Terminal, Code2, Cloud, Brain, Shield, Smartphone } from 'lucide-react'

// Enhanced icon mapping for category headers
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Frontend': Layout,
  'Backend': Server,
  'Database': Database,
  'Databases': Database,
  'Tools': Wrench,
  'DevOps': Terminal,
  'Language': Code2,
  'Languages': Code2,
  'Cloud': Cloud,
  'AI/ML': Brain,
  'Security': Shield,
  'Mobile': Smartphone
}

export function Skills() {
  const { data: skills, isLoading } = useSkills()

  if (isLoading) {
    return (
      <AnimatedSection id="skills" className="section-container bg-surface/30 py-16 md:py-24">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted w-48 rounded" />
          <div className="flex gap-8 mb-12 border-b border-border/50 pb-8">
             <div className="h-16 w-24 bg-muted rounded" />
             <div className="h-16 w-24 bg-muted rounded" />
          </div>
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-6">
                <div className="h-6 bg-muted w-32 rounded" />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
                  {[1, 2, 3, 4, 5, 6].map(j => (
                     <div key={j} className="h-28 bg-muted rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    )
  }

  // Calculate premium metrics
  const totalSkills = skills?.length || 0;
  const categoriesSet = new Set(skills?.map(s => s.category));
  const totalCategories = categoriesSet.size;

  // Group skills by category
  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  return (
    <AnimatedSection id="skills" className="section-container py-16 md:py-24 relative">
      {/* Section Header */}
      <div className="mb-10 md:mb-12">
        <span className="section-label mb-2">Technical Arsenal</span>
        <h2 className="text-section font-display font-bold tracking-tight">
          Skills & Technologies
        </h2>
      </div>

      {groupedSkills && Object.keys(groupedSkills).length > 0 ? (
        <>
          {/* Premium Section Summary */}
          <div className="flex flex-wrap gap-8 md:gap-12 mb-12 pb-8 border-b border-border/50">
            <div className="flex flex-col gap-1">
              <span className="text-4xl md:text-5xl font-display font-black text-foreground drop-shadow-sm">
                {totalSkills}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-semibold">
                Technologies
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-4xl md:text-5xl font-display font-black text-foreground drop-shadow-sm">
                {totalCategories}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-semibold">
                Domains
              </span>
            </div>
          </div>

          {/* Icon Grid grouped by Category */}
          <div className="space-y-16">
            {Object.entries(groupedSkills)
              .sort(([a], [b]) => a.localeCompare(b)) // Alphabetical categories
              .map(([category, categorySkills]) => {
                const Icon = CATEGORY_ICONS[category] || Code2

                return (
                  <div key={category} className="space-y-6">
                    {/* Category Header */}
                    <div className="flex items-center gap-3 border-b border-border/30 pb-3">
                      <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center text-accent">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight text-foreground/90">
                        {category}
                      </h3>
                    </div>

                    {/* Premium App Dock Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-5">
                      {categorySkills
                        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                        .map(skill => (
                          <div 
                            key={skill.id} 
                            className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl glass-card border border-border/50 bg-surface/50 hover:bg-surface hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(var(--accent-rgb),0.12)] cursor-default overflow-hidden"
                            title={skill.proficiency ? `${skill.name} - ${skill.proficiency}` : skill.name}
                          >
                            {/* Subtle Background Glow on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-b from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            
                            {/* Icon Container */}
                            <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110">
                              {skill.icon_identifier ? (
                                <>
                                  {/* Monochrome Base Icon */}
                                  <i className={`devicon-${skill.icon_identifier} text-4xl md:text-5xl text-foreground/60 transition-opacity duration-300 group-hover:opacity-0 absolute flex items-center justify-center`} />
                                  
                                  {/* Colored Reveal Icon */}
                                  <i className={`devicon-${skill.icon_identifier} colored text-4xl md:text-5xl opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 absolute flex items-center justify-center filter drop-shadow-md`} />
                                </>
                              ) : (
                                <Code2 className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground/50 group-hover:text-accent transition-colors duration-300" />
                              )}
                            </div>

                            {/* Technology Name - Always Visible, Allow 2 lines */}
                            <span className="relative z-10 text-[10px] sm:text-[11px] md:text-xs font-semibold text-center text-muted-foreground group-hover:text-foreground transition-colors duration-300 line-clamp-2 leading-tight w-full px-0.5">
                              {skill.name}
                            </span>
                          </div>
                      ))}
                    </div>
                  </div>
                )
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
          <div className="flex flex-col items-center justify-center gap-4">
            <Layout className="w-12 h-12 text-muted-foreground/30" />
            <p>No skills to display. Add them in the admin dashboard.</p>
          </div>
        </div>
      )}
    </AnimatedSection>
  )
}
