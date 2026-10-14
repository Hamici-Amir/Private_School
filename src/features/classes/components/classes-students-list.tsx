import { UsersIcon } from 'lucide-react'
import { Link } from 'react-router'

import { EmptyState } from '@/components/feedback/empty-state'
import { Card, CardContent } from '@/components/ui/card'
import { levelLabelKey } from '@/features/students/constants/students.constants'
import { StudentAvatar } from '@/features/students/components/student-avatar'
import { getStudentFullName } from '@/features/students/utils/students.utils'
import type { Student } from '@/features/students/types/students.types'
import { useI18n } from '@/hooks/use-i18n'

/** Students enrolled in a class, linking back to their profiles. */
export function ClassesStudentsList({ students }: { students: Student[] }) {
  const { t } = useI18n()

  if (students.length === 0) {
    return (
      <EmptyState
        icon={UsersIcon}
        title={t('classes.students.noStudents')}
        description={t('classes.students.noStudentsDescription')}
      />
    )
  }

  return (
    <div className="space-y-3">
      {students.map((student) => (
        <Card key={student.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <StudentAvatar student={student} />
              <div className="min-w-0 flex-1 space-y-0.5">
                <Link
                  to={`/students/${student.id}`}
                  className="hover:text-primary hover:underline font-medium"
                >
                  {getStudentFullName(student)}
                </Link>
                <p className="text-muted-foreground text-xs">{t(levelLabelKey(student.level))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
