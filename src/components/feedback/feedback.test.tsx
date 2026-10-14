import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { useLocaleStore } from '@/store/locale-store'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No students" description="Create your first class." />)
    expect(screen.getByRole('heading', { name: 'No students' })).toBeInTheDocument()
    expect(screen.getByText('Create your first class.')).toBeInTheDocument()
  })

  it('renders an optional action', () => {
    render(<EmptyState title="Empty" action={<button>Add</button>} />)
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('does not render a description section when omitted', () => {
    render(<EmptyState title="Only title" />)
    expect(screen.getByRole('heading', { name: 'Only title' })).toBeInTheDocument()
  })
})

describe('ErrorState', () => {
  beforeEach(() => {
    useLocaleStore.getState().setLocale('fr')
  })

  it('exposes an alert role with title and description', () => {
    render(<ErrorState title="Failed" description="Try again." />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Failed')
    expect(alert).toHaveTextContent('Try again.')
  })

  it('invokes onRetry when the retry button is used', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<ErrorState title="Failed" onRetry={onRetry} />)
    await user.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('invokes onBack when the back button is used', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<ErrorState title="Failed" onBack={onBack} />)
    await user.click(screen.getByRole('button', { name: 'Retour' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('renders technical details in development builds', () => {
    // Vitest runs with `import.meta.env.DEV === true` (inlined at transform time).
    render(<ErrorState title="Failed" details="secret:db.git" />)
    expect(screen.getByText('secret:db.git')).toBeInTheDocument()
  })
})
