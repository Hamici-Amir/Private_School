import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/constants/app'
import { getDirection } from '@/lib/i18n'
import type { Direction, Locale } from '@/types/app'

interface LocaleState {
  locale: Locale
  direction: Direction
  setLocale: (locale: Locale) => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      direction: getDirection(DEFAULT_LOCALE),
      setLocale: (locale) => set({ locale, direction: getDirection(locale) }),
    }),
    {
      name: LOCALE_STORAGE_KEY,
    },
  ),
)
