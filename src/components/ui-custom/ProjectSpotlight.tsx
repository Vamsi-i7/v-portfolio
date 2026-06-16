import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, GitBranch, ChevronRight, ChevronLeft } from 'lucide-react'
import { getPublicUrl } from '@/lib/storage'

interface Project {
  id: string
  title: string
  thumbnail_path?: string | null
  category?: string | null
  tech_stack?: string[] | null
  demo_url?: string | null
  short_description?: string | null
  long_description?: string | null
  github_url?: string | null
  github_stars?: number | null
  started_at?: string | null
  ended_at?: string | null
  is_ongoing?: boolean | null
}

interface ProjectSpotlightProps {
  projects: Project[]
  onProjectChange?: (index: number) => void
}

export function ProjectSpotlight({ projects, onProjectChange }: ProjectSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Use a custom horizontal scroll container with snap points
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollPosition = container.scrollLeft
    const firstCard = container.firstElementChild as HTMLElement
    if (!firstCard) return
    const cardWidth = firstCard.offsetWidth + 32 // card width + gap (gap-8 is 32px)
    const index = Math.round(scrollPosition / cardWidth)
    
    if (index !== activeIndex && index >= 0 && index < projects.length) {
      setActiveIndex(index)
      onProjectChange?.(index)
    }
  }

  const scrollPrev = () => {
    if (containerRef.current) {
      const firstCard = containerRef.current.firstElementChild as HTMLElement
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth + 32
        containerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' })
      }
    }
  }

  const scrollNext = () => {
    if (containerRef.current) {
      const firstCard = containerRef.current.firstElementChild as HTMLElement
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth + 32
        containerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="relative group/spotlight">
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-12 pt-4 px-[10%]"
        style={{ scrollPaddingLeft: '10%', scrollPaddingRight: '10%' }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] snap-center"
          >
            <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.02] shadow-2xl group/card">
              {/* Thumbnail with parallax-like effect */}
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src={project.thumbnail_path ? getPublicUrl('portfolio-assets', project.thumbnail_path) : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200`}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.slice(0, 4).map(tech => (
                      <span key={tech} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-mono text-white/80 uppercase tracking-widest border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-4xl sm:text-6xl font-display font-black text-white uppercase tracking-tightest leading-[0.9]">
                    {project.title}
                  </h3>
                  
                  <p className="hidden md:block text-sm sm:text-lg text-white/60 line-clamp-2 font-medium max-w-xl">
                    {project.short_description}
                  </p>

                  <div className="hidden md:flex items-center gap-4 pt-4">
                    {project.demo_url && (
                      <a 
                        href={project.demo_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-black rounded-full font-bold text-sm transition-transform hover:scale-105 active:scale-95"
                      >
                        <span>Live Preview</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                    {project.github_url && (
                      <a 
                        href={project.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-all"
                      >
                        <GitBranch className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Index Indicator */}
              <div className="absolute top-8 right-10 text-white/20 font-display font-black text-8xl pointer-events-none italic">
                0{index + 1}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="hidden md:flex absolute left-[5%] top-1/2 -translate-y-1/2 items-center gap-4 z-20 pointer-events-none">
        <button 
          onClick={scrollPrev}
          className="p-4 rounded-full bg-black/50 border border-white/10 backdrop-blur-xl text-white hover:bg-accent-primary hover:text-black transition-all pointer-events-auto disabled:opacity-20 shadow-2xl"
          disabled={activeIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="hidden md:flex absolute right-[5%] top-1/2 -translate-y-1/2 items-center gap-4 z-20 pointer-events-none">
        <button 
          onClick={scrollNext}
          className="p-4 rounded-full bg-black/50 border border-white/10 backdrop-blur-xl text-white hover:bg-accent-primary hover:text-black transition-all pointer-events-auto disabled:opacity-20 shadow-2xl"
          disabled={activeIndex === projects.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-3 mt-4">
        {projects.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 transition-all duration-300 rounded-full ${i === activeIndex ? 'w-12 bg-accent-primary' : 'w-4 bg-white/10'}`} 
          />
        ))}
      </div>
    </div>
  )
}
