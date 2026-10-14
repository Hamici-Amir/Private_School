import { STUDENT_CLASSES, STUDENT_LEVELS, getClassesForLevel } from '../constants/students.constants'
import type {
  EducationLevel,
  Student,
  StudentFilters,
  StudentFormValues,
  StudentSortKey,
} from '../types/students.types'

/** "Amine Benali" → "Amine Benali". */
export function getStudentFullName(student: Pick<Student, 'firstName' | 'lastName'>): string {
  return `${student.firstName} ${student.lastName}`.trim()
}

/** "Amine Benali" → "AB". */
export function getStudentInitials(student: Pick<Student, 'firstName' | 'lastName'>): string {
  const first = student.firstName.charAt(0)
  const last = student.lastName.charAt(0)
  return `${first}${last}`.toUpperCase()
}

/** "0550123456" → "0550 12 34 56". Passes already-formatted values through. */
export function formatStudentPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return phone
  return `${digits.slice(0, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
}

/** Whole years between the birth date and the reference date. */
export function getStudentAge(birthDate: string, reference: Date = new Date()): number {
  const birth = new Date(`${birthDate}T00:00:00`)
  if (Number.isNaN(birth.getTime())) return 0
  let age = reference.getFullYear() - birth.getFullYear()
  const birthdayPassed =
    reference.getMonth() > birth.getMonth() ||
    (reference.getMonth() === birth.getMonth() && reference.getDate() >= birth.getDate())
  if (!birthdayPassed) age -= 1
  return Math.max(0, age)
}

/** Local-time yyyy-mm-dd key of a date. */
function dateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Today's local yyyy-mm-dd key (form default for enrollment date). */
export function getTodayKey(reference: Date = new Date()): string {
  return dateKey(reference)
}

/** September 1st of the school year containing `reference`. */
export function getAcademicYearStart(reference: Date = new Date()): string {
  const september = new Date(reference.getFullYear(), 8, 1)
  const start = reference < september ? new Date(reference.getFullYear() - 1, 8, 1) : september
  return dateKey(start)
}

export interface StudentsStats {
  total: number
  active: number
  new: number
  inactive: number
}

/** Derives the headline counters from the current list. */
export function getStudentsStats(students: Student[]): StudentsStats {
  const academicYearStart = getAcademicYearStart()
  return {
    total: students.length,
    active: students.filter((student) => student.status === 'active').length,
    new: students.filter((student) => student.enrollmentDate >= academicYearStart).length,
    inactive: students.filter((student) => student.status === 'inactive').length,
  }
}

const LEVEL_INDEX = new Map<EducationLevel, number>(
  STUDENT_LEVELS.map((level, index) => [level, index]),
)

function getClassLabel(classId: string): string {
  return STUDENT_CLASSES.find((studentClass) => studentClass.id === classId)?.label ?? ''
}

/** Search + filter pipeline for the student list. */
export function filterStudents(
  students: Student[],
  search: string,
  filters: StudentFilters,
): Student[] {
  const needle = search.trim().toLowerCase()
  return students.filter((student) => {
    if (needle) {
      const haystack = [
        getStudentFullName(student),
        student.guardianName,
        getClassLabel(student.classId),
        student.level,
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    if (filters.level !== 'all' && student.level !== filters.level) return false
    if (filters.classId !== 'all' && student.classId !== filters.classId) return false
    if (filters.status !== 'all' && student.status !== filters.status) return false
    return true
  })
}

/** Sort a copy of the list by the requested key. */
export function sortStudents(students: Student[], sortKey: StudentSortKey): Student[] {
  const sorted = [...students]
  switch (sortKey) {
    case 'nameAsc':
      return sorted.sort((a, b) =>
        getStudentFullName(a).localeCompare(getStudentFullName(b), 'en', { sensitivity: 'base' }),
      )
    case 'nameDesc':
      return sortStudents(students, 'nameAsc').reverse()
    case 'levelAsc':
      return sorted.sort((a, b) => {
        const levelDiff =
          (LEVEL_INDEX.get(a.level) ?? 0) - (LEVEL_INDEX.get(b.level) ?? 0)
        if (levelDiff !== 0) return levelDiff
        return getStudentFullName(a).localeCompare(getStudentFullName(b), 'en', {
          sensitivity: 'base',
        })
      })
    case 'enrollmentNewest':
      return sorted.sort((a, b) => b.enrollmentDate.localeCompare(a.enrollmentDate))
    case 'enrollmentOldest':
      return sorted.sort((a, b) => a.enrollmentDate.localeCompare(b.enrollmentDate))
  }
}

/** Page slice of the sorted list. */
export function paginateStudents<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

/** Builds a `Student` from form values, normalizing optional fields. */
export function toStudent(id: string, values: StudentFormValues): Student {
  return {
    id,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    birthDate: values.birthDate,
    gender: values.gender,
    email: values.email.trim() || undefined,
    address: values.address.trim() || undefined,
    guardianName: values.guardianName.trim(),
    guardianPhone: values.guardianPhone.replace(/\D/g, ''),
    level: values.level,
    classId: values.classId,
    status: values.status,
    enrollmentDate: values.enrollmentDate,
  }
}

/** Prefills the form from an existing student (empty string for optional fields). */
export function toFormValues(student: Student): StudentFormValues {
  return {
    firstName: student.firstName,
    lastName: student.lastName,
    birthDate: student.birthDate,
    gender: student.gender,
    address: student.address ?? '',
    email: student.email ?? '',
    guardianName: student.guardianName,
    guardianPhone: student.guardianPhone,
    level: student.level,
    classId: student.classId,
    status: student.status,
    enrollmentDate: student.enrollmentDate,
  }
}

/** Default values for a brand-new student. */
export function getEmptyFormValues(): StudentFormValues {
  const today = getTodayKey()
  return {
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: 'male',
    address: '',
    email: '',
    guardianName: '',
    guardianPhone: '',
    level: '1AM',
    classId: getClassesForLevel('1AM')[0]?.id ?? '',
    status: 'active',
    enrollmentDate: today,
  }
}
