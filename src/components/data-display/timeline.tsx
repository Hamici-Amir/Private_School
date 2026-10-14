import type * as React from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface TimelineItemProps {
  icon?: LucideIcon
  title: React.ReactNode
  description?: React.ReactNode
  meta?: React.ReactNode
  active?: boolean
  className?: string
}

/** Vertical timeline item with a connecting line and dot. */
export function TimelineItem({
  icon: Icon,
  title,
  description,
  meta,
  active = false,
  className,
}: TimelineItemProps) {
  return (
    <li className={cn('flex gap-3', className)}>
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'mt-1 flex size-3 shrink-0 items-center justify-center rounded-full border-2',
            active ? 'border-primary bg-primary' : 'border-border bg-background',
          )}
          aria-hidden="true"
        />
        <span className="bg-border my-1 w-px flex-1" aria-hidden="true" />
      </div>
      <div className="pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{title}</p>
          {ActiveIcon(Icon, active)}
        </div>
        {meta ? <p className="text-muted-foreground text-xs">{meta}</p> : null}
        {description ? <p className="text-muted-foreground mt-1 text-sm">{description}</p> : null}
      </div>
    </li>
  )
}

function ActiveIcon(Icon: LucideIcon | undefined, active: boolean) {
  if (!Icon) return null
  return active ? <Icon className="text-primary size-4" aria-hidden="true" /> : null
}
