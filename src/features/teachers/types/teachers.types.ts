export type TeacherGender = 'male' | 'female'

export type TeacherStatus = 'active' | 'onleave' | 'inactive'

export type TeacherQualification = 'licence' | 'master' | 'phd'

/** Subject the teacher teaches; also used by filters and the form. */
export type TeacherSpecialty =
  | 'math'
  | 'arabic'
  | 'french'
  | 'english'
  | 'science'
  | 'physics'
  | 'historyGeography'
  | 'philosophy'
  | 'sports'
  | 'islamic'
  | 'informatics'
  | 'arts'
  | 'music'

export interface Teacher {
  id: string
  /** Human-friendly sequential number, e.g. "T-001". */
  teacherNumber: string
  firstName: string
  lastName: string
  /** Arabic spelling of the first name (optional). */
  firstNameAr?: string
  /** Arabic spelling of the last name (optional). */
  lastNameAr?: string
  gender: TeacherGender
  /** ISO date (yyyy-mm-dd). */
  birthDate: string
  /** Digits only (e.g. "0550123456"); display formatting happens in utils. */
  phone: string
  email?: string
  address?: string
  city?: string
  specialty: TeacherSpecialty
  qualification: TeacherQualification
  /** ISO date (yyyy-mm-dd). */
  hireDate: string
  /** References to class ids resolved via the students class constants. */
  classIds: string[]
  notes?: string
  status: TeacherStatus
  /** ISO date (yyyy-mm-dd). */
  createdAt: string
}

/** Selection filters for the teacher list; `'all'` means no filter. */
export interface TeacherFilters {
  specialty: TeacherSpecialty | 'all'
  status: TeacherStatus | 'all'
  city: string
  qualification: TeacherQualification | 'all'
}

export type TeacherSortKey =
  | 'nameAsc'
  | 'nameDesc'
  | 'numberAsc'
  | 'numberDesc'
  | 'hireNewest'
  | 'hireOldest'
  | 'classesDesc'
  | 'classesAsc'
  | 'status'

/** Payload of the add/edit teacher form. */
export interface TeacherFormValues {
  firstName: string
  lastName: string
  firstNameAr: string
  lastNameAr: string
  gender: TeacherGender
  birthDate: string
  phone: string
  email: string
  address: string
  city: string
  specialty: TeacherSpecialty
  qualification: TeacherQualification
  hireDate: string
  notes: string
  status: TeacherStatus
}