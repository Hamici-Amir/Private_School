import { useState } from 'react'

import { CircleDotIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/hooks/use-i18n'
import { formatFullDate } from '@/lib/format'
import type { DataSource } from '@/types/feature'

/** Dashboard banner: title, subtitle, current date and the active data source. */
export function DashboardHeader({ source }: { source?: DataSource }) {
  const { t, locale } = useI18n()
  const [today] = useState(() => new Date())

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('dashboard.subtitle')}</p>
        <p className="text-muted-foreground text-sm">{formatFullDate(today, locale)}</p>
      </div>

      {source ? (
        <Badge variant={source === 'mock' ? 'secondary' : 'success'} className="shrink-0">
          <CircleDotIcon aria-hidden="true" />
          {source === 'mock' ? t('foundationPage.mockSource') : t('foundationPage.apiSource')}
        </Badge>
      ) : null}
    </div>
  )
}
