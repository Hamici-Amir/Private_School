import {
  BanknoteIcon,
  BarChart3Icon,
  BookOpenIcon,
  CalendarCheckIcon,
  ClipboardListIcon,
  FolderOpenIcon,
  LayoutDashboardIcon,
  ReceiptIcon,
  SchoolIcon,
  SettingsIcon,
  StarIcon,
  UserCogIcon,
  UsersIcon,
  UsersRoundIcon,
  type LucideIcon,
} from 'lucide-react'

import type { TranslationKey } from '@lib/i18n'
import type { Role } from '@/types/app'

/** Visual badge shown next to a nav item. */
export type NavItemStatus = 'active' | 'beta' | 'new' | 'planned'

export interface NavItem {
  /** Module identifier (used for i18n key, route and placeholder page). */
  key: string
  /** Route when available. */
  href: string
  icon: LucideIcon
  labelKey: TranslationKey
  /** Roles allowed to see the item; empty array means everyone (permission-ready). */
  roles: Role[]
  /** Badge rendered in the sidebar. */
  status: NavItemStatus
  enabled: boolean
}

export interface NavGroup {
  /** Group identifier. */
  key: string
  labelKey: TranslationKey
  items: NavItem[]
}

function item(
  key: string,
  href: string,
  icon: LucideIcon,
  labelKey: TranslationKey,
  status: NavItemStatus,
  roles: Role[] = [],
): NavItem {
  return { key, href, icon, labelKey, roles, status, enabled: true }
}

/** Main application navigation, grouped by section. */
export const NAV_GROUPS: NavGroup[] = [
  {
    key: 'overview',
    labelKey: 'navGroup.overview',
    items: [item('dashboard', '/dashboard', LayoutDashboardIcon, 'nav.dashboard', 'active')],
  },
  {
    key: 'management',
    labelKey: 'navGroup.management',
    items: [
      item('students', '/students', UsersIcon, 'nav.students', 'new'),
      item('parents', '/parents', UsersRoundIcon, 'nav.parents', 'new'),
      item('teachers', '/teachers', UserCogIcon, 'nav.teachers', 'new'),
    ],
  },
  {
    key: 'academics',
    labelKey: 'navGroup.academics',
    items: [
      item('classes', '/classes', SchoolIcon, 'nav.classes', 'new'),
      item('subjects', '/subjects', BookOpenIcon, 'nav.subjects', 'new'),
      item('enrollment', '/enrollments', ClipboardListIcon, 'nav.enrollment', 'new'),
      item('attendance', '/attendance', CalendarCheckIcon, 'nav.attendance', 'planned'),
      item('grades', '/grades', StarIcon, 'nav.grades', 'planned'),
    ],
  },
  {
    key: 'finance',
    labelKey: 'navGroup.finance',
    items: [
      item('payments', '/payments', BanknoteIcon, 'nav.payments', 'planned', [
        'admin',
        'accountant',
        'director',
      ]),
        item('expenses', '/finance/expenses', ReceiptIcon, 'nav.expenses', 'new', [
        'admin',
        'accountant',
      ]),
    ],
  },
  {
    key: 'administration',
    labelKey: 'navGroup.administration',
    items: [
      item('documents', '/documents', FolderOpenIcon, 'nav.documents', 'new'),
      item('reports', '/reports', BarChart3Icon, 'nav.reports', 'planned'),
    ],
  },
  {
    key: 'settings',
    labelKey: 'navGroup.settings',
    items: [item('settings', '/settings', SettingsIcon, 'nav.settings', 'active')],
  },
]

/** Flattened item list (order preserved) for lookups and search. */
export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items)

/** Finds a nav item by module key. */
export function findNavItem(key: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.key === key)
}

/** Finds the group that owns the given nav item. */
export function findNavGroup(item: NavItem): NavGroup | undefined {
  return NAV_GROUPS.find((group) => group.items.includes(item))
}
