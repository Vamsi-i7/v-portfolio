import { motion } from 'framer-motion'
import { forwardRef, type ReactNode } from 'react'

interface AnimatedSectionProps {
  id: string
  children: ReactNode
  className?: string
  /** Adjust margin to trigger animation earlier/later. Default: "-100px" */
  viewportMargin?: string
  /** Accessible name for the section */
  'aria-labelledby'?: string
  onMouseMove?: (e: React.MouseEvent) => void
}

export const AnimatedSection = forwardRef<HTMLElement, AnimatedSectionProps>(({ 
  id, 
  children, 
  className = '', 
  viewportMargin = '-100px',
  'aria-labelledby': ariaLabelledBy,
  onMouseMove
}, ref) => {
  return (
    <motion.section
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`section-padding ${className}`}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: viewportMargin }}
      transition={{ 
        duration: 0.6, // Matches --duration-enter (600ms) from tokens
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number] // Matches --ease-out from tokens
      }}
    >
      {children}
    </motion.section>
  )
})

AnimatedSection.displayName = 'AnimatedSection'
