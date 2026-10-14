import { ar } from './ar'
import { en } from './en'
import { fr } from './types'
import type { Translations } from './types'

/**
 * Localized resource bundles.
 * The French catalog lives in types.ts alongside its types; Arabic and English
 * catalogs are located in their own files.
 */
export const resources: Translations = {
  fr,
  ar,
  en,
}
