import { useLocaleStore } from '@/store/locale-store'
import type { Direction, Locale } from '@/types/app'

interface UseDirectionResult {
  direction: Direction
  locale: Locale
}

export function useDirection(): UseDirectionResult {
  const direction = useLocaleStore((state) => state.direction)
  const locale = useLocaleStore((state) => state.locale)
  return { direction, locale }
}
