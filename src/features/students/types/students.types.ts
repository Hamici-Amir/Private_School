/** Education levels used by the Algerian school system. */
export type EducationLevel =
  | '1AP'
  | '2AP'
  | '3AP'
  | '4AP'
  | '5AP'
  | '1AM'
  | '2AM'
  | '3AM'
  | '4AM'
  | '1AS'
  | '2AS'
  | '3AS'

export type StudentGender = 'male' | 'female'

export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended'

/** A school class (room) a student belongs to. */
export interface StudentClass {
  id: string
  /** Human label, e.g. "1AM A". */
  label: string
  level: EducationLevel
}

export interface Student {
  id: string
  firstName: string
  lastName: string
  /** ISO date (yyyy-mm-dd). */
  birthDate: string
  gender: StudentGender
  email?: string
  address?: string
  guardianName: string
  guardianPhone: string
  level: EducationLevel
  /** Reference to a `StudentClass.id`. */
  classId: string
  status: StudentStatus
  /** ISO date (yyyy-mm-dd). */
  enrollmentDate: string
}

/** Selection filters for the student list; `'all'` means no filter. */
export interface StudentFilters {
  level: EducationLevel | 'all'
  classId: string
  status: StudentStatus | 'all'
}

export type StudentSortKey =
  | 'nameAsc'
  | 'nameDesc'
  | 'levelAsc'
  | 'enrollmentNewest'
  | 'enrollmentOldest'

/** Payload of the add/edit student form. */
export interface StudentFormValues {
  firstName: string
  lastName: string
  birthDate: string
  gender: StudentGender
  address: string
  email: string
  guardianName: string
  guardianPhone: string
  level: EducationLevel
  classId: string
  status: StudentStatus
  enrollmentDate: string
}
