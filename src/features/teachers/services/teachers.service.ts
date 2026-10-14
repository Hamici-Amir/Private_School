import type { Teacher, TeacherFormValues } from '../types/teachers.types'
import { createTeachersMock } from '../mocks/teachers.mock'
import { toTeacher } from '../utils/teachers.utils'

/**
 * In-memory mock service mirroring the future API surface:
 * getTeachers / getTeacher / createTeacher / updateTeacher / deleteTeacher.
 */

let teachers: Teacher[] = createTeachersMock()

/** Test helper: restores the original mock dataset. */
export function resetTeachersMock(): void {
  teachers = createTeachersMock()
}

function clone(teacher: Teacher): Teacher {
  return { ...teacher, classIds: [...teacher.classIds] }
}

function nextNumber(): string {
  return `T-${String(teachers.length + 1).padStart(3, '0')}`
}

export async function getTeachers(): Promise<Teacher[]> {
  return teachers.map(clone)
}

export async function getTeacher(id: string): Promise<Teacher | undefined> {
  const found = teachers.find((teacher) => teacher.id === id)
  return found ? clone(found) : undefined
}

export async function createTeacher(values: TeacherFormValues): Promise<Teacher> {
  const id = `t-${Date.now().toString(36)}`
  const teacher = toTeacher(id, nextNumber(), values)
  teachers = [teacher, ...teachers]
  return clone(teacher)
}

export async function updateTeacher(
  id: string,
  values: TeacherFormValues,
): Promise<Teacher> {
  const index = teachers.findIndex((teacher) => teacher.id === id)
  if (index === -1) {
    throw new Error(`Teacher not found: ${id}`)
  }
  const updated = toTeacher(id, teachers[index].teacherNumber, values)
  updated.classIds = [...teachers[index].classIds]
  teachers[index] = updated
  return clone(updated)
}

export async function deleteTeacher(id: string): Promise<void> {
  teachers = teachers.filter((teacher) => teacher.id !== id)
}