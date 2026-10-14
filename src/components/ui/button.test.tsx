import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children and a default variant by default', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('data-slot', 'button')
  })

  it('applies the requested variant and size classes', () => {
    render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Delete' })
    expect(button.className).toContain('bg-destructive')
    expect(button.className).toContain('h-8')
  })

  it('exposes warning and success variants for semantic actions', () => {
    render(
      <Button variant="warning" size="icon-sm">
        Warn
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Warn' })
    expect(button.className).toContain('bg-warning')
    expect(button.className).toContain('size-8')
  })

  it('disables the button when loading and announces it to screen readers', () => {
    render(
      <Button loading aria-label="Submitting">
        Submit
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Submitting' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('shows a spinner instead of children while loading', () => {
    const { container } = render(<Button loading>Label</Button>)
    expect(screen.queryByText('Label')).not.toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('does not fire click events while loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Submit
      </Button>,
    )
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('respects an explicit disabled prop', () => {
    render(<Button disabled>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })
})
