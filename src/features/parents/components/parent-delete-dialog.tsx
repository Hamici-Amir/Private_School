import { Trash2Icon } from 'lucide-react'

import { ConfirmDialog } from '@/components/dialogs/confirm-dialog'
import { useI18n } from '@/hooks/use-i18n'

import type { Parent } from '../types/parents.types'
import { getParentFullName } from '../utils/parents.utils'

interface ParentDeleteDialogProps {
  parent: Parent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  busy: boolean
  onConfirm: () => void
}

/** Irreversible delete confirmation for a parent. */
export function ParentDeleteDialog({
  parent,
  open,
  onOpenChange,
  busy,
  onConfirm,
}: ParentDeleteDialogProps) {
  const { t } = useI18n()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('parents.deleteDialog.title')}
      description={
        parent
          ? t('parents.deleteDialog.description', { name: getParentFullName(parent) })
          : undefined
      }
      confirmLabel={t('parents.deleteDialog.confirm')}
      cancelLabel={t('common.cancel')}
      variant="destructive"
      icon={Trash2Icon}
      loading={busy}
      onConfirm={onConfirm}
    >
      {parent && parent.childrenIds.length > 0 ? (
        <p className="text-muted-foreground text-sm">{t('parents.deleteDialog.linkedWarning')}</p>
      ) : null}
    </ConfirmDialog>
  )
}