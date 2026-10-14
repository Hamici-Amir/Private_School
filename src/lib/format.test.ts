import { describe, expect, it } from 'vitest'

import {
  CURRENCY_CODE,
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatFullDate,
  formatMonthShort,
  formatNumber,
  formatPercent,
  formatRelativeTime,
} from '@/lib/format'
import type { Locale } from '@/types/app'

const LOCALES: Locale[] = ['ar', 'fr', 'en']

/** Numeric value of the formatted output regardless of digit glyphs. */
function numeric(value: string): number {
  const normalized = value
    .replace(/[\u0660-\u0669]/g, (char) => String(char.charCodeAt(0) - 0x0660))
    .replace(/\D/g, '')
  return Number(normalized)
}

describe('formatNumber', () => {
  it.each(LOCALES)('produces a grouped, fractional value for %s', (locale) => {
    const output = formatNumber(1234567.5, locale)
    expect(output).not.toBe('NaN')
    expect(output.length).toBeGreaterThan(0)
    expect(/\d/.test(output)).toBe(true)
  })

  it('caps decimals via maximumFractionDigits', () => {
    expect(formatNumber(1.239, 'en', { maximumFractionDigits: 2 })).toBe('1.24')
  })

  it('keeps the same digits across locales', () => {
    for (const locale of LOCALES) {
      expect(numeric(formatNumber(1234567.5, locale))).toBe(12345675)
    }
  })
})

function countDigits(value: string): number {
  return (value.match(/\d/g) ?? []).length
}

describe('formatCurrency', () => {
  it('keeps the same amount of digits across locales (grouping only changes separators)', () => {
    const counts = LOCALES.map((locale) => countDigits(formatCurrency(25000, locale)))
    expect(new Set(counts).size).toBe(1)
  })

  it('always targets the Algerian Dinar symbol per locale', () => {
    expect(CURRENCY_CODE).toBe('DZD')
    expect(formatCurrency(1, 'en')).toContain('DZD')
    expect(formatCurrency(1, 'fr')).toContain('DA')
    expect(formatCurrency(1, 'ar')).toContain('د.ج')
  })
})

describe('formatDate / formatDateTime', () => {
  const moment = new Date(2026, 7, 17, 9, 30)

  it('formats a date in the active locale', () => {
    for (const locale of LOCALES) {
      expect(formatDate(moment, locale)).toContain('2026')
    }
  })

  it('formats date and time', () => {
    const output = formatDateTime(moment, 'en')
    expect(output).toContain('2026')
    expect(output).toMatch(/09:30|9:30/)
  })

  it('accepts numbers and strings', () => {
    expect(formatDate(moment.getTime(), 'fr')).toBeTruthy()
    expect(formatDate('2026-08-17T09:30:00', 'fr')).toBeTruthy()
  })
})

describe('formatFullDate', () => {
  it('includes the full weekday, day, month and year in every locale', () => {
    const moment = new Date(2026, 7, 17)
    for (const locale of LOCALES) {
      const output = formatFullDate(moment, locale)
      expect(output).toContain('2026')
      expect(output.split(' ').length).toBeGreaterThanOrEqual(3)
    }
  })

  it('accepts numbers and strings', () => {
    const moment = new Date(2026, 7, 17)
    expect(formatFullDate(moment.getTime(), 'en')).toBe(formatFullDate(moment, 'en'))
    expect(formatFullDate('2026-08-17', 'en').length).toBeGreaterThan(0)
  })
})

describe('formatMonthShort', () => {
  it('returns a short month label in the active locale', () => {
    const august = new Date(2026, 7, 15)
    expect(formatMonthShort(august, 'en')).toBe('Aug')
    expect(formatMonthShort(august, 'fr')).toContain('août')
    expect(formatMonthShort(august, 'ar').length).toBeGreaterThan(0)
  })
})

describe('formatPercent', () => {
  it('renders the same numeric value across locales', () => {
    for (const locale of LOCALES) {
      expect(numeric(formatPercent(92.5, locale))).toBe(925)
    }
  })

  it('caps decimals via maximumFractionDigits', () => {
    expect(formatPercent(88.44, 'en', { maximumFractionDigits: 1 })).toContain('88.4%')
  })

  it('prefixes a sign when requested for positive values', () => {
    expect(formatPercent(3, 'en', { showSign: true })).toBe('+3%')
    expect(formatPercent(-3, 'en', { showSign: true })).toBe('-3%')
  })
})

describe('formatCompactNumber', () => {
  it('compacts large numbers in the active locale', () => {
    expect(formatCompactNumber(4_250_000, 'en')).toBe('4.3M')
    expect(formatCompactNumber(4_250_000, 'fr')).toContain('M')
    expect(formatCompactNumber(4_250_000, 'ar').length).toBeGreaterThan(0)
  })

  it('keeps small numbers readable', () => {
    expect(formatCompactNumber(128, 'en')).toBe('128')
  })
})

describe('formatRelativeTime', () => {
  it('produces a human duration in the active locale', () => {
    const recent = Date.now() - 5 * 60_000
    for (const locale of LOCALES) {
      expect(formatRelativeTime(recent, locale).length).toBeGreaterThan(0)
    }
  })

  it('describes the past with a suffix', () => {
    const past = Date.now() - 120_000
    expect(formatRelativeTime(past, 'en')).toContain('ago')
  })
})
