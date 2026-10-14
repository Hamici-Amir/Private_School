import { LayoutDashboardIcon } from 'lucide-react'

import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/use-i18n'

import {
  ActivityFeed,
  AlertsList,
  AttendanceChart,
  DashboardHeader,
  DashboardSkeleton,
  KpiGrid,
  PaymentsChart,
  QuickActions,
  RegistrationsChart,
  SchedulePreview,
  TodaySummary,
} from '../components'
import { useDashboardData } from '../hooks/use-dashboard-data'
import type { DashboardData } from '../types'

function isDashboardEmpty(data: DashboardData): boolean {
  return Object.keys(data.kpis).length === 0
}

export function DashboardPage() {
  const { t } = useI18n()
  const dashboard = useDashboardData()

  if (dashboard.isPending) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <DashboardSkeleton />
      </div>
    )
  }

  if (dashboard.isError) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <ErrorState
          title={t('dashboard.error.title')}
          description={t('dashboard.error.description')}
          details={dashboard.error}
          onRetry={() => {
            void dashboard.refetch()
          }}
        />
      </div>
    )
  }

  const data = dashboard.data?.data
  if (!data || isDashboardEmpty(data)) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <EmptyState
          icon={LayoutDashboardIcon}
          title={t('dashboard.empty.title')}
          description={t('dashboard.empty.description')}
          action={
            <Button
              variant="outline"
              onClick={() => {
                void dashboard.refetch()
              }}
            >
              {t('common.retry')}
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader source={dashboard.data.source} />

      <KpiGrid kpis={data.kpis} />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <RegistrationsChart registrations={data.registrations} />
        <PaymentsChart payments={data.payments} />
        <AttendanceChart attendance={data.attendance} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <TodaySummary summary={data.summary} />
        <ActivityFeed activity={data.activity} />
        <AlertsList alerts={data.alerts} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <QuickActions />
        <SchedulePreview schedule={data.schedule} />
      </div>
    </div>
  )
}
