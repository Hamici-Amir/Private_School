import type { Theme } from '@/types/app'

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

function isDark(theme: Theme): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return mediaQuery.matches
}

/** Applies the resolved light/dark state to the document root. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle('dark', isDark(theme))
  root.style.colorScheme = theme
}

/** Resolves the effective theme ('light' | 'dark') for the current configuration. */
export function resolveTheme(theme: Theme): 'light' | 'dark' {
  return isDark(theme) ? 'dark' : 'light'
}
