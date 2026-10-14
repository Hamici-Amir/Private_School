import type * as React from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  /** Primary action (usually a Button or Link). */
  action?: React.ReactNode
  /** Secondary action rendered under the primary one. */
  secondaryAction?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

/**
 * Reusable empty-state presentation used by every future module
 * ("No students found", "No payments found", …). Content stays generic:
 * title/description/icon/actions are provided by the caller.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-16 text-center',
        className,
      )}
    >
      {Icon ? (
        <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
          <Icon className="size-6" aria-hidden="true" />
        </div>
      ) : null}
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
      {secondaryAction ? <div>{secondaryAction}</div> : null}
      {children}
    </div>
  )
}
