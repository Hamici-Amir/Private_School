import { describe, expect, it } from 'vitest'

import {
  filterStudents,
  formatStudentPhone,
  getAcademicYearStart,
  getEmptyFormValues,
  getStudentAge,
  getStudentFullName,
  getStudentInitials,
  getStudentsStats,
  getTodayKey,
  paginateStudents,
  sortStudents,
  toFormValues,
  toStudent,
  type StudentsStats,
} from './students.utils'
import type { Student, StudentFilters, StudentFormValues } from '../types/students.types'

function makeStudent(overrides: Partial<Student>): Student {
  return {
    id: 's-test',
    firstName: 'Amine',
    lastName: 'Benali',
    birthDate: '2015-05-05',
    gender: 'male',
    email: undefined,
    address: undefined,
    guardianName: 'Mohamed Benali',
    guardianPhone: '0550 12 34 56',
    level: '1AM',
    classId: 'cl-1am-a',
    status: 'active',
    enrollmentDate: '2025-09-08',
    ...overrides,
  }
}

describe('getStudentFullName / getStudentInitials', () => {
  it('joins first and last name', () => {
    const student = makeStudent({})
    expect(getStudentFullName(student)).toBe('Amine Benali')
  })

  it('computes uppercase initials', () => {
    const student = makeStudent({ firstName: 'amine', lastName: 'benali' })
    expect(getStudentInitials(student)).toBe('AB')
  })
})

describe('formatStudentPhone', () => {
  it('groups a 10-digit number into 4-2-2-2', () => {
    expect(formatStudentPhone('0550123456')).toBe('0550 12 34 56')
  })

  it('ignores spaces and dashes in the source', () => {
    expect(formatStudentPhone('0550-123-456')).toBe('0550 12 34 56')
  })

  it('passes through values that are not 10 digits', () => {
    expect(formatStudentPhone('7777')).toBe('7777')
    expect(formatStudentPhone('0550 12 34 56')).toBe('0550 12 34 56')
  })
})

describe('getStudentAge', () => {
  const reference = new Date(2026, 7, 18)

  it('counts completed years', () => {
    expect(getStudentAge('2015-05-05', reference)).toBe(11)
    expect(getStudentAge('2015-12-05', reference)).toBe(10)
  })

  it('returns 0 for empty or invalid dates', () => {
    expect(getStudentAge('', reference)).toBe(0)
  })
})

describe('getAcademicYearStart', () => {
  it('uses the previous September before September 1st', () => {
    expect(getAcademicYearStart(new Date(2026, 7, 18))).toBe('2025-09-01')
  })

  it('uses the current September from September onwards', () => {
    expect(getAcademicYearStart(new Date(2026, 9, 5))).toBe('2026-09-01')
  })
})

describe('getStudentsStats', () => {
  it('derives total/active/new/inactive counters', () => {
    const students: Student[] = [
      makeStudent({ id: 'a', status: 'active', enrollmentDate: '2025-10-01' }),
      makeStudent({ id: 'b', status: 'active', enrollmentDate: '2022-09-07' }),
      makeStudent({ id: 'c', status: 'inactive', enrollmentDate: '2023-09-06' }),
      makeStudent({ id: 'd', status: 'graduated', enrollmentDate: '2020-09-09' }),
    ]
    const stats: StudentsStats = getStudentsStats(students)
    expect(stats).toEqual({ total: 4, active: 2, new: 1, inactive: 1 })
  })
})

