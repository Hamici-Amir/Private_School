import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from 'lucide-react'
import { Link } from 'react-router'

import { StatusBadge } from '@/components/data-display/status-badge'
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

import { STUDENT_STATUS_META, findStudentClass } from '../constants/students.constants'
import type { Student, StudentSortKey } from '../types/students.types'
import {
  formatStudentPhone,
  getStudentFullName,
} from '../utils/students.utils'
import { StudentAvatar } from './student-avatar'
import { StudentRowActions } from './student-row-actions'

interface StudentsTableProps {
  students: Student[]
  sort: StudentSortKey
  onSortChange: (sort: StudentSortKey) => void
  onEdit: (student: Student) => void
  onChangeStatus: (student: Student) => void
  onDelete: (student: Student) => void
}

function StudentCell({ student }: { student: Student }) {
  return (
    <div className="flex items-center gap-3">
      <StudentAvatar student={student} />
      <div className="min-w-0 space-y-0.5">
        <Link
          to={`/students/${student.id}`}
          className="hover:text-primary hover:underline font-medium"
        >
          {getStudentFullName(student)}
        </Link>
        <p className="text-muted-foreground text-xs">
          {formatStudentPhone(student.guardianPhone)}
        </p>
      </div>
    </div>
  )
}

/**
 * Desktop student table. Hidden on narrow screens, where the card list is
 * shown instead (avoids horizontal scrolling).
 */
export function StudentsTable({
  students,
  sort,
  onSortChange,
  onEdit,
  onChangeStatus,
  onDelete,
}: StudentsTableProps) {
  const { t, locale } = useI18n()

  const nameActive = sort === 'nameAsc' || sort === 'nameDesc'
  const nameDirection = sort === 'nameDesc' ? 'desc' : 'asc'

  return (
    <div className="border-border bg-card hidden overflow-hidden rounded-lg border shadow-card md:block">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() => onSortChange(nameActive ? (nameDirection === 'asc' ? 'nameDesc' : 'nameAsc') : 'nameAsc')}
              >
                {t('students.table.student')}
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
                className={cn(
                  'inline-flex items-center gap-1 hover:text-foreground',
                  sort === 'levelAsc' && 'text-foreground',
                )}
                onClick={() => onSortChange('levelAsc')}
              >
                {t('students.table.level')}
                {sort === 'levelAsc' ? (
                  <ArrowUpIcon className="size-3" aria-hidden="true" />
                ) : (
                  <ArrowUpDownIcon className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </button>
            </TableHead>
            <TableHead>{t('students.table.className')}</TableHead>
            <TableHead>{t('students.table.birthDate')}</TableHead>
            <TableHead>{t('students.table.guardianPhone')}</TableHead>
            <TableHead>{t('students.table.status')}</TableHead>
            <TableHead className="text-end">{t('students.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const statusMeta = STUDENT_STATUS_META[student.status]
            const studentClass = findStudentClass(student.classId)
            return (
              <TableRow key={student.id}>
                <TableCell>
                  <StudentCell student={student} />
                </TableCell>
                <TableCell>
                  <span className="font-medium">{student.level}</span>
                </TableCell>
                <TableCell>{studentClass?.label ?? '—'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(student.birthDate, locale)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatStudentPhone(student.guardianPhone)}
                </TableCell>
                <TableCell>
                  <StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>
                </TableCell>
                <TableCell className="text-end">
                  <StudentRowActions
                    student={student}
                    onEdit={onEdit}
                    onChangeStatus={onChangeStatus}
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