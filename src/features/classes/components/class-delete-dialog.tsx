import { Trash2Icon } from 'lucide-react'

import { ConfirmDialog } from '@/components/dialogs/confirm-dialog'
import { useI18n } from '@/hooks/use-i18n'

import type { ClassCounts, SchoolClass } from '../types/classes.types'

interface ClassDeleteDialogProps {
  schoolClass: SchoolClass | null
  count: ClassCounts | null
  open: boolean
  onOpenChange: (open: boolean) => void
  busy: boolean
  onConfirm: () => void
}

/** Irreversible delete confirmation for a class. */
export function ClassDeleteDialog({
  schoolClass,
  count,
  open,
  onOpenChange,
  busy,
  onConfirm,
}: ClassDeleteDialogProps) {
  const { t } = useI18n()

  const hasLinks = count !== null && (count.students > 0 || count.teachers > 0)

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('classes.deleteDialog.title')}
      description={
        schoolClass ? t('classes.deleteDialog.description', { name: schoolClass.label }) : undefined
      }
      confirmLabel={t('classes.deleteDialog.confirm')}
      cancelLabel={t('common.cancel')}
      variant="destructive"
      icon={Trash2Icon}
      loading={busy}
      onConfirm={onConfirm}
    >
      {hasLinks ? (
        <p className="text-muted-foreground text-sm">{t('classes.deleteDialog.linkedWarning')}</p>
      ) : null}
    </ConfirmDialog>
  )
}
