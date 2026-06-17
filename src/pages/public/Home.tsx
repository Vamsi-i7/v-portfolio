import { SEO } from '@/components/layout/SEO'
import { JsonLd } from '@/components/layout/JsonLd'
import { Hero } from './sections/Hero' // Keep Hero eager for LCP
import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const About = lazy(() => import('./sections/About').then(m => ({ default: m.About })))
const Skills = lazy(() => import('./sections/Skills').then(m => ({ default: m.Skills })))
const Projects = lazy(() => import('./sections/Projects').then(m => ({ default: m.Projects })))
const Experience = lazy(() => import('./sections/Experience').then(m => ({ default: m.Experience })))
const Achievements = lazy(() => import('./sections/Achievements').then(m => ({ default: m.Achievements })))
const Certificates = lazy(() => import('./sections/Certificates').then(m => ({ default: m.Certificates })))
const Contact = lazy(() => import('./sections/Contact').then(m => ({ default: m.Contact })))

export function Home() {
  return (
    <div className="flex flex-col w-full relative z-10">
      <SEO />
      <JsonLd />

      <AnimatePresence mode="popLayout">
        <motion.div key="home" className="relative">
          <Hero />
        </motion.div>

        <Suspense fallback={<div className="h-[400px] w-full animate-pulse bg-white/5 rounded-3xl" />}>
          <motion.div key="projects" className="relative py-16 md:py-24">
            <Projects />
          </motion.div>

          <motion.div key="engineering" className="relative py-16 md:py-24">
            <Skills />
          </motion.div>

          <motion.div key="experience" className="relative">
            <Experience />
          </motion.div>

          <motion.div key="achievements" className="relative py-16 md:py-24">
            <Achievements />
          </motion.div>

          <motion.div key="certifications" className="relative py-16 md:py-24">
            <Certificates />
          </motion.div>

          <motion.div key="about" className="relative py-16 md:py-24">
            <About />
          </motion.div>

          <motion.div key="contact" className="relative py-16 md:py-24">
            <Contact />
          </motion.div>
        </Suspense>
      </AnimatePresence>
    </div>
  )
}
