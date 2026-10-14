import { EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, UsersRoundIcon } from 'lucide-react'
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

import type { Parent } from '../types/parents.types'

interface ParentRowActionsProps {
  parent: Parent
  onEdit: (parent: Parent) => void
  onDelete: (parent: Parent) => void
}

/** Row-level actions: view profile, view children, edit, delete. */
export function ParentRowActions({ parent, onEdit, onDelete }: ParentRowActionsProps) {
  const { t } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label={t('parents.table.actions')} variant="ghost">
          <MoreHorizontalIcon aria-hidden="true" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/parents/${parent.id}`}>
            <EyeIcon aria-hidden="true" />
            {t('parents.actions.view')}
          </Link>
        </DropdownMenuItem>
        {parent.childrenIds.length > 0 ? (
          <DropdownMenuItem asChild>
            <Link to={`/parents/${parent.id}?tab=children`}>
              <UsersRoundIcon aria-hidden="true" />
              {t('parents.actions.viewChildren')}
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onSelect={() => onEdit(parent)}>
          <PencilIcon aria-hidden="true" />
          {t('parents.actions.edit')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(parent)}>
          <Trash2Icon aria-hidden="true" />
          {t('parents.actions.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}