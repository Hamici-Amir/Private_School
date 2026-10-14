import { describe, expect, it } from 'vitest'

import type { Student } from '@/features/students/types/students.types'

import type { Parent, ParentFormValues } from '../types/parents.types'
import {
  filterParents,
  formatParentPhone,
  getEmptyFormValues,
  getParentFullName,
  getParentInitials,
  getParentsStats,
  paginateParents,
  resolveParentChildren,
  sortParents,
  toFormValues,
  toParent,
} from './parents.utils'

function makeParent(overrides: Partial<Parent> = {}): Parent {
  return {
    id: 'p-x',
    parentNumber: 'P-001',
    firstName: 'Mohamed',
    lastName: 'Benali',
    gender: 'male',
    relationship: 'father',
    phone: '0550123456',
    childrenIds: ['s-001'],
    status: 'active',
    createdAt: '1999-09-01',
    ...overrides,
  }
}

const STUDENTS: Student[] = [
  {
    id: 's-001',
    firstName: 'Amine',
    lastName: 'Benali',
    birthDate: '2019-03-14',
    gender: 'male',
    guardianName: 'Mohamed Benali',
    guardianPhone: '0550123456',
    level: '1AP',
    classId: 'cl-1ap-a',
    status: 'active',
    enrollmentDate: '2025-09-08',
  },
  {
    id: 's-002',
    firstName: 'Yasmine',
    lastName: 'Belkacem',
    birthDate: '2019-07-22',
    gender: 'female',
    guardianName: 'Karim Belkacem',
    guardianPhone: '0661234567',
    level: '1AP',
    classId: 'cl-1ap-a',
    status: 'active',
    enrollmentDate: '2025-09-08',
  },
]

describe('parent display helpers', () => {
  it('builds the full name', () => {
    expect(getParentFullName({ firstName: 'Mohamed', lastName: 'Benali' })).toBe('Mohamed Benali')
  })

  it('builds initials', () => {
    expect(getParentInitials({ firstName: 'Mohamed', lastName: 'Benali' })).toBe('MB')
  })

  it('formats a 10-digit phone number', () => {
    expect(formatParentPhone('0550123456')).toBe('0550 12 34 56')
    expect(formatParentPhone('already')).toBe('already')
  })
})

describe('getParentsStats', () => {
  it('derives headline counters', () => {
    const stats = getParentsStats([
      makeParent({ id: 'p-1', childrenIds: ['s-001'], status: 'active' }),
      makeParent({ id: 'p-2', childrenIds: ['s-002'], status: 'active', createdAt: '2999-01-01' }),
      makeParent({ id: 'p-3', childrenIds: ['s-003'], status: 'active' }),
      makeParent({ id: 'p-4', childrenIds: ['s-004', 's-005'], status: 'inactive' }),
    ])
    expect(stats.total).toBe(4)
    expect(stats.active).toBe(3)
    expect(stats.multipleChildren).toBe(1)
    // p-2 is always "new" (createdAt far future), the rest are not.
    expect(stats.new).toBe(1)
  })
})

describe('filterParents', () => {
  it('filters by search across name, number, city and occupation', () => {
    const parents = [
      makeParent({ id: 'p-1', firstName: 'Rachid', lastName: 'Kacem', city: 'Alger' }),
      makeParent({ id: 'p-2', parentNumber: 'P-002', firstName: 'Karim', lastName: 'Belkacem', occupation: 'Ingénieur' }),
    ]
    const base = { relationship: 'all' as const, status: 'all' as const, city: 'all' as const, children: 'all' as const }
    expect(filterParents(parents, 'razhid', base)).toHaveLength(0)
    expect(filterParents(parents, 'Rachid', base)).toHaveLength(1)
    expect(filterParents(parents, 'ingénieur', base)).toHaveLength(1)
    expect(filterParents(parents, 'P-002', base)).toHaveLength(1)
  })

  it('filters by relationship, status, city and child count', () => {
    const parents = [
      makeParent({ id: 'p-1', relationship: 'mother', status: 'inactive', city: 'Alger', childrenIds: ['s-001'] }),
      makeParent({ id: 'p-2', relationship: 'father', status: 'active', city: 'Kouba', childrenIds: ['s-001', 's-002'] }),
    ]
    const base = { relationship: 'all' as const, status: 'all' as const, city: 'all' as const, children: 'all' as const }

    expect(filterParents(parents, '', { ...base, relationship: 'mother' })).toHaveLength(1)
    expect(filterParents(parents, '', { ...base, status: 'active' })).toHaveLength(1)
    expect(filterParents(parents, '', { ...base, city: 'Kouba' })).toHaveLength(1)
    expect(filterParents(parents, '', { ...base, children: 'one' })).toHaveLength(1)
    expect(filterParents(parents, '', { ...base, children: 'multiple' })).toHaveLength(1)
  })
})

