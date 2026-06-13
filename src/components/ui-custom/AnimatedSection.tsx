import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedSectionProps {
  id: string
  children: ReactNode
  className?: string
  /** Adjust margin to trigger animation earlier/later. Default: "-100px" */
  viewportMargin?: string
  /** Accessible name for the section */
  'aria-labelledby'?: string
}

export function AnimatedSection({ 
  id, 
  children, 
  className = '', 
  viewportMargin = '-100px',
  'aria-labelledby': ariaLabelledBy
}: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`section-padding ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ 
        duration: 0.6, // Matches --duration-enter (600ms) from tokens
        ease: [0.16, 1, 0.3, 1] // Matches --ease-out from tokens
      }}
    >
      {children}
    </motion.section>
  )
}
