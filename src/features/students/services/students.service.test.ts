import { beforeEach, describe, expect, it } from 'vitest'

import type { StudentFormValues } from '../types/students.types'
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
  resetStudentsMock,
  updateStudent,
  updateStudentStatus,
} from './students.service'

const VALUES: StudentFormValues = {
  firstName: 'Yacine',
  lastName: 'Ziani',
  birthDate: '2014-05-05',
  gender: 'male',
  address: '',
  email: '',
  guardianName: 'Ali Ziani',
  guardianPhone: '0660 22 33 44',
  level: '1AM',
  classId: 'cl-1am-b',
  status: 'active',
  enrollmentDate: '2025-09-08',
}

beforeEach(() => {
  resetStudentsMock()
})

describe('students.service', () => {
  it('returns the full seeded list', async () => {
    const students = await getStudents()
    expect(students).toHaveLength(36)
    expect(students.map((student) => student.id)).toContain('s-001')
  })

  it('finds a student by id and returns undefined for unknown ids', async () => {
    const student = await getStudent('s-001')
    expect(student?.firstName).toBe('Amine')
    expect(await getStudent('s-unknown')).toBeUndefined()
  })

  it('returns copies, not internal references', async () => {
    const [student] = await getStudents()
    student.firstName = 'Hacked'
    const fresh = await getStudent(student.id)
    expect(fresh?.firstName).toBe('Amine')
  })

  it('creates a student and prepends it to the list', async () => {
    const created = await createStudent(VALUES)
    expect(created.id).toBeTruthy()
    expect(created.firstName).toBe('Yacine')

    const students = await getStudents()
    expect(students[0].id).toBe(created.id)
    expect(students).toHaveLength(37)
  })

  it('updates a student and throws for unknown ids', async () => {
    const updated = await updateStudent('s-001', { ...VALUES, firstName: 'Karim' })
    expect(updated.firstName).toBe('Karim')
    expect((await getStudent('s-001'))?.firstName).toBe('Karim')

    await expect(updateStudent('s-nope', VALUES)).rejects.toThrow('Student not found')
  })

  it('deletes a student and is idempotent for unknown ids', async () => {
    await deleteStudent('s-001')
    expect(await getStudent('s-001')).toBeUndefined()

    await expect(deleteStudent('s-already-gone')).resolves.toBeUndefined()
    const students = await getStudents()
    expect(students).toHaveLength(35)
  })

  it('updates the status of a student', async () => {
    const updated = await updateStudentStatus('s-002', 'inactive')
    expect(updated.status).toBe('inactive')
    expect((await getStudent('s-002'))?.status).toBe('inactive')

    await expect(updateStudentStatus('s-nope', 'active')).rejects.toThrow('Student not found')
  })
})