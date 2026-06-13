import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Now } from './sections/Now'
import { Skills } from './sections/Skills'

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Now />
      <Skills />
      {/* 
        Future sections will be added here:
        <Projects />
        <Journey />
        <Experience />
        <Certificates />
        <Contact />
      */}
    </>
  )
}
