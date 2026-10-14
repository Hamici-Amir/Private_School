import { Link } from 'react-router'

import { StatusBadge } from '@/components/data-display/status-badge'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/hooks/use-i18n'
import { formatDate } from '@/lib/format'

import { STUDENT_STATUS_META, findStudentClass } from '../constants/students.constants'
import type { Student } from '../types/students.types'
import { formatStudentPhone, getStudentFullName } from '../utils/students.utils'
import { StudentAvatar } from './student-avatar'
import { StudentRowActions } from './student-row-actions'

interface StudentsCardListProps {
  students: Student[]
  onEdit: (student: Student) => void
  onChangeStatus: (student: Student) => void
  onDelete: (student: Student) => void
}

/** Compact student cards shown instead of the table on narrow screens. */
export function StudentsCardList({
  students,
  onEdit,
  onChangeStatus,
  onDelete,
}: StudentsCardListProps) {
  const { t, locale } = useI18n()

  return (
    <div className="space-y-3 md:hidden">
      {students.map((student) => {
        const statusMeta = STUDENT_STATUS_META[student.status]
        const studentClass = findStudentClass(student.classId)
        return (
          <Card key={student.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <StudentAvatar student={student} size="md" />
                  <div className="min-w-0 space-y-0.5">
                    <Link
                      to={`/students/${student.id}`}
                      className="hover:text-primary hover:underline font-medium"
                    >
                      {getStudentFullName(student)}
                    </Link>
                    <p className="text-muted-foreground text-xs">
                      {student.level} · {studentClass?.label ?? '—'}
                    </p>
                  </div>
                </div>
                <StudentRowActions
                  student={student}
                  onEdit={onEdit}
                  onChangeStatus={onChangeStatus}
                  onDelete={onDelete}
                />
              </div>
              <dl className="text-muted-foreground mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="col-span-2 flex items-center justify-between gap-2">
                  <dt>{t('students.table.birthDate')}</dt>
                  <dd>{formatDate(student.birthDate, locale)}</dd>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-2">
                  <dt>{t('students.table.guardianPhone')}</dt>
                  <dd dir="ltr">{formatStudentPhone(student.guardianPhone)}</dd>
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