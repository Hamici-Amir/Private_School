import { formatMonthShort } from '@/lib/format'
import type { Locale } from '@/types/app'

/** Converts an ISO month key ("2026-03") into the first day of that month. */
export function monthKeyToDate(month: string): Date {
  const [year, monthIndex] = month.split('-').map(Number)
  return new Date(year, monthIndex - 1, 1)
}

/** Short localized month label for chart axes, e.g. "أوت" / "août" / "Aug". */
export function formatChartMonth(month: string, locale: Locale): string {
  return formatMonthShort(monthKeyToDate(month), locale)
}
