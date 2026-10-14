import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { useLocaleStore } from '@/store/locale-store'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Breadcrumbs />
    </MemoryRouter>,
  )
}

describe('Breadcrumbs', () => {
  beforeEach(() => {
    useLocaleStore.getState().setLocale('fr')
  })

  it('renders the trail with a link to the overview', () => {
    renderAt('/payments')

    expect(screen.getByRole('link', { name: "Vue d'ensemble" })).toHaveAttribute(
      'href',
      '/dashboard',
    )
    expect(screen.getByText('Finances')).toBeInTheDocument()
    expect(screen.getByText('Paiements')).toBeInTheDocument()
  })

  it('represents the current page without a link', () => {
    renderAt('/payments')

    const current = screen.getByRole('link', { name: 'Paiements' })
    expect(current.tagName).not.toBe('A')
    expect(current).toHaveAttribute('aria-disabled', 'true')
    expect(current).toHaveAttribute('aria-current', 'page')
  })

  it('never nests list items inside the trail list', () => {
    renderAt('/payments')

    const list = screen.getByRole('list')
    const items = list.querySelectorAll('li')
    expect(items.length).toBeGreaterThan(0)
    for (const item of items) {
      expect(item.querySelector('li')).toBeNull()
    }
  })
})
