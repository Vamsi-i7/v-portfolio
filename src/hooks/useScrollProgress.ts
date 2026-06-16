import { useScroll, useSpring } from 'framer-motion'

export function useScrollProgress() {
  const { scrollYProgress, scrollY } = useScroll()
  
  // Smooth out the progress for 3D animations
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 100,
    restDelta: 0.001
  })

  return {
    scrollYProgress,
    smoothProgress,
    scrollY
  }
}
