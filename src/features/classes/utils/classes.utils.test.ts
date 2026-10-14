import { describe, expect, it } from 'vitest'

import type { Student } from '@/features/students/types/students.types'
import type { Teacher } from '@/features/teachers/types/teachers.types'

import type { SchoolClass } from '../types/classes.types'
import {
  buildClassCounts,
  educationStage,
  filterClasses,
  getClassInitials,
  getClassesStats,
  getEmptyFormValues,
  paginateClasses,
  resolveClassStudents,
  resolveClassTeachers,
  sortClasses,
  toClass,
  toFormValues,
} from './classes.utils'

function makeClass(overrides: Partial<SchoolClass> = {}): SchoolClass {
  return {
    id: 'cl-1',
    label: '1AM B',
    level: '1AM',
    room: '202',
    capacity: 32,
    status: 'active',
    createdAt: '1999-09-01',
    ...overrides,
  }
}

function makeStudent(id: string, classId: string): Student {
  return {
    id,
    firstName: 'Osman',
    lastName: 'Benali',
    birthDate: '2016-01-01',
    gender: 'male',
    guardianName: 'Kamel',
    guardianPhone: '0550123456',
    level: '1AM',
    classId,
    status: 'active',
    enrollmentDate: '2024-09-01',
  }
}

function makeTeacher(id: string, classIds: string[]): Teacher {
  return {
    id,
    teacherNumber: 'T-01',
    firstName: 'Salima',
    lastName: 'Ferhat',
    gender: 'female',
    birthDate: '1985-01-01',
    phone: '0550123456',
    specialty: 'math',
    qualification: 'master',
    hireDate: '2015-09-01',
    classIds,
    status: 'active',
    createdAt: '1999-09-01',
  }
}

describe('getClassInitials', () => {
  it('returns the first two characters of the label', () => {
    expect(getClassInitials('1AM C')).toBe('1A')
  })

  it('ignores spaces in short labels', () => {
    expect(getClassInitials('5 AP')).toBe('5A')
  })
})

describe('educationStage', () => {
  it('maps AP to primary', () => {
    expect(educationStage('5AP')).toBe('primary')
  })

  it('maps AM to middle', () => {
    expect(educationStage('1AM')).toBe('middle')
  })

  it('maps AS to secondary', () => {
    expect(educationStage('3AS')).toBe('secondary')
  })
})

describe('getClassesStats', () => {
  it('counts classes by stage', () => {
    const classes = [
      makeClass({ id: 'a', level: '1AP' }),
      makeClass({ id: 'b', level: '4AM' }),
      makeClass({ id: 'c', level: '2AS' }),
      makeClass({ id: 'd', level: '5AP' }),
    ]
    expect(getClassesStats(classes)).toEqual({
      total: 4,
      primary: 2,
      middle: 1,
      secondary: 1,
    })
  })
})

describe('resolveClassStudents and resolveClassTeachers', () => {
  it('filters students by classId', () => {
    const students = [
      makeStudent('s-1', 'cl-1'),
      makeStudent('s-2', 'cl-2'),
      makeStudent('s-3', 'cl-1'),
    ]
    expect(resolveClassStudents('cl-1', students)).toHaveLength(2)
  })

  it('filters teachers by classIds membership', () => {
    const teachers = [makeTeacher('t-1', ['cl-1']), makeTeacher('t-2', ['cl-2'])]
    expect(resolveClassTeachers('cl-1', teachers).map((teacher) => teacher.id)).toEqual(['t-1'])
  })
})

describe('buildClassCounts', () => {
  it('counts students and teachers per class', () => {
    const classes = [makeClass({ id: 'cl-1' }), makeClass({ id: 'cl-2' })]
    const students = [
      makeStudent('s-1', 'cl-1'),
      makeStudent('s-2', 'cl-2'),
      makeStudent('s-3', 'cl-1'),
    ]
    const teachers = [makeTeacher('t-1', ['cl-1']), makeTeacher('t-2', ['cl-2'])]
    expect(buildClassCounts(classes, students, teachers)).toEqual({
      'cl-1': { students: 2, teachers: 1 },
      'cl-2': { students: 1, teachers: 1 },
    })
  })
})

