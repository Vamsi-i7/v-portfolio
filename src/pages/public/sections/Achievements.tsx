import { useAchievements } from '@/hooks/queries/useAchievements'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Trophy, ExternalLink } from 'lucide-react'

export function Achievements() {
  const { data: achievements, isLoading } = useAchievements()

  if (isLoading || !achievements?.length) return null

  return (
    <AnimatedSection id="achievements" className="section-container">
      <div className="mb-10 md:mb-16">
        <span className="section-label mb-2">Milestones</span>
        <h2 className="text-section font-display font-bold tracking-tight mb-4">
          Prestige & Recognition
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Highlights from hackathons, global rankings, and competitive programming.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const CardContent = () => (
            <div className="h-full glass-card border border-border/50 hover:border-accent/30 hover:bg-accent/5 p-8 flex flex-col justify-center items-center text-center group transition-all duration-300 relative overflow-hidden">
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <Trophy className="w-8 h-8 text-accent/50 mb-4 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
              
              <div className="text-4xl md:text-5xl font-display font-black tracking-tighter gradient-text mb-4 z-10">
                {achievement.value || 'Winner'}
              </div>
              
              <div className="space-y-1 z-10">
                {achievement.platform && (
                  <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {achievement.platform}
                  </div>
                )}
                <h3 className="text-lg font-medium text-foreground">
                  {achievement.title}
                </h3>
              </div>

              {achievement.link_url && (
                <div className="mt-6 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity flex items-center z-10">
                  View Proof <ExternalLink className="ml-1 w-3 h-3" />
                </div>
              )}
            </div>
          )

          if (achievement.link_url) {
            return (
              <a 
                key={achievement.id} 
                href={achievement.link_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block transition-transform hover:-translate-y-1"
              >
                <CardContent />
              </a>
            )
          }

          return (
            <div key={achievement.id} className="block">
              <CardContent />
            </div>
          )
        })}
      </div>
    </AnimatedSection>
  )
}
