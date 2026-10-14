import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from 'lucide-react'
import { Link } from 'react-router'

import { StatusBadge } from '@/components/data-display/status-badge'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { levelLabelKey } from '@/features/students/constants/students.constants'
import { useI18n } from '@/hooks/use-i18n'
import { getTeacherFullName } from '@/features/teachers/utils/teachers.utils'
import type { Teacher } from '@/features/teachers/types/teachers.types'

import { CLASS_STATUS_META } from '../constants/classes.constants'
import type { ClassCounts, ClassSortKey, SchoolClass } from '../types/classes.types'
import { ClassAvatar } from './class-avatar'
import { ClassRowActions } from './class-row-actions'

interface ClassesTableProps {
  classes: SchoolClass[]
  counts: Record<string, ClassCounts>
  teachers: Teacher[]
  sort: ClassSortKey
  onSortChange: (sort: ClassSortKey) => void
  onEdit: (schoolClass: SchoolClass) => void
  onDelete: (schoolClass: SchoolClass) => void
}

function ClassCell({ schoolClass }: { schoolClass: SchoolClass }) {
  const { t } = useI18n()
  return (
    <div className="flex items-center gap-3">
      <ClassAvatar label={schoolClass.label} />
      <div className="min-w-0 space-y-0.5">
        <Link
          to={`/classes/${schoolClass.id}`}
          className="hover:text-primary hover:underline font-medium"
        >
          {schoolClass.label}
        </Link>
        <p className="text-muted-foreground text-xs">
          {t('classes.details.room')} {schoolClass.room}
        </p>
      </div>
    </div>
  )
}

function StudentsCell({ schoolClass, count }: { schoolClass: SchoolClass; count: number }) {
  const { t } = useI18n()
  const ratio = Math.min(100, Math.round((count / schoolClass.capacity) * 100))
  return (
    <div className="space-y-1">
      <Badge variant="secondary">{t('classes.students.count', { count })}</Badge>
      <div className="bg-muted h-1.5 w-24 overflow-hidden rounded-full" role="presentation">
        <div
          className="bg-primary h-full rounded-full"
          style={{ width: `${ratio}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

/**
 * Desktop class table. Hidden on narrow screens, where the card list is
 * shown instead (avoids horizontal scrolling).
 */
export function ClassesTable({
  classes,
  counts,
  teachers,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: ClassesTableProps) {
  const { t } = useI18n()

  const labelActive = sort === 'labelAsc' || sort === 'labelDesc'
  const labelDirection = sort === 'labelDesc' ? 'desc' : 'asc'
  const levelActive = sort === 'levelAsc' || sort === 'levelDesc'
  const levelDirection = sort === 'levelDesc' ? 'desc' : 'asc'
  const studentsActive = sort === 'enrolledDesc' || sort === 'enrolledAsc'
  const studentsDirection = sort === 'enrolledDesc' ? 'desc' : 'asc'
  const teachersActive = sort === 'teachersDesc' || sort === 'teachersAsc'
  const teachersDirection = sort === 'teachersDesc' ? 'desc' : 'asc'

  return (
    <div className="border-border bg-card hidden overflow-hidden rounded-lg border shadow-card md:block">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() =>
                  onSortChange(
                    labelActive
                      ? labelDirection === 'asc'
                        ? 'labelDesc'
                        : 'labelAsc'
                      : 'labelAsc',
                  )
                }
              >
                {t('classes.table.class')}
                {labelActive ? (
                  labelDirection === 'asc' ? (
                    <ArrowUpIcon className="size-3" aria-hidden="true" />
                  ) : (
                    <ArrowDownIcon className="size-3" aria-hidden="true" />
                  )
                ) : (
                  <ArrowUpDownIcon className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </button>
            </TableHead>
            <TableHead>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() =>
                  onSortChange(
                    levelActive
                      ? levelDirection === 'asc'
                        ? 'levelDesc'
                        : 'levelAsc'
                      : 'levelAsc',
                  )
                }
              >
                {t('classes.table.level')}
                {levelActive ? (
                  levelDirection === 'asc' ? (
                    <ArrowUpIcon className="size-3" aria-hidden="true" />
                  ) : (
                    <ArrowDownIcon className="size-3" aria-hidden="true" />
                  )
                ) : (
                  <ArrowUpDownIcon className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </button>
            </TableHead>
            <TableHead>{t('classes.table.headTeacher')}</TableHead>
            <TableHead>{t('classes.table.capacity')}</TableHead>
            <TableHead>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() =>
                  onSortChange(
                    studentsActive
                      ? studentsDirection === 'asc'
                        ? 'enrolledDesc'
                        : 'enrolledAsc'
                      : 'enrolledDesc',
                  )
                }
              >
                {t('classes.table.students')}
                {studentsActive ? (
                  studentsDirection === 'asc' ? (
                    <ArrowUpIcon className="size-3" aria-hidden="true" />
                  ) : (
                    <ArrowDownIcon className="size-3" aria-hidden="true" />
                  )
                ) : (
                  <ArrowUpDownIcon className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </button>
            </TableHead>
            <TableHead>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() =>
                  onSortChange(
                    teachersActive
                      ? teachersDirection === 'asc'
                        ? 'teachersDesc'
                        : 'teachersAsc'
                      : 'teachersDesc',
                  )
                }
              >
                {t('classes.table.teachers')}
                {teachersActive ? (
                  teachersDirection === 'asc' ? (
                    <ArrowUpIcon className="size-3" aria-hidden="true" />
                  ) : (
                    <ArrowDownIcon className="size-3" aria-hidden="true" />
                  )
                ) : (
                  <ArrowUpDownIcon className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </button>
            </TableHead>
            <TableHead>{t('classes.table.status')}</TableHead>
            <TableHead className="text-end">{t('classes.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((schoolClass) => {
            const statusMeta = CLASS_STATUS_META[schoolClass.status]
            const count = counts[schoolClass.id] ?? { students: 0, teachers: 0 }
            const headTeacher = teachers.find((teacher) => teacher.id === schoolClass.headTeacherId)
            return (
              <TableRow key={schoolClass.id}>
                <TableCell>
                  <ClassCell schoolClass={schoolClass} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {t(levelLabelKey(schoolClass.level))}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {headTeacher ? (
                    <Link
                      to={`/teachers/${headTeacher.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {getTeacherFullName(headTeacher)}
                    </Link>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{schoolClass.capacity}</TableCell>
                <TableCell>
                  <StudentsCell schoolClass={schoolClass} count={count.students} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <Badge variant="secondary">
                    {t('classes.teachers.count', { count: count.teachers })}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>
                </TableCell>
                <TableCell className="text-end">
                  <ClassRowActions
                    schoolClass={schoolClass}
                    count={count}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
