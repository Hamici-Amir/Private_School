import type { Student } from '@/features/students/types/students.types'

import type { Parent, ParentFilters, ParentFormValues, ParentSortKey } from '../types/parents.types'

/** "Mohamed Benali" → "Mohamed Benali". */
export function getParentFullName(parent: Pick<Parent, 'firstName' | 'lastName'>): string {
  return `${parent.firstName} ${parent.lastName}`.trim()
}

/** "Mohamed Benali" → "MB". */
export function getParentInitials(parent: Pick<Parent, 'firstName' | 'lastName'>): string {
  const first = parent.firstName.charAt(0)
  const last = parent.lastName.charAt(0)
  return `${first}${last}`.toUpperCase()
}

/** "0550123456" → "0550 12 34 56". Passes already-formatted values through. */
export function formatParentPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return phone
  return `${digits.slice(0, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
}

export interface ParentsStats {
  total: number
  active: number
  multipleChildren: number
  new: number
}

/** September 1st of the school year containing `reference`. */
function getAcademicYearStart(reference: Date = new Date()): string {
  const september = new Date(reference.getFullYear(), 8, 1)
  const start =
    reference < september ? new Date(reference.getFullYear() - 1, 8, 1) : september
  const year = start.getFullYear()
  const month = String(start.getMonth() + 1).padStart(2, '0')
  const day = String(start.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Derives the headline counters from the current list. */
export function getParentsStats(parents: Parent[]): ParentsStats {
  const academicYearStart = getAcademicYearStart()
  return {
    total: parents.length,
    active: parents.filter((parent) => parent.status === 'active').length,
    multipleChildren: parents.filter((parent) => parent.childrenIds.length > 1).length,
    new: parents.filter((parent) => parent.createdAt >= academicYearStart).length,
  }
}

/** Search + filter pipeline for the parent list. */
export function filterParents(
  parents: Parent[],
  search: string,
  filters: ParentFilters,
): Parent[] {
  const needle = search.trim().toLowerCase()
  return parents.filter((parent) => {
    if (needle) {
      const haystack = [
        getParentFullName(parent),
        parent.email ?? '',
        parent.city ?? '',
        parent.occupation ?? '',
        parent.parentNumber,
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    if (filters.relationship !== 'all' && parent.relationship !== filters.relationship) {
      return false
    }
    if (filters.status !== 'all' && parent.status !== filters.status) return false
    if (filters.city !== 'all' && parent.city !== filters.city) return false
    if (filters.children === 'one' && parent.childrenIds.length !== 1) return false
    if (filters.children === 'multiple' && parent.childrenIds.length < 2) return false
    return true
  })
}

/** Sort a copy of the list by the requested key. */
export function sortParents(parents: Parent[], sortKey: ParentSortKey): Parent[] {
  const sorted = [...parents]
  switch (sortKey) {
    case 'nameAsc':
      return sorted.sort((a, b) =>
        getParentFullName(a).localeCompare(getParentFullName(b), 'en', { sensitivity: 'base' }),
      )
    case 'nameDesc':
      return sortParents(parents, 'nameAsc').reverse()
    case 'numberAsc':
      return sorted.sort((a, b) => a.parentNumber.localeCompare(b.parentNumber))
    case 'numberDesc':
      return sorted.sort((a, b) => b.parentNumber.localeCompare(a.parentNumber))
    case 'childrenDesc':
      return sorted.sort((a, b) => b.childrenIds.length - a.childrenIds.length)
    case 'childrenAsc':
      return sorted.sort((a, b) => a.childrenIds.length - b.childrenIds.length)
    case 'createdNewest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case 'createdOldest':
      return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    case 'status':
      return sorted.sort(
        (a, b) =>
          a.status.localeCompare(b.status) ||
          getParentFullName(a).localeCompare(getParentFullName(b), 'en', { sensitivity: 'base' }),
      )
  }
}

/** Page slice of the sorted list. */
export function paginateParents<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

/** Resolves child student records from the students list. */
export function resolveParentChildren(childrenIds: string[], students: Student[]): Student[] {
  const byId = new Map(students.map((student) => [student.id, student]))
  return childrenIds
    .map((id) => byId.get(id))
    .filter((student): student is Student => student !== undefined)
}

/** Builds a `Parent` from form values, normalizing optional fields. */
export function toParent(id: string, parentNumber: string, values: ParentFormValues): Parent {
  return {
    id,
    parentNumber,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    firstNameAr: values.firstNameAr.trim() || undefined,
    lastNameAr: values.lastNameAr.trim() || undefined,
    gender: values.gender,
    relationship: values.relationship,
    phone: values.phone.replace(/\D/g, ''),
    secondaryPhone: values.secondaryPhone.replace(/\D/g, '') || undefined,
    email: values.email.trim() || undefined,
    address: values.address.trim() || undefined,
    city: values.city.trim() || undefined,
    occupation: values.occupation.trim() || undefined,
    nationality: values.nationality.trim() || undefined,
    notes: values.notes.trim() || undefined,
    childrenIds: [],
    status: values.status,
    createdAt: new Date().toISOString().slice(0, 10),
  }
}

/** Prefills the form from an existing parent (empty string for optional fields). */
export function toFormValues(parent: Parent): ParentFormValues {
  return {
    firstName: parent.firstName,
    lastName: parent.lastName,
    firstNameAr: parent.firstNameAr ?? '',
    lastNameAr: parent.lastNameAr ?? '',
    gender: parent.gender,
    relationship: parent.relationship,
    phone: parent.phone,
    secondaryPhone: parent.secondaryPhone ?? '',
    email: parent.email ?? '',
    address: parent.address ?? '',
    city: parent.city ?? '',
    occupation: parent.occupation ?? '',
    nationality: parent.nationality ?? '',
    notes: parent.notes ?? '',
    status: parent.status,
  }
}

/** Default values for a brand-new parent. */
export function getEmptyFormValues(): ParentFormValues {
  return {
    firstName: '',
    lastName: '',
    firstNameAr: '',
    lastNameAr: '',
    gender: 'male',
    relationship: 'father',
    phone: '',
    secondaryPhone: '',
    email: '',
    address: '',
    city: '',
    occupation: '',
    nationality: 'Algérienne',
    notes: '',
    status: 'active',
  }
}