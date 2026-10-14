import type { StatusTone } from '@/components/data-display/status-badge'
import type { TranslationKey } from '@/lib/i18n'

import type {
  ParentGender,
  ParentRelationship,
  ParentSortKey,
  ParentStatus,
} from '../types/parents.types'

/** Ordered relationship list (used by filters and the form). */
export const PARENT_RELATIONSHIPS: ParentRelationship[] = [
  'father',
  'mother',
  'guardian',
  'other',
]

export interface ParentRelationshipMeta {
  labelKey: TranslationKey
}

export const PARENT_RELATIONSHIP_META: Record<ParentRelationship, ParentRelationshipMeta> = {
  father: { labelKey: 'parents.relationships.father' },
  mother: { labelKey: 'parents.relationships.mother' },
  guardian: { labelKey: 'parents.relationships.guardian' },
  other: { labelKey: 'parents.relationships.other' },
}

/** Ordered status list (used by filters and the form). */
export const PARENT_STATUSES: ParentStatus[] = ['active', 'inactive']

export interface ParentStatusMeta {
  labelKey: TranslationKey
  tone: StatusTone
}

export const PARENT_STATUS_META: Record<ParentStatus, ParentStatusMeta> = {
  active: { labelKey: 'parents.statuses.active', tone: 'success' },
  inactive: { labelKey: 'parents.statuses.inactive', tone: 'neutral' },
}

export const PARENT_GENDERS: ParentGender[] = ['male', 'female']

export interface ParentGenderMeta {
  labelKey: TranslationKey
}

export const PARENT_GENDER_META: Record<ParentGender, ParentGenderMeta> = {
  male: { labelKey: 'parents.genders.male' },
  female: { labelKey: 'parents.genders.female' },
}

/** Cities referenced by the mock dataset (used by the city filter). */
export const PARENT_CITIES: string[] = [
  'Alger',
  'Bab Ezzouar',
  'Bordj El Kiffan',
  'Birkhadem',
  'El Harrach',
  'Hydra',
  'Kouba',
  'Dely Ibrahim',
  'Chéraga',
  'El Biar',
  'Ben Aknoun',
  'Hussein Dey',
  'Draria',
  'Bourouba',
  'Tizi Ouzou',
]

export interface ParentSortOption {
  value: ParentSortKey
  labelKey: TranslationKey
}

export const PARENT_SORT_OPTIONS: ParentSortOption[] = [
  { value: 'nameAsc', labelKey: 'parents.sort.nameAsc' },
  { value: 'nameDesc', labelKey: 'parents.sort.nameDesc' },
  { value: 'numberAsc', labelKey: 'parents.sort.numberAsc' },
  { value: 'numberDesc', labelKey: 'parents.sort.numberDesc' },
  { value: 'childrenDesc', labelKey: 'parents.sort.childrenDesc' },
  { value: 'childrenAsc', labelKey: 'parents.sort.childrenAsc' },
  { value: 'createdNewest', labelKey: 'parents.sort.createdNewest' },
  { value: 'createdOldest', labelKey: 'parents.sort.createdOldest' },
  { value: 'status', labelKey: 'parents.sort.status' },
]

export const DEFAULT_PARENT_SORT: ParentSortKey = 'nameAsc'
export const DEFAULT_PARENT_PAGE_SIZE = 10