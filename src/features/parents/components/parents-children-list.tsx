import { Link } from 'react-router'

import { StatusBadge } from '@/components/data-display/status-badge'
import { EmptyState } from '@/components/feedback/empty-state'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/hooks/use-i18n'
import { UsersRoundIcon } from 'lucide-react'

import { StudentAvatar } from '@/features/students/components/student-avatar'
import {
  STUDENT_STATUS_META,
  findStudentClass,
} from '@/features/students/constants/students.constants'
import { getStudentFullName } from '@/features/students/utils/students.utils'
import type { Student } from '@/features/students/types/students.types'

/** List of the students linked to a parent, each linking back to its profile. */
export function ParentChildrenList({ children }: { children: Student[] }) {
  const { t } = useI18n()

  if (children.length === 0) {
    return (
      <EmptyState
        icon={UsersRoundIcon}
        title={t('parents.children.noChildren')}
        description={t('parents.children.noChildrenDescription')}
      />
    )
  }

  return (
    <div className="space-y-3">
      {children.map((student) => {
        const statusMeta = STUDENT_STATUS_META[student.status]
        const studentClass = findStudentClass(student.classId)
        return (
          <Card key={student.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <StudentAvatar student={student} size="md" />
                <div className="min-w-0 flex-1 space-y-0.5">
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
                <StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}