import { createContext, useContext, useEffect, useState } from 'react'

export type ThemeType = 'theme-inferno' | 'theme-amber' | 'theme-emerald' | 'theme-blue' | 'theme-rose' | 'theme-purple'

interface ThemeContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('portfolio-theme') as ThemeType
      if (stored && ['theme-inferno', 'theme-amber', 'theme-emerald', 'theme-blue', 'theme-rose', 'theme-purple'].includes(stored)) {
        return stored
      }
    }
    return 'theme-amber' // Default to starting theme (Warm Amber)
  })

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme)
    localStorage.setItem('portfolio-theme', newTheme)
  }

  useEffect(() => {
    const root = document.documentElement
    const themeClasses = ['theme-inferno', 'theme-amber', 'theme-emerald', 'theme-blue', 'theme-rose', 'theme-purple']
    
    // Remove all existing theme classes
    themeClasses.forEach((cls) => root.classList.remove(cls))
    
    // Add new theme class
    root.classList.add(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
