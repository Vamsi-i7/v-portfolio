import { useSettings } from '@/hooks/queries/useSettings'
import { useCodingCache } from '@/hooks/queries/useCodingCache'
import { useProjects } from '@/hooks/queries/useProjects'
import { useExperiences } from '@/hooks/queries/useExperiences'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { MagneticButton } from '@/components/ui-custom/MagneticButton'
import { NodeGraph } from '@/components/ui-custom/NodeGraph'
import { Button } from '@/components/ui/button'
import { ChevronRight, ArrowUpRight } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { motion } from 'framer-motion'
import { useRef } from 'react'

export function Hero() {
  const { data: settings } = useSettings()
  const { data: cacheEntries } = useCodingCache()
  const { data: projects } = useProjects()
  const { data: experiences } = useExperiences()
  const containerRef = useRef<HTMLElement>(null)

  const githubData = cacheEntries?.find(e => e.platform === 'github')?.data as any
  const leetcodeData = cacheEntries?.find(e => e.platform === 'leetcode')?.data as any
  
  const latestExperience = experiences?.[0]
  const projectCount = projects?.length || 0

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    containerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    containerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    },
  }

  const firstName = settings?.full_name?.split(' ')[0] || 'VAMSI'
  const lastName = settings?.full_name?.split(' ').slice(1).join(' ') || 'KRISHNA'

  return (
    <AnimatedSection 
      id="home" 
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden spotlight-card" 
      aria-labelledby="hero-title"
      onMouseMove={handleMouseMove}
    >
      <div className="section-container w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT CONTENT: THE IDENTITY (60%) */}
          <motion.div 
            className="lg:col-span-7 flex flex-col items-start order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Massive Display Name */}
            <motion.h1 
              id="hero-title"
              variants={itemVariants}
              className="text-display font-display font-extrabold leading-[0.85] tracking-tightest text-primary mb-8"
            >
              <span className="block">{firstName}</span>
              <span className="block text-text-secondary">{lastName}</span>
            </motion.h1>

            {/* Sharp Positioning Statement */}
            <motion.p 
              variants={itemVariants}
              className="text-hero font-display font-bold leading-tight tracking-tight text-primary mb-10 max-w-[600px]"
            >
              {settings?.tagline || 'Building autonomous AI systems that think, learn, and ship.'}
            </motion.p>

            {/* Proof Bar: Monospace Credibility */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-x-6 gap-y-4 mb-12 font-mono text-mono"
            >
              <ProofItem 
                label="GitHub" 
                value={githubData?.stats?.contributions_last_year || '500+'} 
                suffix="contributions"
              />
              <div className="h-4 w-px bg-bg-border hidden sm:block" />
              <ProofItem 
                label="LeetCode" 
                value={leetcodeData?.contest?.top_percentage ? `Top ${leetcodeData.contest.top_percentage}%` : 'Top 8%'} 
                suffix="rank"
              />
              <div className="h-4 w-px bg-bg-border hidden sm:block" />
              <ProofItem 
                label="Engineering" 
                value={`${projectCount}+`} 
                suffix="shipped"
              />
            </motion.div>

            {/* CTA Group with Magnetic Interaction */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto mb-12">
              <MagneticButton strength={20}>
                <Button asChild size="lg" className="h-14 px-8 text-base font-bold bg-accent-primary text-black hover:bg-accent-primary-dark transition-all shadow-[0_0_30px_rgba(255,149,0,0.2)] group rounded-full">
                  <a href="#projects" onClick={() => trackEvent('hero_cta_work')}>
                    View Work 
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </MagneticButton>
              
              <MagneticButton strength={15}>
                <Button asChild size="lg" variant="ghost" className="h-14 px-8 text-base font-bold border border-bg-border hover:bg-bg-surface hover:text-primary transition-all group rounded-full">
                  <a href="#about" onClick={() => trackEvent('hero_cta_about')}>
                    About Me
                    <ArrowUpRight className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </Button>
              </MagneticButton>
            </motion.div>

            {/* Status Pill (Replaces "Now") */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-bg-surface/50 backdrop-blur-sm border border-bg-border/50 shadow-sm transition-all hover:border-accent-primary/30 group">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                </span>
                <span className="text-caption uppercase tracking-[0.2em] font-bold text-text-secondary group-hover:text-primary transition-colors">
                  {latestExperience ? `Operating as ${latestExperience.role_title}` : 'Ready for Impact'}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT CONTENT: THE VISUAL SIGNATURE (40%) */}
          <motion.div 
            className="lg:col-span-5 relative flex items-center justify-center w-full h-full min-h-[300px] lg:min-h-[500px] order-2 mt-8 lg:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
          >
            <NodeGraph />
          </motion.div>

        </div>
      </div>
    </AnimatedSection>
  )
}

function ProofItem({ label, value, suffix }: { label: string, value: string | number, suffix: string }) {
  return (
    <div className="flex items-center gap-2 group cursor-default">
      <span className="text-text-muted transition-colors group-hover:text-accent-primary">[{label}:</span>
      <span className="text-primary font-bold">{value}</span>
      <span className="text-text-secondary italic">{suffix}]</span>
    </div>
  )
}
