import { useProjects } from '@/hooks/queries/useProjects'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Button } from '@/components/ui/button'
import { Code2, ExternalLink, Image as ImageIcon } from 'lucide-react'

export function Projects() {
  const { data: projects, isLoading } = useProjects()

  if (isLoading) {
    return (
      <AnimatedSection id="projects" className="section-container">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted w-48 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    <AnimatedSection id="projects" className="section-container py-24 relative">
      <div className="mb-12">
        <span className="section-label mb-2">Portfolio</span>
        <h2 className="text-section font-display font-bold tracking-tight">
          Featured Projects
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="card-elevated flex flex-col h-full group p-0 overflow-hidden">
            
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted border-b border-border overflow-hidden">
              {project.thumbnail_path ? (
                <img 
                  src={project.thumbnail_path} 
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              {/* Fallback Icon */}
              <div className={`absolute inset-0 flex items-center justify-center bg-surface/50 ${project.thumbnail_path ? 'hidden' : ''}`}>
                <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-xl font-display font-bold leading-tight group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                {project.is_ongoing && (
                  <span className="badge badge-published whitespace-nowrap shrink-0 mt-1">In Progress</span>
                )}
              </div>

              <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                {project.short_description}
              </p>

              {/* Tech Stack */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech_stack.slice(0, 4).map((tech, idx) => (
                    <span key={idx} className="text-xs font-mono px-2 py-1 bg-accent/10 text-accent rounded-md">
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 4 && (
                    <span className="text-xs font-mono px-2 py-1 bg-muted text-muted-foreground rounded-md">
                      +{project.tech_stack.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Links */}
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/50">
                {project.github_url && (
                  <Button asChild variant="outline" size="sm" className="btn-ghost flex-1 h-9">
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Code2 className="w-4 h-4 mr-2" /> Code
                    </a>
                  </Button>
                )}
                {project.demo_url && (
                  <Button asChild size="sm" className="btn-accent flex-1 h-9">
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </AnimatedSection>
  )
}
