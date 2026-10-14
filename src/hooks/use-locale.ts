import { useLocaleStore } from '@/store/locale-store'
import type { Locale } from '@/types/app'

interface UseLocaleResult {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export function useLocale(): UseLocaleResult {
  const locale = useLocaleStore((state) => state.locale)
  const setLocale = useLocaleStore((state) => state.setLocale)
  return { locale, setLocale }
}
