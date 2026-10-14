import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { APP_SHELL_STORAGE_KEY } from '@/constants/app'

interface AppShellState {
  /** Desktop sidebar collapsed to an icon rail. */
  sidebarCollapsed: boolean
  /** Mobile navigation drawer visibility. */
  mobileNavOpen: boolean
  /** Global command palette (Ctrl/Cmd+K) visibility. */
  commandOpen: boolean
  collapseSidebar: () => void
  expandSidebar: () => void
  toggleSidebar: () => void
  toggleMobileNav: () => void
  openMobileNav: () => void
  closeMobileNav: () => void
  openCommand: () => void
  closeCommand: () => void
}

/** Application shell UI preferences (sidebar collapsed state persists). */
export const useAppShellStore = create<AppShellState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      mobileNavOpen: false,
      commandOpen: false,
      collapseSidebar: () => set({ sidebarCollapsed: true }),
      expandSidebar: () => set({ sidebarCollapsed: false }),
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      toggleMobileNav: () => set({ mobileNavOpen: !get().mobileNavOpen }),
      openMobileNav: () => set({ mobileNavOpen: true }),
      closeMobileNav: () => set({ mobileNavOpen: false }),
      openCommand: () => set({ commandOpen: true }),
      closeCommand: () => set({ commandOpen: false }),
    }),
    {
      name: APP_SHELL_STORAGE_KEY,
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    },
  ),
)
