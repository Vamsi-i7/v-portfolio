import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowUpRight, GitBranch } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Project {
  id: string
  title: string
  category?: string | null
  tech_stack?: string[] | null
  demo_url?: string | null
  short_description?: string | null
  github_url?: string | null
  github_stars?: number | null
}

interface ProjectArchiveProps {
  projects: Project[]
}

export function ProjectArchive({ projects }: ProjectArchiveProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [limit, setLimit] = useState(9)

  const allTech = useMemo(() => {
    const tech = new Set<string>()
    projects.forEach(p => p.tech_stack?.forEach(t => tech.add(t)))
    return Array.from(tech).sort()
  }, [projects])

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTech = !selectedTech || p.tech_stack?.includes(selectedTech)
      return matchesSearch && matchesTech
    })
  }, [projects, searchQuery, selectedTech])

  const visibleProjects = filteredProjects.slice(0, limit)

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <Badge 
            variant={selectedTech === null ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedTech(null)}
          >
            All
          </Badge>
          {allTech.slice(0, 8).map(tech => (
            <Badge 
              key={tech}
              variant={selectedTech === tech ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedTech(tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="group relative"
            >
              <div 
                className="h-full flex flex-col justify-between border border-white/10 bg-white/[0.02] rounded-2xl p-6 transition-all duration-300 hover:border-accent-primary/50 hover:bg-white/[0.04]"
              >
                <div>
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-accent-primary uppercase tracking-widest block truncate">{project.category}</span>
                      <h4 className="text-lg font-display font-bold text-white group-hover:text-accent-primary transition-colors truncate">{project.title}</h4>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {project.github_url && (
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 bg-white/5 rounded-lg hover:bg-accent-primary hover:text-black transition-colors"
                          aria-label="GitHub Repository"
                        >
                          <GitBranch className="w-4 h-4" />
                        </a>
                      )}
                      {project.demo_url && (
                        <a 
                          href={project.demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 bg-white/5 rounded-lg hover:bg-accent-primary hover:text-black transition-colors"
                          aria-label="Live Demo"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-white/50 line-clamp-3 mb-6 leading-relaxed">
                    {project.short_description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                  {project.tech_stack?.map(tech => (
                    <span 
                      key={tech} 
                      className="text-[9px] font-mono text-white/30 uppercase px-2 py-0.5 bg-white/5 rounded border border-white/5 transition-colors group-hover:text-accent-primary group-hover:border-accent-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length > limit && (
        <div className="flex justify-center pt-12">
          <button 
            onClick={() => setLimit(prev => prev + 9)}
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white text-xs font-black uppercase tracking-widest hover:bg-accent-primary hover:text-black transition-all shadow-xl"
          >
            Load More Projects
          </button>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest">No projects found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
