import { useState, useMemo } from 'react'
import { useProjects } from '@/hooks/queries/useProjects'
import { AnimatedSection } from '@/components/ui-custom/AnimatedSection'
import { RevealText } from '@/components/ui-custom/RevealText'
import { ProjectSpotlight } from '@/components/ui-custom/ProjectSpotlight'
import { ProjectArchive } from '@/components/ui-custom/ProjectArchive'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Layers, ArrowUpRight, GitBranch } from 'lucide-react'

export function Projects() {
  const { data: projects, isLoading } = useProjects()
  const [showArchive, setShowArchive] = useState(false)
  const [activeSpotlightIndex, setActiveSpotlightIndex] = useState(0)

  // Top 6 projects for the spotlight
  const featuredProjects = useMemo(() => projects?.slice(0, 6) || [], [projects])
  
  if (isLoading || !projects || projects.length === 0) return null

  return (
    <AnimatedSection 
      id="projects" 
      className="section-container relative py-20 overflow-hidden" 
      aria-labelledby="projects-title"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-12 relative z-10">
        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/30 mb-4 block">Engineered Solutions</span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <RevealText text="Project Spotlight" className="text-5xl sm:text-7xl font-display font-black tracking-tightest text-white uppercase" />
          <p className="max-w-md text-sm text-white/40 font-medium leading-relaxed">
            A selection of my most impactful works, from complex distributed systems to refined user experiences.
          </p>
        </div>
      </div>

      {/* Main Spotlight Gallery */}
      <div className="relative z-10 mb-12">
        <ProjectSpotlight 
          projects={featuredProjects} 
          onProjectChange={(index) => setActiveSpotlightIndex(index)}
        />
      </div>

      {/* Synced "Deep Dive" Details Container - Strict fixed height wrapper to prevent any viewport height shifts */}
      <div className="relative z-10 w-[85vw] md:w-full md:max-w-4xl mx-auto px-0 md:px-4 mb-20">
        <motion.div 
          className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 sm:p-10 backdrop-blur-xl relative overflow-hidden group/details h-[500px] sm:h-[460px] md:h-[340px] flex flex-col justify-center"
        >
          <AnimatePresence mode="wait">
            {featuredProjects[activeSpotlightIndex] && (
              <motion.div
                key={featuredProjects[activeSpotlightIndex].id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="w-full"
              >
                {/* Subtle background number */}
                <div className="absolute -bottom-10 -right-10 text-[12rem] font-display font-black text-white/[0.02] pointer-events-none group-hover/details:text-accent-primary/[0.02] transition-colors duration-500 select-none">
                  {activeSpotlightIndex + 1}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                  <div className="md:col-span-1 space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-accent-primary uppercase tracking-[0.2em] font-bold block mb-2">Technical Core</span>
                      <div className="flex flex-wrap gap-2">
                        {featuredProjects[activeSpotlightIndex].tech_stack?.map(tech => (
                          <span key={tech} className="px-2 py-1 bg-white/5 rounded text-[9px] font-mono text-white/50 border border-white/5 uppercase">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-8">
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] block">The Implementation</span>
                      <div className="overflow-y-auto max-h-[110px] md:max-h-[135px] pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <p className="text-white/80 leading-relaxed font-medium text-sm md:text-base">
                          {featuredProjects[activeSpotlightIndex].long_description || featuredProjects[activeSpotlightIndex].short_description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {featuredProjects[activeSpotlightIndex].github_stars !== null && featuredProjects[activeSpotlightIndex].github_stars !== undefined && featuredProjects[activeSpotlightIndex].github_stars > 0 && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                            <span className="text-accent-primary text-xs font-bold">★</span>
                            <span className="text-[10px] font-mono text-white/60">{featuredProjects[activeSpotlightIndex].github_stars} Stars</span>
                          </div>
                        )}
                        <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                          {featuredProjects[activeSpotlightIndex].category}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {featuredProjects[activeSpotlightIndex].demo_url && (
                          <a 
                            href={featuredProjects[activeSpotlightIndex].demo_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-black rounded-full font-bold text-xs transition-transform hover:scale-105 active:scale-95"
                          >
                            <span>Live Preview</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {featuredProjects[activeSpotlightIndex].github_url && (
                          <a 
                            href={featuredProjects[activeSpotlightIndex].github_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-all"
                            aria-label="GitHub Repository"
                          >
                            <GitBranch className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* The Archive Section */}
      <div className="relative z-10 mt-20">
        <div className="flex flex-col items-center gap-8">
          <motion.button
            onClick={() => setShowArchive(!showArchive)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center gap-3 px-8 py-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/5 transition-all hover:border-accent-primary/30"
          >
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-accent-primary group-hover:text-black transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Explore full collection</span>
              <span className="text-sm font-bold text-white uppercase tracking-tight">
                {showArchive ? 'Collapse Archive' : `View Project Archive (${projects.length}+)`}
              </span>
            </div>
            {showArchive ? <ChevronUp className="w-5 h-5 text-white/20 ml-4" /> : <ChevronDown className="w-5 h-5 text-white/20 ml-4" />}
          </motion.button>

          <AnimatePresence>
            {showArchive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full pt-12 border-t border-white/5"
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tightest">The Full Archive</h3>
                  <p className="text-xs text-white/30 font-mono mt-2 uppercase tracking-widest">Scalable inventory of all engineered projects</p>
                </div>
                <ProjectArchive projects={projects} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatedSection>
  )
}
