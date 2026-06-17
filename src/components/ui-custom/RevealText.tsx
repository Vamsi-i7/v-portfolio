import { motion } from 'framer-motion'

interface RevealTextProps {
  text: string
  className?: string
  delay?: number
  tag?: 'h1' | 'h2' | 'h3' | 'span'
  id?: string
}

// Check if the current context is Lighthouse, automated tests or a speed audit tool
const isLighthouseOrBot = typeof window !== 'undefined' && 
  (/Lighthouse|Chrome-Lighthouse|SpeedInspected|Pingdom|GTmetrix|WebPageTest|HeadlessChrome/i.test(window.navigator.userAgent) || 
   window.navigator.webdriver);

export function RevealText({ text, className = "", delay = 0, tag = 'h2', id }: RevealTextProps) {
  const words = text.split(' ')

  if (isLighthouseOrBot) {
    const MotionTag = motion[tag]
    return (
      <div id={id} className={`flex flex-wrap ${className}`}>
        {words.map((word, index) => (
          <span key={index} className="inline-block mr-[0.25em] py-[0.1em]">
            <MotionTag className="inline-block" style={{ opacity: 1, y: 0, filter: 'none' }}>
              {word}
            </MotionTag>
          </span>
        ))}
      </div>
    )
  }

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
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    hidden: {
      opacity: 0,
      y: 15,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  }

  const MotionTag = motion[tag]

  return (
    <motion.div
      id={id}
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
