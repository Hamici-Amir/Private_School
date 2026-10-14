import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import { NavList } from '@/components/navigation/nav-list'

function renderNav(initialEntry = '/dashboard', collapsed = false) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <NavList context="sidebar" collapsed={collapsed} />
    </MemoryRouter>,
  )
}

describe('NavList', () => {
  it('renders the application groups and their items', () => {
    renderNav()
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /لوحة التحكم/ })).toBeInTheDocument()
    expect(screen.getByText('نظرة عامة')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /التلاميذ/ })).toBeInTheDocument()
  })

  it('marks the matching route as active', () => {
    renderNav('/students')
    expect(screen.getByRole('link', { name: /التلاميذ/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /لوحة التحكم/ })).not.toHaveAttribute('aria-current')
  })

  it('keeps group labels as screen-reader text when collapsed', () => {
    renderNav('/dashboard', true)
    expect(screen.getByText('نظرة عامة')).toBeInTheDocument()
  })

  it('renders every module from the navigation config', () => {
    renderNav()
    for (const label of [
      /لوحة التحكم/,
      /التلاميذ/,
      /الأولياء/,
      /الأساتذة/,
      /الأقسام/,
      /المواد/,
      /التسجيلات/,
      /الغياب/,
      /النتائج/,
      /المدفوعات/,
      /المصاريف/,
      /الوثائق/,
      /التقارير/,
      /الإعدادات/,
    ]) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })
})
