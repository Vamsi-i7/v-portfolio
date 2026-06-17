import { useSettings } from '@/hooks/queries/useSettings'
import { useCertificates } from '@/hooks/queries/useCertificates'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { getPublicUrl } from '@/lib/storage'
import { RevealText } from '@/components/ui-custom/RevealText'
import { StaggeredMotion } from '@/components/ui-custom/StaggeredMotion'
import { ShieldCheck, Zap, Box, Layout, Cpu, Shield, Award, Star } from 'lucide-react'

const PRINCIPLE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  cpu: Cpu,
  box: Box,
  layout: Layout,
  zap: Zap,
  shield: Shield,
  award: Award,
  star: Star,
}

const DEFAULT_PRINCIPLES = [
  {
    icon: 'cpu',
    title: 'Predictive Scale',
    desc: "I engineer for 100x today's load. Resilient systems are born from assuming growth is inevitable."
  },
  {
    icon: 'box',
    title: 'Atomic Logic',
    desc: 'Reusable patterns over one-off fixes. I build composable primitives that simplify complex domains.'
  },
  {
    icon: 'layout',
    title: 'Product Mindset',
    desc: 'Code is a liability; features are the goal. I optimize for the shortest path to customer value.'
  },
  {
    icon: 'zap',
    title: 'Performance First',
    desc: 'Every millisecond is a bounce. Deep profiling and benchmarking are core to my development loop.'
  }
]

export function About() {
  const { data: settings } = useSettings()
  const { data: certificates } = useCertificates()

  const profileImageUrl = settings?.profile_image_path 
    ? getPublicUrl('portfolio-assets', settings.profile_image_path)
    : null

  return (
    <AnimatedSection id="about" className="section-container relative" aria-labelledby="about-title">
      <div className="mb-16">
        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/30 mb-4 block">Identity</span>
        <RevealText id="about-title" text="Engineering Philosophy" className="text-4xl sm:text-6xl font-display font-black tracking-tightest text-white uppercase" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
        {/* LEFT: IMAGE & VERIFICATIONS */}
        <div className="lg:col-span-5 space-y-12">
          <StaggeredMotion delay={0.2}>
            <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full max-w-[280px] lg:max-w-none mx-auto rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm shadow-2xl">
              {profileImageUrl ? (
                <img 
                  src={profileImageUrl} 
                  alt={settings?.full_name || 'Profile'} 
                  loading="lazy"
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/5 font-mono tracking-[0.5em] uppercase font-black text-xl">Core.Sys</span>
                </div>
              )}
              {/* Architectural Overlay */}
              <div className="absolute inset-0 border-[16px] border-black/20 pointer-events-none" />
              <div className="absolute top-6 left-6 flex flex-col gap-1">
                <div className="w-8 h-[1px] bg-white/40" />
                <div className="w-[1px] h-8 bg-white/40" />
              </div>
            </div>
          </StaggeredMotion>

          {/* Compact Certifications - Merged as Proof */}
          {certificates && certificates.length > 0 && (
            <div className="space-y-6 pt-4">
              <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Verified Credentials</h3>
              <div className="grid grid-cols-1 gap-3">
                {certificates.slice(0, 3).map((cert) => (
                  <div key={cert.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-accent-primary/20 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-accent-primary/60 group-hover:text-accent-primary transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-white/80 truncate uppercase tracking-tight">{cert.title}</div>
                      <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{cert.issuer_name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: CONTENT */}
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-8">
            <RevealText 
              text={settings?.about_philosophy || "I believe in building systems that don't just work, but endure."}
              className="text-2xl md:text-4xl text-white/90 font-display font-medium leading-tight tracking-tight"
              delay={0.1}
            />
            <div className="h-[1px] w-24 bg-accent-primary/40" />
            <p className="text-sm md:text-lg text-white/50 leading-relaxed max-w-[600px]">
              {settings?.bio || "Staff-level thinking applied to every line of code. My approach combines deep architectural rigor with an obsessive focus on product impact and user outcomes."}
            </p>
          </div>

          <StaggeredMotion delay={0.4} stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
            {(() => {
              const principles = Array.isArray(settings?.about_principles) && settings.about_principles.length > 0
                ? (settings.about_principles as Array<{ title: string; desc: string; icon: string }>)
                : DEFAULT_PRINCIPLES
              return principles.map((p, idx) => {
                const IconComp = PRINCIPLE_ICON_MAP[p.icon] || Cpu
                return (
                  <PrincipleItem 
                    key={idx}
                    icon={<IconComp className="w-4 h-4" />}
                    title={p.title} 
                    desc={p.desc} 
                  />
                )
              })
            })()}
          </StaggeredMotion>
        </div>
      </div>
    </AnimatedSection>
  )
}

function PrincipleItem({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="space-y-4 group">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-primary/60 group-hover:text-accent-primary group-hover:bg-accent-primary/10 transition-all border border-white/5 group-hover:border-accent-primary/20">
          {icon}
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] group-hover:text-white transition-colors">{title}</h3>
      </div>
      <p className="text-xs text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors">{desc}</p>
    </div>
  )
}
