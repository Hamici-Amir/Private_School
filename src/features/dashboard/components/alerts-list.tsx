import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/feedback/empty-state'
import { useI18n } from '@/hooks/use-i18n'
import { formatRelativeTime } from '@/lib/format'
import { cn } from '@/lib/utils'

import type { DashboardAlert, Severity } from '../types'

const SEVERITY_CLASSES: Record<Severity, string> = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
}

/** Highlighted alerts calling for action. */
export function AlertsList({ alerts }: { alerts: DashboardAlert[] }) {
  const { t, locale } = useI18n()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('dashboard.alerts.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {alerts.length === 0 ? (
          <EmptyState title={t('dashboard.alerts.empty')} className="py-8" />
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="border-muted flex items-start gap-3 rounded-lg border p-3"
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-2 shrink-0 rounded-full',
                    {
                      info: 'bg-info',
                      success: 'bg-success',
                      warning: 'bg-warning',
                      error: 'bg-destructive',
                    }[alert.severity],
                  )}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-snug">{alert.title}</span>
                  <time
                    dateTime={new Date(alert.at).toISOString()}
                    className={cn('mt-1 block text-xs', SEVERITY_CLASSES[alert.severity])}
                  >
                    {formatRelativeTime(alert.at, locale)}
                  </time>
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
