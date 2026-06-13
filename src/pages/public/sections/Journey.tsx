import { useJourneyEntries } from '@/hooks/queries/useJourneyEntries'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { MapPin } from 'lucide-react'

export function Journey() {
  const { data: entries, isLoading } = useJourneyEntries()

  if (isLoading) {
    return (
      <AnimatedSection id="journey" className="section-container bg-surface/30">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted w-48 rounded" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl w-full max-w-2xl" />
            ))}
          </div>
        </div>
      </AnimatedSection>
    )
  }

  if (!entries || entries.length === 0) {
    return null
  }

  const formatMonthYear = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(dateStr))
  }

  return (
    <AnimatedSection id="journey" className="section-container py-24 relative">
      <div className="mb-12">
        <span className="section-label mb-2">My Path</span>
        <h2 className="text-section font-display font-bold tracking-tight">
          The Journey
        </h2>
      </div>

      <div className="max-w-3xl ml-2 md:ml-6 border-l-2 border-border relative">
        {entries.map((entry, index) => (
          <div key={entry.id} className={`relative pl-8 md:pl-12 ${index !== entries.length - 1 ? 'mb-12' : ''}`}>
            
            {/* Timeline Dot */}
            <div className={`absolute left-[-9px] top-1 w-4 h-4 rounded-full border-2 border-bg-base ${entry.is_highlight ? 'bg-accent shadow-[0_0_0_2px_var(--bg-base),0_0_0_4px_rgba(59,130,246,0.3)]' : 'bg-muted-foreground'}`} />
            
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
              <h3 className={`text-xl font-display font-bold ${entry.is_highlight ? 'text-accent' : ''}`}>
                {entry.title}
              </h3>
              <span className="text-sm font-mono text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {formatMonthYear(entry.entry_date)}
              </span>
            </div>

            {entry.description && (
              <p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed">
                {entry.description}
              </p>
            )}

            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-xs font-medium bg-surface border border-border/50 rounded-md text-foreground/80">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {entry.link_url && (
              <a 
                href={entry.link_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-accent hover:text-accent-foreground mt-4 transition-colors"
              >
                {entry.link_label || 'Learn more'} &rarr;
              </a>
            )}

          </div>
        ))}
      </div>
    </AnimatedSection>
  )
}
