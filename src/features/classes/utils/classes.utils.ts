import { STUDENT_LEVELS } from '@/features/students/constants/students.constants'
import type { Student } from '@/features/students/types/students.types'
import type { Teacher } from '@/features/teachers/types/teachers.types'

import type {
  ClassCounts,
  ClassFilters,
  ClassFormValues,
  ClassSortKey,
  SchoolClass,
} from '../types/classes.types'

export type EducationStage = 'primary' | 'middle' | 'secondary'

/** "1AM C" → "1A". */
export function getClassInitials(label: string): string {
  return label.replace(/\s/g, '').slice(0, 2).toUpperCase()
}

/** Groups an education level into its stage. */
export function educationStage(level: SchoolClass['level']): EducationStage {
  if (level.endsWith('AP')) return 'primary'
  if (level.endsWith('AS')) return 'secondary'
  return 'middle'
}

export interface ClassesStats {
  total: number
  primary: number
  middle: number
  secondary: number
}

/** Derives the headline counters from the current list. */
export function getClassesStats(classes: SchoolClass[]): ClassesStats {
  return {
    total: classes.length,
    primary: classes.filter((schoolClass) => educationStage(schoolClass.level) === 'primary')
      .length,
    middle: classes.filter((schoolClass) => educationStage(schoolClass.level) === 'middle').length,
    secondary: classes.filter((schoolClass) => educationStage(schoolClass.level) === 'secondary')
      .length,
  }
}

/** Students enrolled in the given class. */
export function resolveClassStudents(classId: string, students: Student[]): Student[] {
  return students.filter((student) => student.classId === classId)
}

/** Teachers assigned to the given class. */
export function resolveClassTeachers(classId: string, teachers: Teacher[]): Teacher[] {
  return teachers.filter((teacher) => teacher.classIds.includes(classId))
}

/** Live enrollment/assignment counters keyed by class id. */
export function buildClassCounts(
  classes: SchoolClass[],
  students: Student[],
  teachers: Teacher[],
): Record<string, ClassCounts> {
  return classes.reduce<Record<string, ClassCounts>>((counts, schoolClass) => {
    counts[schoolClass.id] = {
      students: resolveClassStudents(schoolClass.id, students).length,
      teachers: resolveClassTeachers(schoolClass.id, teachers).length,
    }
    return counts
  }, {})
}

/** Search + filter pipeline for the class list. */
export function filterClasses(
  classes: SchoolClass[],
  search: string,
  filters: ClassFilters,
): SchoolClass[] {
  const needle = search.trim().toLowerCase()
  return classes.filter((schoolClass) => {
    if (needle) {
      const haystack = [schoolClass.label, schoolClass.room, schoolClass.level]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    if (filters.level !== 'all' && schoolClass.level !== filters.level) return false
    if (filters.status !== 'all' && schoolClass.status !== filters.status) return false
    return true
  })
}

function levelIndex(level: SchoolClass['level']): number {
  return STUDENT_LEVELS.indexOf(level)
}

/** Sort a copy of the list by the requested key. */
export function sortClasses(
  classes: SchoolClass[],
  sortKey: ClassSortKey,
  counts: Record<string, ClassCounts> = {},
): SchoolClass[] {
  const sorted = [...classes]
  const enrolled = (schoolClass: SchoolClass) => counts[schoolClass.id]?.students ?? 0
  const assigned = (schoolClass: SchoolClass) => counts[schoolClass.id]?.teachers ?? 0
  switch (sortKey) {
    case 'labelAsc':
      return sorted.sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }))
    case 'labelDesc':
      return sortClasses(classes, 'labelAsc', counts).reverse()
    case 'levelAsc':
      return sorted.sort(
        (a, b) => levelIndex(a.level) - levelIndex(b.level) || a.label.localeCompare(b.label, 'en'),
      )
    case 'levelDesc':
      return sortClasses(classes, 'levelAsc', counts).reverse()
    case 'capacityAsc':
      return sorted.sort((a, b) => a.capacity - b.capacity)
    case 'capacityDesc':
      return sorted.sort((a, b) => b.capacity - a.capacity)
    case 'enrolledAsc':
      return sorted.sort((a, b) => enrolled(a) - enrolled(b))
    case 'enrolledDesc':
      return sorted.sort((a, b) => enrolled(b) - enrolled(a))
    case 'teachersAsc':
      return sorted.sort((a, b) => assigned(a) - assigned(b))
    case 'teachersDesc':
      return sorted.sort((a, b) => assigned(b) - assigned(a))
  }
}

/** Page slice of the sorted list. */
export function paginateClasses<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

const NO_HEAD_TEACHER = 'none'

/** Builds a `SchoolClass` from form values, normalizing optional fields. */
export function toClass(id: string, values: ClassFormValues): SchoolClass {
  return {
    id,
    label: values.label.trim(),
    level: values.level,
    room: values.room.trim(),
    capacity: values.capacity,
    headTeacherId:
      values.headTeacherId === '' || values.headTeacherId === NO_HEAD_TEACHER
        ? undefined
        : values.headTeacherId,
    status: values.status,
    createdAt: new Date().toISOString().slice(0, 10),
  }
}

/** Prefills the form from an existing class. */
export function toFormValues(schoolClass: SchoolClass): ClassFormValues {
  return {
    label: schoolClass.label,
    level: schoolClass.level,
    room: schoolClass.room,
    capacity: schoolClass.capacity,
    headTeacherId: schoolClass.headTeacherId ?? NO_HEAD_TEACHER,
    status: schoolClass.status,
  }
}

/** Default values for a brand-new class. */
export function getEmptyFormValues(): ClassFormValues {
  return {
    label: '',
    level: '1AP',
    room: '',
    capacity: 30,
    headTeacherId: NO_HEAD_TEACHER,
    status: 'active',
  }
}
