/** Application-wide locales. Arabic is first-class (RTL) and the default. */
export type Locale = 'ar' | 'fr' | 'en'

/** Theme preference, including OS-driven mode. */
export type Theme = 'light' | 'dark' | 'system'

/** Document direction derived from a locale. */
export type Direction = 'ltr' | 'rtl'

/** Employment / user roles (future use, kept intentionally broad). */
export type Role = 'admin' | 'director' | 'teacher' | 'parent' | 'accountant'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  locale: Locale
}
