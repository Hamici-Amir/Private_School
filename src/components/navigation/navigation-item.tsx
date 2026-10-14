import type * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router'

import { cn } from '@/lib/utils'

interface NavItemBase {
  label: React.ReactNode
  icon?: LucideIcon
  href?: string
  active?: boolean
  disabled?: boolean
  /** End-of-row accessory, e.g. a status badge. */
  badge?: React.ReactNode
  onClick?: () => void
  title?: string
}

/** Reusable sidebar link item. */
export function SidebarNavItem({
  label,
  icon: Icon,
  href,
  active = false,
  disabled = false,
  badge,
  onClick,
  title,
}: NavItemBase) {
  const content = (
    <>
      {Icon ? <Icon className="size-[18px] shrink-0" aria-hidden="true" /> : null}
      <span className="truncate">{label}</span>
      {badge ? <span className="ms-auto shrink-0">{badge}</span> : null}
    </>
  )
  const className = cn(
    'group relative flex h-8 w-full items-center gap-2.5 rounded-md px-3 text-sm font-medium',
    'before:absolute before:inset-y-1.5 before:start-0 before:w-1 before:rounded-full before:bg-primary before:content-[""]',
    active
      ? 'bg-primary/10 text-primary before:opacity-100'
      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground before:opacity-0',
    disabled && 'pointer-events-none opacity-50',
  )

  if (disabled) {
    return (
      <span role="link" aria-disabled="true" className={className} title={title}>
        {content}
      </span>
    )
  }

  if (href) {
    return (
      <Link
        to={href}
        aria-current={active ? 'page' : undefined}
        aria-label={title}
        className={className}
        onClick={onClick}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  )
}

/** Navigation group with an optional title label. */
export function NavGroup({
  label,
  children,
  className,
}: {
  label?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-1', className)}>
      {label ? (
        <p className="text-muted-foreground px-3 text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </p>
      ) : null}
      <div className="space-y-1">{children}</div>
    </div>
  )
}

/** Top-bar navigation item (tabs-style). */
export function TopNavItem({ label, icon: Icon, active = false, onClick }: NavItemBase) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium',
        active
          ? 'bg-secondary text-secondary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
      {label}
    </button>
  )
}

/** Mobile drawer navigation row (larger touch target). */
export function MobileNavItem({ label, icon: Icon, active = false, onClick }: NavItemBase) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={cn(
        'flex h-12 w-full items-center gap-3 rounded-md px-3 text-sm font-medium',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      )}
    >
      {Icon ? <Icon className="size-5 shrink-0" aria-hidden="true" /> : null}
      <span className="truncate">{label}</span>
    </button>
  )
}
