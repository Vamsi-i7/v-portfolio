import { useState, useRef, useEffect } from 'react'
import { useTheme, type ThemeType } from '@/contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette } from 'lucide-react'

const THEMES: { id: ThemeType; name: string; color: string }[] = [
  { id: 'theme-inferno', name: 'Inferno Red', color: '#FF1E1E' },
  { id: 'theme-amber', name: 'Warm Amber', color: '#FF9500' },
  { id: 'theme-emerald', name: 'Emerald Cyber', color: '#05F292' },
  { id: 'theme-blue', name: 'Nordic Blue', color: '#60A5FA' },
  { id: 'theme-rose', name: 'Retro Rose', color: '#FF2E93' },
  { id: 'theme-purple', name: 'Aura Purple', color: '#A855F7' },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="fixed top-5 right-5 md:top-auto md:bottom-8 md:right-8 z-[100] pointer-events-none flex items-center gap-2" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 450 }}
            className="flex items-center gap-2 p-1.5 rounded-full bg-bg-surface/90 border border-white/[0.08] backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] pointer-events-auto select-none mr-1"
          >
            {THEMES.map((t) => {
              const isActive = theme === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`relative w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all ${
                    isActive 
                      ? 'scale-110 ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-surface' 
                      : 'hover:scale-110 active:scale-95 opacity-70 hover:opacity-100'
                  }`}
                  title={t.name}
                  aria-label={`Switch to ${t.name} theme`}
                >
                  <span 
                    className="w-[18px] h-[18px] rounded-full block" 
                    style={{ backgroundColor: t.color }}
                  />
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full border border-white/10 bg-bg-surface/80 hover:bg-bg-elevated backdrop-blur-md flex items-center justify-center text-text-secondary hover:text-accent-primary transition-all pointer-events-auto hover:border-accent-primary/20 shadow-lg hover:scale-105 active:scale-95 group ${
          isOpen ? 'text-accent-primary border-accent-primary/20 bg-bg-elevated' : ''
        }`}
        aria-label="Toggle theme selector"
        aria-expanded={isOpen}
      >
        <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
      </button>
    </div>
  )
}
