import { describe, expect, it } from 'vitest'

import { getBreadcrumbs } from '@/lib/breadcrumbs'

describe('getBreadcrumbs', () => {
  it('builds the overview trail for the dashboard home', () => {
    expect(getBreadcrumbs('/dashboard')).toEqual([
      { labelKey: 'navGroup.overview', href: '/dashboard' },
      { labelKey: 'nav.dashboard' },
    ])
  })

  it('includes the owning group for standalone modules', () => {
    expect(getBreadcrumbs('/students')).toEqual([
      { labelKey: 'navGroup.overview', href: '/dashboard' },
      { labelKey: 'navGroup.management' },
      { labelKey: 'nav.students' },
    ])
  })

  it('falls back to overview when the route is unknown', () => {
    expect(getBreadcrumbs('/not-a-route')).toEqual([
      { labelKey: 'navGroup.overview', href: '/dashboard' },
    ])
  })

  it('maps utility routes to their labels', () => {
    expect(getBreadcrumbs('/profile')).toEqual([
      { labelKey: 'navGroup.overview', href: '/dashboard' },
      { labelKey: 'userMenu.profile' },
    ])
    expect(getBreadcrumbs('/notifications')).toEqual([
      { labelKey: 'navGroup.overview', href: '/dashboard' },
      { labelKey: 'shell.notifications' },
    ])
  })

  it('does not add the group for groups with a single item', () => {
    const trail = getBreadcrumbs('/settings')
    expect(trail).toEqual([
      { labelKey: 'navGroup.overview', href: '/dashboard' },
      { labelKey: 'nav.settings' },
    ])
  })
})
