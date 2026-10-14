import { useNavigate } from 'react-router'

import { AppLogo } from '@/components/common/app-logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useI18n } from '@/hooks/use-i18n'

interface ErrorFallbackProps {
  message?: string
  details?: unknown
  onRetry?: () => void
  onHome?: () => void
}

/** Human-friendly full-screen error presentation. */
export function ErrorFallback({ message, details, onRetry, onHome }: ErrorFallbackProps) {
  const { t } = useI18n()
  const navigate = useNavigate()

  const handleRetry = onRetry ?? (() => navigate(0))
  const handleHome = onHome ?? (() => navigate('/'))

  return (
    <div className="bg-muted/40 flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <AppLogo />
          <CardTitle className="mt-4">{t('error.title')}</CardTitle>
          <CardDescription>{t('error.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message ? (
            <p className="border-border bg-muted/50 rounded-md border p-3 font-mono text-sm">
              {message}
            </p>
          ) : null}
          {import.meta.env.DEV && details ? (
            <pre className="bg-muted text-muted-foreground overflow-x-auto rounded-md p-3 text-xs">
              {JSON.stringify(details, null, 2)}
            </pre>
          ) : null}
        </CardContent>
        <CardFooter className="gap-2">
          <Button onClick={handleRetry}>{t('common.retry')}</Button>
          <Button variant="outline" onClick={handleHome}>
            {t('common.returnHome')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
