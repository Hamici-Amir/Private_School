import type { StatusTone } from '@/components/data-display/status-badge'
import type { TranslationKey } from '@/lib/i18n'
import type { EducationLevel } from '@/features/students/types/students.types'
import type { SubjectSortKey, SubjectStatus } from '../types/subjects.types'

export const SUBJECT_LEVELS: EducationLevel[] = ['1AP','2AP','3AP','4AP','5AP','1AM','2AM','3AM','4AM','1AS','2AS','3AS']
export const SUBJECT_STATUSES: SubjectStatus[] = ['active', 'inactive']
export const SUBJECT_STATUS_META: Record<SubjectStatus, { labelKey: TranslationKey; tone: StatusTone }> = { active: { labelKey: 'subjects.status.active', tone: 'success' }, inactive: { labelKey: 'subjects.status.inactive', tone: 'neutral' } }
export const DEFAULT_SUBJECT_SORT: SubjectSortKey = 'nameAsc'
export const DEFAULT_SUBJECT_PAGE_SIZE = 10
export const SUBJECT_LEVEL_LABELS: Record<EducationLevel, TranslationKey> = Object.fromEntries(SUBJECT_LEVELS.map((level) => [level, `students.levels.${level}`])) as Record<EducationLevel, TranslationKey>
