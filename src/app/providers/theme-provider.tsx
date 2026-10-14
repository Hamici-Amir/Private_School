import { useEffect, type ReactNode } from 'react'

import { applyTheme } from '@/lib/theme'
import { useThemeStore } from '@/store/theme-store'

interface ThemeProviderProps {
  children: ReactNode
}

/** Applies the theme preference and reacts to OS-level changes. */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    applyTheme(theme)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') applyTheme('system')
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  return children
}
