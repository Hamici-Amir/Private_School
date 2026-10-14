import { formatDistanceToNowStrict } from 'date-fns'
import { arDZ, enUS, fr } from 'date-fns/locale'

import type { Locale } from '@/types/app'

/** Intl locale tags used for each application locale. */
const INTL_LOCALES: Record<Locale, string> = {
  ar: 'ar-DZ',
  fr: 'fr-DZ',
  en: 'en-DZ',
}

/** Official ISO currency code (Algerian Dinar). */
export const CURRENCY_CODE = 'DZD'

interface FormatNumberOptions {
  maximumFractionDigits?: number
}

/**
 * Formats a number using the Intl conventions of the active locale,
 * e.g. 1234.5 → "1 234,5" (fr-DZ) / "1.234,5" (ar-DZ) / "1,234.5" (en).
 */
export function formatNumber(value: number, locale: Locale, options?: FormatNumberOptions): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    maximumFractionDigits: options?.maximumFractionDigits,
  }).format(value)
}

/**
 * Formats an amount in Algerian Dinar (دج / DA / DZD) with locale grouping.
 */
export function formatCurrency(value: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: 'currency',
    currency: CURRENCY_CODE,
    maximumFractionDigits: 2,
  }).format(value)
  // Intl renders "DA" for fr-DZ, "د.ج." for ar-DZ and "DZD" for en-DZ;
  // keep the output as produced so separators stay locale-correct.
  return formatted
}

/** Normalizes DateLike inputs to a Date instance. */
function toDate(date: Date | number | string): Date {
  if (date instanceof Date) return date
  return new Date(date)
}

/** Locale-aware short date, e.g. "17/08/2026". */
export function formatDate(date: Date | number | string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale]).format(toDate(date))
}

/** Locale-aware full date, e.g. "الأحد 17 أوت 2026" / "lundi 17 août 2026" / "Monday, August 17, 2026". */
export function formatFullDate(date: Date | number | string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], {
    dateStyle: 'full',
  }).format(toDate(date))
}

/** Locale-aware short month name, e.g. "أوت" / "août" / "Aug". */
export function formatMonthShort(date: Date | number | string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], {
    month: 'short',
  }).format(toDate(date))
}

/** Locale-aware long date + time, used e.g. by notifications. */
export function formatDateTime(date: Date | number | string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(toDate(date))
}

interface FormatPercentOptions {
  /** Prefix a "+" when the value is positive. */
  showSign?: boolean
  maximumFractionDigits?: number
}

/**
 * Formats a ratio (0–1 represented as a signed number, e.g. 92.5) in the active
 * locale, e.g. 92.5 → "92,5 %" (fr-DZ) / "٩٢٫٥٪" (ar-DZ) / "92.5%" (en).
 */
export function formatPercent(
  value: number,
  locale: Locale,
  options?: FormatPercentOptions,
): string {
  const prefix = options?.showSign && value > 0 ? '+' : ''
  return (
    prefix +
    new Intl.NumberFormat(INTL_LOCALES[locale], {
      style: 'percent',
      maximumFractionDigits: options?.maximumFractionDigits ?? 1,
    }).format(value / 100)
  )
}

/** Locale-aware compact number, e.g. 4_250_000 → "4,3 M" (fr-DZ) / "4.3M" (en). */
export function formatCompactNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

/** date-fns locales used for relative durations (formatDistanceToNow). */
const DATE_FNS_LOCALES: Record<Locale, typeof enUS> = {
  ar: arDZ,
  fr,
  en: enUS,
}

/**
 * Relative duration from now in the active locale ("12 دقيقة"/"il y a 12 minutes"/"12 min ago").
 */
export function formatRelativeTime(date: Date | number | string, locale: Locale): string {
  return formatDistanceToNowStrict(toDate(date), {
    addSuffix: true,
    locale: DATE_FNS_LOCALES[locale],
  })
}
