import type { Direction, Locale } from '@/types/app'

const LOCALE_TO_DIRECTION: Record<Locale, Direction> = {
  ar: 'rtl',
  fr: 'ltr',
  en: 'ltr',
}

/** Resolves the document direction for a given locale. */
export function getDirection(locale: Locale): Direction {
  return LOCALE_TO_DIRECTION[locale]
}
