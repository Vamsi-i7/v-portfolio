import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Now } from './sections/Now'
import { Skills } from './sections/Skills'
import { Projects } from './sections/Projects'
import { Journey } from './sections/Journey'
import { Experience } from './sections/Experience'

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Now />
      <Skills />
      <Projects />
      <Journey />
      <Experience />
      {/* 
        Future sections will be added here:
        <Certificates />
        <Contact />
      */}
    </>
  )
}
