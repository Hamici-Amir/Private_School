import { beforeEach, describe, expect, it } from 'vitest'

import type { TeacherFormValues } from '../types/teachers.types'
import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  getTeachers,
  resetTeachersMock,
  updateTeacher,
} from './teachers.service'

const VALUES: TeacherFormValues = {
  firstName: 'Amina',
  lastName: 'Ziani',
  firstNameAr: 'أمينة',
  lastNameAr: 'زياني',
  gender: 'female',
  birthDate: '1990-03-15',
  phone: '0660 22 33 44',
  email: '',
  address: 'Cité AADL, Alger',
  city: 'Alger',
  specialty: 'english',
  qualification: 'master',
  hireDate: '2024-09-05',
  notes: '',
  status: 'active',
}

beforeEach(() => {
  resetTeachersMock()
})

describe('teachers.service', () => {
  it('returns the full seeded list', async () => {
    const teachers = await getTeachers()
    expect(teachers).toHaveLength(23)
    expect(teachers.map((teacher) => teacher.id)).toContain('t-001')
  })

  it('finds a teacher by id and returns undefined for unknown ids', async () => {
    const teacher = await getTeacher('t-001')
    expect(teacher?.firstName).toBe('Hassan')
    expect(teacher?.classIds).toContain('cl-1am-a')
    expect(await getTeacher('t-unknown')).toBeUndefined()
  })

  it('returns copies, not internal references', async () => {
    const [teacher] = await getTeachers()
    teacher.firstName = 'Hacked'
    teacher.classIds.push('cl-999')
    const fresh = await getTeacher(teacher.id)
    expect(fresh?.firstName).toBe('Hassan')
    expect(fresh?.classIds).not.toContain('cl-999')
  })

  it('creates a teacher, assigns a sequential number and prepends it', async () => {
    const created = await createTeacher(VALUES)
    expect(created.id).toBeTruthy()
    expect(created.firstName).toBe('Amina')
    expect(created.teacherNumber).toBe('T-024')
    expect(created.classIds).toEqual([])

    const teachers = await getTeachers()
    expect(teachers[0].id).toBe(created.id)
    expect(teachers).toHaveLength(24)
  })

  it('updates a teacher, preserves assigned classes and throws for unknown ids', async () => {
    const updated = await updateTeacher('t-001', { ...VALUES, firstName: 'Karim' })
    expect(updated.firstName).toBe('Karim')
    expect((await getTeacher('t-001'))?.firstName).toBe('Karim')
    expect((await getTeacher('t-001'))?.classIds).toContain('cl-1am-a')

    await expect(updateTeacher('t-nope', VALUES)).rejects.toThrow('Teacher not found')
  })

  it('deletes a teacher and is idempotent for unknown ids', async () => {
    await deleteTeacher('t-001')
    expect(await getTeacher('t-001')).toBeUndefined()

    await expect(deleteTeacher('t-already-gone')).resolves.toBeUndefined()
    const teachers = await getTeachers()
    expect(teachers).toHaveLength(22)
  })
})