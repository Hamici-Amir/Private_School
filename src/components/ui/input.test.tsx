import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders a text input by default', () => {
    render(<Input aria-label="Search" />)
    const input = screen.getByRole('textbox', { name: 'Search' })
    expect(input).toHaveAttribute('data-slot', 'input')
  })

  it('reflects the provided type attribute', () => {
    render(<Input type="email" aria-label="Email" />)
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('type', 'email')
  })

  it('is disabled when the disabled prop is set', () => {
    render(<Input disabled aria-label="Locked" />)
    expect(screen.getByRole('textbox', { name: 'Locked' })).toBeDisabled()
  })

  it('marks invalid inputs for assistive technology', () => {
    render(<Input aria-invalid aria-label="Invalid" />)
    expect(screen.getByRole('textbox', { name: 'Invalid' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('filters user input through the value/onChange contract', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input aria-label="Name" onChange={onChange} />)
    const input = screen.getByRole('textbox', { name: 'Name' })
    await user.type(input, 'Amine')
    expect(onChange).toHaveBeenCalled()
    expect(input).toHaveValue('Amine')
  })
})
