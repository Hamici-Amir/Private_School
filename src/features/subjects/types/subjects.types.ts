import type { EducationLevel } from '@/features/students/types/students.types'

export type SubjectStatus = 'active' | 'inactive'
export interface Subject {
  id: string
  code: string
  name: string
  nameFr: string
  nameAr: string
  description: string
  levels: EducationLevel[]
  teacherIds: string[]
  status: SubjectStatus
  createdAt: string
  updatedAt: string
}
export interface SubjectFormValues {
  code: string
  name: string
  nameFr: string
  nameAr: string
  description: string
  levels: EducationLevel[]
  teacherIds: string[]
  status: SubjectStatus
}
export interface SubjectFilters { level: EducationLevel | 'all'; status: SubjectStatus | 'all' }
export type SubjectSortKey = 'nameAsc' | 'nameDesc' | 'codeAsc' | 'codeDesc' | 'levelsDesc' | 'teachersDesc' | 'status'
