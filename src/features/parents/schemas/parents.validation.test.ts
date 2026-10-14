import { describe, expect, it } from 'vitest'

import {
  createParentSchema,
  type ParentValidationMessages,
} from './parents.validation'

const MESSAGES: ParentValidationMessages = {
  required: 'Ce champ est requis.',
  emailInvalid: 'Adresse e-mail invalide.',
  phoneInvalid: 'Numéro de téléphone invalide.',
  contactRequired: 'Indiquez au moins l’adresse ou la ville.',
  firstNameTooLong: 'Prénom trop long.',
  lastNameTooLong: 'Nom trop long.',
  addressTooLong: 'Adresse trop longue.',
  cityTooLong: 'Ville trop longue.',
  occupationTooLong: 'Profession trop longue.',
  nationalityTooLong: 'Nationalité trop longue.',
  notesTooLong: 'Notes trop longues.',
}

const VALID = {
  firstName: 'Mohamed',
  lastName: 'Benali',
  firstNameAr: '',
  lastNameAr: '',
  gender: 'male' as const,
  relationship: 'father' as const,
  phone: '0550 12 34 56',
  secondaryPhone: '',
  email: '',
  address: 'Cité 20 Août, Alger',
  city: 'Alger',
  occupation: '',
  nationality: 'Algérienne',
  notes: '',
  status: 'active' as const,
}

describe('createParentSchema', () => {
  it('accepts a valid payload', () => {
    const result = createParentSchema(MESSAGES).safeParse(VALID)
    expect(result.success).toBe(true)
  })

  it('accepts when only the city is provided', () => {
    const result = createParentSchema(MESSAGES).safeParse({ ...VALID, address: '' })
    expect(result.success).toBe(true)
  })

  it('requires first and last names', () => {
    const result = createParentSchema(MESSAGES).safeParse({ ...VALID, firstName: '   ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(MESSAGES.required)
    }
  })

  it('rejects an invalid phone number', () => {
    const result = createParentSchema(MESSAGES).safeParse({ ...VALID, phone: '1234' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message === MESSAGES.phoneInvalid)).toBe(
        true,
      )
    }
  })

  it('accepts formatted Algerian mobile numbers', () => {
    const result = createParentSchema(MESSAGES).safeParse({
      ...VALID,
      phone: '0770-12-34-56',
      secondaryPhone: '0661 23 45 67',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid secondary phone when filled', () => {
    const result = createParentSchema(MESSAGES).safeParse({ ...VALID, secondaryPhone: '1234' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email when filled', () => {
    const result = createParentSchema(MESSAGES).safeParse({ ...VALID, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(MESSAGES.emailInvalid)
    }
  })

  it('requires at least an address or a city', () => {
    const result = createParentSchema(MESSAGES).safeParse({ ...VALID, address: '', city: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message === MESSAGES.contactRequired)).toBe(
        true,
      )
    }
  })

  it('rejects an invalid relationship', () => {
    const result = createParentSchema(MESSAGES).safeParse({
      ...VALID,
      relationship: 'uncle' as const,
    })
    expect(result.success).toBe(false)
  })

  it('accepts Arabic names up to 100 characters', () => {
    const result = createParentSchema(MESSAGES).safeParse({
      ...VALID,
      firstNameAr: 'محمد' + 'أ'.repeat(50),
    })
    expect(result.success).toBe(true)
  })
})