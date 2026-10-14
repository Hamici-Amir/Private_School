import type * as React from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ActivityItemProps {
  icon?: LucideIcon
  title: React.ReactNode
  description?: React.ReactNode
  /** Relative date/timestamp, e.g. "il y a 5 min". */
  time?: React.ReactNode
  className?: string
}

/** Single activity row for feed-style lists (recent actions, logs). */
export function ActivityItem({
  icon: Icon,
  title,
  description,
  time,
  className,
}: ActivityItemProps) {
  return (
    <li className={cn('flex items-start gap-3', className)}>
      {Icon ? (
        <div className="bg-muted text-muted-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
          <Icon className="size-4" aria-hidden="true" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug">{title}</p>
        {description ? (
          <p className="text-muted-foreground mt-0.5 text-sm leading-snug">{description}</p>
        ) : null}
      </div>
      {time ? <time className="text-muted-foreground shrink-0 text-xs">{time}</time> : null}
    </li>
  )
}
