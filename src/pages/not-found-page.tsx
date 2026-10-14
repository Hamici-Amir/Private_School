import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/hooks/use-i18n'

/** Catch-all 404 page. */
export function NotFoundPage() {
  const { t } = useI18n()

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>404 · {t('common.pageNotFound')}</CardTitle>
          <CardDescription>{t('common.pageNotFoundDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/">{t('common.returnHome')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
