import { useState } from 'react'
import { useAchievements } from '@/hooks/queries/useAchievements'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { motion } from 'framer-motion'
import { Trophy, Star, Target, Zap, Award, type LucideIcon } from 'lucide-react'
import { RevealText } from '@/components/ui-custom/RevealText'

const ICON_MAP: Record<string, LucideIcon> = {
  trophy: Trophy,
  star: Star,
  target: Target,
  zap: Zap,
  award: Award,
}

export function Achievements() {
  const { data: achievements, isLoading } = useAchievements()

  if (isLoading || !achievements?.length) return null

  return (
    <AnimatedSection id="achievements" className="section-container relative py-12 md:py-16" aria-labelledby="achievements-title">
      <div className="mb-12">
        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-accent-primary mb-3 block">Milestones</span>
        <RevealText id="achievements-title" text="Recognition" className="text-4xl sm:text-6xl font-display font-black tracking-tightest text-primary uppercase" />
      </div>

      <div className="flex flex-wrap gap-6 justify-center max-w-5xl mx-auto">
        {achievements.map((achievement, index) => (
          <AchievementCard 
            key={achievement.id}
            achievement={achievement}
            index={index}
          />
        ))}
      </div>
    </AnimatedSection>
  )
}

interface Achievement {
  id: string
  title: string
  value?: string | null
  icon_name?: string | null
  platform?: string | null
  achievement_type?: string | null
  achieved_at?: string | null
}

function AchievementCard({ achievement, index }: { achievement: Achievement, index: number }) {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({})
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left - box.width / 2
    const y = e.clientY - box.top - box.height / 2
    
    const rotateX = -(y / (box.height / 2)) * 10
    const rotateY = (x / (box.width / 2)) * 10

    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.08s ease-out',
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s ease-out',
    })
  }

  const IconComponent = achievement.icon_name && ICON_MAP[achievement.icon_name] 
    ? ICON_MAP[achievement.icon_name] 
    : Trophy
  
  let metric = achievement.value
  let label = achievement.title
  if (!metric) {
    const match = achievement.title.match(/^(\d+(?:\+|-|%)?)\s+(.*)$/)
    if (match) {
      metric = match[1]
      label = match[2]
    } else {
      metric = achievement.title
      label = achievement.platform || achievement.achievement_type || 'Achievement'
    }
  }

  const year = achievement.achieved_at ? new Date(achievement.achieved_at).getFullYear() : null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.05 }}
      className="group flex flex-col w-full sm:w-[260px] h-[170px] p-5 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.06] backdrop-blur-md hover:border-accent-primary/20 hover:bg-white/[0.04] transition-all justify-between shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.6)] relative overflow-hidden cursor-default"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Icon & Year */}
      <div className="flex justify-between items-start relative z-10">
        <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent-primary/10 transition-colors duration-300">
          <IconComponent className="w-4 h-4 text-accent-primary group-hover:scale-110 transition-transform duration-300" />
        </div>
        {year && (
          <span className="text-[9px] font-mono font-bold tracking-widest text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
            {year}
          </span>
        )}
      </div>

      {/* Metric & Label */}
      <div className="space-y-1.5 relative z-10">
        <div className="text-2xl font-black font-display text-white tracking-tight group-hover:text-accent-primary transition-colors leading-none truncate" title={metric}>
          {metric}
        </div>
        <div className="text-[10px] uppercase font-mono text-white/40 tracking-wider font-semibold truncate block mt-0.5" title={label}>
          {label}
        </div>
      </div>
    </motion.div>
  )
}
