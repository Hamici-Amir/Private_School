import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import {
  StatusBadge,
  STATUS_TONE,
  STATUS_VARIANT,
  type StatusTone,
} from '@/components/data-display/status-badge'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  it('renders content in a span with badge semantics', () => {
    render(<Badge>New</Badge>)
    const badge = screen.getByText('New')
    expect(badge.tagName).toBe('SPAN')
    expect(badge).toHaveAttribute('data-slot', 'badge')
  })

  it('applies the default variant by default', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText('Default').className).toContain('bg-primary')
  })

  it('applies semantic soft variants', () => {
    render(<Badge variant="success-soft">Paid</Badge>)
    expect(screen.getByText('Paid').className).toContain('bg-success-soft')
  })
})

describe('StatusBadge', () => {
  it('maps every status tone to a rendered badge variant', () => {
    for (const [keyword, tone] of Object.entries(STATUS_TONE)) {
      const variant = STATUS_VARIANT[tone as StatusTone]
      expect(variant).toBeTruthy()
      expect(keyword).toBeTruthy()
    }
    expect(STATUS_TONE.active).toBe('success')
    expect(STATUS_TONE.unpaid).toBe('error')
    expect(STATUS_TONE.pending).toBe('pending')
  })

  it('renders a status dot for color-independent recognition by default', () => {
    render(<StatusBadge>Active</StatusBadge>)
    const badge = screen.getByText('Active').closest('[data-slot="badge"]')
    expect(badge?.querySelector('[aria-hidden="true"][data-tone]')).toBeInTheDocument()
  })

  it('renders custom children and forwards a tone override', () => {
    render(<StatusBadge tone="error">Blocked</StatusBadge>)
    expect(screen.getByText('Blocked')).toBeInTheDocument()
  })

  it('omits the dot when disabled', () => {
    render(<StatusBadge dot={false}>NoDot</StatusBadge>)
    const badge = screen.getByText('NoDot').closest('[data-slot="badge"]')
    expect(badge?.querySelector('[data-tone]')).not.toBeInTheDocument()
  })
})
