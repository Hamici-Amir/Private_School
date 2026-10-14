import { AlertTriangleIcon, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/use-i18n'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  description?: string
  /** Optional technical details; rendered only in development builds. */
  details?: unknown
  icon?: LucideIcon
  onRetry?: () => void
  onBack?: () => void
  className?: string
}

/**
 * Reusable error-state presentation. Never leaks sensitive details in
 * production — technical information is shown only when `import.meta.env.DEV`.
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  details,
  icon: Icon = AlertTriangleIcon,
  onRetry,
  onBack,
  className,
}: ErrorStateProps) {
  const { t } = useI18n()

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-16 text-center',
        className,
      )}
    >
      <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-full">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {import.meta.env.DEV && details ? (
        <pre className="bg-muted text-muted-foreground max-w-full overflow-x-auto rounded-md p-3 text-start text-xs">
          {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
        </pre>
      ) : null}
      {(onRetry || onBack) && (
        <div className="mt-1 flex flex-wrap justify-center gap-2">
          {onRetry ? <Button onClick={onRetry}>{t('common.retry')}</Button> : null}
          {onBack ? (
            <Button variant="outline" onClick={onBack}>
              {t('common.back')}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}
