import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { THEME_STORAGE_KEY } from '@/constants/app'
import { applyTheme } from '@/lib/theme'
import type { Theme } from '@/types/app'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    },
  ),
)
