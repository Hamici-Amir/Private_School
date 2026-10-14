import { z } from 'zod'

import { PARENT_RELATIONSHIPS } from '../constants/parents.constants'
import type {
  ParentGender,
  ParentRelationship,
  ParentStatus,
} from '../types/parents.types'

export interface ParentValidationMessages {
  required: string
  emailInvalid: string
  phoneInvalid: string
  contactRequired: string
  firstNameTooLong: string
  lastNameTooLong: string
  addressTooLong: string
  cityTooLong: string
  occupationTooLong: string
  nationalityTooLong: string
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

/** Builds the add/edit parent schema with localized messages. */
export function createParentSchema(messages: ParentValidationMessages) {
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
      gender: z.enum(['male', 'female'] as [ParentGender, ...ParentGender[]], {
        message: messages.required,
      }),
      relationship: z.enum(PARENT_RELATIONSHIPS as [ParentRelationship, ...ParentRelationship[]], {
        message: messages.required,
      }),
      phone: z
        .string()
        .trim()
        .min(1, messages.required)
        .refine(isValidPhone, messages.phoneInvalid),
      secondaryPhone: z
        .string()
        .trim()
        .refine((value) => value === '' || isValidPhone(value), messages.phoneInvalid),
      email: z
        .string()
        .trim()
        .refine((value) => value === '' || isValidEmail(value), messages.emailInvalid),
      address: z.string().trim().max(300, messages.addressTooLong),
      city: z.string().trim().max(100, messages.cityTooLong),
      occupation: z.string().trim().max(100, messages.occupationTooLong),
      nationality: z.string().trim().max(100, messages.nationalityTooLong),
      notes: z.string().trim().max(500, messages.notesTooLong),
      status: z.enum(['active', 'inactive'] as [ParentStatus, ...ParentStatus[]], {
        message: messages.required,
      }),
    })
    .refine((data) => isContactReachable(data.address, data.city), {
      message: messages.contactRequired,
      path: ['address'],
    })
}

export type ParentFormSchema = z.infer<ReturnType<typeof createParentSchema>>