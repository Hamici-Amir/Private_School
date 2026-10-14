import { describe, expect, it } from 'vitest'

import type { Teacher, TeacherFormValues } from '../types/teachers.types'
import {
  countClassStages,
  filterTeachers,
  formatTeacherPhone,
  getEmptyFormValues,
  getTeacherFullName,
  getTeacherInitials,
  getTeachersStats,
  paginateTeachers,
  resolveTeacherClasses,
  sortTeachers,
  toFormValues,
  toTeacher,
} from './teachers.utils'

function makeTeacher(overrides: Partial<Teacher> = {}): Teacher {
  return {
    id: 't-x',
    teacherNumber: 'T-001',
    firstName: 'Hassan',
    lastName: 'Meddour',
    gender: 'male',
    birthDate: '1980-04-12',
    phone: '0550123456',
    specialty: 'math',
    qualification: 'master',
    hireDate: '2015-09-01',
    classIds: ['cl-1am-a'],
    status: 'active',
    createdAt: '1999-09-01',
    ...overrides,
  }
}

describe('teacher display helpers', () => {
  it('builds the full name', () => {
    expect(getTeacherFullName({ firstName: 'Hassan', lastName: 'Meddour' })).toBe(
      'Hassan Meddour',
    )
  })

  it('builds initials', () => {
    expect(getTeacherInitials({ firstName: 'Hassan', lastName: 'Meddour' })).toBe('HM')
  })

  it('formats a 10-digit phone number', () => {
    expect(formatTeacherPhone('0550123456')).toBe('0550 12 34 56')
    expect(formatTeacherPhone('already')).toBe('already')
  })
})

describe('getTeachersStats', () => {
  it('derives headline counters', () => {
    const stats = getTeachersStats([
      makeTeacher({ id: 't-1', status: 'active' }),
      makeTeacher({ id: 't-2', status: 'active', createdAt: '2999-01-01' }),
      makeTeacher({ id: 't-3', status: 'onleave' }),
      makeTeacher({ id: 't-4', status: 'inactive' }),
    ])
    expect(stats.total).toBe(4)
    expect(stats.active).toBe(2)
    expect(stats.onLeave).toBe(1)
    // t-2 is always "new" (createdAt far future), the rest are not.
    expect(stats.new).toBe(1)
  })
})

describe('filterTeachers', () => {
  it('filters by search across name, number, specialty and city', () => {
    const teachers = [
      makeTeacher({ id: 't-1', firstName: 'Rachid', lastName: 'Kacem', city: 'Alger' }),
      makeTeacher({ id: 't-2', teacherNumber: 'T-002', firstName: 'Karim', specialty: 'french' }),
    ]
    const base = {
      specialty: 'all' as const,
      status: 'all' as const,
      city: 'all' as const,
      qualification: 'all' as const,
    }
    expect(filterTeachers(teachers, 'razhid', base)).toHaveLength(0)
    expect(filterTeachers(teachers, 'Rachid', base)).toHaveLength(1)
    expect(filterTeachers(teachers, 'french', base)).toHaveLength(1)
    expect(filterTeachers(teachers, 'T-002', base)).toHaveLength(1)
  })

  it('filters by specialty, status, city and qualification', () => {
    const teachers = [
      makeTeacher({
        id: 't-1',
        specialty: 'arabic',
        status: 'inactive',
        city: 'Alger',
        qualification: 'phd',
      }),
      makeTeacher({
        id: 't-2',
        specialty: 'math',
        status: 'active',
        city: 'Kouba',
        qualification: 'master',
      }),
    ]
    const base = {
      specialty: 'all' as const,
      status: 'all' as const,
      city: 'all' as const,
      qualification: 'all' as const,
    }

    expect(filterTeachers(teachers, '', { ...base, specialty: 'arabic' })).toHaveLength(1)
    expect(filterTeachers(teachers, '', { ...base, status: 'active' })).toHaveLength(1)
    expect(filterTeachers(teachers, '', { ...base, city: 'Kouba' })).toHaveLength(1)
    expect(filterTeachers(teachers, '', { ...base, qualification: 'phd' })).toHaveLength(1)
  })
})

