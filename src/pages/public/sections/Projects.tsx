import { useProjects } from '@/hooks/queries/useProjects'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Button } from '@/components/ui/button'
import { Code2, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { getPublicUrl } from '@/lib/storage'

export function Projects() {
  const { data: projects, isLoading } = useProjects()

  if (isLoading) {
    return (
      <AnimatedSection id="projects" className="section-container bg-surface/30">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted w-48 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </AnimatedSection>
    )
  }

  if (!projects || projects.length === 0) {
    return null
  }

  return (
    <AnimatedSection id="projects" className="section-container py-16 md:py-24 relative">
      <div className="mb-10 md:mb-12">
        <span className="section-label mb-2">Portfolio</span>
        <h2 className="text-section font-display font-bold tracking-tight">
          Featured Projects
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => {
          const thumbUrl = getPublicUrl('portfolio-assets', project.thumbnail_path)
          const isFeatured = project.is_featured

          return (
            <div 
              key={project.id} 
              className={`card-elevated flex flex-col h-full group p-0 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-accent/40 ${isFeatured ? 'md:col-span-2 md:flex-row' : ''}`}
            >
              
              {/* Thumbnail */}
              <div className={`relative bg-muted border-border overflow-hidden ${isFeatured ? 'md:w-[45%] border-b-0 md:border-r border-border/50' : 'aspect-video border-b border-border/50'}`}>
                {thumbUrl ? (
                  <>
                    {/* Blurred backdrop to fill space regardless of aspect ratio */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110" 
                      style={{ backgroundImage: `url(${thumbUrl})` }} 
                    />
                    <img 
                      src={thumbUrl} 
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement?.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  </>
                ) : null}
                {/* Fallback Icon */}
                <div className={`absolute inset-0 flex items-center justify-center bg-surface/50 ${thumbUrl ? 'hidden' : ''}`}>
                  <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
                </div>
              </div>

              {/* Content */}
              <div className={`p-6 md:p-8 flex flex-col flex-1 ${isFeatured ? 'md:w-[55%] justify-center' : ''}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-2xl font-display font-bold leading-tight group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  {project.is_ongoing && (
                    <span className="badge badge-published whitespace-nowrap shrink-0 mt-1">In Progress</span>
                  )}
                </div>

                <div className="flex flex-col flex-1 mb-6">
                  <p className={`text-muted-foreground text-base leading-relaxed ${isFeatured && project.long_description ? 'mb-4' : ''} ${isFeatured ? '' : 'line-clamp-3'}`}>
                    {project.short_description}
                  </p>
                  
                  {isFeatured && project.long_description && (
                    <div className="pl-4 border-l-2 border-accent/30 text-sm text-muted-foreground/90 leading-relaxed italic">
                      <p className="line-clamp-4">{project.long_description}</p>
                    </div>
                  )}
                </div>

                {/* Tech Stack - No truncation to improve keyword matching */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech_stack.map((tech, idx) => (
                      <span key={idx} className="text-xs font-mono px-2 py-1 bg-accent/10 text-accent border border-accent/20 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-3 mt-auto pt-5 border-t border-border/50">
                  {project.github_url && (
                    <Button asChild variant="outline" size="sm" className="btn-ghost flex-1 h-10">
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Code2 className="w-4 h-4 mr-2" /> Code
                      </a>
                    </Button>
                  )}
                  {project.demo_url && (
                    <Button asChild size="sm" className="btn-accent flex-1 h-10">
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </AnimatedSection>
  )
}
