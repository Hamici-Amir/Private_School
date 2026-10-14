import type { StatusTone } from '@/components/data-display/status-badge'
import type { TranslationKey } from '@/lib/i18n'

import type {
  EducationLevel,
  StudentClass,
  StudentGender,
  StudentSortKey,
  StudentStatus,
} from '../types/students.types'

/** Ordered education levels (used for filters and level-based sorting). */
export const STUDENT_LEVELS: EducationLevel[] = [
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

/** Available classes with their owning level. */
export const STUDENT_CLASSES: StudentClass[] = [
  { id: 'cl-1ap-a', label: '1AP A', level: '1AP' },
  { id: 'cl-2ap-a', label: '2AP A', level: '2AP' },
  { id: 'cl-3ap-a', label: '3AP A', level: '3AP' },
  { id: 'cl-4ap-a', label: '4AP A', level: '4AP' },
  { id: 'cl-5ap-a', label: '5AP A', level: '5AP' },
  { id: 'cl-1am-a', label: '1AM A', level: '1AM' },
  { id: 'cl-1am-b', label: '1AM B', level: '1AM' },
  { id: 'cl-2am-a', label: '2AM A', level: '2AM' },
  { id: 'cl-2am-b', label: '2AM B', level: '2AM' },
  { id: 'cl-3am-a', label: '3AM A', level: '3AM' },
  { id: 'cl-4am-a', label: '4AM A', level: '4AM' },
  { id: 'cl-1as-a', label: '1AS A', level: '1AS' },
  { id: 'cl-1as-b', label: '1AS B', level: '1AS' },
  { id: 'cl-2as-a', label: '2AS A', level: '2AS' },
  { id: 'cl-2as-b', label: '2AS B', level: '2AS' },
  { id: 'cl-3as-a', label: '3AS A', level: '3AS' },
]

/** Label key lookup for a level (e.g. "students.levels.1AP"). */
export function levelLabelKey(level: EducationLevel): TranslationKey {
  return `students.levels.${level}` as TranslationKey
}

/** Class lookup helper. */
export function findStudentClass(classId: string): StudentClass | undefined {
  return STUDENT_CLASSES.find((studentClass) => studentClass.id === classId)
}

/** Classes available for a level (`'all'` returns every class). */
export function getClassesForLevel(level: EducationLevel | 'all'): StudentClass[] {
  if (level === 'all') return STUDENT_CLASSES
  return STUDENT_CLASSES.filter((studentClass) => studentClass.level === level)
}

/** Ordered status list (used by filters and the status select). */
export const STUDENT_STATUSES: StudentStatus[] = [
  'active',
  'inactive',
  'graduated',
  'transferred',
  'suspended',
]

export const STUDENT_GENDERS: StudentGender[] = ['male', 'female']

export interface StudentStatusMeta {
  labelKey: TranslationKey
  tone: StatusTone
}

export const STUDENT_STATUS_META: Record<StudentStatus, StudentStatusMeta> = {
  active: { labelKey: 'students.statuses.active', tone: 'success' },
  inactive: { labelKey: 'students.statuses.inactive', tone: 'neutral' },
  graduated: { labelKey: 'students.statuses.graduated', tone: 'info' },
  transferred: { labelKey: 'students.statuses.transferred', tone: 'warning' },
  suspended: { labelKey: 'students.statuses.suspended', tone: 'error' },
}

export interface StudentGenderMeta {
  labelKey: TranslationKey
}

export const STUDENT_GENDER_META: Record<StudentGender, StudentGenderMeta> = {
  male: { labelKey: 'students.genders.male' },
  female: { labelKey: 'students.genders.female' },
}

export interface StudentSortOption {
  value: StudentSortKey
  labelKey: TranslationKey
}

export const STUDENT_SORT_OPTIONS: StudentSortOption[] = [
  { value: 'nameAsc', labelKey: 'students.sort.nameAsc' },
  { value: 'nameDesc', labelKey: 'students.sort.nameDesc' },
  { value: 'levelAsc', labelKey: 'students.sort.levelAsc' },
  { value: 'enrollmentNewest', labelKey: 'students.sort.enrollmentNewest' },
  { value: 'enrollmentOldest', labelKey: 'students.sort.enrollmentOldest' },
]

export const DEFAULT_STUDENT_SORT: StudentSortKey = 'nameAsc'
export const DEFAULT_STUDENT_PAGE_SIZE = 10
