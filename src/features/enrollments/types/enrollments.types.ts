/** Academic years used by the school system. */
export type AcademicYear =
  | '2024-2025'
  | '2025-2026'
  | '2026-2027'
  | '2027-2028'

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

export type EnrollmentStatus = 'active' | 'pending' | 'cancelled' | 'completed' | 'inactive'

export type RegistrationType = 'new' | 'returning' | 'transfer'

/** A school class (room) a student belongs to. */
export interface SchoolClass {
  id: string
  /** Human label, e.g. "1AM A". */
  label: string
  level: EducationLevel
  room: string
  capacity: number
  headTeacherId: string
  status: 'active' | 'inactive'
  createdAt: string
}

/** Enrollment model representing a student's registration for an academic year. */
export interface Enrollment {
  id: string
  studentId: string
  studentName: string
  parentId: string
  parentName: string
  academicYear: AcademicYear
  levelId: EducationLevel
  levelName: string
  classId: string
  className: string
  enrollmentDate: string
  status: EnrollmentStatus
  registrationType: RegistrationType
  notes?: string
  createdAt: string
  updatedAt: string
}

/** Selection filters for the enrollment list; 'all' means no filter. */
export interface EnrollmentFilters {
  academicYear: AcademicYear | 'all'
  level: EducationLevel | 'all'
  classId: string
  status: EnrollmentStatus | 'all'
  registrationType: RegistrationType | 'all'
  enrollmentDate: string
}

export type EnrollmentSortKey =
  | 'studentAsc'
  | 'studentDesc'
  | 'academicYearAsc'
  | 'academicYearDesc'
  | 'enrollmentDateAsc'
  | 'enrollmentDateDesc'
  | 'levelAsc'
  | 'levelDesc'
  | 'classAsc'
  | 'classDesc'
  | 'statusAsc'
  | 'statusDesc'
  | 'registrationTypeAsc'
  | 'registrationTypeDesc'

/** Payload of the add/edit enrollment form. */
export interface EnrollmentFormValues {
  studentId: string
  parentId: string
  academicYear: AcademicYear
  levelId: EducationLevel
  classId: string
  enrollmentDate: string
  registrationType: RegistrationType
  status: EnrollmentStatus
  notes?: string
}

/** Class capacity info for validation. */
export interface ClassCapacity {
  classId: string
  className: string
  capacity: number
  currentStudents: number
  availableSeats: number
  isFull: boolean
}

/** Enrollment with resolved related data for detail view. */
export interface EnrollmentDetail extends Enrollment {
  student: {
    id: string
    firstName: string
    lastName: string
    birthDate: string
    gender: 'male' | 'female'
    email?: string
    address?: string
    guardianName: string
    guardianPhone: string
    level: EducationLevel
    classId: string
    status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended'
    enrollmentDate: string
  }
  parent: {
    id: string
    firstName: string
    lastName: string
    firstNameAr?: string
    lastNameAr?: string
    gender: 'male' | 'female'
    relationship: 'father' | 'mother' | 'guardian' | 'other'
    phone: string
    secondaryPhone?: string
    email?: string
    address?: string
    city?: string
    occupation?: string
    nationality?: string
    notes?: string
    status: 'active' | 'inactive'
    createdAt: string
  }
  class: SchoolClass
}