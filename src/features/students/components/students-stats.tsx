import { GraduationCapIcon, UserMinusIcon, UserPlusIcon, UsersIcon } from 'lucide-react'

import { StatCard } from '@/components/data-display/stat-card'
import { useI18n } from '@/hooks/use-i18n'
import { formatNumber } from '@/lib/format'

import type { Student } from '../types/students.types'
import { getStudentsStats } from '../utils/students.utils'

/** Headline counters derived from the current student list. */
export function StudentsStats({ students }: { students: Student[] }) {
  const { t, locale } = useI18n()
  const stats = getStudentsStats(students)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title={t('students.stats.total')}
        value={formatNumber(stats.total, locale)}
        icon={UsersIcon}
      />
      <StatCard
        title={t('students.stats.active')}
        value={formatNumber(stats.active, locale)}
        icon={GraduationCapIcon}
      />
      <StatCard
        title={t('students.stats.new')}
        value={formatNumber(stats.new, locale)}
        icon={UserPlusIcon}
      />
      <StatCard
        title={t('students.stats.inactive')}
        value={formatNumber(stats.inactive, locale)}
        icon={UserMinusIcon}
      />
    </div>
  )
}