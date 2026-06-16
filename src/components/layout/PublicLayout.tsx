import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Navbar } from '@/components/layout/Navbar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/ui-custom/ScrollProgress'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { Preloader } from '@/components/ui-custom/Preloader'
import { motion } from 'framer-motion'
import { SideRays } from '@/components/ui-custom/SideRays'
import { useTheme } from '@/contexts/ThemeContext'
import { ThemeSwitcher } from '@/components/ui-custom/ThemeSwitcher'
import LiquidEther from '@/components/ui-custom/LiquidEther'

const THEME_PALETTES: Record<string, string[]> = {
  'theme-inferno': ['#FF1E1E', '#FF9A00', '#FF4E00'],
  'theme-amber':   ['#ff5e6f', '#ffd349', '#FF9500'],
  'theme-emerald': ['#05F292', '#00f2fe', '#00f5a0'],
  'theme-blue':    ['#60A5FA', '#a18cd1', '#3b82f6'],
  'theme-rose':    ['#FF2E93', '#ff7eb3', '#E01675'],
  'theme-purple':  ['#A855F7', '#00f2fe', '#8b5cf6'],
}

const RAY_COLORS: Record<string, { color1: string; color2: string }> = {
  'theme-inferno': { color1: '#FF1E1E', color2: '#FF9A00' },
  'theme-amber':   { color1: '#ff5e6f', color2: '#ffd349' },
  'theme-emerald': { color1: '#05F292', color2: '#00f2fe' },
  'theme-blue':    { color1: '#60A5FA', color2: '#a18cd1' },
  'theme-rose':    { color1: '#FF2E93', color2: '#ff7eb3' },
  'theme-purple':  { color1: '#A855F7', color2: '#00f2fe' },
}

export function PublicLayout() {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window !== 'undefined') {
      if (import.meta.env.DEV) return true // Always show in local dev for easy testing
      return !sessionStorage.getItem('portfolio-preloaded')
    }
    return false
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const rayColors = RAY_COLORS[theme] || RAY_COLORS['theme-inferno']
  const activePalette = THEME_PALETTES[theme] || THEME_PALETTES['theme-amber']

  return (
    <>
      {showPreloader && (
        <Preloader onComplete={() => {
          sessionStorage.setItem('portfolio-preloaded', 'true')
          setShowPreloader(false)
        }} />
      )}
      <SmoothScroll>
        <ScrollProgress />
        <Navbar />
        <MobileNav />
        <ThemeSwitcher />

        {/* Global Cursor Spotlight */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle 350px at var(--mouse-x, -999px) var(--mouse-y, -999px), var(--accent-spotlight, rgba(255, 149, 0, 0.08)), transparent 80%)'
          }}
        />

        {/* Global Liquid Ether background */}
        <LiquidEther colors={activePalette} className="fixed inset-0 w-screen h-screen pointer-events-none z-0 opacity-40" />

        {/* Global SideRays WebGL background */}
        <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 opacity-25">
          <SideRays
            speed={2.5}
            rayColor1={rayColors.color1}
            rayColor2={rayColors.color2}
            intensity={2}
            spread={2}
            origin="top-right"
            tilt={0}
            saturation={1.5}
            blend={0.75}
            falloff={1.6}
            opacity={1.0}
          />
        </div>

        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
          animate={{ 
            opacity: showPreloader ? 0 : 1, 
            scale: showPreloader ? 0.98 : 1, 
            filter: showPreloader ? 'blur(8px)' : 'blur(0px)',
          }}
          transition={{ 
            duration: 1.1, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.08
          }}
          className="relative flex min-h-screen flex-col bg-transparent text-foreground font-body"
        >
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md focus:shadow-lg"
        >
          Skip to content
        </a>

        <main id="main-content" className="flex-1 pt-20 pb-28 md:pb-0 overflow-x-hidden relative z-10">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>

        <Footer />
      </motion.div>
    </SmoothScroll>
    </>
  )
}

