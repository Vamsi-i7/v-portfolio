import { useAchievements } from '@/hooks/queries/useAchievements'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { motion } from 'framer-motion'
import { Trophy, Star, Target, Zap, ArrowUpRight, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  trophy: Trophy,
  star: Star,
  target: Target,
  zap: Zap,
}

export function Achievements() {
  const { data: achievements, isLoading } = useAchievements()

  if (isLoading || !achievements?.length) return null

  return (
    <AnimatedSection id="achievements" className="section-container relative" aria-labelledby="achievements-title">
      <div className="mb-12">
        <span className="section-label">Milestones</span>
        <h2 id="achievements-title" className="text-section font-display font-bold tracking-tight mt-2">
          Recognition
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => {
          const IconComponent = achievement.icon_name && ICON_MAP[achievement.icon_name] 
            ? ICON_MAP[achievement.icon_name] 
            : Trophy

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-bg-surface border border-bg-border hover:border-accent-primary/50 transition-all shadow-sm hover:shadow-glow-accent relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-[40px] group-hover:bg-accent-primary/10 transition-colors" />

              <div className="flex items-start gap-5 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-bg-elevated border border-bg-border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 text-accent-primary" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-primary leading-tight">
                      {achievement.title}
                    </h3>
                    {achievement.platform && (
                      <span className="text-xs font-medium text-text-secondary mt-1">
                        {achievement.platform}
                      </span>
                    )}
                  </div>
                  
                  {achievement.value && (
                    <div className="inline-flex items-center gap-2 text-sm font-mono font-bold text-accent-primary bg-accent-primary/10 px-2 py-1 rounded">
                      {achievement.value}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                      {achievement.achievement_type}
                    </span>
                    
                    {achievement.link_url && (
                      <a 
                        href={achievement.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted hover:text-accent-primary transition-colors p-1"
                        aria-label={`View details for ${achievement.title}`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </AnimatedSection>
  )
}
