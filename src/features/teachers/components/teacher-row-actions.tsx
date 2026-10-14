import { EyeIcon, MoreHorizontalIcon, PencilIcon, SchoolIcon, Trash2Icon } from 'lucide-react'
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

import type { Teacher } from '../types/teachers.types'

interface TeacherRowActionsProps {
  teacher: Teacher
  onEdit: (teacher: Teacher) => void
  onDelete: (teacher: Teacher) => void
}

/** Row-level actions: view profile, view classes, edit, delete. */
export function TeacherRowActions({ teacher, onEdit, onDelete }: TeacherRowActionsProps) {
  const { t } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label={t('teachers.table.actions')} variant="ghost">
          <MoreHorizontalIcon aria-hidden="true" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/teachers/${teacher.id}`}>
            <EyeIcon aria-hidden="true" />
            {t('teachers.actions.view')}
          </Link>
        </DropdownMenuItem>
        {teacher.classIds.length > 0 ? (
          <DropdownMenuItem asChild>
            <Link to={`/teachers/${teacher.id}?tab=classes`}>
              <SchoolIcon aria-hidden="true" />
              {t('teachers.actions.viewClasses')}
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onSelect={() => onEdit(teacher)}>
          <PencilIcon aria-hidden="true" />
          {t('teachers.actions.edit')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(teacher)}>
          <Trash2Icon aria-hidden="true" />
          {t('teachers.actions.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}