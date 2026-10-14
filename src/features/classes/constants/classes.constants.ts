import type { StatusTone } from '@/components/data-display/status-badge'
import type { TranslationKey } from '@/lib/i18n'

import type { ClassSortKey, ClassStatus } from '../types/classes.types'

export const CLASS_STATUSES: ClassStatus[] = ['active', 'inactive']

export interface ClassStatusMeta {
  labelKey: TranslationKey
  tone: StatusTone
}

export const CLASS_STATUS_META: Record<ClassStatus, ClassStatusMeta> = {
  active: { labelKey: 'classes.statuses.active', tone: 'success' },
  inactive: { labelKey: 'classes.statuses.inactive', tone: 'neutral' },
}

export interface ClassSortOption {
  value: ClassSortKey
  labelKey: TranslationKey
}

export const CLASS_SORT_OPTIONS: ClassSortOption[] = [
  { value: 'labelAsc', labelKey: 'classes.sort.labelAsc' },
  { value: 'labelDesc', labelKey: 'classes.sort.labelDesc' },
  { value: 'levelAsc', labelKey: 'classes.sort.levelAsc' },
  { value: 'levelDesc', labelKey: 'classes.sort.levelDesc' },
  { value: 'capacityAsc', labelKey: 'classes.sort.capacityAsc' },
  { value: 'capacityDesc', labelKey: 'classes.sort.capacityDesc' },
  { value: 'enrolledAsc', labelKey: 'classes.sort.enrolledAsc' },
  { value: 'enrolledDesc', labelKey: 'classes.sort.enrolledDesc' },
  { value: 'teachersAsc', labelKey: 'classes.sort.teachersAsc' },
  { value: 'teachersDesc', labelKey: 'classes.sort.teachersDesc' },
]

export const DEFAULT_CLASS_SORT: ClassSortKey = 'labelAsc'
export const DEFAULT_CLASS_PAGE_SIZE = 10
