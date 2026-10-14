import type * as React from 'react'
import type { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KeyValueProps extends React.ComponentProps<'div'> {
  label: React.ReactNode
  value: React.ReactNode
  mono?: boolean
}

/** Simple label/value row used inside detail cards. */
export function KeyValue({ label, value, mono = false, className }: KeyValueProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 py-1.5', className)}>
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className={cn('text-sm font-medium text-end', mono && 'font-mono text-foreground')}>
        {value}
      </dd>
    </div>
  )
}

interface InfoCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: LucideIcon
  /** Optional end-aligned label (e.g. a StatusBadge). */
  badge?: React.ReactNode
  /** Columns for the KeyValue children on wide screens. */
  columns?: 1 | 2
}

/** Definition-list card built from KeyValue children. */
export function InfoCard({
  title,
  description,
  icon: Icon,
  badge,
  columns = 1,
  className,
  children,
}: InfoCardProps) {
  return (
    <Card className={cn('gap-4', className)}>
      {title || badge ? (
        <CardHeader className="flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {Icon ? <Icon className="text-muted-foreground size-4" aria-hidden="true" /> : null}
            <div className="space-y-0.5">
              {title ? <CardTitle className="text-base">{title}</CardTitle> : null}
              {description ? (
                <CardDescription className="text-sm">{description}</CardDescription>
              ) : null}
            </div>
          </div>
          {badge}
        </CardHeader>
      ) : null}
      <CardContent className={cn(columns === 2 && 'sm:columns-2')}>
        <dl className="space-y-0.5">{children}</dl>
      </CardContent>
    </Card>
  )
}

interface DataListProps {
  items: Array<{ id?: string; label: React.ReactNode; value: React.ReactNode; mono?: boolean }>
  className?: string
}

/** Standalone definition list without a card wrapper. */
export function DataList({ items, className }: DataListProps) {
  return (
    <dl className={cn('divide-y divide-border', className)}>
      {items.map((item, index) => (
        <KeyValue key={item.id ?? index} label={item.label} value={item.value} mono={item.mono} />
      ))}
    </dl>
  )
}
