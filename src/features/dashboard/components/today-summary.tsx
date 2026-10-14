import {
  BanknoteIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
  UserCheckIcon,
  UserXIcon,
  type LucideIcon,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/hooks/use-i18n'
import { formatNumber } from '@/lib/format'

import type { SummaryKind, TodaySummaryItem } from '../types'

const SUMMARY_ICONS: Record<SummaryKind, LucideIcon> = {
  classesToday: CalendarDaysIcon,
  present: UserCheckIcon,
  absent: UserXIcon,
  pendingPayments: BanknoteIcon,
  upcomingExams: CalendarClockIcon,
}

/** Strip of "today" key figures. */
export function TodaySummary({ summary }: { summary: TodaySummaryItem[] }) {
  const { t, locale } = useI18n()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('dashboard.summary.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {summary.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">{t('common.noData')}</p>
        ) : (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
            {summary.map((item) => {
              const Icon = SUMMARY_ICONS[item.kind]
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-muted-foreground truncate text-xs">
                      {t(`dashboard.summary.${item.kind}`)}
                    </dt>
                    <dd className="text-lg font-semibold leading-tight">
                      {formatNumber(item.count, locale)}
                    </dd>
                  </div>
                </div>
              )
            })}
          </dl>
        )}
      </CardContent>
    </Card>
  )
}
