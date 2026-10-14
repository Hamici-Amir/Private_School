export type ParentGender = 'male' | 'female'

export type ParentRelationship = 'father' | 'mother' | 'guardian' | 'other'

export type ParentStatus = 'active' | 'inactive'

export interface Parent {
  id: string
  /** Human-friendly sequential number, e.g. "P-001". */
  parentNumber: string
  firstName: string
  lastName: string
  /** Arabic spelling of the first name (optional). */
  firstNameAr?: string
  /** Arabic spelling of the last name (optional). */
  lastNameAr?: string
  gender: ParentGender
  relationship: ParentRelationship
  /** Digits only (e.g. "0550123456"); display formatting happens in utils. */
  phone: string
  secondaryPhone?: string
  email?: string
  address?: string
  city?: string
  occupation?: string
  nationality?: string
  notes?: string
  /** References to `Student.id` values resolved via the students service. */
  childrenIds: string[]
  status: ParentStatus
  /** ISO date (yyyy-mm-dd). */
  createdAt: string
}

export type ParentChildCountFilter = 'all' | 'one' | 'multiple'

/** Selection filters for the parent list; `'all'` means no filter. */
export interface ParentFilters {
  relationship: ParentRelationship | 'all'
  status: ParentStatus | 'all'
  city: string
  children: ParentChildCountFilter
}

export type ParentSortKey =
  | 'nameAsc'
  | 'nameDesc'
  | 'numberAsc'
  | 'numberDesc'
  | 'childrenDesc'
  | 'childrenAsc'
  | 'createdNewest'
  | 'createdOldest'
  | 'status'

/** Payload of the add/edit parent form. */
export interface ParentFormValues {
  firstName: string
  lastName: string
  firstNameAr: string
  lastNameAr: string
  gender: ParentGender
  relationship: ParentRelationship
  phone: string
  secondaryPhone: string
  email: string
  address: string
  city: string
  occupation: string
  nationality: string
  notes: string
  status: ParentStatus
}