import { useSettings } from '@/hooks/queries/useSettings'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { getPublicUrl } from '@/lib/storage'
import { motion } from 'framer-motion'

export function About() {
  const { data: settings, isLoading } = useSettings()

  if (isLoading) return null

  const profileImageUrl = settings?.profile_image_path 
    ? getPublicUrl('portfolio-assets', settings.profile_image_path)
    : null

  return (
    <AnimatedSection id="about" className="section-container relative" aria-labelledby="about-title">
      <div className="mb-16">
        <span className="section-label">Identity</span>
        <h2 id="about-title" className="text-section font-display font-bold tracking-tight mt-2">
          Behind The Code
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* LEFT: IMAGE */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] max-w-sm mx-auto w-full rounded-2xl overflow-hidden border border-bg-border shadow-2xl bg-bg-surface"
          >
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt={settings?.full_name || 'Profile'} 
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg-elevated to-bg-surface">
                <span className="text-text-muted/40 font-mono tracking-widest uppercase font-bold text-sm">Image Pending</span>
              </div>
            )}
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent-primary opacity-50 m-4 rounded-tl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent-primary opacity-50 m-4 rounded-br-lg" />
          </motion.div>
        </div>

        {/* RIGHT: PERSONAL STATEMENT */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="space-y-8">
            <p className="text-xl md:text-2xl text-text-primary leading-relaxed font-medium">
              {settings?.bio || "I build high-performance web applications and autonomous AI agents with a focus on engineering excellence and product-led growth."}
            </p>
            
            <div className="h-px w-16 bg-accent-primary/40" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
              <PrincipleItem 
                title="Systems over shortcuts" 
                desc="I favor scalable architectures and reusable patterns over quick-fix solutions that incur technical debt." 
              />
              <PrincipleItem 
                title="Build for scale" 
                desc="Every line of code is written with the assumption of 100x current load, ensuring long-term resilience." 
              />
              <PrincipleItem 
                title="Measure then optimize" 
                desc="Decisions are driven by data. I profile and benchmark systems before diving into performance tuning." 
              />
              <PrincipleItem 
                title="Learn by shipping" 
                desc="I believe in rapid iteration and real-world feedback over premature perfection in a sandbox." 
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

function PrincipleItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-bold text-primary uppercase tracking-wider">{title}</h4>
      <p className="text-[13px] text-text-secondary leading-relaxed">{desc}</p>
    </div>
  )
}
