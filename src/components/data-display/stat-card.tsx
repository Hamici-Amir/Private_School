import type * as React from 'react'
import { TrendingDownIcon, TrendingUpIcon, type LucideIcon } from 'lucide-react'

import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface StatCardProps extends React.ComponentProps<'div'> {
  title: string
  value: React.ReactNode
  description?: string
  icon?: LucideIcon
  /** Optional trend value, e.g. "+12%". */
  trend?: { value: string; positive?: boolean }
  loading?: boolean
}

/** Dashboard metric widget. */
export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading,
  className,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn('gap-3 p-5', className)}>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-28" />
      </Card>
    )
  }

  return (
    <Card className={cn('gap-3 p-5', className)}>
      <div className="flex items-center justify-between gap-2">
        <CardDescription className="text-sm">{title}</CardDescription>
        {Icon ? (
          <div className="text-muted-foreground bg-muted flex size-8 items-center justify-center rounded-md">
            <Icon className="size-4" aria-hidden="true" />
          </div>
        ) : null}
      </div>
      <CardTitle className="text-2xl font-bold tracking-tight">{value}</CardTitle>
      <div className="flex items-center gap-2">
        {trend ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-medium',
              trend.positive === false ? 'text-destructive' : 'text-success-soft-foreground',
            )}
          >
            {trend.positive === false ? (
              <TrendingDownIcon className="size-3" aria-hidden="true" />
            ) : (
              <TrendingUpIcon className="size-3" aria-hidden="true" />
            )}
            {trend.value}
          </span>
        ) : null}
        {description ? <CardDescription>{description}</CardDescription> : null}
      </div>
    </Card>
  )
}
