import { useSearchParams } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NAV_ITEMS } from '@/constants/navigation'
import { useI18n } from '@/hooks/use-i18n'

/** Placeholder for every future module; reads the requested module name. */
export function ComingSoonPage() {
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const moduleKey = searchParams.get('module') ?? 'dashboard'
  const navItem = NAV_ITEMS.find((item) => item.key === moduleKey)
  const label = navItem ? t(navItem.labelKey) : moduleKey

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{t('common.underConstruction')}</h1>
        <Badge variant="secondary">{label}</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{label}</CardTitle>
          <CardDescription>{t('common.underConstructionDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">{`/${moduleKey}`}</CardContent>
      </Card>
    </div>
  )
}
