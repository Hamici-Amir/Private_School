import { SchoolIcon } from 'lucide-react'
import { Link } from 'react-router'

import { EmptyState } from '@/components/feedback/empty-state'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/hooks/use-i18n'

import { levelLabelKey } from '@/features/students/constants/students.constants'
import type { StudentClass } from '@/features/students/types/students.types'

/** Classes assigned to a teacher, linking to the live Classes module. */
export function TeachersClassesList({ classes }: { classes: StudentClass[] }) {
  const { t } = useI18n()

  if (classes.length === 0) {
    return (
      <EmptyState
        icon={SchoolIcon}
        title={t('teachers.classes.noClasses')}
        description={t('teachers.classes.noClassesDescription')}
      />
    )
  }

  return (
    <div className="space-y-3">
      {classes.map((studentClass) => (
        <Card key={studentClass.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full">
                <SchoolIcon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1 space-y-0.5">
                <Link
                  to={`/classes/${studentClass.id}`}
                  className="hover:text-primary hover:underline font-medium"
                >
                  {studentClass.label}
                </Link>
                <p className="text-muted-foreground text-xs">
                  {t(levelLabelKey(studentClass.level))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
