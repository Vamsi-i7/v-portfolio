import { SEO } from '@/components/layout/SEO'
import { JsonLd } from '@/components/layout/JsonLd'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Now } from './sections/Now'
import { Skills } from './sections/Skills'
import { CodingProfiles } from './sections/CodingProfiles'
import { Projects } from './sections/Projects'
import { Journey } from './sections/Journey'
import { Experience } from './sections/Experience'
import { Achievements } from './sections/Achievements'
import { Certificates } from './sections/Certificates'
import { Contact } from './sections/Contact'

export function Home() {
  return (
    <>
      <SEO />
      <JsonLd />
      <Hero />
      <Now />
      <Experience />
      <Achievements />
      <Projects />
      <Skills />
      <CodingProfiles />
      <Certificates />
      <Journey />
      <About />
      <Contact />
    </>
  )
}
