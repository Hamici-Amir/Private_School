import { useCallback, useMemo } from 'react'

import { getDirection, resources } from '@/lib/i18n'
import type { TranslationKey } from '@/lib/i18n'
import { useLocaleStore } from '@/store/locale-store'
import type { Direction, Locale } from '@/types/app'

/** Named interpolation values, e.g. `t('dataTable.pagination', { total: 3 })`. */
export type TranslationVars = Record<string, string | number>

interface UseI18nResult {
  locale: Locale
  direction: Direction
  /** Looks up a dot-notation translation key and replaces `{name}` placeholders. */
  t: (key: TranslationKey, vars?: TranslationVars) => string
}

function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template
  return Object.entries(vars).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
    template,
  )
}

export function useI18n(): UseI18nResult {
  const locale = useLocaleStore((state) => state.locale)
  const translation = useMemo(() => resources[locale], [locale])

  const t = useCallback(
    (key: TranslationKey, vars?: TranslationVars): string => {
      const parts = key.split('.')
      let node: unknown = translation
      for (const part of parts) {
        if (node && typeof node === 'object') {
          node = (node as Record<string, unknown>)[part]
        } else {
          return key
        }
      }
      return typeof node === 'string' ? interpolate(node, vars) : key
    },
    [translation],
  )

  return { locale, direction: getDirection(locale), t }
}
