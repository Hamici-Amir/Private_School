import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/hooks/use-i18n'
import { formatCompactNumber, formatNumber, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'

import type { Locale } from '@/types/app'

import type { DashboardKpiConfig } from '../constants'
import type { DashboardKpi, TrendDirection } from '../types'

interface KpiCardProps {
  kpi: DashboardKpi
  config: DashboardKpiConfig
  label: string
}

const CURRENCY_SYMBOL: Record<Locale, string> = {
  ar: 'د.ج',
  fr: 'DA',
  en: 'DZD',
}

function formatValue(kpi: DashboardKpi, config: DashboardKpiConfig, locale: Locale): string {
  if (config.format === 'currency') return formatCompactNumber(kpi.value, locale)
  if (config.format === 'percent') return formatPercent(kpi.value, locale)
  return formatNumber(kpi.value, locale)
}

function isPositive(direction: TrendDirection, goodWhenDown: boolean): boolean {
  return direction === 'flat' ? false : (direction === 'up') === !goodWhenDown
}

function TrendBadge({ kpi, goodWhenDown = false }: { kpi: DashboardKpi; goodWhenDown?: boolean }) {
  const { locale, t } = useI18n()
  const positive = isPositive(kpi.trend.direction, goodWhenDown)
  const Icon =
    kpi.trend.direction === 'flat'
      ? MinusIcon
      : kpi.trend.direction === 'up'
        ? TrendingUpIcon
        : TrendingDownIcon

  const variant =
    kpi.trend.direction === 'flat' ? 'neutral' : positive ? 'success-soft' : 'warning-soft'
  const hint =
    kpi.trend.direction === 'flat'
      ? t('dashboard.trend.stable')
      : positive
        ? t('dashboard.trend.positive')
        : t('dashboard.trend.negative')

  return (
    <Badge variant={variant} className="gap-1" title={hint}>
      <Icon aria-hidden="true" />
      <span>
        {formatPercent(kpi.trend.value, locale, { maximumFractionDigits: 1, showSign: true })}
      </span>
      <span className="text-muted-foreground hidden font-normal md:inline">
        {t('dashboard.trend.vsPrevious')}
      </span>
    </Badge>
  )
}

/** Single KPI stat card with its trend indicator. */
export function KpiCard({ kpi, config, label }: KpiCardProps) {
  const { locale } = useI18n()
  const Icon = config.icon

  return (
    <Card className="gap-4">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-muted-foreground text-sm font-medium">{label}</CardTitle>
        <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          className={cn(
            'text-2xl font-semibold tracking-tight',
            formatValue(kpi, config, locale).length > 10 && 'text-xl',
          )}
        >
          {formatValue(kpi, config, locale)}
          {config.format === 'currency' ? (
            <span className="text-muted-foreground ms-1.5 text-sm font-medium">
              {CURRENCY_SYMBOL[locale]}
            </span>
          ) : null}
        </div>
        <TrendBadge kpi={kpi} goodWhenDown={config.goodWhenDown} />
      </CardContent>
    </Card>
  )
}
