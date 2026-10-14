import type { ReactNode } from 'react'

import { useI18n } from '@/hooks/use-i18n'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useThemeStore } from '@/store/theme-store'
import { Toaster } from '@/lib/toast'

/**
 * Mounts the sonner Toaster with app-aware theme (light/dark/system) and
 * RTL-aware positioning. Notifications stay out of the way and are
 * consistent with the active theme + direction.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme)
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const { direction } = useI18n()

  const resolvedTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme

  return (
    <>
      {children}
      <Toaster
        theme={resolvedTheme}
        position={direction === 'rtl' ? 'bottom-left' : 'bottom-right'}
        richColors
        closeButton
        offset={16}
        gap={8}
        toastOptions={{
          className: 'font-sans text-body-sm border-border shadow-dropdown',
        }}
      />
    </>
  )
}
