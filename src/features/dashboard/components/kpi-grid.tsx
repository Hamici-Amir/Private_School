import { useI18n } from '@/hooks/use-i18n'

import { DASHBOARD_KPIS } from '../constants'
import type { DashboardKpi, DashboardKpiId } from '../types'
import { KpiCard } from './kpi-card'

/** Responsive grid of the 8 KPI cards. */
export function KpiGrid({ kpis }: { kpis: Record<DashboardKpiId, DashboardKpi> }) {
  const { t } = useI18n()

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {DASHBOARD_KPIS.map((config) => {
        const kpi = kpis[config.id]
        return (
          <KpiCard
            key={config.id}
            kpi={kpi}
            config={config}
            label={t(`dashboard.kpis.${config.id}.label`)}
          />
        )
      })}
    </div>
  )
}
