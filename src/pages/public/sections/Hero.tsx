import { useSettings } from '@/hooks/queries/useSettings'
import { useCodingCache } from '@/hooks/queries/useCodingCache'
import { useProjects } from '@/hooks/queries/useProjects'
import { useExperiences } from '@/hooks/queries/useExperiences'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { MagneticButton } from '@/components/ui-custom/MagneticButton'
import { Button } from '@/components/ui/button'
import { ChevronRight, ArrowUpRight } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { RevealText } from '@/components/ui-custom/RevealText'
import { StaggeredMotion } from '@/components/ui-custom/StaggeredMotion'
import { getPublicUrl } from '@/lib/storage'
import { DecryptedText } from '@/components/ui-custom/DecryptedText'

export function Hero() {
  const { data: settings } = useSettings()
  const { data: cacheEntries } = useCodingCache()
  const { data: projects } = useProjects()
  const { data: experiences } = useExperiences()
  const containerRef = useRef<HTMLElement>(null)



  interface GithubCache {
    stats?: {
      contributions_last_year?: number
    }
  }
  interface LeetcodeCache {
    contest?: {
      top_percentage?: number
    }
  }

  const githubData = cacheEntries?.find(e => e.platform === 'github')?.data as GithubCache | undefined
  const leetcodeData = cacheEntries?.find(e => e.platform === 'leetcode')?.data as LeetcodeCache | undefined
  
  const latestExperience = experiences?.[0]
  const projectCount = projects?.length !== undefined ? projects.length : 3

  const fullName = settings?.full_name || 'Vamsi Krishna'
  const resumeUrl = settings?.resume_path ? getPublicUrl('portfolio-assets', settings.resume_path) : null

  const showPreloader = typeof window !== 'undefined'
    ? (import.meta.env.DEV ? true : !sessionStorage.getItem('portfolio-preloaded'))
    : false

  const delay1 = showPreloader ? 2000 : 300
  const delay2 = showPreloader ? 2200 : 500

  return (
    <AnimatedSection 
      id="home" 
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-20 pb-8 lg:py-0 overflow-hidden" 
      aria-labelledby="hero-title"
    >
      {/* Subtle Dot Grid Background Pattern with Center-Fade */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-plus-lighter"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 100%)'
        }}
      />

      {/* Background layer */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none" />



      {/* Main Content Overlay */}
      <div className="section-container w-full relative z-10">
        <div className="max-w-[700px] lg:max-w-[800px] flex flex-col items-start text-left">
          
          {/* Status Pill - Refined */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl transition-all group">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 group-hover:text-white/80 transition-colors">
                {latestExperience ? latestExperience.role_title : 'Engineer'}
              </span>
            </div>
          </motion.div>

          {/* Primary Value Proposition */}
          <RevealText 
            id="hero-title"
            tag="h1"
            text={settings?.tagline || 'Full Stack Engineer • Systems Builder • AI Enthusiast'}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[1.05] tracking-tightest text-white mb-6 uppercase text-left w-full"
            delay={0.2}
          />

          {/* Identity Sub-headline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <p className="text-xs sm:text-sm text-white/40 font-medium tracking-[0.2em] uppercase">
              <DecryptedText 
                text="Designed & Engineered by "
                animateOn="view"
                revealDirection="start"
                delay={delay1}
                className="text-white/40 font-medium tracking-[0.2em]"
                parentClassName="inline-block"
                encryptedClassName="text-white/20 font-mono"
              />{' '}
              <DecryptedText 
                text={fullName}
                animateOn="view"
                revealDirection="center"
                delay={delay2}
                className="text-white font-black tracking-normal"
                parentClassName="inline-block"
                encryptedClassName="text-accent-primary font-mono opacity-80"
              />
            </p>
            <div className="h-[1px] w-12 bg-accent-primary/30" />
          </motion.div>

          {/* CTA Group - Tighter */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
            <MagneticButton strength={15}>
              <Button asChild size="lg" className="h-12 px-8 text-[10px] font-black uppercase tracking-[0.3em] bg-white text-black hover:bg-accent-primary hover:text-black transition-all shadow-2xl rounded-full">
                <a href="#projects" onClick={() => trackEvent('hero_cta_work')}>
                  View Systems 
                  <ChevronRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </MagneticButton>
            
            <div className="flex items-center gap-4">
              <MagneticButton strength={10}>
                <Button asChild size="lg" variant="ghost" className="h-12 px-8 text-[10px] font-black uppercase tracking-[0.3em] border border-white/20 hover:bg-white/5 text-white/60 hover:text-white transition-all rounded-full">
                  <a href="#about" onClick={() => trackEvent('hero_cta_about')}>
                    Philosophy
                    <ArrowUpRight className="ml-2 w-4 h-4 opacity-30" />
                  </a>
                </Button>
              </MagneticButton>

              {resumeUrl && (
                <MagneticButton strength={10}>
                  <Button asChild size="lg" variant="ghost" className="h-12 px-8 text-[10px] font-black uppercase tracking-[0.3em] border border-white/20 hover:bg-white/5 text-white/60 hover:text-white transition-all rounded-full">
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('hero_cta_resume')}>
                      Resume
                      <ArrowUpRight className="ml-2 w-4 h-4 opacity-30" />
                    </a>
                  </Button>
                </MagneticButton>
              )}
            </div>
          </div>

          {/* Proof Bar - Integrated Dashboard Feel */}
          <StaggeredMotion delay={0.8} stagger={0.08} className="flex flex-wrap items-center gap-x-8 gap-y-4 px-6 py-4 rounded-2xl bg-white/[0.01] border border-white/5 backdrop-blur-sm">
            <ProofItem label="Open Source" value={githubData?.stats?.contributions_last_year || '500+'} />
            <div className="w-[1px] h-6 bg-white/5" />
            <ProofItem label="Algorithmic" value={leetcodeData?.contest?.top_percentage ? `Top ${leetcodeData.contest.top_percentage}%` : 'Top 8%'} />
            <div className="w-[1px] h-6 bg-white/5" />
            <ProofItem label="Experience" value={`${projectCount}+ Shipped`} />
          </StaggeredMotion>
        </div>
      </div>
    </AnimatedSection>
  )
}

function ProofItem({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex flex-col items-start gap-0.5 group">
      <span className="text-xl font-display font-black text-white/80 group-hover:text-accent-primary transition-colors tracking-tighter leading-none">{value}</span>
      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors leading-none">{label}</span>
    </div>
  )
}
