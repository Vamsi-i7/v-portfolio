import { useExperiences } from '@/hooks/queries/useExperiences'
import { useJourneyEntries } from '@/hooks/queries/useJourneyEntries'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Building2, ArrowUpRight } from 'lucide-react'
import { getPublicUrl } from '@/lib/storage'
import { motion } from 'framer-motion'

export function Experience() {
  const { data: experiences, isLoading: expLoading } = useExperiences()
  const { data: journeyEntries } = useJourneyEntries()

  if (expLoading || (!experiences?.length && !journeyEntries?.length)) return null

  const formatMonthYear = (dateStr: string) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(dateStr))

  // Collect milestone entries from Journey
  const milestones = journeyEntries
    ?.filter(e => !e.is_highlight)
    .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime())
    .slice(0, 5) ?? []

  return (
    <AnimatedSection id="experience" className="section-container relative" aria-labelledby="experience-title">
      <div className="mb-16">
        <span className="section-label">Experience</span>
        <h2 id="experience-title" className="text-section font-display font-bold tracking-tight mt-2">
          Career Path
        </h2>
      </div>

      <div className="exp-timeline">
        <div className="exp-timeline-line" aria-hidden="true" />

        {experiences?.map((exp, index) => {
          const logoUrl = exp.company_logo_path ? getPublicUrl('portfolio-assets', exp.company_logo_path) : null
          const bullets = Array.isArray(exp.description_bullets) ? exp.description_bullets as string[] : []
          const summary = bullets[0] || ''
          const metric = bullets[1] || null

          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="exp-entry group"
            >
              <div className={`exp-node ${exp.is_current ? 'exp-node-current' : 'exp-node-past'}`} />
              
              <div className="exp-card">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="exp-logo">
                      {logoUrl ? (
                        <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="w-4 h-4 text-text-muted" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary leading-tight">{exp.role_title}</h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-text-secondary mt-0.5">
                        {exp.company_url ? (
                          <a 
                            href={exp.company_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-accent-primary transition-colors flex items-center gap-1 font-medium"
                          >
                            {exp.company_name} <ArrowUpRight className="w-3 h-3" />
                          </a>
                        ) : <span className="font-medium text-text-primary">{exp.company_name}</span>}
                        <span className="text-text-muted">·</span>
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-text-muted uppercase tracking-widest pt-1">
                    {formatMonthYear(exp.start_date)} — {exp.is_current ? <span className="text-accent-primary">Present</span> : (exp.end_date ? formatMonthYear(exp.end_date) : '')}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
                    {summary}
                  </p>
                  {metric && (
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                      <span className="w-1 h-1 rounded-full bg-accent-primary" />
                      {metric}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6">
                  {exp.technologies?.slice(0, 6).map((tech, i) => (
                    <span key={i} className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] group-hover:text-accent-primary transition-colors">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* Milestones as lighter nodes */}
        {milestones.length > 0 && (
          <div className="mt-4 space-y-8">
            {milestones.map((m, i) => (
              <motion.div 
                key={m.id} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative flex items-baseline gap-6 group/milestone"
              >
                <div className="absolute -left-[30px] top-1.5 w-1.5 h-1.5 rounded-full bg-bg-border border border-bg-border group-hover/milestone:bg-accent-primary group-hover/milestone:scale-125 transition-all" />
                <span className="text-[10px] font-mono font-bold text-text-muted uppercase w-20 shrink-0 tracking-tighter">
                  {formatMonthYear(m.entry_date)}
                </span>
                <span className="text-sm font-bold text-text-secondary group-hover/milestone:text-text-primary transition-colors">{m.title}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  )
}
