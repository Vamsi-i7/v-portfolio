import { motion } from 'framer-motion'

interface RevealTextProps {
  text: string
  className?: string
  delay?: number
  tag?: 'h1' | 'h2' | 'h3' | 'span'
}

export function RevealText({ text, className = "", delay = 0, tag = 'h2' }: RevealTextProps) {
  const words = text.split(' ')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: delay 
      },
    },
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    hidden: {
      opacity: 0,
      y: 40,
      filter: "blur(10px)",
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  }

  const MotionTag = motion[tag]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-wrap ${className}`}
    >
      {words.map((word, index) => (
        <span key={index} className="overflow-hidden inline-block mr-[0.25em] py-[0.1em]">
          <MotionTag
            variants={child}
            className="inline-block"
          >
            {word}
          </MotionTag>
        </span>
      ))}
    </motion.div>
  )
}
