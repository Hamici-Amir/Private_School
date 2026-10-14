import { z } from 'zod'

import {
  TEACHER_QUALIFICATIONS,
  TEACHER_SPECIALTIES,
} from '../constants/teachers.constants'
import type {
  TeacherGender,
  TeacherQualification,
  TeacherSpecialty,
  TeacherStatus,
} from '../types/teachers.types'

export interface TeacherValidationMessages {
  required: string
  emailInvalid: string
  phoneInvalid: string
  contactRequired: string
  birthDateFuture: string
  hireDateFuture: string
  firstNameTooLong: string
  lastNameTooLong: string
  addressTooLong: string
  cityTooLong: string
  notesTooLong: string
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

/** At least one of address/city must be provided. */
function isContactReachable(address: string, city: string): boolean {
  return address.trim() !== '' || city.trim() !== ''
}

/** None of the input date (yyyy-mm-dd) is in the future. */
function isNotFuture(date: string): boolean {
  return date <= new Date().toISOString().slice(0, 10)
}

/** Builds the add/edit teacher schema with localized messages. */
export function createTeacherSchema(messages: TeacherValidationMessages) {
  return z
    .object({
      firstName: z
        .string()
        .trim()
        .min(1, messages.required)
        .max(100, messages.firstNameTooLong),
      lastName: z
        .string()
        .trim()
        .min(1, messages.required)
        .max(100, messages.lastNameTooLong),
      firstNameAr: z.string().trim().max(100, messages.firstNameTooLong),
      lastNameAr: z.string().trim().max(100, messages.lastNameTooLong),
      gender: z.enum(['male', 'female'] as [TeacherGender, ...TeacherGender[]], {
        message: messages.required,
      }),
      birthDate: z
        .string()
        .trim()
        .min(1, messages.required)
        .refine(isNotFuture, messages.birthDateFuture),
      phone: z
        .string()
        .trim()
        .min(1, messages.required)
        .refine(isValidPhone, messages.phoneInvalid),
      email: z
        .string()
        .trim()
        .refine((value) => value === '' || isValidEmail(value), messages.emailInvalid),
      address: z.string().trim().max(300, messages.addressTooLong),
      city: z.string().trim().max(100, messages.cityTooLong),
      specialty: z.enum(TEACHER_SPECIALTIES as [TeacherSpecialty, ...TeacherSpecialty[]], {
        message: messages.required,
      }),
      qualification: z.enum(
        TEACHER_QUALIFICATIONS as [TeacherQualification, ...TeacherQualification[]],
        { message: messages.required },
      ),
      hireDate: z
        .string()
        .trim()
        .min(1, messages.required)
        .refine(isNotFuture, messages.hireDateFuture),
      notes: z.string().trim().max(500, messages.notesTooLong),
      status: z.enum(['active', 'onleave', 'inactive'] as [TeacherStatus, ...TeacherStatus[]], {
        message: messages.required,
      }),
    })
    .refine((data) => isContactReachable(data.address, data.city), {
      message: messages.contactRequired,
      path: ['address'],
    })
}

export type TeacherFormSchema = z.infer<ReturnType<typeof createTeacherSchema>>