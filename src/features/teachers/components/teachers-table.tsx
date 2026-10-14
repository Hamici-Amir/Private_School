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
import { useI18n } from '@/hooks/use-i18n'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

import {
  TEACHER_SPECIALTY_META,
  TEACHER_STATUS_META,
} from '../constants/teachers.constants'
import type { Teacher, TeacherSortKey } from '../types/teachers.types'
import {
  getTeacherFullName,
  resolveTeacherClasses,
} from '../utils/teachers.utils'
import { TeacherAvatar } from './teacher-avatar'
import { TeacherRowActions } from './teacher-row-actions'

interface TeachersTableProps {
  teachers: Teacher[]
  sort: TeacherSortKey
  onSortChange: (sort: TeacherSortKey) => void
  onEdit: (teacher: Teacher) => void
  onDelete: (teacher: Teacher) => void
}

function TeacherCell({ teacher }: { teacher: Teacher }) {
  const { t } = useI18n()
  return (
    <div className="flex items-center gap-3">
      <TeacherAvatar teacher={teacher} />
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
  )
}

function ClassesCell({ teacher }: { teacher: Teacher }) {
  const { t } = useI18n()
  const classes = resolveTeacherClasses(teacher.classIds)
  const visible = classes.slice(0, 2)
  const rest = classes.length - visible.length

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {t('teachers.classes.count', { count: classes.length })}
        </Badge>
      </div>
      {visible.length > 0 ? (
        <div className="flex flex-col gap-0.5">
          {visible.map((studentClass) => (
            <span key={studentClass.id} className="text-muted-foreground text-xs">
              {studentClass.label} · {studentClass.level}
            </span>
          ))}
          {rest > 0 ? (
            <span className="text-muted-foreground text-xs">
              {t('teachers.classes.more', { count: rest })}
            </span>
          ) : null}
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      )}
    </div>
  )
}

/**
 * Desktop teacher table. Hidden on narrow screens, where the card list is
 * shown instead (avoids horizontal scrolling).
 */
export function TeachersTable({
  teachers,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: TeachersTableProps) {
  const { t, locale } = useI18n()

  const nameActive = sort === 'nameAsc' || sort === 'nameDesc'
  const nameDirection = sort === 'nameDesc' ? 'desc' : 'asc'
  const numberActive = sort === 'numberAsc' || sort === 'numberDesc'
  const numberDirection = sort === 'numberDesc' ? 'desc' : 'asc'
  const classesActive = sort === 'classesDesc' || sort === 'classesAsc'
  const classesDirection = sort === 'classesDesc' ? 'desc' : 'asc'

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
                    nameActive ? (nameDirection === 'asc' ? 'nameDesc' : 'nameAsc') : 'nameAsc',
                  )
                }
              >
                {t('teachers.table.teacher')}
                {nameActive ? (
                  nameDirection === 'asc' ? (
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
                    numberActive
                      ? numberDirection === 'asc'
                        ? 'numberDesc'
                        : 'numberAsc'
                      : 'numberAsc',
                  )
                }
              >
                {t('teachers.table.teacherNumber')}
                {numberActive ? (
                  numberDirection === 'asc' ? (
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
                    classesActive
                      ? classesDirection === 'asc'
                        ? 'classesDesc'
                        : 'classesAsc'
                      : 'classesDesc',
                  )
                }
              >
                {t('teachers.table.classes')}
                {classesActive ? (
                  classesDirection === 'asc' ? (
                    <ArrowUpIcon className="size-3" aria-hidden="true" />
                  ) : (
                    <ArrowDownIcon className="size-3" aria-hidden="true" />
                  )
                ) : (
                  <ArrowUpDownIcon className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </button>
            </TableHead>
            <TableHead>{t('teachers.table.status')}</TableHead>
            <TableHead>{t('teachers.table.hireDate')}</TableHead>
            <TableHead className="text-end">{t('teachers.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => {
            const statusMeta = TEACHER_STATUS_META[teacher.status]
            return (
              <TableRow key={teacher.id}>
                <TableCell>
                  <TeacherCell teacher={teacher} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className={cn('font-mono text-xs')}>{teacher.teacherNumber}</span>
                </TableCell>
                <TableCell>
                  <ClassesCell teacher={teacher} />
                </TableCell>
                <TableCell>
                  <StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(teacher.hireDate, locale)}
                </TableCell>
                <TableCell className="text-end">
                  <TeacherRowActions teacher={teacher} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}