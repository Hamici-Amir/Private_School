import { z } from 'zod'

export const enrollmentSchema = z.object({
  studentId: z.string().min(1, 'required'), parentId: z.string(), academicYear: z.string().min(1, 'required'), levelId: z.string().min(1, 'required'), classId: z.string().min(1, 'required'), enrollmentDate: z.string().min(1, 'required'), registrationType: z.enum(['new', 'returning', 'transfer']), status: z.enum(['active', 'pending', 'cancelled', 'completed', 'inactive']), notes: z.string().max(1000, 'notesTooLong').optional(),
})
