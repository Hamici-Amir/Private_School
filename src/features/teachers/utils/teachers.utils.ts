import { findStudentClass } from '@/features/students/constants/students.constants'
import type { StudentClass } from '@/features/students/types/students.types'

import type {
  Teacher,
  TeacherFilters,
  TeacherFormValues,
  TeacherSortKey,
} from '../types/teachers.types'

/** "Mohamed Benali" → "Mohamed Benali". */
export function getTeacherFullName(teacher: Pick<Teacher, 'firstName' | 'lastName'>): string {
  return `${teacher.firstName} ${teacher.lastName}`.trim()
}

/** "Mohamed Benali" → "MB". */
export function getTeacherInitials(teacher: Pick<Teacher, 'firstName' | 'lastName'>): string {
  const first = teacher.firstName.charAt(0)
  const last = teacher.lastName.charAt(0)
  return `${first}${last}`.toUpperCase()
}

/** "0550123456" → "0550 12 34 56". Passes already-formatted values through. */
export function formatTeacherPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return phone
  return `${digits.slice(0, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
}

export interface TeachersStats {
  total: number
  active: number
  onLeave: number
  new: number
}

/** September 1st of the school year containing `reference`. */
function getAcademicYearStart(reference: Date = new Date()): string {
  const september = new Date(reference.getFullYear(), 8, 1)
  const start =
    reference < september ? new Date(reference.getFullYear() - 1, 8, 1) : september
  const year = start.getFullYear()
  const month = String(start.getMonth() + 1).padStart(2, '0')
  const day = String(start.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Derives the headline counters from the current list. */
export function getTeachersStats(teachers: Teacher[]): TeachersStats {
  const academicYearStart = getAcademicYearStart()
  return {
    total: teachers.length,
    active: teachers.filter((teacher) => teacher.status === 'active').length,
    onLeave: teachers.filter((teacher) => teacher.status === 'onleave').length,
    new: teachers.filter((teacher) => teacher.createdAt >= academicYearStart).length,
  }
}

/** Search + filter pipeline for the teacher list. */
export function filterTeachers(
  teachers: Teacher[],
  search: string,
  filters: TeacherFilters,
): Teacher[] {
  const needle = search.trim().toLowerCase()
  return teachers.filter((teacher) => {
    if (needle) {
      const haystack = [
        getTeacherFullName(teacher),
        teacher.email ?? '',
        teacher.city ?? '',
        teacher.specialty,
        teacher.teacherNumber,
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    if (filters.specialty !== 'all' && teacher.specialty !== filters.specialty) return false
    if (filters.status !== 'all' && teacher.status !== filters.status) return false
    if (filters.city !== 'all' && teacher.city !== filters.city) return false
    if (
      filters.qualification !== 'all' &&
      teacher.qualification !== filters.qualification
    ) {
      return false
    }
    return true
  })
}

/** Sort a copy of the list by the requested key. */
export function sortTeachers(teachers: Teacher[], sortKey: TeacherSortKey): Teacher[] {
  const sorted = [...teachers]
  switch (sortKey) {
    case 'nameAsc':
      return sorted.sort((a, b) =>
        getTeacherFullName(a).localeCompare(getTeacherFullName(b), 'en', { sensitivity: 'base' }),
      )
    case 'nameDesc':
      return sortTeachers(teachers, 'nameAsc').reverse()
    case 'numberAsc':
      return sorted.sort((a, b) => a.teacherNumber.localeCompare(b.teacherNumber))
    case 'numberDesc':
      return sorted.sort((a, b) => b.teacherNumber.localeCompare(a.teacherNumber))
    case 'hireNewest':
      return sorted.sort((a, b) => b.hireDate.localeCompare(a.hireDate))
    case 'hireOldest':
      return sorted.sort((a, b) => a.hireDate.localeCompare(b.hireDate))
    case 'classesDesc':
      return sorted.sort((a, b) => b.classIds.length - a.classIds.length)
    case 'classesAsc':
      return sorted.sort((a, b) => a.classIds.length - b.classIds.length)
    case 'status':
      return sorted.sort(
        (a, b) =>
          a.status.localeCompare(b.status) ||
          getTeacherFullName(a).localeCompare(getTeacherFullName(b), 'en', { sensitivity: 'base' }),
      )
  }
}

/** Page slice of the sorted list. */
export function paginateTeachers<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

/** Resolves assigned class records from the class ids. */
export function resolveTeacherClasses(classIds: string[]): StudentClass[] {
  return classIds
    .map((id) => findStudentClass(id))
    .filter((studentClass): studentClass is StudentClass => studentClass !== undefined)
}

/** Groups a teacher's classes by education stage. */
export function countClassStages(classIds: string[]): {
  primary: number
  middle: number
  secondary: number
} {
  return classIds.reduce(
    (stages, id) => {
      const studentClass = findStudentClass(id)
      if (!studentClass) return stages
      if (studentClass.level.endsWith('AP')) stages.primary += 1
      else if (studentClass.level.endsWith('AS')) stages.secondary += 1
      else stages.middle += 1
      return stages
    },
    { primary: 0, middle: 0, secondary: 0 },
  )
}

/** Builds a `Teacher` from form values, normalizing optional fields. */
export function toTeacher(id: string, teacherNumber: string, values: TeacherFormValues): Teacher {
  return {
    id,
    teacherNumber,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    firstNameAr: values.firstNameAr.trim() || undefined,
    lastNameAr: values.lastNameAr.trim() || undefined,
    gender: values.gender,
    birthDate: values.birthDate,
    phone: values.phone.replace(/\D/g, ''),
    email: values.email.trim() || undefined,
    address: values.address.trim() || undefined,
    city: values.city.trim() || undefined,
    specialty: values.specialty,
    qualification: values.qualification,
    hireDate: values.hireDate,
    classIds: [],
    notes: values.notes.trim() || undefined,
    status: values.status,
    createdAt: new Date().toISOString().slice(0, 10),
  }
}

/** Prefills the form from an existing teacher (empty string for optional fields). */
export function toFormValues(teacher: Teacher): TeacherFormValues {
  return {
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    firstNameAr: teacher.firstNameAr ?? '',
    lastNameAr: teacher.lastNameAr ?? '',
    gender: teacher.gender,
    birthDate: teacher.birthDate,
    phone: teacher.phone,
    email: teacher.email ?? '',
    address: teacher.address ?? '',
    city: teacher.city ?? '',
    specialty: teacher.specialty,
    qualification: teacher.qualification,
    hireDate: teacher.hireDate,
    notes: teacher.notes ?? '',
    status: teacher.status,
  }
}

/** Default values for a brand-new teacher. */
export function getEmptyFormValues(): TeacherFormValues {
  return {
    firstName: '',
    lastName: '',
    firstNameAr: '',
    lastNameAr: '',
    gender: 'male',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    specialty: 'math',
    qualification: 'master',
    hireDate: '',
    notes: '',
    status: 'active',
  }
}