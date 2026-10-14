import { Link } from 'react-router'

import { StatusBadge } from '@/components/data-display/status-badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/hooks/use-i18n'
import { formatDate } from '@/lib/format'

import {
  TEACHER_SPECIALTY_META,
  TEACHER_STATUS_META,
} from '../constants/teachers.constants'
import type { Teacher } from '../types/teachers.types'
import { formatTeacherPhone, getTeacherFullName } from '../utils/teachers.utils'
import { TeacherAvatar } from './teacher-avatar'
import { TeacherRowActions } from './teacher-row-actions'

interface TeachersCardListProps {
  teachers: Teacher[]
  onEdit: (teacher: Teacher) => void
  onDelete: (teacher: Teacher) => void
}

/** Compact teacher cards shown instead of the table on narrow screens. */
export function TeachersCardList({ teachers, onEdit, onDelete }: TeachersCardListProps) {
  const { t, locale } = useI18n()

  return (
    <div className="space-y-3 md:hidden">
      {teachers.map((teacher) => {
        const statusMeta = TEACHER_STATUS_META[teacher.status]
        return (
          <Card key={teacher.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <TeacherAvatar teacher={teacher} size="md" />
                  <div className="min-w-0 space-y-0.5">
                    <Link
                      to={`/teachers/${teacher.id}`}
                      className="hover:text-primary hover:underline font-medium"
                    >
                      {getTeacherFullName(teacher)}
                    </Link>
                    <p className="text-muted-foreground text-xs">
                      {t(TEACHER_SPECIALTY_META[teacher.specialty].labelKey)}
                    </p>
                  </div>
                </div>
                <TeacherRowActions teacher={teacher} onEdit={onEdit} onDelete={onDelete} />
              </div>
              <dl className="text-muted-foreground mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="col-span-2 flex items-center justify-between gap-2">
                  <dt>{t('teachers.table.phone')}</dt>
                  <dd dir="ltr">{formatTeacherPhone(teacher.phone)}</dd>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-2">
                  <dt>{t('teachers.table.classes')}</dt>
                  <dd>
                    <Badge variant="secondary">
                      {t('teachers.classes.count', { count: teacher.classIds.length })}
                    </Badge>
                  </dd>
                </div>
                <div className="col-span-2">
                  <StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-2">
                  <dt>{t('teachers.table.hireDate')}</dt>
                  <dd>{formatDate(teacher.hireDate, locale)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}