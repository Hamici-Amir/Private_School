import type { ComponentProps } from 'react'

import { Badge } from '@/components/ui/badge'
import type { BadgeVariant } from '@/components/ui/badge-variants'
import { cn } from '@/lib/utils'

/** Semantic status tones shared across every module. */
export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending'

export const STATUS_VARIANT: Record<StatusTone, BadgeVariant> = {
  success: 'success-soft',
  warning: 'warning-soft',
  error: 'destructive-soft',
  info: 'info-soft',
  neutral: 'secondary',
  pending: 'warning-soft',
}

/**
 * Common status vocabulary mapped to tones. Modules can reuse these or
 * provide their own tone for domain-specific states
 * (Paid/Partially paid/Unpaid, Present/Absent/Late/Excused, …).
 */
export const STATUS_TONE: Record<string, StatusTone> = {
  active: 'success',
  inactive: 'neutral',
  pending: 'pending',
  approved: 'success',
  rejected: 'error',
  cancelled: 'error',
  paid: 'success',
  'partially-paid': 'warning',
  unpaid: 'error',
  present: 'success',
  absent: 'error',
  late: 'warning',
  excused: 'info',
  overdue: 'warning',
  draft: 'neutral',
}

type StatusBadgeProps = Omit<ComponentProps<typeof Badge>, 'variant'> & {
  variant?: BadgeVariant
  tone?: StatusTone
  /** Renders a small status dot before the label (color-independent cue). */
  dot?: boolean
}

/**
 * Semantic status badge. Use `tone` for a standard status or `variant`
 * for full control of the badge styling.
 */
export function StatusBadge({
  tone = 'neutral',
  variant,
  dot = true,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge variant={variant ?? STATUS_VARIANT[tone]} className={cn('gap-1', className)} {...props}>
      {dot ? (
        <span aria-hidden="true" className="relative flex size-1.5" data-tone={tone}>
          <span
            className={cn(
              'absolute inline-flex size-full rounded-full opacity-60',
              tone === 'success' && 'bg-success-soft-foreground',
              tone === 'warning' && 'bg-warning-soft-foreground',
              tone === 'error' && 'bg-destructive',
              tone === 'info' && 'bg-info-soft-foreground',
              (tone === 'neutral' || tone === 'pending') && 'bg-muted-foreground',
            )}
          />
        </span>
      ) : null}
      {children}
    </Badge>
  )
}
