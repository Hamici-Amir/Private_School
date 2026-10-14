import { z } from 'zod'

import { DEFAULT_API_TIMEOUT } from '@/constants/app'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().optional().or(z.literal('')),
  VITE_API_TIMEOUT: z
    .string()
    .regex(/^\d+$/)
    .default(String(DEFAULT_API_TIMEOUT))
    .transform(Number),
  VITE_USE_MOCK_API: z
    .string()
    .default('true')
    .transform((value) => value === 'true'),
  VITE_ENABLE_DEV_TOOLS: z
    .string()
    .default('false')
    .transform((value) => value === 'true'),
})

/** Project-wide validated environment configuration. */
export const env = envSchema.parse(import.meta.env)

export type AppConfig = typeof env
