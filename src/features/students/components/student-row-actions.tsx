import { EyeIcon, MoreHorizontalIcon, PencilIcon, RotateCwIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router'

import { IconButton } from '@/components/ui/icon-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/hooks/use-i18n'

import type { Student } from '../types/students.types'

interface StudentRowActionsProps {
  student: Student
  onEdit: (student: Student) => void
  onChangeStatus: (student: Student) => void
  onDelete: (student: Student) => void
}

/** Row-level actions: view, edit, change status, delete. */
export function StudentRowActions({
  student,
  onEdit,
  onChangeStatus,
  onDelete,
}: StudentRowActionsProps) {
  const { t } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label={t('students.table.actions')} variant="ghost">
          <MoreHorizontalIcon aria-hidden="true" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/students/${student.id}`}>
            <EyeIcon aria-hidden="true" />
            {t('students.actions.view')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onEdit(student)}>
          <PencilIcon aria-hidden="true" />
          {t('students.actions.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onChangeStatus(student)}>
          <RotateCwIcon aria-hidden="true" />
          {t('students.actions.changeStatus')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(student)}>
          <Trash2Icon aria-hidden="true" />
          {t('students.actions.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}