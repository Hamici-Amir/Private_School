import { BookUserIcon } from 'lucide-react'
import { Link } from 'react-router'

import { EmptyState } from '@/components/feedback/empty-state'
import { Card, CardContent } from '@/components/ui/card'
import { TeacherAvatar } from '@/features/teachers/components/teacher-avatar'
import { TEACHER_SPECIALTY_META } from '@/features/teachers/constants/teachers.constants'
import { getTeacherFullName } from '@/features/teachers/utils/teachers.utils'
import type { Teacher } from '@/features/teachers/types/teachers.types'
import { useI18n } from '@/hooks/use-i18n'

/** Teachers assigned to a class, linking back to their profiles. */
export function ClassesTeachersList({ teachers }: { teachers: Teacher[] }) {
  const { t } = useI18n()

  if (teachers.length === 0) {
    return (
      <EmptyState
        icon={BookUserIcon}
        title={t('classes.teachers.noTeachers')}
        description={t('classes.teachers.noTeachersDescription')}
      />
    )
  }

  return (
    <div className="space-y-3">
      {teachers.map((teacher) => (
        <Card key={teacher.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TeacherAvatar teacher={teacher} />
              <div className="min-w-0 flex-1 space-y-0.5">
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
