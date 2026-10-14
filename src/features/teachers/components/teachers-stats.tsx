import { CalendarDaysIcon, UserCheckIcon, UserPlusIcon, UsersIcon } from 'lucide-react'

import { StatCard } from '@/components/data-display/stat-card'
import { useI18n } from '@/hooks/use-i18n'
import { formatNumber } from '@/lib/format'

import type { Teacher } from '../types/teachers.types'
import { getTeachersStats } from '../utils/teachers.utils'

/** Headline counters derived from the current teacher list. */
export function TeachersStats({ teachers }: { teachers: Teacher[] }) {
  const { t, locale } = useI18n()
  const stats = getTeachersStats(teachers)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title={t('teachers.stats.total')}
        value={formatNumber(stats.total, locale)}
        icon={UsersIcon}
      />
      <StatCard
        title={t('teachers.stats.active')}
        value={formatNumber(stats.active, locale)}
        icon={UserCheckIcon}
      />
      <StatCard
        title={t('teachers.stats.onleave')}
        value={formatNumber(stats.onLeave, locale)}
        icon={CalendarDaysIcon}
      />
      <StatCard
        title={t('teachers.stats.new')}
        value={formatNumber(stats.new, locale)}
        icon={UserPlusIcon}
      />
    </div>
  )
}