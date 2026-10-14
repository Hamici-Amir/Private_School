import type { Locale } from '@/types/app'

export const APP_NAME = 'Private School Management System'
export const APP_SHORT_NAME = 'PSMS'

/** Arabic is the default language (RTL); French and English are LTR. */
export const DEFAULT_LOCALE: Locale = 'ar'
export const SUPPORTED_LOCALES: readonly Locale[] = ['ar', 'fr', 'en']

export const THEME_STORAGE_KEY = 'psms.theme'
export const LOCALE_STORAGE_KEY = 'psms.locale'
export const APP_SHELL_STORAGE_KEY = 'psms.app-shell'
export const API_STORAGE_KEY = 'psms.api'

export const DEFAULT_API_TIMEOUT = 15_000
export const MOCK_DELAY = 250

export const SUPPORTED_LANGUAGES: Record<Locale, string> = {
  ar: 'العربية',
  fr: 'Français',
  en: 'English',
}