describe('sortParents', () => {
  it('sorts by name ascending and descending', () => {
    const parents = [
      makeParent({ id: 'p-1', firstName: 'Karim', lastName: 'Belkacem' }),
      makeParent({ id: 'p-2', firstName: 'Rachid', lastName: 'Kacem' }),
    ]
    expect(sortParents(parents, 'nameAsc')[0].id).toBe('p-1')
    expect(sortParents(parents, 'nameDesc')[0].id).toBe('p-2')
  })

  it('sorts by number, children count and creation date', () => {
    const parents = [
      makeParent({ id: 'p-3', parentNumber: 'P-003', childrenIds: ['s-001'], createdAt: '2020-09-07' }),
      makeParent({ id: 'p-1', parentNumber: 'P-001', childrenIds: ['s-001', 's-002'], createdAt: '2024-09-05' }),
    ]
    expect(sortParents(parents, 'numberAsc')[0].id).toBe('p-1')
    expect(sortParents(parents, 'numberDesc')[0].id).toBe('p-3')
    expect(sortParents(parents, 'childrenDesc')[0].id).toBe('p-1')
    expect(sortParents(parents, 'childrenAsc')[0].id).toBe('p-3')
    expect(sortParents(parents, 'createdNewest')[0].id).toBe('p-1')
    expect(sortParents(parents, 'createdOldest')[0].id).toBe('p-3')
  })
})

describe('paginateParents', () => {
  it('slices the sorted list per page', () => {
    const items = [1, 2, 3, 4, 5]
    expect(paginateParents(items, 1, 2)).toEqual([1, 2])
    expect(paginateParents(items, 3, 2)).toEqual([5])
  })
})

describe('resolveParentChildren', () => {
  it('maps child ids to student records and drops unknowns', () => {
    const children = resolveParentChildren(['s-001', 's-999'], STUDENTS)
    expect(children).toHaveLength(1)
    expect(children[0].firstName).toBe('Amine')
  })
})

describe('toParent / toFormValues / getEmptyFormValues', () => {
  const VALUES: ParentFormValues = {
    firstName: ' Mohamed ',
    lastName: 'Benali',
    firstNameAr: ' محمد ',
    lastNameAr: '',
    gender: 'male',
    relationship: 'father',
    phone: '0550-12-34-56',
    secondaryPhone: '',
    email: '',
    address: ' Alger ',
    city: 'Alger',
    occupation: '',
    nationality: 'Algérienne',
    notes: '',
    status: 'active',
  }

  it('normalizes raw values into a parent', () => {
    const parent = toParent('p-new', 'P-100', VALUES)
    expect(parent.firstName).toBe('Mohamed')
    expect(parent.firstNameAr).toBe('محمد')
    expect(parent.lastNameAr).toBeUndefined()
    expect(parent.phone).toBe('0550123456')
    expect(parent.secondaryPhone).toBeUndefined()
    expect(parent.email).toBeUndefined()
    expect(parent.address).toBe('Alger')
    expect(parent.childrenIds).toEqual([])
    expect(parent.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('round-trips through the form values', () => {
    const parent = toParent('p-new', 'P-100', VALUES)
    const values = toFormValues(parent)
    expect(values.firstName).toBe('Mohamed')
    expect(values.firstNameAr).toBe('محمد')
    expect(values.lastNameAr).toBe('')
    expect(values.secondaryPhone).toBe('')
    expect(values.phone).toBe('0550123456')
  })

  it('provides sensible defaults for a new parent', () => {
    const values = getEmptyFormValues()
    expect(values.firstName).toBe('')
    expect(values.relationship).toBe('father')
    expect(values.status).toBe('active')
    expect(values.nationality).toBe('Algérienne')
  })
})