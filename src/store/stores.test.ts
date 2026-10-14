import { beforeEach, describe, expect, it } from 'vitest'

import { useAppShellStore } from './app-shell.store'
import { useNotificationsStore } from './notifications-store'

describe('useAppShellStore', () => {
  beforeEach(() => {
    useAppShellStore.setState({ sidebarCollapsed: false, mobileNavOpen: false, commandOpen: false })
  })

  it('toggles the desktop sidebar', () => {
    useAppShellStore.getState().toggleSidebar()
    expect(useAppShellStore.getState().sidebarCollapsed).toBe(true)
    useAppShellStore.getState().toggleSidebar()
    expect(useAppShellStore.getState().sidebarCollapsed).toBe(false)
  })

  it('opens and closes the mobile navigation', () => {
    useAppShellStore.getState().openMobileNav()
    expect(useAppShellStore.getState().mobileNavOpen).toBe(true)
    useAppShellStore.getState().closeMobileNav()
    expect(useAppShellStore.getState().mobileNavOpen).toBe(false)
  })

  it('tracks the command palette visibility', () => {
    useAppShellStore.getState().openCommand()
    expect(useAppShellStore.getState().commandOpen).toBe(true)
    useAppShellStore.getState().closeCommand()
    expect(useAppShellStore.getState().commandOpen).toBe(false)
  })

  it('collapses and expands independently', () => {
    useAppShellStore.getState().collapseSidebar()
    expect(useAppShellStore.getState().sidebarCollapsed).toBe(true)
    useAppShellStore.getState().expandSidebar()
    expect(useAppShellStore.getState().sidebarCollapsed).toBe(false)
  })
})

describe('useNotificationsStore', () => {
  beforeEach(() => {
    useNotificationsStore.getState().reset()
  })

  it('seeds unread notifications', () => {
    const state = useNotificationsStore.getState()
    expect(state.notifications.length).toBeGreaterThan(0)
    expect(state.unreadCount).toBeGreaterThan(0)
  })

  it('marks a single notification as read and updates the count', () => {
    const first = useNotificationsStore.getState().notifications[0]
    useNotificationsStore.getState().markAsRead(first.id)
    const state = useNotificationsStore.getState()
    expect(state.notifications.find((n) => n.id === first.id)?.read).toBe(true)
    expect(state.unreadCount).toBe(1)
  })

  it('marks every notification as read', () => {
    useNotificationsStore.getState().markAllAsRead()
    const state = useNotificationsStore.getState()
    expect(state.notifications.every((n) => n.read)).toBe(true)
    expect(state.unreadCount).toBe(0)
  })
})
