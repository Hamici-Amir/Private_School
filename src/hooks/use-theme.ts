import { useThemeStore } from '@/store/theme-store'
import type { Theme } from '@/types/app'

interface UseThemeResult {
  theme: Theme
  setTheme: (theme: Theme) => void
}

/** Convenience wrapper around the persisted theme store. */
export function useTheme(): UseThemeResult {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  return { theme, setTheme }
}
