import { Link } from 'react-router'

import { StatusBadge } from '@/components/data-display/status-badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { levelLabelKey } from '@/features/students/constants/students.constants'
import { getTeacherFullName } from '@/features/teachers/utils/teachers.utils'
import type { Teacher } from '@/features/teachers/types/teachers.types'
import { useI18n } from '@/hooks/use-i18n'

import { CLASS_STATUS_META } from '../constants/classes.constants'
import type { ClassCounts, SchoolClass } from '../types/classes.types'
import { ClassAvatar } from './class-avatar'
import { ClassRowActions } from './class-row-actions'

interface ClassesCardListProps {
  classes: SchoolClass[]
  counts: Record<string, ClassCounts>
  teachers: Teacher[]
  onEdit: (schoolClass: SchoolClass) => void
  onDelete: (schoolClass: SchoolClass) => void
}

/** Compact class cards shown instead of the table on narrow screens. */
export function ClassesCardList({
  classes,
  counts,
  teachers,
  onEdit,
  onDelete,
}: ClassesCardListProps) {
  const { t } = useI18n()

  return (
    <div className="space-y-3 md:hidden">
      {classes.map((schoolClass) => {
        const statusMeta = CLASS_STATUS_META[schoolClass.status]
        const count = counts[schoolClass.id] ?? { students: 0, teachers: 0 }
        const headTeacher = teachers.find((teacher) => teacher.id === schoolClass.headTeacherId)
        return (
          <Card key={schoolClass.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ClassAvatar label={schoolClass.label} size="md" />
                  <div className="min-w-0 space-y-0.5">
                    <Link
                      to={`/classes/${schoolClass.id}`}
                      className="hover:text-primary hover:underline font-medium"
                    >
                      {schoolClass.label}
                    </Link>
                    <p className="text-muted-foreground text-xs">
                      {t(levelLabelKey(schoolClass.level))} · {schoolClass.room}
                    </p>
                  </div>
                </div>
                <ClassRowActions
                  schoolClass={schoolClass}
                  count={count}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
              <dl className="text-muted-foreground mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <dt>{t('classes.table.capacity')}</dt>
                  <dd>{schoolClass.capacity}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt>{t('classes.table.students')}</dt>
                  <dd>
                    <Badge variant="secondary">
                      {t('classes.students.count', { count: count.students })}
                    </Badge>
                  </dd>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-2">
                  <dt>{t('classes.table.headTeacher')}</dt>
                  <dd>
                    {headTeacher ? (
                      <Link
                        to={`/teachers/${headTeacher.id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {getTeacherFullName(headTeacher)}
                      </Link>
                    ) : (
                      t('classes.details.noHeadTeacher')
                    )}
                  </dd>
                </div>
                <div className="col-span-2">
                  <StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>
                </div>
              </dl>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
