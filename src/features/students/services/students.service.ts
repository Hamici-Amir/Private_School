import type { Student, StudentFormValues, StudentStatus } from '../types/students.types'
import { createStudentsMock } from '../mocks/students.mock'
import { toStudent } from '../utils/students.utils'

/**
 * In-memory mock service mirroring the future API surface:
 * getStudents / getStudent / createStudent / updateStudent /
 * deleteStudent / updateStudentStatus.
 */

let students: Student[] = createStudentsMock()

/** Test helper: restores the original mock dataset. */
export function resetStudentsMock(): void {
  students = createStudentsMock()
}

function clone(student: Student): Student {
  return { ...student }
}

export async function getStudents(): Promise<Student[]> {
  return students.map(clone)
}

export async function getStudent(id: string): Promise<Student | undefined> {
  const found = students.find((student) => student.id === id)
  return found ? clone(found) : undefined
}

export async function createStudent(values: StudentFormValues): Promise<Student> {
  const id = `s-${Date.now().toString(36)}`
  const student = toStudent(id, values)
  students = [student, ...students]
  return clone(student)
}

export async function updateStudent(
  id: string,
  values: StudentFormValues,
): Promise<Student> {
  const index = students.findIndex((student) => student.id === id)
  if (index === -1) {
    throw new Error(`Student not found: ${id}`)
  }
  const updated = toStudent(id, values)
  students[index] = updated
  return clone(updated)
}

export async function deleteStudent(id: string): Promise<void> {
  students = students.filter((student) => student.id !== id)
}

export async function updateStudentStatus(
  id: string,
  status: StudentStatus,
): Promise<Student> {
  const index = students.findIndex((student) => student.id === id)
  if (index === -1) {
    throw new Error(`Student not found: ${id}`)
  }
  students[index] = { ...students[index], status }
  return clone(students[index])
}