describe('sortTeachers', () => {
  it('sorts by name ascending and descending', () => {
    const teachers = [
      makeTeacher({ id: 't-1', firstName: 'Karim', lastName: 'Belkacem' }),
      makeTeacher({ id: 't-2', firstName: 'Rachid', lastName: 'Kacem' }),
    ]
    expect(sortTeachers(teachers, 'nameAsc')[0].id).toBe('t-1')
    expect(sortTeachers(teachers, 'nameDesc')[0].id).toBe('t-2')
  })

  it('sorts by number, hire date, classes count and status', () => {
    const teachers = [
      makeTeacher({
        id: 't-3',
        teacherNumber: 'T-003',
        hireDate: '2020-09-07',
        classIds: ['cl-1am-a'],
      }),
      makeTeacher({
        id: 't-1',
        teacherNumber: 'T-001',
        hireDate: '2024-09-05',
        classIds: ['cl-1am-a', 'cl-1am-b'],
      }),
    ]
    expect(sortTeachers(teachers, 'numberAsc')[0].id).toBe('t-1')
    expect(sortTeachers(teachers, 'numberDesc')[0].id).toBe('t-3')
    expect(sortTeachers(teachers, 'hireNewest')[0].id).toBe('t-1')
    expect(sortTeachers(teachers, 'hireOldest')[0].id).toBe('t-3')
    expect(sortTeachers(teachers, 'classesDesc')[0].id).toBe('t-1')
    expect(sortTeachers(teachers, 'classesAsc')[0].id).toBe('t-3')
  })
})

describe('paginateTeachers', () => {
  it('slices the sorted list per page', () => {
    const items = [1, 2, 3, 4, 5]
    expect(paginateTeachers(items, 1, 2)).toEqual([1, 2])
    expect(paginateTeachers(items, 3, 2)).toEqual([5])
  })
})

describe('resolveTeacherClasses / countClassStages', () => {
  it('maps class ids to class records and drops unknowns', () => {
    const classes = resolveTeacherClasses(['cl-1am-a', 'cl-999'])
    expect(classes).toHaveLength(1)
    expect(classes[0].label).toBe('1AM A')
  })

  it('counts classes per education stage', () => {
    expect(
      countClassStages(['cl-1ap-a', 'cl-5ap-a', 'cl-1am-b', 'cl-2as-a', 'cl-999']),
    ).toEqual({ primary: 2, middle: 1, secondary: 1 })
  })
})

describe('toTeacher / toFormValues / getEmptyFormValues', () => {
  const VALUES: TeacherFormValues = {
    firstName: ' Hassan ',
    lastName: 'Meddour',
    firstNameAr: ' حسان ',
    lastNameAr: '',
    gender: 'male',
    birthDate: '1980-04-12',
    phone: '0550-12-34-56',
    email: '',
    address: ' Alger ',
    city: 'Alger',
    specialty: 'math',
    qualification: 'master',
    hireDate: '2015-09-01',
    notes: '',
    status: 'active',
  }

  it('normalizes raw values into a teacher', () => {
    const teacher = toTeacher('t-new', 'T-100', VALUES)
    expect(teacher.firstName).toBe('Hassan')
    expect(teacher.firstNameAr).toBe('حسان')
    expect(teacher.lastNameAr).toBeUndefined()
    expect(teacher.phone).toBe('0550123456')
    expect(teacher.email).toBeUndefined()
    expect(teacher.address).toBe('Alger')
    expect(teacher.classIds).toEqual([])
    expect(teacher.hireDate).toBe('2015-09-01')
    expect(teacher.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('round-trips through the form values', () => {
    const teacher = toTeacher('t-new', 'T-100', VALUES)
    const values = toFormValues(teacher)
    expect(values.firstName).toBe('Hassan')
    expect(values.firstNameAr).toBe('حسان')
    expect(values.lastNameAr).toBe('')
    expect(values.phone).toBe('0550123456')
    expect(values.specialty).toBe('math')
  })

  it('provides sensible defaults for a new teacher', () => {
    const values = getEmptyFormValues()
    expect(values.firstName).toBe('')
    expect(values.specialty).toBe('math')
    expect(values.qualification).toBe('master')
    expect(values.status).toBe('active')
    expect(values.gender).toBe('male')
  })
})