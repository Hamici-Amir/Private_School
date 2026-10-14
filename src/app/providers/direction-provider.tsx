import { useEffect, type ReactNode } from 'react'

import { getDirection } from '@/lib/i18n'
import { useLocaleStore } from '@/store/locale-store'

interface DirectionProviderProps {
  children: ReactNode
}

/**
 * Keeps the document direction (RTL/LTR) and language in sync with the
 * active locale. Arabic → rtl, French → ltr.
 */
export function DirectionProvider({ children }: DirectionProviderProps) {
  const locale = useLocaleStore((state) => state.locale)

  useEffect(() => {
    const root = document.documentElement
    root.dir = getDirection(locale)
    root.lang = locale
  }, [locale])

  return children
}
