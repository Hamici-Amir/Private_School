import type { EducationLevel } from '@/features/students/types/students.types'

export type ClassStatus = 'active' | 'inactive'

/** A school class (room) managed by the Classes module. */
export interface SchoolClass {
  id: string
  /** Human label, e.g. "1AM C". */
  label: string
  level: EducationLevel
  /** Room identifier, e.g. "201". */
  room: string
  /** Maximum number of students. */
  capacity: number
  /** Reference to a `Teacher.id`; optional. */
  headTeacherId?: string
  status: ClassStatus
  /** ISO date (yyyy-mm-dd). */
  createdAt: string
}

/** Selection filters for the class list; `'all'` means no filter. */
export interface ClassFilters {
  level: EducationLevel | 'all'
  status: ClassStatus | 'all'
}

export type ClassSortKey =
  | 'labelAsc'
  | 'labelDesc'
  | 'levelAsc'
  | 'levelDesc'
  | 'capacityAsc'
  | 'capacityDesc'
  | 'enrolledAsc'
  | 'enrolledDesc'
  | 'teachersAsc'
  | 'teachersDesc'

/** Live counters derived from the students/teachers mocks. */
export interface ClassCounts {
  students: number
  teachers: number
}

/** Payload of the add/edit class form. */
export interface ClassFormValues {
  label: string
  level: EducationLevel
  room: string
  capacity: number
  /** `'none'` means no head teacher. */
  headTeacherId: string
  status: ClassStatus
}
