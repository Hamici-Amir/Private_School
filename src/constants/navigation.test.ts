import { describe, expect, it } from 'vitest'

import { NAV_GROUPS, NAV_ITEMS, findNavGroup, findNavItem } from '@/constants/navigation'

describe('navigation configuration', () => {
  it('flattens every group item into NAV_ITEMS', () => {
    const flattened = NAV_GROUPS.flatMap((group) => group.items)
    expect(NAV_ITEMS).toEqual(flattened)
    expect(NAV_ITEMS.length).toBeGreaterThan(0)
  })

  it('exposes unique item keys and hrefs', () => {
    const keys = NAV_ITEMS.map((item) => item.key)
    const hrefs = NAV_ITEMS.map((item) => item.href)
    expect(new Set(keys).size).toBe(keys.length)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('finds an item by key and its owning group', () => {
    const students = findNavItem('students')
    expect(students).toBeDefined()
    expect(findNavGroup(students!)?.labelKey).toBe('navGroup.management')
  })

  it('returns undefined for unknown keys', () => {
    expect(findNavItem('nope')).toBeUndefined()
  })

  it('keeps finance items restricted to finance roles', () => {
    const payments = findNavItem('payments')!
    expect(payments.roles).toContain('accountant')
  })

  it('exports the six application groups in order', () => {
    expect(NAV_GROUPS.map((group) => group.key)).toEqual([
      'overview',
      'management',
      'academics',
      'finance',
      'administration',
      'settings',
    ])
  })
})
