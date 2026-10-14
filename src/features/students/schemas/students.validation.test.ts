import { describe, expect, it } from 'vitest'

import {
  createStudentSchema,
  type StudentValidationMessages,
} from './students.validation'

const MESSAGES: StudentValidationMessages = {
  required: 'Ce champ est requis.',
  emailInvalid: 'Adresse e-mail invalide.',
  phoneInvalid: 'Numéro de téléphone invalide.',
  birthDateFuture: 'Date de naissance invalide.',
  firstNameTooLong: 'Prénom trop long.',
  lastNameTooLong: 'Nom trop long.',
  guardianNameTooLong: 'Nom du tuteur trop long.',
  addressTooLong: 'Adresse trop longue.',
}

const VALID = {
  firstName: 'Amine',
  lastName: 'Benali',
  birthDate: '2015-05-05',
  gender: 'male' as const,
  address: '',
  email: '',
  guardianName: 'Mohamed Benali',
  guardianPhone: '0550 12 34 56',
  level: '1AM' as const,
  classId: 'cl-1am-a',
  status: 'active' as const,
  enrollmentDate: '2025-09-08',
}

describe('createStudentSchema', () => {
  it('accepts a valid payload', () => {
    const result = createStudentSchema(MESSAGES).safeParse(VALID)
    expect(result.success).toBe(true)
  })

  it('accepts an optional email when present and valid', () => {
    const result = createStudentSchema(MESSAGES).safeParse({ ...VALID, email: 'a@b.dz' })
    expect(result.success).toBe(true)
  })

  it('requires first and last names', () => {
    const result = createStudentSchema(MESSAGES).safeParse({ ...VALID, firstName: '   ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(MESSAGES.required)
    }
  })

  it('rejects an invalid phone number', () => {
    const result = createStudentSchema(MESSAGES).safeParse({ ...VALID, guardianPhone: '1234' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(MESSAGES.phoneInvalid)
    }
  })

  it('accepts formatted Algerian mobile numbers', () => {
    const result = createStudentSchema(MESSAGES).safeParse({ ...VALID, guardianPhone: '0770-12-34-56' })
    expect(result.success).toBe(true)
  })

  it('rejects a future birth date', () => {
    const result = createStudentSchema(MESSAGES).safeParse({ ...VALID, birthDate: '2050-01-01' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(MESSAGES.birthDateFuture)
    }
  })

  it('rejects an invalid email when filled', () => {
    const result = createStudentSchema(MESSAGES).safeParse({ ...VALID, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(MESSAGES.emailInvalid)
    }
  })

  it('rejects a class id that does not exist', () => {
    const result = createStudentSchema(MESSAGES).safeParse({ ...VALID, classId: 'cl-nope' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message === MESSAGES.required)).toBe(true)
    }
  })
})