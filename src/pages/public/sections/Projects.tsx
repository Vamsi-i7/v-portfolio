import { useState, useMemo, useRef } from 'react'
import { useProjects } from '@/hooks/queries/useProjects'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { Code2, Image as ImageIcon, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { getPublicUrl } from '@/lib/storage'
import { trackEvent } from '@/lib/analytics'
import { motion, AnimatePresence } from 'framer-motion'

export function Projects() {
  const { data: projects, isLoading } = useProjects()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  const activeProject = useMemo(() => {
    if (!projects) return null
    if (!activeId) return projects[0]
    return projects.find(p => p.id === activeId) || projects[0]
  }, [projects, activeId])

  const selectorProjects = useMemo(() => {
    if (!projects) return []
    return projects.filter(p => p.id !== activeProject?.id).slice(0, 4)
  }, [projects, activeProject])

  const remainingProjects = useMemo(() => {
    if (!projects) return []
    return projects.filter(p => p.id !== activeProject?.id).slice(4)
  }, [projects, activeProject])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    containerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    containerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  if (isLoading || !projects || projects.length === 0) return null

  return (
    <AnimatedSection 
      id="projects" 
      ref={containerRef}
      className="section-container relative spotlight-card" 
      aria-labelledby="projects-title"
      onMouseMove={handleMouseMove}
    >
      <div className="mb-12">
        <span className="section-label">Work</span>
        <h2 id="projects-title" className="text-section font-display font-bold tracking-tight mt-2">
          Featured Systems
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ZONE A: CINEMATIC FEATURED PANEL (62%) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject?.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
              className="relative aspect-square md:aspect-video rounded-xl overflow-hidden border border-bg-border shadow-2xl group cursor-pointer bg-bg-surface"
            >
              {/* Live Link Overlay - Placed at the back of the DOM so it doesn't steal button clicks */}
              {activeProject?.demo_url && (
                <a 
                  href={activeProject.demo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-0 no-cursor"
                  aria-label={`View live demo of ${activeProject.title}`}
                  onClick={() => trackEvent('project_view_live', { title: activeProject.title })}
                />
              )}

              {/* Image with Parallax-ready scale */}
              {activeProject?.thumbnail_path ? (
                <img 
                  src={getPublicUrl('portfolio-assets', activeProject.thumbnail_path)}
                  alt={activeProject.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg-elevated to-bg-surface pointer-events-none">
                  <ImageIcon className="w-12 h-12 text-text-muted/20" />
                </div>
              )}

              {/* Bottom Gradient Overlay & Metadata */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
              
              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end z-10 pointer-events-none">
                <div className="flex justify-between items-end gap-6">
                  <div className="space-y-4 max-w-2xl pointer-events-auto">
                    <h3 className="text-[28px] md:text-[32px] font-display font-bold text-white leading-tight">
                      {activeProject?.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/70 font-medium leading-relaxed max-w-[90%] line-clamp-2">
                      {activeProject?.short_description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-mono text-white/50">
                      {activeProject?.github_stars && (
                        <span className="flex items-center gap-1.5 text-amber-400">
                          <span className="w-1 h-1 rounded-full bg-current" />
                          {activeProject.github_stars} stars
                        </span>
                      )}
                      <span className="opacity-30">·</span>
                      <span className="uppercase tracking-widest">{activeProject?.tech_stack?.join(' · ')}</span>
                    </div>
                  </div>

                  {/* GitHub Action in Corner */}
                  {activeProject?.github_url && (
                    <a 
                      href={activeProject.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all group/icon mb-2 shrink-0 pointer-events-auto"
                      aria-label="View source code on GitHub"
                    >
                      <Code2 className="w-6 h-6 group-hover/icon:scale-110 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ZONE B: SELECTOR STRIP (38%) */}
        <div className="lg:col-span-4 h-full">
          <div className="flex flex-col gap-4">
            {selectorProjects.map((project) => (
              <ProjectThumb 
                key={project.id} 
                project={project} 
                onClick={() => {
                  setActiveId(project.id)
                  trackEvent('project_switch', { title: project.title })
                }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* SHOW ALL DRAWER */}
      {remainingProjects.length > 0 && (
        <div className="mt-12 border-t border-bg-border pt-12">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-between p-6 bg-bg-surface border border-bg-border rounded-xl hover:border-accent-primary/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-bg-elevated border border-bg-border rounded-full text-[11px] font-bold text-text-secondary">
                +{remainingProjects.length} projects
              </span>
              <span className="text-sm font-bold text-text-primary uppercase tracking-widest">Engineering Archive</span>
            </div>
            <div className="flex items-center gap-2 text-accent-primary font-bold text-sm">
              {showAll ? 'Show Less' : 'Explore All'}
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />}
            </div>
          </button>

          <AnimatePresence>
            {showAll && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
                  {remainingProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      className="relative aspect-video rounded-lg overflow-hidden border border-bg-border group cursor-pointer bg-bg-surface shadow-md"
                      onClick={() => {
                        setActiveId(project.id)
                        setShowAll(false)
                        window.scrollTo({ top: (containerRef.current?.offsetTop || 0) - 100, behavior: 'smooth' })
                      }}
                    >
                      {project.thumbnail_path ? (
                        <img src={getPublicUrl('portfolio-assets', project.thumbnail_path)} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-text-muted/20" /></div>
                      )}
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                        <span className="text-white text-xs font-bold text-center mb-1">{project.title}</span>
                        <span className="text-white/50 text-[10px] font-mono">{project.category || 'System'}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatedSection>
  )
}

function ProjectThumb({ project, onClick }: { project: any, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-3 rounded-xl border border-transparent hover:bg-bg-surface hover:border-bg-border transition-all group"
    >
      <div className="relative aspect-video w-24 rounded-lg overflow-hidden border border-bg-border shrink-0 transition-transform group-hover:scale-[1.02]">
        {project.thumbnail_path ? (
          <img 
            src={getPublicUrl('portfolio-assets', project.thumbnail_path)} 
            alt=""
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-text-muted/40" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-bold text-text-secondary group-hover:text-primary transition-colors truncate">
          {project.title}
        </h4>
        <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-0.5">
          {project.category || 'Production'}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
    </button>
  )
}
