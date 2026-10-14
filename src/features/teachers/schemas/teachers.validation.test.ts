import { describe, expect, it } from 'vitest'

import {
  createTeacherSchema,
  type TeacherValidationMessages,
} from './teachers.validation'

const MESSAGES: TeacherValidationMessages = {
  required: 'Ce champ est requis.',
  emailInvalid: 'Adresse e-mail invalide.',
  phoneInvalid: 'Numéro de téléphone invalide.',
  contactRequired: 'Indiquez au moins l’adresse ou la ville.',
  birthDateFuture: 'Date de naissance dans le futur.',
  hireDateFuture: 'Date d’embauche dans le futur.',
  firstNameTooLong: 'Prénom trop long.',
  lastNameTooLong: 'Nom trop long.',
  addressTooLong: 'Adresse trop longue.',
  cityTooLong: 'Ville trop longue.',
  notesTooLong: 'Notes trop longues.',
}

const VALID = {
  firstName: 'Hassan',
  lastName: 'Meddour',
  firstNameAr: '',
  lastNameAr: '',
  gender: 'male' as const,
  birthDate: '1980-04-12',
  phone: '0550 12 34 56',
  email: '',
  address: 'Cité 20 Août, Alger',
  city: 'Alger',
  specialty: 'math' as const,
  qualification: 'master' as const,
  hireDate: '2015-09-01',
  notes: '',
  status: 'active' as const,
}

describe('createTeacherSchema', () => {
  it('accepts a valid payload', () => {
    const result = createTeacherSchema(MESSAGES).safeParse(VALID)
    expect(result.success).toBe(true)
  })

  it('accepts when only the city is provided', () => {
    const result = createTeacherSchema(MESSAGES).safeParse({ ...VALID, address: '' })
    expect(result.success).toBe(true)
  })

  it('requires first and last names', () => {
    const result = createTeacherSchema(MESSAGES).safeParse({ ...VALID, firstName: '   ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(MESSAGES.required)
    }
  })

  it('rejects an invalid phone number', () => {
    const result = createTeacherSchema(MESSAGES).safeParse({ ...VALID, phone: '1234' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message === MESSAGES.phoneInvalid)).toBe(
        true,
      )
    }
  })

  it('accepts formatted Algerian mobile numbers', () => {
    const result = createTeacherSchema(MESSAGES).safeParse({
      ...VALID,
      phone: '0770-12-34-56',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a birth date in the future', () => {
    const result = createTeacherSchema(MESSAGES).safeParse({
      ...VALID,
      birthDate: '2999-01-01',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message === MESSAGES.birthDateFuture)).toBe(
        true,
      )
    }
  })

  it('rejects a hire date in the future', () => {
    const result = createTeacherSchema(MESSAGES).safeParse({
      ...VALID,
      hireDate: '2999-01-01',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message === MESSAGES.hireDateFuture)).toBe(
        true,
      )
    }
  })

  it('rejects an invalid email when filled', () => {
    const result = createTeacherSchema(MESSAGES).safeParse({ ...VALID, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(MESSAGES.emailInvalid)
    }
  })

  it('requires at least an address or a city', () => {
    const result = createTeacherSchema(MESSAGES).safeParse({ ...VALID, address: '', city: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message === MESSAGES.contactRequired)).toBe(
        true,
      )
    }
  })

  it('rejects an unknown specialty and qualification', () => {
    const unknownSpecialty = createTeacherSchema(MESSAGES).safeParse({
      ...VALID,
      specialty: 'alchemy' as const,
    })
    expect(unknownSpecialty.success).toBe(false)

    const unknownQualification = createTeacherSchema(MESSAGES).safeParse({
      ...VALID,
      qualification: 'diploma' as const,
    })
    expect(unknownQualification.success).toBe(false)
  })

  it('rejects an invalid status', () => {
    const result = createTeacherSchema(MESSAGES).safeParse({
      ...VALID,
      status: 'retired' as const,
    })
    expect(result.success).toBe(false)
  })

  it('accepts Arabic names up to 100 characters', () => {
    const result = createTeacherSchema(MESSAGES).safeParse({
      ...VALID,
      firstNameAr: 'محمد' + 'أ'.repeat(50),
    })
    expect(result.success).toBe(true)
  })
})