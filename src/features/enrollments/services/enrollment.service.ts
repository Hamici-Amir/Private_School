import { getClasses } from '@/features/classes/services/classes.service'
import { getParents } from '@/features/parents/services/parents.service'
import { getStudents } from '@/features/students/services/students.service'
import { createEnrollmentsMock } from '../mocks/enrollments.mock'
import type { Enrollment, EnrollmentFormValues, ClassCapacity } from '../types/enrollments.types'

let enrollments: Enrollment[] | null = null
let sequence = 200

async function data(): Promise<Enrollment[]> {
  if (!enrollments) enrollments = await createEnrollmentsMock()
  return enrollments
}
function copy(item: Enrollment): Enrollment { return { ...item } }
async function resolve(values: EnrollmentFormValues, id?: string): Promise<Enrollment> {
  const [students, parents, classes] = await Promise.all([getStudents(), getParents(), getClasses()])
  const student = students.find((item) => item.id === values.studentId)
  const schoolClass = classes.find((item) => item.id === values.classId)
  const parent = parents.find((item) => item.id === values.parentId)
  if (!student) throw new Error('invalid-student')
  if (!schoolClass || schoolClass.level !== values.levelId) throw new Error('invalid-class')
  if (values.parentId && (!parent || !parent.childrenIds.includes(student.id))) throw new Error('invalid-parent')
  return {
    id: id ?? `en-${sequence++}`, studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    parentId: parent?.id ?? '', parentName: parent ? `${parent.firstName} ${parent.lastName}` : '',
    academicYear: values.academicYear, levelId: values.levelId, levelName: values.levelId,
    classId: schoolClass.id, className: schoolClass.label, enrollmentDate: values.enrollmentDate,
    status: values.status, registrationType: values.registrationType, notes: values.notes ?? '',
    createdAt: id ? (enrollments?.find((item) => item.id === id)?.createdAt ?? new Date().toISOString()) : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
export async function resetEnrollmentsMock(): Promise<void> { enrollments = await createEnrollmentsMock(); sequence = 200 }
export async function getEnrollments(): Promise<Enrollment[]> { return (await data()).map(copy) }
export async function getEnrollmentById(id: string): Promise<Enrollment | undefined> { return (await data()).find((item) => item.id === id) }
export async function getClassCapacity(classId: string, academicYear: string, excludingId?: string): Promise<ClassCapacity | undefined> {
  const classes = await getClasses(); const schoolClass = classes.find((item) => item.id === classId); if (!schoolClass) return undefined
  const currentStudents = (await data()).filter((item) => item.classId === classId && item.academicYear === academicYear && item.status === 'active' && item.id !== excludingId).length
  return { classId, className: schoolClass.label, capacity: schoolClass.capacity, currentStudents, availableSeats: Math.max(0, schoolClass.capacity - currentStudents), isFull: currentStudents >= schoolClass.capacity }
}
export async function createEnrollment(values: EnrollmentFormValues): Promise<Enrollment> {
  const current = await data()
  if (current.some((item) => item.studentId === values.studentId && item.academicYear === values.academicYear && item.status === 'active')) throw new Error('duplicate')
  if (values.status === 'active') { const capacity = await getClassCapacity(values.classId, values.academicYear); if (capacity?.isFull) throw new Error('class-full') }
  const created = await resolve(values); enrollments = [created, ...current]; return copy(created)
}
export async function updateEnrollment(id: string, values: EnrollmentFormValues): Promise<Enrollment> {
  const current = await data(); const old = current.find((item) => item.id === id); if (!old) throw new Error('not-found')
  if (values.status === 'active' && current.some((item) => item.id !== id && item.studentId === values.studentId && item.academicYear === values.academicYear && item.status === 'active')) throw new Error('duplicate')
  if (values.status === 'active') { const capacity = await getClassCapacity(values.classId, values.academicYear, id); if (capacity?.isFull) throw new Error('class-full') }
  const updated = await resolve(values, id); enrollments = current.map((item) => item.id === id ? updated : item); return copy(updated)
}
export async function deleteEnrollment(id: string): Promise<void> { enrollments = (await data()).filter((item) => item.id !== id) }
export async function cancelEnrollment(id: string): Promise<Enrollment> { const item = (await data()).find((entry) => entry.id === id); if (!item) throw new Error('not-found'); item.status = 'cancelled'; item.updatedAt = new Date().toISOString(); return copy(item) }
export async function changeEnrollmentClass(id: string, classId: string): Promise<Enrollment> { const item = (await data()).find((entry) => entry.id === id); if (!item) throw new Error('not-found'); const capacity = await getClassCapacity(classId, item.academicYear, id); if (!capacity || capacity.isFull) throw new Error('class-full'); const classes = await getClasses(); const schoolClass = classes.find((entry) => entry.id === classId); if (!schoolClass || schoolClass.level !== item.levelId) throw new Error('invalid-class'); item.classId = classId; item.className = schoolClass.label; item.updatedAt = new Date().toISOString(); return copy(item) }
