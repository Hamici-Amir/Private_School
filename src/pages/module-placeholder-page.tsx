import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  PageActions,
  PageContainer,
  PageContent,
  PageHeader,
  PageTitle,
} from '@/components/layout/page'
import type { NavItemStatus } from '@/constants/navigation'
import { useI18n } from '@/hooks/use-i18n'
import { toast } from '@/lib/toast'
import type { TranslationKey } from '@/lib/i18n'

const STATUS_VARIANT: Record<NavItemStatus, 'secondary' | 'warning' | 'success'> = {
  active: 'success',
  beta: 'warning',
  new: 'secondary',
  planned: 'secondary',
}

interface ModulePlaceholderPageProps {
  labelKey: TranslationKey
  href: string
  status?: NavItemStatus
}

/** Placeholder used until each module ships its real screens (V1 scope). */
export function ModulePlaceholderPage({ labelKey, href, status }: ModulePlaceholderPageProps) {
  const { t } = useI18n()
  const label = t(labelKey)

  function handleComingSoon() {
    toast.info(t('common.underConstructionDescription'))
  }

  return (
    <PageContainer>
      <PageHeader>
        <div className="space-y-1">
          <PageTitle className="flex items-center gap-3">
            {label}
            {status ? (
              <Badge variant={STATUS_VARIANT[status]}>
                {t(`navItemStatus.${status}` as TranslationKey)}
              </Badge>
            ) : null}
          </PageTitle>
          <p className="text-muted-foreground text-sm">{href}</p>
        </div>
        <PageActions>
          <Button onClick={handleComingSoon}>{t('common.underConstruction')}</Button>
        </PageActions>
      </PageHeader>

      <PageContent>
        <Card>
          <CardHeader>
            <CardTitle>{label}</CardTitle>
            <CardDescription>{t('common.underConstructionDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-muted-foreground rounded-md border px-2 py-1 font-mono text-sm">
              {href}
            </span>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleComingSoon}>
              {t('common.retry')}
            </Button>
          </CardFooter>
        </Card>
      </PageContent>
    </PageContainer>
  )
}