describe('filterClasses', () => {
  const classes = [
    makeClass({ id: 'a', label: '1AM C', room: '201', level: '1AM', status: 'active' }),
    makeClass({ id: 'b', label: '2AS B', room: '304', level: '2AS', status: 'inactive' }),
    makeClass({ id: 'c', label: '5AP A', room: '105', level: '5AP', status: 'active' }),
  ]

  it('matches label, room and level case-insensitively', () => {
    expect(filterClasses(classes, '2as', { level: 'all', status: 'all' }).map((c) => c.id)).toEqual(
      ['b'],
    )
    expect(filterClasses(classes, '304', { level: 'all', status: 'all' }).map((c) => c.id)).toEqual(
      ['b'],
    )
    expect(filterClasses(classes, '1aM', { level: 'all', status: 'all' }).map((c) => c.id)).toEqual(
      ['a'],
    )
  })

  it('filters by level and status', () => {
    expect(filterClasses(classes, '', { level: '5AP', status: 'active' }).map((c) => c.id)).toEqual(
      ['c'],
    )
    expect(
      filterClasses(classes, '', { level: 'all', status: 'inactive' }).map((c) => c.id),
    ).toEqual(['b'])
  })
})

describe('sortClasses', () => {
  const classes = [
    makeClass({ id: 'a', label: '1AM C', level: '1AM', capacity: 30 }),
    makeClass({ id: 'b', label: '2AS B', level: '2AS', capacity: 32 }),
    makeClass({ id: 'c', label: '5AP A', level: '5AP', capacity: 35 }),
  ]
  const counts = {
    a: { students: 2, teachers: 1 },
    b: { students: 3, teachers: 0 },
    c: { students: 1, teachers: 4 },
  }

  it('sorts by label ascending and descending', () => {
    expect(sortClasses(classes, 'labelAsc', counts).map((c) => c.id)).toEqual(['a', 'b', 'c'])
    expect(sortClasses(classes, 'labelDesc', counts).map((c) => c.id)).toEqual(['c', 'b', 'a'])
  })

  it('sorts by level following the official level order', () => {
    expect(sortClasses(classes, 'levelAsc', counts).map((c) => c.id)).toEqual(['c', 'a', 'b'])
  })

  it('sorts by capacity ascending and descending', () => {
    expect(sortClasses(classes, 'capacityAsc', counts).map((c) => c.id)).toEqual(['a', 'b', 'c'])
    expect(sortClasses(classes, 'capacityDesc', counts).map((c) => c.id)).toEqual(['c', 'b', 'a'])
  })

  it('sorts by enrolled students count', () => {
    expect(sortClasses(classes, 'enrolledAsc', counts).map((c) => c.id)).toEqual(['c', 'a', 'b'])
    expect(sortClasses(classes, 'enrolledDesc', counts).map((c) => c.id)).toEqual(['b', 'a', 'c'])
  })

  it('sorts by assigned teachers count', () => {
    expect(sortClasses(classes, 'teachersAsc', counts).map((c) => c.id)).toEqual(['b', 'a', 'c'])
    expect(sortClasses(classes, 'teachersDesc', counts).map((c) => c.id)).toEqual(['c', 'a', 'b'])
  })
})

describe('paginateClasses', () => {
  it('slices the list by page', () => {
    expect(paginateClasses([1, 2, 3, 4, 5], 1, 2)).toEqual([1, 2])
    expect(paginateClasses([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4])
    expect(paginateClasses([1, 2, 3, 4, 5], 3, 2)).toEqual([5])
  })
})

describe('toClass', () => {
  it('trims text fields and normalizes the head teacher', () => {
    const schoolClass = toClass('cl-100', {
      label: ' 4AM B ',
      level: '4AM',
      room: ' 207 ',
      capacity: 32,
      headTeacherId: 'none',
      status: 'active',
    })
    expect(schoolClass.label).toBe('4AM B')
    expect(schoolClass.room).toBe('207')
    expect(schoolClass.headTeacherId).toBeUndefined()
    expect(schoolClass.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('keeps a real head teacher id', () => {
    const schoolClass = toClass('cl-100', {
      label: '4AM B',
      level: '4AM',
      room: '207',
      capacity: 32,
      headTeacherId: 't-001',
      status: 'active',
    })
    expect(schoolClass.headTeacherId).toBe('t-001')
  })
})

describe('toFormValues', () => {
  it('round-trips a class without a head teacher', () => {
    const values = toFormValues(makeClass({ id: 'cl-1' }))
    expect(values.headTeacherId).toBe('none')
    expect(values.label).toBe('1AM B')
  })
})

describe('getEmptyFormValues', () => {
  it('returns sensible defaults', () => {
    expect(getEmptyFormValues()).toEqual({
      label: '',
      level: '1AP',
      room: '',
      capacity: 30,
      headTeacherId: 'none',
      status: 'active',
    })
  })
})
