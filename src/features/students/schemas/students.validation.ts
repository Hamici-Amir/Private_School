import { z } from 'zod'

import { STUDENT_CLASSES, STUDENT_LEVELS } from '../constants/students.constants'
import type { EducationLevel, StudentGender, StudentStatus } from '../types/students.types'

export interface StudentValidationMessages {
  required: string
  emailInvalid: string
  phoneInvalid: string
  birthDateFuture: string
  firstNameTooLong: string
  lastNameTooLong: string
  guardianNameTooLong: string
  addressTooLong: string
}

function normalizePhone(value: string): string {
  return value.replace(/[\s.-]/g, '')
}

/** Algerian mobile numbers: 05/06/07 followed by 8 digits. */
function isValidPhone(value: string): boolean {
  const normalized = normalizePhone(value)
  if (!/^\d+$/.test(normalized)) return false
  return /^0[567]\d{8}$/.test(normalized)
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isPastOrToday(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return false
  return date <= new Date()
}

/** Builds the add/edit student schema with localized messages. */
export function createStudentSchema(messages: StudentValidationMessages) {
  return z.object({
    firstName: z
      .string()
      .trim()
      .min(1, messages.required)
      .max(200, messages.firstNameTooLong),
    lastName: z
      .string()
      .trim()
      .min(1, messages.required)
      .max(200, messages.lastNameTooLong),
    birthDate: z.string().refine(isPastOrToday, messages.birthDateFuture),
    gender: z.enum(['male', 'female'] as [StudentGender, ...StudentGender[]], {
      message: messages.required,
    }),
    address: z.string().trim().max(500, messages.addressTooLong),
    email: z
      .string()
      .trim()
      .max(200)
      .refine((value) => value === '' || isValidEmail(value), messages.emailInvalid),
    guardianName: z
      .string()
      .trim()
      .min(1, messages.required)
      .max(200, messages.guardianNameTooLong),
    guardianPhone: z
      .string()
      .trim()
      .min(1, messages.required)
      .refine(isValidPhone, messages.phoneInvalid),
    level: z.enum(STUDENT_LEVELS as [EducationLevel, ...EducationLevel[]], {
      message: messages.required,
    }),
    classId: z
      .string()
      .min(1, messages.required)
      .refine(
        (value) => STUDENT_CLASSES.some((studentClass) => studentClass.id === value),
        messages.required,
      ),
    status: z.enum(
      ['active', 'inactive', 'graduated', 'transferred', 'suspended'] as [
        StudentStatus,
        ...StudentStatus[],
      ],
      { message: messages.required },
    ),
    enrollmentDate: z.string().min(1, messages.required),
  })
}

export type StudentFormSchema = z.infer<ReturnType<typeof createStudentSchema>>
