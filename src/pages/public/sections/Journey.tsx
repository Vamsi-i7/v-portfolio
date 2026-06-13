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
    <AnimatedSection id="journey" className="section-container py-16 md:py-24 relative">
      <div className="mb-12 text-center md:text-left">
        <span className="section-label mb-2 mx-auto md:mx-0">My Path</span>
        <h2 className="text-section font-display font-bold tracking-tight">
          The Journey
        </h2>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Vertical Line - Left on mobile, Center on desktop */}
        <div className="absolute left-[15px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-border/60" />

        <div className="space-y-8">
          {entries.map((entry, index) => {
            const isEven = index % 2 === 0
            return (
              <div key={entry.id} className="relative flex flex-col md:flex-row items-start md:justify-between group">
                
                {/* Timeline Dot */}
                <div className={`absolute left-[7px] md:left-1/2 top-1.5 md:top-2 w-[18px] h-[18px] -translate-x-1/2 rounded-full border-[3px] border-bg-base z-10 transition-transform duration-300 group-hover:scale-125 ${entry.is_highlight ? 'bg-accent shadow-[0_0_0_2px_var(--bg-base),0_0_0_4px_rgba(59,130,246,0.2)]' : 'bg-muted-foreground'}`} />

                {/* Left Side (Empty on mobile, Content on even desktop, Date on odd desktop) */}
                <div className={`pl-12 md:pl-0 w-full md:w-[45%] flex flex-col ${isEven ? 'md:items-end md:text-right' : 'md:items-start'}`}>
                  {isEven ? (
                    // Content for Even (Left Side)
                    <div className="card-elevated w-full hover:border-accent/30 transition-colors min-h-[120px]">
                      <div className="flex flex-col gap-2 mb-3">
                        <h3 className={`text-xl font-display font-bold ${entry.is_highlight ? 'text-accent' : ''}`}>
                          {entry.title}
                        </h3>
                        <span className={`text-sm font-mono text-muted-foreground flex items-center gap-1.5 ${isEven ? 'md:justify-end' : ''}`}>
                          <MapPin className="w-3.5 h-3.5" />
                          {formatMonthYear(entry.entry_date)}
                        </span>
                      </div>

                      {entry.description && (
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {entry.description}
                        </p>
                      )}

                      {entry.tags && entry.tags.length > 0 && (
                        <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : ''}`}>
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
                  ) : (
                    // Just the date (on desktop) for Odd
                    <div className="hidden md:flex items-center h-full pt-1.5 text-muted-foreground font-mono">
                       {formatMonthYear(entry.entry_date)}
                    </div>
                  )}
                </div>

                {/* Right Side (Content on mobile, Content on odd desktop, Date on even desktop) */}
                <div className={`pl-12 md:pl-0 w-full md:w-[45%] flex flex-col ${isEven ? 'md:items-start hidden md:flex' : 'md:items-start mt-0'}`}>
                   {!isEven ? (
                    // Content for Odd (Right Side)
                    <div className="card-elevated w-full hover:border-accent/30 transition-colors min-h-[120px] mt-0 md:mt-0">
                       <div className="flex flex-col gap-2 mb-3">
                        <h3 className={`text-xl font-display font-bold ${entry.is_highlight ? 'text-accent' : ''}`}>
                          {entry.title}
                        </h3>
                        <span className="text-sm font-mono text-muted-foreground flex items-center gap-1.5 md:hidden">
                          <MapPin className="w-3.5 h-3.5" />
                          {formatMonthYear(entry.entry_date)}
                        </span>
                      </div>

                      {entry.description && (
                        <p className="text-muted-foreground mb-4 leading-relaxed">
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
                   ) : (
                     // Just the date (on desktop) for Even
                     <div className="hidden md:flex items-center h-full pt-1.5 text-muted-foreground font-mono">
                       {formatMonthYear(entry.entry_date)}
                     </div>
                   )}
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </AnimatedSection>
  )
}
