import { useExperiences } from '@/hooks/queries/useExperiences'
import { useJourneyEntries } from '@/hooks/queries/useJourneyEntries'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Building2, ArrowUpRight } from 'lucide-react'
import { getPublicUrl } from '@/lib/storage'
import { motion } from 'framer-motion'
import { RevealText } from '@/components/ui-custom/RevealText'

export function Experience() {
  const { data: experiences, isLoading: expLoading } = useExperiences()
  const { data: journeyEntries } = useJourneyEntries()

  if (expLoading || (!experiences?.length && !journeyEntries?.length)) return null

  const formatMonthYear = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(dateStr))
    } catch {
      return dateStr
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <AnimatedSection 
        id="experience" 
        className="section-container relative py-12 md:py-16" 
        aria-labelledby="experience-title"
      >
        <div className="mb-12">
          <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/30 mb-4 block">Experience</span>
          <RevealText text="Professional Path" className="text-4xl sm:text-6xl font-display font-black tracking-tightest text-white uppercase" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences?.map((exp, index) => {
            const logoUrl = exp.company_logo_path ? getPublicUrl('portfolio-assets', exp.company_logo_path) : null
            const bullets = Array.isArray(exp.description_bullets) ? exp.description_bullets as string[] : []
            const technologies = Array.isArray(exp.technologies) ? exp.technologies : []
            const impactStatement = bullets[0] || ''

            const durationText = `${formatMonthYear(exp.start_date)} — ${exp.is_current ? 'Present' : (exp.end_date ? formatMonthYear(exp.end_date) : '')}`
            const statusText = exp.is_current ? 'Active' : 'Completed'

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col h-[220px] p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all group relative overflow-hidden justify-between shadow-lg"
              >
                {/* Header: Logo & Role */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 shrink-0 group-hover:bg-white/10 transition-colors">
                    {logoUrl ? (
                      <img src={logoUrl} alt="" className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <Building2 className="w-5 h-5 text-white/20" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white tracking-tight leading-snug truncate">
                      {exp.role_title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-mono mt-0.5">
                      {exp.company_url ? (
                        <a 
                          href={exp.company_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-accent-primary transition-colors inline-flex items-center gap-0.5"
                        >
                          {exp.company_name} <ArrowUpRight className="w-3 h-3" />
                        </a>
                      ) : (
                        <span>{exp.company_name}</span>
                      )}
                      <span>•</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description / Impact Statement */}
                <p className="text-xs text-white/60 leading-relaxed line-clamp-2 my-2">
                  {impactStatement}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1 mb-2 overflow-hidden max-h-[28px]">
                  {technologies.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded bg-white/[0.02] border border-white/5 text-[9px] font-mono text-white/40 group-hover:text-accent-primary group-hover:border-accent-primary/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Duration ———— Status */}
                <div className="flex items-center justify-between text-[10px] font-mono text-white/30 pt-2 border-t border-white/5 mt-auto">
                  <span>{durationText}</span>
                  <div className="flex-grow mx-3 border-t border-dashed border-white/10" />
                  <span className="text-accent-primary uppercase font-bold tracking-wider text-[9px]">{statusText}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Journey Section (Engineering Evolution) */}
        {journeyEntries && journeyEntries.length > 0 && (
          <div className="mt-20 pt-16 border-t border-white/5">
            <div className="mb-12">
              <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-accent-primary mb-3 block">Timeline</span>
              <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Engineering Evolution</h3>
            </div>

            <div className="relative w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {/* Horizontal glowing connector path */}
              <div className="absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-accent-primary/20 via-accent-primary to-accent-primary/20 opacity-50 pointer-events-none" />
              <div className="absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-accent-primary/80 blur-[2px] shadow-[0_0_8px_rgba(255,149,0,0.8)] pointer-events-none" />

              <div className="flex justify-between items-start min-w-[800px] px-[5%] relative z-10">
                {journeyEntries
                  .sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime())
                  .map((m, index) => {
                    const year = new Date(m.entry_date).getFullYear()
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex flex-col items-center text-center px-4 flex-1 group"
                      >
                        {/* Node circle */}
                        <div className="w-14 h-14 rounded-full bg-[#050508] border-2 border-white/10 flex items-center justify-center cursor-pointer hover:border-accent-primary hover:shadow-[0_0_15px_rgba(255,149,0,0.4)] transition-all duration-300 group-hover:scale-105 mb-4 z-20 relative">
                          <div className="w-4 h-4 rounded-full bg-white/20 group-hover:bg-accent-primary group-hover:shadow-[0_0_8px_rgba(255,149,0,0.6)] transition-all duration-300" />
                        </div>

                        {/* Year */}
                        <span className="text-[10px] font-mono font-bold text-accent-primary mb-1 tracking-widest">{year}</span>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-white tracking-tight uppercase group-hover:text-accent-primary transition-colors duration-200">
                          {m.title}
                        </h4>

                        {/* Insight */}
                        {m.description && (
                          <p className="text-[10.5px] text-white/40 leading-relaxed mt-2 max-w-[150px] line-clamp-2 group-hover:text-white/60 transition-colors duration-200">
                            {m.description}
                          </p>
                        )}
                      </motion.div>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
      </AnimatedSection>
    </motion.div>
  )
}
