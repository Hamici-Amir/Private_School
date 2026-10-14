import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'

import { NotificationCenter } from '@/components/navigation/notification-center'
import { useLocaleStore } from '@/store/locale-store'
import { useNotificationsStore } from '@/store/notifications-store'

function renderCenter() {
  return render(
    <MemoryRouter>
      <NotificationCenter />
    </MemoryRouter>,
  )
}

describe('NotificationCenter', () => {
  beforeEach(() => {
    useLocaleStore.getState().setLocale('fr')
    useNotificationsStore.getState().reset()
  })

  it('shows the unread badge when there are unread items', () => {
    renderCenter()
    const trigger = screen.getByRole('button', { name: 'Notifications' })
    expect(trigger.textContent).toContain(String(useNotificationsStore.getState().unreadCount))
  })

  it('opens the dropdown listing notifications', async () => {
    const user = userEvent.setup()
    renderCenter()
    await user.click(screen.getByRole('button', { name: 'Notifications' }))
    const list = screen.getByRole('menu')
    expect(within(list).getAllByRole('menuitem').length).toBeGreaterThan(0)
  })

  it('marks all as read from the dropdown header', async () => {
    const user = userEvent.setup()
    renderCenter()
    await user.click(screen.getByRole('button', { name: 'Notifications' }))
    const viewAll = screen.getByRole('menuitem', { name: /Voir toutes les notifications/i })
    expect(viewAll).toBeInTheDocument()
    expect(useNotificationsStore.getState().unreadCount).toBeGreaterThan(0)
  })
})
