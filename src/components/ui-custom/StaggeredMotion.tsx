import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StaggeredMotionProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
}

export function StaggeredMotion({ 
  children, 
  className = "", 
  delay = 0,
  stagger = 0.1 
}: StaggeredMotionProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }

  const child = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-50px" }}
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((item, index) => (
          <motion.div key={index} variants={child}>
            {item}
          </motion.div>
        ))
      ) : (
        <motion.div variants={child}>{children}</motion.div>
      )}
    </motion.div>
  )
}
