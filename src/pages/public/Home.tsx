import { SEO } from '@/components/layout/SEO'
import { JsonLd } from '@/components/layout/JsonLd'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Skills } from './sections/Skills'
import { Projects } from './sections/Projects'
import { Experience } from './sections/Experience'
import { Achievements } from './sections/Achievements'
import { Certificates } from './sections/Certificates'
import { Contact } from './sections/Contact'

export function Home() {
  return (
    <div className="flex flex-col w-full relative z-10">
      <SEO />
      <JsonLd />

      <div id="home" className="relative">
        <Hero />
      </div>

      <div id="projects" className="relative bg-bg-surface/40 backdrop-blur-md border-y border-white/5">
        <Projects />
      </div>

      <div id="engineering" className="relative">
        <Skills />
      </div>

      <div id="experience" className="relative bg-bg-surface/40 backdrop-blur-md border-y border-white/5">
        <Experience />
      </div>

      <div id="achievements" className="relative">
        <Achievements />
      </div>

      <div id="certifications" className="relative bg-bg-surface/40 backdrop-blur-md border-y border-white/5">
        <Certificates />
      </div>

      <div id="about" className="relative">
        <About />
      </div>

      <div id="contact" className="relative bg-bg-surface/40 backdrop-blur-md border-t border-white/5">
        <Contact />
      </div>
    </div>
  )
}
