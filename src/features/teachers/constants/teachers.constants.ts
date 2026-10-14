import type { StatusTone } from '@/components/data-display/status-badge'
import type { TranslationKey } from '@/lib/i18n'

import type {
  TeacherGender,
  TeacherQualification,
  TeacherSortKey,
  TeacherSpecialty,
  TeacherStatus,
} from '../types/teachers.types'

/** Ordered specialty list (used by filters and the form). */
export const TEACHER_SPECIALTIES: TeacherSpecialty[] = [
  'math',
  'arabic',
  'french',
  'english',
  'science',
  'physics',
  'historyGeography',
  'philosophy',
  'sports',
  'islamic',
  'informatics',
  'arts',
  'music',
]

export interface TeacherSpecialtyMeta {
  labelKey: TranslationKey
}

export const TEACHER_SPECIALTY_META: Record<TeacherSpecialty, TeacherSpecialtyMeta> = {
  math: { labelKey: 'teachers.specialties.math' },
  arabic: { labelKey: 'teachers.specialties.arabic' },
  french: { labelKey: 'teachers.specialties.french' },
  english: { labelKey: 'teachers.specialties.english' },
  science: { labelKey: 'teachers.specialties.science' },
  physics: { labelKey: 'teachers.specialties.physics' },
  historyGeography: { labelKey: 'teachers.specialties.historyGeography' },
  philosophy: { labelKey: 'teachers.specialties.philosophy' },
  sports: { labelKey: 'teachers.specialties.sports' },
  islamic: { labelKey: 'teachers.specialties.islamic' },
  informatics: { labelKey: 'teachers.specialties.informatics' },
  arts: { labelKey: 'teachers.specialties.arts' },
  music: { labelKey: 'teachers.specialties.music' },
}

/** Ordered qualification list (used by filters and the form). */
export const TEACHER_QUALIFICATIONS: TeacherQualification[] = ['licence', 'master', 'phd']

export interface TeacherQualificationMeta {
  labelKey: TranslationKey
}

export const TEACHER_QUALIFICATION_META: Record<TeacherQualification, TeacherQualificationMeta> = {
  licence: { labelKey: 'teachers.qualifications.licence' },
  master: { labelKey: 'teachers.qualifications.master' },
  phd: { labelKey: 'teachers.qualifications.phd' },
}

/** Ordered status list (used by filters and the form). */
export const TEACHER_STATUSES: TeacherStatus[] = ['active', 'onleave', 'inactive']

export interface TeacherStatusMeta {
  labelKey: TranslationKey
  tone: StatusTone
}

export const TEACHER_STATUS_META: Record<TeacherStatus, TeacherStatusMeta> = {
  active: { labelKey: 'teachers.statuses.active', tone: 'success' },
  onleave: { labelKey: 'teachers.statuses.onleave', tone: 'warning' },
  inactive: { labelKey: 'teachers.statuses.inactive', tone: 'neutral' },
}

export const TEACHER_GENDERS: TeacherGender[] = ['male', 'female']

export interface TeacherGenderMeta {
  labelKey: TranslationKey
}

export const TEACHER_GENDER_META: Record<TeacherGender, TeacherGenderMeta> = {
  male: { labelKey: 'teachers.genders.male' },
  female: { labelKey: 'teachers.genders.female' },
}

/** Cities referenced by the mock dataset (used by the city filter). */
export const TEACHER_CITIES: string[] = [
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

export interface TeacherSortOption {
  value: TeacherSortKey
  labelKey: TranslationKey
}

export const TEACHER_SORT_OPTIONS: TeacherSortOption[] = [
  { value: 'nameAsc', labelKey: 'teachers.sort.nameAsc' },
  { value: 'nameDesc', labelKey: 'teachers.sort.nameDesc' },
  { value: 'numberAsc', labelKey: 'teachers.sort.numberAsc' },
  { value: 'numberDesc', labelKey: 'teachers.sort.numberDesc' },
  { value: 'hireNewest', labelKey: 'teachers.sort.hireNewest' },
  { value: 'hireOldest', labelKey: 'teachers.sort.hireOldest' },
  { value: 'classesDesc', labelKey: 'teachers.sort.classesDesc' },
  { value: 'classesAsc', labelKey: 'teachers.sort.classesAsc' },
  { value: 'status', labelKey: 'teachers.sort.status' },
]

export const DEFAULT_TEACHER_SORT: TeacherSortKey = 'nameAsc'
export const DEFAULT_TEACHER_PAGE_SIZE = 10