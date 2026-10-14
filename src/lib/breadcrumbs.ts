import { findNavGroup, findNavItem } from '@/constants/navigation'
import type { TranslationKey } from '@/lib/i18n'

export interface BreadcrumbEntry {
  labelKey: TranslationKey
  /** Present for links (all entries but the last one). */
  href?: string
}

/** Labels for app routes that are not part of the primary navigation. */
const UTILITY_LABELS: Record<string, TranslationKey> = {
  '/profile': 'userMenu.profile',
  '/notifications': 'shell.notifications',
}

/** Dynamic detail routes: overview → module → labelled detail page. */
const DETAIL_TRAILS: Array<{ match: RegExp; itemKey: string; labelKey: TranslationKey }> = [
  { match: /^\/students\/[^/]+$/, itemKey: 'students', labelKey: 'students.details.title' },
  { match: /^\/parents\/[^/]+$/, itemKey: 'parents', labelKey: 'parents.details.title' },
  { match: /^\/teachers\/[^/]+$/, itemKey: 'teachers', labelKey: 'teachers.details.title' },
  { match: /^\/classes\/[^/]+$/, itemKey: 'classes', labelKey: 'classes.details.title' },
]

/**
 * Reconstructs a breadcrumb trail from the navigation configuration for the
 * given pathname. Unmatched utility routes fall back to a labelled entry.
 */
export function getBreadcrumbs(pathname: string): BreadcrumbEntry[] {
  const item = findNavItemByPath(pathname)
  if (item) {
    const group = findNavGroup(item)
    const trail: BreadcrumbEntry[] = [{ labelKey: 'navGroup.overview', href: '/dashboard' }]
    if (group && group.items.length > 1) {
      trail.push({ labelKey: group.labelKey })
    }
    trail.push({ labelKey: item.labelKey })
    return trail
  }

  for (const detail of DETAIL_TRAILS) {
    if (detail.match.test(pathname)) {
      const moduleItem = findNavItem(detail.itemKey)
      if (moduleItem) {
        return [
          { labelKey: 'navGroup.overview', href: '/dashboard' },
          { labelKey: moduleItem.labelKey, href: moduleItem.href },
          { labelKey: detail.labelKey },
        ]
      }
    }
  }

  const utilityLabel = UTILITY_LABELS[pathname]
  if (utilityLabel) {
    return [{ labelKey: 'navGroup.overview', href: '/dashboard' }, { labelKey: utilityLabel }]
  }

  return [{ labelKey: 'navGroup.overview', href: '/dashboard' }]
}

/** Finds the nav item whose href matches the given pathname. */
function findNavItemByPath(pathname: string) {
  const item = findNavItem(pathname.replace(/^\//, ''))
  return item && item.href === pathname ? item : undefined
}
