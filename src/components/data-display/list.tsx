import type * as React from 'react'
import { type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

/** Metric label + value + optional hint, used in summary rows. */
export function Metric({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: React.ReactNode
  value: React.ReactNode
  hint?: React.ReactNode
  icon?: LucideIcon
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      <span className="flex items-center gap-1.5">
        {Icon ? <Icon className="text-muted-foreground size-3.5" aria-hidden="true" /> : null}
        <span className="text-lg font-semibold tracking-tight">{value}</span>
      </span>
      {hint ? <span className="text-muted-foreground text-xs">{hint}</span> : null}
    </div>
  )
}

interface ListProps extends React.ComponentProps<'ul'> {
  dividers?: boolean
}

/** Generic list wrapper. */
export function List({ dividers = false, className, ...props }: ListProps) {
  return (
    <ul
      className={cn('space-y-1', dividers && 'divide-y divide-border space-y-0', className)}
      {...props}
    />
  )
}

interface ListItemProps extends Omit<React.ComponentProps<'li'>, 'title'> {
  icon?: LucideIcon
  title?: React.ReactNode
  description?: React.ReactNode
  /** End-aligned content. */
  trailing?: React.ReactNode
}

/** Standard list row with optional icon, description and trailing slot. */
export function ListItem({
  icon: Icon,
  title,
  description,
  trailing,
  className,
  ...props
}: ListItemProps) {
  return (
    <li className={cn('flex items-center gap-3 rounded-md p-2', className)} {...props}>
      {Icon ? (
        <div className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
          <Icon className="size-4" aria-hidden="true" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        {title ? <p className="truncate text-sm font-medium">{title}</p> : null}
        {description ? (
          <p className="text-muted-foreground truncate text-xs">{description}</p>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </li>
  )
}
