import { useSettings } from '@/hooks/queries/useSettings'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Button } from '@/components/ui/button'
import { FileText, User } from 'lucide-react'
import { getPublicUrl } from '@/lib/storage'
import { trackEvent } from '@/lib/analytics'

export function About() {
  const { data: settings, isLoading } = useSettings()

  if (isLoading) {
    return (
      <AnimatedSection id="about" className="section-container">
        <div className="animate-pulse flex flex-col md:flex-row gap-12 items-center">
          <div className="w-48 h-48 rounded-full bg-muted flex-shrink-0" />
          <div className="space-y-4 w-full">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/6" />
          </div>
        </div>
      </AnimatedSection>
    )
  }

  return (
    <AnimatedSection id="about" className="section-container py-16 md:py-24" aria-labelledby="about-title">
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
        
        {/* Profile Image Column */}
        <div className="flex-shrink-0 relative">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-bg-surface shadow-xl relative z-10 bg-muted flex items-center justify-center">
            {settings?.profile_image_path ? (
              <img 
                src={getPublicUrl('portfolio-assets', settings.profile_image_path)} 
                alt={settings.full_name || 'Profile'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            {/* Fallback Icon */}
            <User className={`w-20 h-20 text-muted-foreground ${settings?.profile_image_path ? 'hidden absolute' : ''}`} />
          </div>
          {/* Decorative background blur */}
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full -z-10 transform scale-110" />
        </div>

        {/* Bio Column */}
        <div className="flex-1 space-y-6">
          <div>
            <span className="section-label mb-2">About Me</span>
            <h2 id="about-title" className="text-section font-display font-bold tracking-tight">
              Behind the Code
            </h2>
          </div>

          <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
            {settings?.bio ? (
              // Splitting by double newline to support basic paragraphs if stored that way
              settings.bio.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))
            ) : (
              <p>
                I am a passionate developer dedicated to building impactful, high-performance web applications.
                I thrive on solving complex problems and continuously learning new technologies.
              </p>
            )}
          </div>

          {settings?.resume_path && (
            <div className="pt-4">
              <Button asChild variant="outline" className="btn-ghost">
                <a 
                  href={getPublicUrl('portfolio-assets', settings.resume_path)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('resume_download', { source: 'about' })}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Resume
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AnimatedSection>
  )
}
