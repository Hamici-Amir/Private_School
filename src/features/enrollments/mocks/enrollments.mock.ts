import { getClasses } from '@/features/classes/services/classes.service'
import { getParents } from '@/features/parents/services/parents.service'
import { getStudents } from '@/features/students/services/students.service'
import type { Enrollment } from '../types/enrollments.types'

export async function createEnrollmentsMock(): Promise<Enrollment[]> {
  const [students, parents, classes] = await Promise.all([getStudents(), getParents(), getClasses()])
  const parentByStudent = new Map(parents.flatMap((parent) => parent.childrenIds.map((id) => [id, parent] as const)))
  const classById = new Map(classes.map((schoolClass) => [schoolClass.id, schoolClass]))
  const now = '2026-08-21T09:00:00.000Z'
  const current = students.map((student, index): Enrollment => {
    const parent = parentByStudent.get(student.id)
    const schoolClass = classById.get(student.classId)
    return {
      id: `en-${String(index + 1).padStart(3, '0')}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      parentId: parent?.id ?? '',
      parentName: parent ? `${parent.firstName} ${parent.lastName}` : '',
      academicYear: '2026-2027',
      levelId: student.level,
      levelName: student.level,
      classId: student.classId,
      className: schoolClass?.label ?? student.classId,
      enrollmentDate: '2026-09-01',
      status: index % 17 === 0 ? 'pending' : index % 19 === 0 ? 'inactive' : 'active',
      registrationType: index % 9 === 0 ? 'new' : 'returning',
      notes: index % 8 === 0 ? 'Administrative registration review.' : '',
      createdAt: now,
      updatedAt: now,
    }
  })
  const history = students.slice(0, 12).map((student, index): Enrollment => {
    const parent = parentByStudent.get(student.id)
    const schoolClass = classById.get(student.classId)
    return {
      id: `en-h${String(index + 1).padStart(3, '0')}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      parentId: parent?.id ?? '',
      parentName: parent ? `${parent.firstName} ${parent.lastName}` : '',
      academicYear: '2025-2026',
      levelId: student.level,
      levelName: student.level,
      classId: student.classId,
      className: schoolClass?.label ?? student.classId,
      enrollmentDate: '2025-09-08',
      status: index % 4 === 0 ? 'cancelled' : 'completed',
      registrationType: 'returning',
      notes: '',
      createdAt: '2025-09-01T09:00:00.000Z',
      updatedAt: '2025-09-01T09:00:00.000Z',
    }
  })
  return [...current, ...history]
}
