import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ConfirmDialog } from '@/components/dialogs/confirm-dialog'

describe('ConfirmDialog', () => {
  it('renders title and description when open', () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="Delete class"
        description="This action cannot be undone."
      />,
    )
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText('Delete class')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
  })

  it('does not render content when closed', () => {
    render(<ConfirmDialog open={false} onOpenChange={() => {}} title="Delete class" />)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('fires onConfirm when the confirm button is used', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog open onOpenChange={() => {}} title="Delete class" onConfirm={onConfirm} />,
    )
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('disables the controls while loading', () => {
    render(
      <ConfirmDialog
        open
        loading
        onOpenChange={() => {}}
        title="Deleting…"
        confirmLabel="Delete"
      />,
    )
    const dialog = screen.getByRole('alertdialog')
    const buttons = dialog.querySelectorAll('button')
    for (const button of buttons) {
      expect(button).toBeDisabled()
    }
  })

  it('uses the destructive variant labels when requested', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <ConfirmDialog
        open
        variant="destructive"
        onOpenChange={onOpenChange}
        title="Remove teacher"
        confirmLabel="Yes, remove"
        cancelLabel="Keep it"
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Keep it' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
