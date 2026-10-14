import { describe, expect, it } from 'vitest'
import { filterSubjects, getSubjectStats, paginateSubjects, sortSubjects } from './subjects.utils'
import type { Subject } from '../types/subjects.types'

const subjects: Subject[] = [
  { id: 'a', code: 'MAT', name: 'Mathematics', nameFr: 'Mathématiques', nameAr: 'الرياضيات', description: '', levels: ['1AP', '2AP'], teacherIds: ['t-1'], status: 'active', createdAt: '', updatedAt: '' },
  { id: 'b', code: 'ART', name: 'Arts', nameFr: 'Arts', nameAr: 'الفنون', description: '', levels: ['1AM'], teacherIds: [], status: 'inactive', createdAt: '', updatedAt: '' },
]

describe('subject utilities', () => {
  it('filters by translated name, level, and status', () => {
    expect(filterSubjects(subjects, 'رياضيات', { level: 'all', status: 'all' })).toHaveLength(1)
    expect(filterSubjects(subjects, '', { level: '1AM', status: 'active' })).toHaveLength(0)
  })
  it('sorts and paginates subject collections', () => {
    expect(sortSubjects(subjects, 'nameDesc').map((subject) => subject.id)).toEqual(['a', 'b'])
    expect(paginateSubjects(subjects, 2, 1)).toEqual([subjects[1]])
  })
  it('derives summary counts', () => {
    expect(getSubjectStats(subjects)).toEqual({ total: 2, active: 1, inactive: 1, assigned: 1 })
  })
})
