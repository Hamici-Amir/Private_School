import { BookOpenIcon, GraduationCapIcon, LayersIcon, SchoolIcon } from 'lucide-react'

import { StatCard } from '@/components/data-display/stat-card'
import { useI18n } from '@/hooks/use-i18n'
import { formatNumber } from '@/lib/format'

import type { SchoolClass } from '../types/classes.types'
import { getClassesStats } from '../utils/classes.utils'

/** Headline counters derived from the current class list. */
export function ClassesStats({ classes }: { classes: SchoolClass[] }) {
  const { t, locale } = useI18n()
  const stats = getClassesStats(classes)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title={t('classes.stats.total')}
        value={formatNumber(stats.total, locale)}
        icon={SchoolIcon}
      />
      <StatCard
        title={t('classes.stats.primary')}
        value={formatNumber(stats.primary, locale)}
        icon={BookOpenIcon}
      />
      <StatCard
        title={t('classes.stats.middle')}
        value={formatNumber(stats.middle, locale)}
        icon={LayersIcon}
      />
      <StatCard
        title={t('classes.stats.secondary')}
        value={formatNumber(stats.secondary, locale)}
        icon={GraduationCapIcon}
      />
    </div>
  )
}
