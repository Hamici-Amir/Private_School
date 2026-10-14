import { Trash2Icon } from 'lucide-react'

import { ConfirmDialog } from '@/components/dialogs/confirm-dialog'
import { useI18n } from '@/hooks/use-i18n'

import type { Teacher } from '../types/teachers.types'
import { getTeacherFullName } from '../utils/teachers.utils'

interface TeacherDeleteDialogProps {
  teacher: Teacher | null
  open: boolean
  onOpenChange: (open: boolean) => void
  busy: boolean
  onConfirm: () => void
}

/** Irreversible delete confirmation for a teacher. */
export function TeacherDeleteDialog({
  teacher,
  open,
  onOpenChange,
  busy,
  onConfirm,
}: TeacherDeleteDialogProps) {
  const { t } = useI18n()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('teachers.deleteDialog.title')}
      description={
        teacher
          ? t('teachers.deleteDialog.description', { name: getTeacherFullName(teacher) })
          : undefined
      }
      confirmLabel={t('teachers.deleteDialog.confirm')}
      cancelLabel={t('common.cancel')}
      variant="destructive"
      icon={Trash2Icon}
      loading={busy}
      onConfirm={onConfirm}
    >
      {teacher && teacher.classIds.length > 0 ? (
        <p className="text-muted-foreground text-sm">{t('teachers.deleteDialog.linkedWarning')}</p>
      ) : null}
    </ConfirmDialog>
  )
}