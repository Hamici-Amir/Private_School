import type { PaymentMethod, ExpenseStatus } from '../types/finance.types'
export const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'bank-transfer', 'card', 'other']
export const EXPENSE_STATUSES: ExpenseStatus[] = ['paid', 'pending', 'cancelled']
export const DEFAULT_FINANCE_DATE = '2026-08-22'
export const EXPENSE_PAGE_SIZE = 15
export const EXPENSE_CATEGORIES = [
  { id: 'supplies', nameAr: 'لوازم', nameFr: 'Fournitures', nameEn: 'Supplies' }, { id: 'salaries', nameAr: 'أجور ورواتب', nameFr: 'Salaires', nameEn: 'Salaries' }, { id: 'rent', nameAr: 'إيجار', nameFr: 'Loyer', nameEn: 'Rent' }, { id: 'utilities', nameAr: 'فواتير وخدمات', nameFr: 'Services et factures', nameEn: 'Utilities' }, { id: 'maintenance', nameAr: 'صيانة', nameFr: 'Maintenance', nameEn: 'Maintenance' }, { id: 'transportation', nameAr: 'نقل', nameFr: 'Transport', nameEn: 'Transportation' }, { id: 'equipment', nameAr: 'معدات', nameFr: 'Équipement', nameEn: 'Equipment' }, { id: 'cleaning', nameAr: 'تنظيف', nameFr: 'Nettoyage', nameEn: 'Cleaning' }, { id: 'food', nameAr: 'إطعام', nameFr: 'Restauration', nameEn: 'Food' }, { id: 'marketing', nameAr: 'تسويق', nameFr: 'Marketing', nameEn: 'Marketing' }, { id: 'other', nameAr: 'أخرى', nameFr: 'Autre', nameEn: 'Other' },
] as const
