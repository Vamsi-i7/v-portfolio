import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden'

    // Duration of focus reveal + loading bar fill-up
    const timer = setTimeout(() => {
      setIsExiting(true)
    }, 2200)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const handleExitComplete = () => {
    // Restore scrolling
    document.body.style.overflow = ''
    onComplete()
  }

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.8, 
              ease: [0.85, 0, 0.15, 1] 
            }
          }}
          onAnimationComplete={handleExitComplete}
          className="fixed inset-0 w-screen h-screen bg-[#050505] z-[9999] flex flex-col items-center justify-center select-none"
        >
          {/* Main Greeting Container */}
          <div className="flex flex-col items-center justify-center min-h-[140px]">
            <div className="relative py-3 px-6">
              {/* Bold Modern Display Greeting with Cinematic Lens Focus Animation */}
              <motion.h1
                initial={{ 
                  opacity: 0, 
                  filter: 'blur(24px)', 
                  letterSpacing: '0.4em', 
                  scale: 0.92 
                }}
                animate={{ 
                  opacity: 1, 
                  filter: 'blur(0px)', 
                  letterSpacing: '0.08em', 
                  scale: 1,
                  transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } 
                }}
                exit={{
                  scale: 3.5,
                  filter: 'blur(35px)',
                  opacity: 0,
                  transition: { duration: 0.75, ease: [0.85, 0, 0.15, 1] }
                }}
                className="text-6xl sm:text-7xl md:text-8xl text-white font-display font-black leading-none uppercase select-none relative z-0"
              >
                hello
              </motion.h1>
            </div>

            {/* Apple/MacBook-Style Minimal Progress Indicator */}
            <motion.div 
              exit={{ 
                opacity: 0, 
                y: 15,
                transition: { duration: 0.4, ease: 'easeIn' }
              }}
              className="w-36 h-[2px] bg-white/10 rounded-full mt-6 relative overflow-hidden"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ 
                  width: '100%',
                  transition: { 
                    duration: 2.0, 
                    ease: [0.22, 1, 0.36, 1] 
                  }
                }}
                className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              />
            </motion.div>
          </div>

          {/* Dynamic Ambient Accent Light */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-screen bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
