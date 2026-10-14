import { UserCheckIcon, UserPlusIcon, UsersIcon, UsersRoundIcon } from 'lucide-react'

import { StatCard } from '@/components/data-display/stat-card'
import { useI18n } from '@/hooks/use-i18n'
import { formatNumber } from '@/lib/format'

import type { Parent } from '../types/parents.types'
import { getParentsStats } from '../utils/parents.utils'

/** Headline counters derived from the current parent list. */
export function ParentsStats({ parents }: { parents: Parent[] }) {
  const { t, locale } = useI18n()
  const stats = getParentsStats(parents)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title={t('parents.stats.total')}
        value={formatNumber(stats.total, locale)}
        icon={UsersIcon}
      />
      <StatCard
        title={t('parents.stats.active')}
        value={formatNumber(stats.active, locale)}
        icon={UserCheckIcon}
      />
      <StatCard
        title={t('parents.stats.multipleChildren')}
        value={formatNumber(stats.multipleChildren, locale)}
        icon={UsersRoundIcon}
      />
      <StatCard
        title={t('parents.stats.new')}
        value={formatNumber(stats.new, locale)}
        icon={UserPlusIcon}
      />
    </div>
  )
}