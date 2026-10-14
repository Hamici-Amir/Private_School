import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ModulePlaceholderPage } from '@/pages/module-placeholder-page'

describe('ModulePlaceholderPage', () => {
  it('renders the module title, href and construction notice', () => {
    render(<ModulePlaceholderPage labelKey="nav.students" href="/students" />)
    expect(screen.getByRole('heading', { name: 'التلاميذ' })).toBeInTheDocument()
    expect(screen.getAllByText('/students').length).toBeGreaterThan(0)
    expect(screen.getByText('الوحدة قيد التطوير').closest('h1')).toBeNull()
  })

  it('renders a status badge when provided', () => {
    render(<ModulePlaceholderPage labelKey="nav.grades" href="/grades" status="planned" />)
    expect(screen.getByText('مخطط')).toBeInTheDocument()
  })

  it('fires an informative toast on the action buttons', async () => {
    const user = userEvent.setup()
    render(<ModulePlaceholderPage labelKey="nav.settings" href="/settings" />)
    const button = screen.getByRole('button', { name: 'الوحدة قيد التطوير' })
    await user.click(button)
    expect(screen.getByRole('button', { name: 'الوحدة قيد التطوير' })).toBeInTheDocument()
  })

  it('omits a blank status badge when no status is passed', () => {
    render(<ModulePlaceholderPage labelKey="nav.dashboard" href="/dashboard" />)
    expect(screen.queryByText('مخطط')).not.toBeInTheDocument()
  })
})
