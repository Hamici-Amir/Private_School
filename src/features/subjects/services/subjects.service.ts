import type { Subject, SubjectFormValues } from '../types/subjects.types'
import { createSubjectsMock } from '../mocks/subjects.mock'

let subjects = createSubjectsMock()
let sequence = 100
function clone(subject: Subject): Subject { return { ...subject, levels: [...subject.levels], teacherIds: [...subject.teacherIds] } }
export function resetSubjectsMock(): void { subjects = createSubjectsMock(); sequence = 100 }
export async function getSubjects(): Promise<Subject[]> { return subjects.map(clone) }
export async function getSubject(id: string): Promise<Subject | undefined> { const subject = subjects.find((item) => item.id === id); return subject ? clone(subject) : undefined }
export async function createSubject(values: SubjectFormValues): Promise<Subject> { if (subjects.some((item) => item.code.toLowerCase() === values.code.toLowerCase())) throw new Error('duplicate-code'); const now = new Date().toISOString(); const subject: Subject = { ...values, id: `sub-${sequence++}`, createdAt: now, updatedAt: now }; subjects = [subject, ...subjects]; return clone(subject) }
export async function updateSubject(id: string, values: SubjectFormValues): Promise<Subject> { const index = subjects.findIndex((item) => item.id === id); if (index < 0) throw new Error('not-found'); if (subjects.some((item) => item.id !== id && item.code.toLowerCase() === values.code.toLowerCase())) throw new Error('duplicate-code'); const updated = { ...subjects[index], ...values, updatedAt: new Date().toISOString() }; subjects[index] = updated; return clone(updated) }
export async function deleteSubject(id: string): Promise<void> { subjects = subjects.filter((item) => item.id !== id) }
