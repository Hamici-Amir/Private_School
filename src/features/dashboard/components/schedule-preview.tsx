import { CalendarClockIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/feedback/empty-state'
import { useI18n } from '@/hooks/use-i18n'
import { formatDate } from '@/lib/format'

import type { ScheduleItem } from '../types'

function SessionTime({ startsAt, endsAt }: Pick<ScheduleItem, 'startsAt' | 'endsAt'>) {
  const { locale } = useI18n()
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()

  return (
    <time
      dateTime={end.toISOString()}
      className="bg-muted text-muted-foreground w-fit shrink-0 rounded-md px-2 py-1 text-xs font-medium"
    >
      {sameDay ? formatDate(start, locale) : formatDate(end, locale)}
      {' · '}
      {start.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}–
      {end.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
    </time>
  )
}

/** Upcoming scheduled sessions. */
export function SchedulePreview({ schedule }: { schedule: ScheduleItem[] }) {
  const { t } = useI18n()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <CalendarClockIcon className="text-muted-foreground size-4" aria-hidden="true" />
          {t('dashboard.schedule.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schedule.length === 0 ? (
          <EmptyState title={t('dashboard.schedule.empty')} className="py-8" />
        ) : (
          <ul className="space-y-3">
            {schedule.map((session) => (
              <li
                key={session.id}
                className="border-muted flex flex-col gap-2 rounded-lg border p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{session.subject}</span>
                  <SessionTime startsAt={session.startsAt} endsAt={session.endsAt} />
                </div>
                <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <span>{session.group}</span>
                  <span>{session.teacher}</span>
                  <span>{session.room}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
