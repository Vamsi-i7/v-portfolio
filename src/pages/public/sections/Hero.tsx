import { useSettings } from '@/hooks/queries/useSettings'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Button } from '@/components/ui/button'
import { ArrowDown, ChevronRight } from 'lucide-react'

export function Hero() {
  const { data: settings, isLoading } = useSettings()

  return (
    <AnimatedSection id="home" className="relative min-h-[90vh] flex flex-col justify-center">
      {/* Background Gradient Effect - Matches PRD §5.5/§7.1 */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ backgroundImage: 'var(--gradient-hero)' }}
      />

      <div className="section-container max-w-hero text-center relative z-10">
        
        {/* Intro Label */}
        <div className="mb-6 flex justify-center">
          <span className="section-label bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
            {isLoading ? 'Loading...' : `Hello, I'm ${settings?.full_name || 'Vamsi'}`}
          </span>
        </div>

        {/* Main Tagline */}
        <h1 className="text-hero font-display font-extrabold leading-[1.1] tracking-tight mb-8">
          {isLoading ? (
            <div className="animate-pulse bg-muted h-20 w-3/4 mx-auto rounded-md" />
          ) : (
            <span className="gradient-text">
              {settings?.tagline || 'Software Engineer & Developer'}
            </span>
          )}
        </h1>

        {/* Bio / Subcopy */}
        <p className="text-section-body text-muted-foreground max-w-[600px] mx-auto mb-10 text-lg md:text-xl">
          {isLoading ? (
            <div className="animate-pulse bg-muted h-6 w-full max-w-md mx-auto rounded-md" />
          ) : (
             settings?.bio || "I build high-performance web applications and autonomous AI agents."
          )}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="btn-accent w-full sm:w-auto h-12 px-8 text-base">
            <a href="#projects">
              View My Work <ChevronRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="btn-ghost w-full sm:w-auto h-12 px-8 text-base">
            <a href="#about">
              More About Me
            </a>
          </Button>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60 pointer-events-none">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-[scroll-chevron_2s_infinite]" />
      </div>

    </AnimatedSection>
  )
}
