import { EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, UsersIcon } from 'lucide-react'
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

import type { ClassCounts, SchoolClass } from '../types/classes.types'

interface ClassRowActionsProps {
  schoolClass: SchoolClass
  count: ClassCounts
  onEdit: (schoolClass: SchoolClass) => void
  onDelete: (schoolClass: SchoolClass) => void
}

/** Row-level actions: view detail, view students/teachers, edit, delete. */
export function ClassRowActions({ schoolClass, count, onEdit, onDelete }: ClassRowActionsProps) {
  const { t } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label={t('classes.table.actions')} variant="ghost">
          <MoreHorizontalIcon aria-hidden="true" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/classes/${schoolClass.id}`}>
            <EyeIcon aria-hidden="true" />
            {t('classes.actions.view')}
          </Link>
        </DropdownMenuItem>
        {count.students > 0 ? (
          <DropdownMenuItem asChild>
            <Link to={`/classes/${schoolClass.id}?tab=students`}>
              <UsersIcon aria-hidden="true" />
              {t('classes.actions.viewStudents')}
            </Link>
          </DropdownMenuItem>
        ) : null}
        {count.teachers > 0 ? (
          <DropdownMenuItem asChild>
            <Link to={`/classes/${schoolClass.id}?tab=teachers`}>
              <UsersIcon aria-hidden="true" />
              {t('classes.actions.viewTeachers')}
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onSelect={() => onEdit(schoolClass)}>
          <PencilIcon aria-hidden="true" />
          {t('classes.actions.edit')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(schoolClass)}>
          <Trash2Icon aria-hidden="true" />
          {t('classes.actions.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
