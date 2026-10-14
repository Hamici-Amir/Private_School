import {
  BanknoteIcon,
  BookOpenIcon,
  CalendarCheckIcon,
  FileTextIcon,
  UserPlusIcon,
  type LucideIcon,
} from 'lucide-react'

import { EmptyState } from '@/components/feedback/empty-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/hooks/use-i18n'
import { formatRelativeTime } from '@/lib/format'

import type { ActivityType, DashboardActivity } from '../types'

const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  enrollment: UserPlusIcon,
  payment: BanknoteIcon,
  attendance: CalendarCheckIcon,
  invoice: FileTextIcon,
  document: BookOpenIcon,
}

/** Recent events feed. */
export function ActivityFeed({ activity }: { activity: DashboardActivity[] }) {
  const { t, locale } = useI18n()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('dashboard.activity.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {activity.length === 0 ? (
          <EmptyState title={t('dashboard.activity.empty')} className="py-8" />
        ) : (
          <ul className="divide-y">
            {activity.map((item) => {
              const Icon = ACTIVITY_ICONS[item.type]
              return (
                <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-muted-foreground text-xs">
                      {t(`dashboard.activityTypes.${item.type}`)}
                    </span>
                    <span className="block truncate text-sm font-medium">{item.title}</span>
                  </span>
                  <time
                    dateTime={new Date(item.at).toISOString()}
                    className="text-muted-foreground shrink-0 text-xs"
                  >
                    {formatRelativeTime(item.at, locale)}
                  </time>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
