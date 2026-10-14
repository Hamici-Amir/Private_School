import { z } from 'zod'

import { STUDENT_LEVELS } from '@/features/students/constants/students.constants'
import type { EducationLevel } from '@/features/students/types/students.types'

import { CLASS_STATUSES } from '../constants/classes.constants'
import type { ClassStatus } from '../types/classes.types'

export interface ClassValidationMessages {
  required: string
  labelTooLong: string
  roomTooLong: string
  capacityInvalid: string
  capacityInt: string
}

/** Builds the add/edit class schema with localized messages. */
export function createClassSchema(messages: ClassValidationMessages) {
  return z.object({
    label: z.string().trim().min(1, messages.required).max(100, messages.labelTooLong),
    level: z.enum(STUDENT_LEVELS as [EducationLevel, ...EducationLevel[]], {
      message: messages.required,
    }),
    room: z.string().trim().min(1, messages.required).max(10, messages.roomTooLong),
    capacity: z
      .number()
      .int(messages.capacityInt)
      .min(1, messages.capacityInvalid)
      .max(50, messages.capacityInvalid),
    headTeacherId: z.string(),
    status: z.enum(CLASS_STATUSES as [ClassStatus, ...ClassStatus[]], {
      message: messages.required,
    }),
  })
}

export type ClassFormSchema = z.infer<ReturnType<typeof createClassSchema>>
