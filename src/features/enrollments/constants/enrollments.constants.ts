import type { AcademicYear, EducationLevel, EnrollmentStatus, RegistrationType, EnrollmentSortKey, EnrollmentFilters } from '../types/enrollments.types'

/** Default academic year for the current school year. */
export const DEFAULT_ACADEMIC_YEAR: AcademicYear = '2026-2027'

/** Available academic years for selection. */
export const ACADEMIC_YEARS: AcademicYear[] = [
  '2024-2025',
  '2025-2026',
  '2026-2027',
  '2027-2028',
]

/** Education levels used by the Algerian school system. */
export const EDUCATION_LEVELS: EducationLevel[] = [
  '1AP',
  '2AP',
  '3AP',
  '4AP',
  '5AP',
  '1AM',
  '2AM',
  '3AM',
  '4AM',
  '1AS',
  '2AS',
  '3AS',
]

/** Enrollment statuses. */
export const ENROLLMENT_STATUSES: EnrollmentStatus[] = [
  'active',
  'pending',
  'cancelled',
  'completed',
  'inactive',
]

/** Registration types. */
export const REGISTRATION_TYPES: RegistrationType[] = [
  'new',
  'returning',
  'transfer',
]

/** Default pagination size. */
export const DEFAULT_ENROLLMENT_PAGE_SIZE = 15

/** Default sort key for enrollments. */
export const DEFAULT_ENROLLMENT_SORT: EnrollmentSortKey = 'enrollmentDateDesc'

/** Default filters (no filtering). */
export const ALL_ENROLLMENT_FILTERS: EnrollmentFilters = {
  academicYear: 'all',
  level: 'all',
  classId: 'all',
  status: 'all',
  registrationType: 'all',
  enrollmentDate: '',
}

/** Status tone mapping for badges. */
export const ENROLLMENT_STATUS_TONE: Record<EnrollmentStatus, 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending'> = {
  active: 'success',
  pending: 'pending',
  cancelled: 'error',
  completed: 'info',
  inactive: 'neutral',
}

/** Registration type labels for i18n. */
export const REGISTRATION_TYPE_LABELS: Record<RegistrationType, string> = {
  new: 'enrollments.registrationType.new',
  returning: 'enrollments.registrationType.returning',
  transfer: 'enrollments.registrationType.transfer',
}

/** Enrollment status labels for i18n. */
export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  active: 'enrollments.status.active',
  pending: 'enrollments.status.pending',
  cancelled: 'enrollments.status.cancelled',
  completed: 'enrollments.status.completed',
  inactive: 'enrollments.status.inactive',
}

/** Level label keys for i18n (shared with students). */
export const LEVEL_LABEL_KEYS: Record<EducationLevel, string> = {
  '1AP': 'students.levels.1AP',
  '2AP': 'students.levels.2AP',
  '3AP': 'students.levels.3AP',
  '4AP': 'students.levels.4AP',
  '5AP': 'students.levels.5AP',
  '1AM': 'students.levels.1AM',
  '2AM': 'students.levels.2AM',
  '3AM': 'students.levels.3AM',
  '4AM': 'students.levels.4AM',
  '1AS': 'students.levels.1AS',
  '2AS': 'students.levels.2AS',
  '3AS': 'students.levels.3AS',
}