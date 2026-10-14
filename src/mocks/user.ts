import type { User } from '@/types/app'

/**
 * Mock signed-in user used by the application shell header.
 * The authentication module (future step) will populate this from the API.
 */
export const MOCK_USER: User = {
  id: 'u-1',
  name: 'Amine Benali',
  email: 'amine.benali@psms.dz',
  role: 'admin',
  locale: 'ar',
}
