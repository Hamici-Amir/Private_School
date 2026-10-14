import { z } from 'zod'

/** Validated login input (kept permissive until authentication ships). */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type LoginFormValues = z.infer<typeof loginSchema>

/** Generic metadata descriptor for module-level schemas (future use). */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().default(20),
})

export type PaginationValues = z.infer<typeof paginationSchema>
