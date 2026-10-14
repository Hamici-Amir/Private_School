import type { Locale, Theme } from '@/types/app'

export interface SchoolSettings {
  name: string
  nameAr: string
  nameFr: string
  nameEn: string
  code: string
  type: 'private'
  description: string
  address: string
  city: string
  wilaya: string
  postalCode: string
  phone: string
  secondaryPhone: string
  email: string
  website: string
  logo: string
}

export interface AcademicYear {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'current' | 'upcoming' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface AcademicSettings {
  currentYearId: string
  years: AcademicYear[]
  defaultLevel: string
  defaultClass: string
  defaultTerm: 'term1' | 'term2' | 'term3'
  levels: { id: string; active: boolean }[]
  classes: { id: string; active: boolean }[]
}

export interface FinanceSettings {
  currency: 'DZD'
  symbol: 'DA'
  paymentMethod: 'cash' | 'bank-transfer' | 'card' | 'other'
  invoicePrefix: string
  receiptPrefix: string
  expensePrefix: string
  studentPrefix: string
  enrollmentPrefix: string
}

export interface DocumentSettings {
  maxFileSize: number
  allowedTypes: string[]
  defaultCategory: string
}

export interface SettingsConfig {
  school: SchoolSettings
  academic: AcademicSettings
  finance: FinanceSettings
  documents: DocumentSettings
  appearance: { theme: Theme }
  language: { locale: Locale; dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'; timeFormat: '24' | '12'; country: 'Algeria'; timezone: 'Africa/Algiers' }
  notifications: Record<'system' | 'payments' | 'attendance' | 'documents' | 'announcements' | 'email' | 'sms', boolean>
  general: { landingPage: 'dashboard' | 'students' | 'finance' | 'reports'; itemsPerPage: 10 | 15 | 25 | 50; confirmDestructive: boolean; showNotifications: boolean; compactTables: boolean; simplifiedInterface: boolean }
}

const STORAGE_KEY = 'private-school-settings-v1'

const defaultSettings: SettingsConfig = {
  school: {
    name: 'El Bahith Private School', nameAr: 'مدرسة الباحث الخاصة', nameFr: 'École Privée El Bahith', nameEn: 'El Bahith Private School', code: 'SCH-2026-001', type: 'private', description: 'A welcoming private school focused on strong foundations and confident learners.', address: '12 rue des Oliviers', city: 'Alger', wilaya: 'Alger', postalCode: '16000', phone: '023 12 34 56', secondaryPhone: '0550 12 34 56', email: 'contact@elbahith.dz', website: 'https://elbahith.dz', logo: '',
  },
  academic: {
    currentYearId: '2026-2027', years: [{ id: '2026-2027', name: '2026-2027', startDate: '2026-09-01', endDate: '2027-06-30', status: 'current', createdAt: '2026-06-01', updatedAt: '2026-06-01' }, { id: '2027-2028', name: '2027-2028', startDate: '2027-09-01', endDate: '2028-06-30', status: 'upcoming', createdAt: '2026-06-01', updatedAt: '2026-06-01' }], defaultLevel: '1AM', defaultClass: '1AM-A', defaultTerm: 'term1', levels: ['1AP', '2AP', '3AP', '4AP', '5AP', '1AM', '2AM', '3AM', '4AM', '1AS', '2AS', '3AS'].map((id) => ({ id, active: true })), classes: ['1AM-A', '1AM-B', '2AM-A', '3AS-A'].map((id) => ({ id, active: true })),
  },
  finance: { currency: 'DZD', symbol: 'DA', paymentMethod: 'cash', invoicePrefix: 'INV-', receiptPrefix: 'REC-', expensePrefix: 'EXP-', studentPrefix: 'STD-', enrollmentPrefix: 'ENR-' },
  documents: { maxFileSize: 10, allowedTypes: ['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'JPG', 'JPEG', 'PNG', 'WEBP'], defaultCategory: 'school' },
  appearance: { theme: 'system' },
  language: { locale: 'ar', dateFormat: 'DD/MM/YYYY', timeFormat: '24', country: 'Algeria', timezone: 'Africa/Algiers' },
  notifications: { system: true, payments: true, attendance: true, documents: true, announcements: true, email: false, sms: false },
  general: { landingPage: 'dashboard', itemsPerPage: 15, confirmDestructive: true, showNotifications: true, compactTables: false, simplifiedInterface: false },
}

function cloneSettings(settings: SettingsConfig): SettingsConfig {
  return structuredClone(settings)
}

export function getSettings(): SettingsConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...cloneSettings(defaultSettings), ...JSON.parse(stored) } : cloneSettings(defaultSettings)
  } catch {
    return cloneSettings(defaultSettings)
  }
}

function persist(settings: SettingsConfig): SettingsConfig {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  return settings
}

export function updateSettings(patch: Partial<SettingsConfig>): SettingsConfig {
  return persist({ ...getSettings(), ...patch })
}

export function updateSchoolSettings(school: SchoolSettings) { return updateSettings({ school }) }
export function updateAcademicSettings(academic: AcademicSettings) { return updateSettings({ academic }) }
export function updateFinanceSettings(finance: FinanceSettings) { return updateSettings({ finance }) }
export function updateDocumentSettings(documents: DocumentSettings) { return updateSettings({ documents }) }
export function updateAppearanceSettings(appearance: SettingsConfig['appearance']) { return updateSettings({ appearance }) }
export function updateLanguageSettings(language: SettingsConfig['language']) { return updateSettings({ language }) }
export function updateNotificationSettings(notifications: SettingsConfig['notifications']) { return updateSettings({ notifications }) }
export function updateGeneralSettings(general: SettingsConfig['general']) { return updateSettings({ general }) }
export function resetSettings() { return persist(cloneSettings(defaultSettings)) }
