import { useState } from 'react'
import { RotateCwIcon } from 'lucide-react'

import { FormDialog } from '@/components/dialogs/form-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useI18n } from '@/hooks/use-i18n'

import {
  STUDENT_STATUSES,
  STUDENT_STATUS_META,
} from '../constants/students.constants'
import type { Student, StudentStatus } from '../types/students.types'
import { getStudentFullName } from '../utils/students.utils'

interface StudentStatusDialogProps {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
  busy: boolean
  onSubmit: (status: StudentStatus) => void
}

/** Modal to update a student's status. */
export function StudentStatusDialog({
  student,
  open,
  onOpenChange,
  busy,
  onSubmit,
}: StudentStatusDialogProps) {
  const { t } = useI18n()
  // Initialized from the target student; the page remounts this dialog
  // (via key) whenever a different student is targeted.
  const [status, setStatus] = useState<StudentStatus>(() => student?.status ?? 'active')

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('students.statusDialog.title')}
      description={student ? t('students.statusDialog.description', { name: getStudentFullName(student) }) : undefined}
      submitLabel={t('students.statusDialog.confirm')}
      cancelLabel={t('common.cancel')}
      loading={busy}
      onSubmit={() => onSubmit(status)}
    >
      <div>
        <Select value={status} onValueChange={(value) => setStatus(value as StudentStatus)}>
          <SelectTrigger className="w-full" aria-label={t('students.table.status')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STUDENT_STATUSES.map((option) => (
              <SelectItem key={option} value={option}>
                {t(STUDENT_STATUS_META[option].labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs">
          <RotateCwIcon className="size-3" aria-hidden="true" />
          {t('students.actions.changeStatus')}
        </p>
      </div>
    </FormDialog>
  )
}