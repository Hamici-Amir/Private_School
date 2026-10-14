import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { AvatarGroup, initials } from '@/components/data-display/avatar-group'

describe('initials', () => {
  it('returns the first letters of first and last name', () => {
    expect(initials('Amine Benali')).toBe('AB')
  })

  it('collapses multiple spaces', () => {
    expect(initials('  Amine   Benali  ')).toBe('AB')
  })

  it('handles single-word names by taking the first two letters', () => {
    expect(initials('Amine')).toBe('AM')
  })

  it('handles Arabic multi-word names', () => {
    expect(initials('محمد أمين')).toBe('مأ')
  })

  it('returns an empty string for empty input', () => {
    expect(initials('')).toBe('')
    expect(initials('   ')).toBe('')
  })
})

describe('AvatarGroup', () => {
  const people = [
    { name: 'Amine Benali' },
    { name: 'Yasmine Saadi' },
    { name: 'Mohamed Idir' },
    { name: 'Lina Bouzid' },
    { name: 'Adam Zerrouki' },
  ]

  it('renders initials for every avatar', () => {
    render(<AvatarGroup items={people} max={10} />)
    for (const { name } of people) {
      expect(screen.getAllByText(initials(name)).length).toBeGreaterThan(0)
    }
  })

  it('caps the visible count at `max` and shows the overflow pill', () => {
    render(<AvatarGroup items={people} max={3} />)
    expect(screen.getByText('+2')).toBeInTheDocument()
    expect(screen.queryByText(initials('Adam Zerrouki') as string)).not.toBeInTheDocument()
  })

  it('do not render an overflow pill when all items are visible', () => {
    render(<AvatarGroup items={people} max={10} />)
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
  })
})
