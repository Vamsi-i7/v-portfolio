import { useState } from 'react'
import { useSkills } from '@/hooks/queries/useSkills'
import { useCodingCache } from '@/hooks/queries/useCodingCache'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { GitBranch, Code2, Trophy } from 'lucide-react'
import { RevealText } from '@/components/ui-custom/RevealText'
import { StaggeredMotion } from '@/components/ui-custom/StaggeredMotion'
import { motion } from 'framer-motion'

// Category display order
const CATEGORY_ORDER = ['Languages', 'Language', 'Frontend', 'AI/ML', 'Backend', 'Database', 'Databases', 'DevOps', 'Cloud', 'Mobile', 'Tools', 'Security']

// Canonical display names
const CATEGORY_LABEL: Record<string, string> = {
  Language: 'Primary',
  Languages: 'Primary',
  Frontend: 'Frontend',
  'AI/ML': 'AI / ML',
  Backend: 'Backend',
  Database: 'Database',
  Databases: 'Database',
  DevOps: 'DevOps',
  Cloud: 'Cloud',
  Mobile: 'Mobile',
  Tools: 'Tools',
  Security: 'Security',
}

export function Skills() {
  const { data: skills, isLoading: skillsLoading } = useSkills()
  const { data: cacheEntries, isLoading: cacheLoading } = useCodingCache()

  interface GithubCache {
    stats: {
      contributions_last_year: number | string
      total_stars: number
    }
  }
  interface LeetcodeCache {
    stats: {
      total_solved: number | string
    }
    contest: {
      top_percentage: number | string
      rating?: number
    }
  }
  interface CodeforcesCache {
    stats: {
      rating: number | string
    }
    profile: {
      rank: string
    }
  }

  const githubData = cacheEntries?.find(e => e.platform === 'github')?.data as unknown as GithubCache | undefined
  const lcData = cacheEntries?.find(e => e.platform === 'leetcode')?.data as unknown as LeetcodeCache | undefined
  const cfData = cacheEntries?.find(e => e.platform === 'codeforces')?.data as unknown as CodeforcesCache | undefined

  if (skillsLoading || cacheLoading || !skills?.length) return null

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category
    const label = CATEGORY_LABEL[category] || category
    if (!acc[label]) {
      acc[label] = []
    }
    acc[label].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  // Convert to sorted rows
  const rows = Object.entries(groupedSkills)
    .map(([label, rowSkills]) => ({
      label,
      skills: rowSkills,
    }))
    .sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a.label)
      const indexB = CATEGORY_ORDER.indexOf(b.label)
      if (indexA === -1 && indexB === -1) return a.label.localeCompare(b.label)
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })

  const getIconClass = (skill: { icon_identifier?: string | null }) => {
    if (skill.icon_identifier) return `devicon-${skill.icon_identifier}-plain`
    return 'devicon-javascript-plain' // fallback
  }

  return (
    <AnimatedSection id="engineering" className="section-container relative py-16" aria-labelledby="dna-title">
      <div className="mb-16">
        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/30 mb-4 block">Dashboard</span>
        <RevealText text="Engineering DNA" className="text-4xl sm:text-6xl font-display font-black tracking-tightest text-white uppercase" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT: Analytics Cards */}
        <div className="lg:col-span-4 space-y-6">
          <StaggeredMotion stagger={0.08} className="flex flex-col gap-6">
            {githubData && (
              <PlatformMetric 
                icon={<GitBranch className="w-4 h-4 text-white" />}
                title="GitHub"
                value={githubData.stats.contributions_last_year || '500+'}
                label="Annual Shipped"
                meta={`${githubData.stats.total_stars} stars`}
              />
            )}
            {lcData && (
              <PlatformMetric 
                icon={<Code2 className="w-4 h-4 text-white/80" />}
                title="LeetCode"
                value={lcData.stats.total_solved}
                label="Solved Problems"
                meta={lcData.contest.rating && lcData.contest.rating > 0 && Number(lcData.contest.top_percentage) > 0 ? `Top ${lcData.contest.top_percentage}%` : 'Unrated'}
              />
            )}
            {cfData && (
              <PlatformMetric 
                icon={<Trophy className="w-4 h-4 text-white/80" />}
                title="Codeforces"
                value={cfData.stats.rating}
                label="Elo Rating"
                meta={cfData.profile.rank}
              />
            )}
          </StaggeredMotion>
        </div>

        {/* RIGHT: High-Information Stack Grid */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="lg:col-span-8 p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm shadow-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            {rows.map(({ label, skills: rowSkills }, rIndex) => (
              <motion.div 
                key={label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: rIndex * 0.05 }}
                className="space-y-4"
              >
                <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-accent-primary" />
                  {label}
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {rowSkills
                    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                    .map((skill, sIndex) => (
                      <motion.div 
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: rIndex * 0.05 + sIndex * 0.02 }}
                        className="group flex items-center gap-2 cursor-default"
                      >
                        <i className={`${getIconClass(skill)} text-sm text-white/10 group-hover:text-accent-primary transition-colors`} />
                        <span className="text-[11px] font-bold text-white/40 group-hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1">
                          {skill.name}
                          {skill.proficiency && (
                            <span className="text-[7px] font-mono text-accent-primary/45 group-hover:text-accent-primary transition-colors tracking-tighter">
                              ({skill.proficiency.substring(0, 3)})
                            </span>
                          )}
                        </span>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </AnimatedSection>
  )
}

interface PlatformMetricProps {
  icon: React.ReactNode
  title: string
  value: string | number
  label: string
  meta?: string
}

function PlatformMetric({ icon, title, value, label, meta }: PlatformMetricProps) {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({})
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left - box.width / 2
    const y = e.clientY - box.top - box.height / 2
    
    // Max 8 degrees rotation
    const rotateX = -(y / (box.height / 2)) * 8
    const rotateY = (x / (box.width / 2)) * 8

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

  return (
    <div 
      className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent-primary/20 transition-all flex items-center gap-6 group cursor-default"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-accent-primary/10 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{title}</span>
          <span className="text-[8px] font-mono text-accent-primary/60">{meta}</span>
        </div>
        <div className="text-3xl font-display font-black text-white tracking-tighter leading-tight">{value}</div>
        <div className="text-[8px] font-mono text-white/10 uppercase tracking-[0.1em]">{label}</div>
      </div>
    </div>
  )
}
