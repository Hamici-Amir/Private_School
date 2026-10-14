import { Trash2Icon } from 'lucide-react'

import { ConfirmDialog } from '@/components/dialogs/confirm-dialog'
import { useI18n } from '@/hooks/use-i18n'

import type { Student } from '../types/students.types'
import { getStudentFullName } from '../utils/students.utils'

interface StudentDeleteDialogProps {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
  busy: boolean
  onConfirm: () => void
}

/** Irreversible delete confirmation for a student. */
export function StudentDeleteDialog({
  student,
  open,
  onOpenChange,
  busy,
  onConfirm,
}: StudentDeleteDialogProps) {
  const { t } = useI18n()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('students.deleteDialog.title')}
      description={
        student ? t('students.deleteDialog.description', { name: getStudentFullName(student) }) : undefined
      }
      confirmLabel={t('students.deleteDialog.confirm')}
      cancelLabel={t('common.cancel')}
      variant="destructive"
      icon={Trash2Icon}
      loading={busy}
      onConfirm={onConfirm}
    />
  )
}