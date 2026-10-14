import { useLocation, useNavigate } from 'react-router'

import type { NavItem, NavItemStatus } from '@/constants/navigation'
import { NAV_GROUPS } from '@/constants/navigation'
import { useI18n } from '@/hooks/use-i18n'
import type { TranslationKey } from '@/lib/i18n'
import { cn } from '@/lib/utils'

import { MobileNavItem, NavGroup, SidebarNavItem } from './navigation-item'

interface NavListProps {
  /** Rendering context: desktop sidebar or mobile drawer. */
  context: 'sidebar' | 'mobile'
  /** Rail mode (icons only) — only meaningful for the sidebar. */
  collapsed?: boolean
  /** Called after an item is picked (mobile drawer closes). */
  onNavigate?: () => void
}

const STATUS_VALUE: Record<NavItemStatus, string> = {
  active: 'bg-success',
  beta: 'bg-warning',
  new: 'bg-primary',
  planned: 'bg-muted-foreground/60',
}

/** Accessible label for a nav item status. */
function statusKey(status: NavItemStatus): TranslationKey {
  return `navItemStatus.${status}` as TranslationKey
}

function StatusDot({ status }: { status: NavItemStatus }) {
  return (
    <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-full', STATUS_VALUE[status])} />
  )
}

/** Expanded-mode status badge (text) for the sidebar. */
function StatusBadge({ status, t }: { status: NavItemStatus; t: (key: TranslationKey) => string }) {
  if (status === 'active') return null
  return (
    <span
      className={cn(
        'ms-auto rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide',
        status === 'beta' && 'bg-warning/10 text-warning',
        status === 'new' && 'bg-primary/10 text-primary',
        status === 'planned' && 'bg-muted text-muted-foreground',
      )}
    >
      {t(statusKey(status))}
    </span>
  )
}

interface RenderItemArgs {
  item: NavItem
  pathname: string
  context: 'sidebar' | 'mobile'
  collapsed: boolean
  navigate: (href: string) => void
  t: (key: TranslationKey) => string
  onNavigate: (() => void) | undefined
}

/** Renders a single nav row for the active context. */
function renderItem({
  item,
  pathname,
  context,
  collapsed,
  navigate,
  t,
  onNavigate,
}: RenderItemArgs) {
  const active = pathname === item.href
  const Icon = item.icon
  const title = t(item.labelKey)

  if (context === 'mobile') {
    return (
      <MobileNavItem
        key={item.key}
        label={title}
        icon={Icon}
        active={active}
        onClick={() => {
          onNavigate?.()
          navigate(item.href)
        }}
      />
    )
  }

  if (collapsed) {
    return (
      <SidebarNavItem
        key={item.key}
        label={<span className="sr-only">{title}</span>}
        title={title}
        icon={Icon}
        href={item.href}
        active={active}
        badge={<StatusDot status={item.status} />}
      />
    )
  }

  return (
    <SidebarNavItem
      key={item.key}
      label={title}
      icon={Icon}
      href={item.href}
      active={active}
      badge={<StatusBadge status={item.status} t={t} />}
    />
  )
}

/**
 * Renders grouped application navigation.
 * Active state is derived from the router location rather than stored state.
 */
export function NavList({ context, collapsed = false, onNavigate }: NavListProps) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav aria-label="Primary navigation" className="flex flex-col gap-1.5">
      {NAV_GROUPS.map((group) => (
        <NavGroup
          key={group.key}
          label={
            context === 'sidebar' && !collapsed ? (
              t(group.labelKey)
            ) : (
              <span className="sr-only">{t(group.labelKey)}</span>
            )
          }
        >
          {group.items.map((item) =>
            renderItem({
              item,
              pathname,
              context,
              collapsed,
              navigate,
              t,
              onNavigate,
            }),
          )}
        </NavGroup>
      ))}
    </nav>
  )
}