describe('filterStudents', () => {
  const students: Student[] = [
    makeStudent({ id: 'a', firstName: 'Amine', lastName: 'Benali', level: '1AM', classId: 'cl-1am-a', status: 'active' }),
    makeStudent({ id: 'b', firstName: 'Sara', lastName: 'Lounis', level: '3AM', classId: 'cl-3am-a', status: 'suspended' }),
    makeStudent({ id: 'c', firstName: 'Nadir', lastName: 'Ould Kaci', level: '2AS', classId: 'cl-2as-b', status: 'inactive' }),
  ]
  const none: StudentFilters = { level: 'all', classId: 'all', status: 'all' }

  it('matches search case-insensitively against the full name', () => {
    expect(filterStudents(students, 'amine', none).map((s) => s.id)).toEqual(['a'])
    expect(filterStudents(students, 'OULD', none).map((s) => s.id)).toEqual(['c'])
  })

  it('filters by level', () => {
    expect(filterStudents(students, '', { ...none, level: '3AM' }).map((s) => s.id)).toEqual(['b'])
  })

  it('filters by class', () => {
    expect(filterStudents(students, '', { ...none, classId: 'cl-2as-b' }).map((s) => s.id)).toEqual([
      'c',
    ])
  })

  it('filters by status and combines criteria', () => {
    expect(filterStudents(students, '', { ...none, status: 'inactive' }).map((s) => s.id)).toEqual([
      'c',
    ])
    expect(
      filterStudents(students, 'lounis', { ...none, status: 'suspended' }).map((s) => s.id),
    ).toEqual(['b'])
  })
})

describe('sortStudents', () => {
  const students: Student[] = [
    makeStudent({ id: 'a', firstName: 'Amine', lastName: 'Benali', level: '1AM', enrollmentDate: '2025-09-08' }),
    makeStudent({ id: 'b', firstName: 'Sara', lastName: 'Sellami', level: '3AM', enrollmentDate: '2022-09-07' }),
    makeStudent({ id: 'c', firstName: 'Nadir', lastName: 'Ould Kaci', level: '2AS', enrollmentDate: '2023-09-06' }),
  ]
  const ids = (list: Student[]) => list.map((s) => s.id)

  it('sorts by name ascending and descending', () => {
    expect(ids(sortStudents(students, 'nameAsc'))).toEqual(['a', 'c', 'b'])
    expect(ids(sortStudents(students, 'nameDesc'))).toEqual(['b', 'c', 'a'])
  })

  it('sorts by level ascending (1AM before 3AM before 2AS)', () => {
    expect(ids(sortStudents(students, 'levelAsc'))).toEqual(['a', 'b', 'c'])
  })

  it('sorts by enrollment date', () => {
    expect(ids(sortStudents(students, 'enrollmentNewest'))).toEqual(['a', 'c', 'b'])
    expect(ids(sortStudents(students, 'enrollmentOldest'))).toEqual(['b', 'c', 'a'])
  })

  it('does not mutate the input array', () => {
    const copy = [...students]
    sortStudents(students, 'nameDesc')
    expect(students).toEqual(copy)
  })
})

describe('paginateStudents', () => {
  it('slices pages', () => {
    const items = [1, 2, 3, 4, 5]
    expect(paginateStudents(items, 1, 2)).toEqual([1, 2])
    expect(paginateStudents(items, 2, 2)).toEqual([3, 4])
    expect(paginateStudents(items, 3, 2)).toEqual([5])
  })
})

describe('toStudent / toFormValues / getEmptyFormValues', () => {
  const values: StudentFormValues = {
    firstName: '  Amine ',
    lastName: '  Benali  ',
    birthDate: '2015-05-05',
    gender: 'male',
    address: '  ',
    email: '',
    guardianName: ' Mohamed ',
    guardianPhone: '0550 12 34 56',
    level: '1AM',
    classId: 'cl-1am-a',
    status: 'active',
    enrollmentDate: '2025-09-08',
  }

  it('normalizes whitespace and empty optionals when building a student', () => {
    const student = toStudent('s-new', values)
    expect(student).toMatchObject({
      id: 's-new',
      firstName: 'Amine',
      lastName: 'Benali',
      email: undefined,
      address: undefined,
      guardianName: 'Mohamed',
      guardianPhone: '0550123456',
    })
  })

  it('round-trips a student through toFormValues', () => {
    const student = makeStudent({})
    const back = toFormValues(student)
    expect(back.firstName).toBe('Amine')
    expect(back.email).toBe('')
  })

  it('provides sensible create defaults', () => {
    const defaults = getEmptyFormValues()
    expect(defaults.level).toBe('1AM')
    expect(defaults.classId).toBe('cl-1am-a')
    expect(defaults.status).toBe('active')
    expect(defaults.enrollmentDate).toBe(getTodayKey())
  })
})