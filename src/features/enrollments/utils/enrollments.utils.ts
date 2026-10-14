import type { Enrollment, EnrollmentFilters, EnrollmentSortKey } from '../types/enrollments.types'

export function filterEnrollments(items: Enrollment[], search: string, filters: EnrollmentFilters): Enrollment[] {
  const query = search.trim().toLocaleLowerCase()
  return items.filter((item) => {
    const haystack = [item.studentName, item.parentName, item.studentId, item.className, item.levelName, item.academicYear].join(' ').toLocaleLowerCase()
    return (!query || haystack.includes(query)) && (filters.academicYear === 'all' || item.academicYear === filters.academicYear) && (filters.level === 'all' || item.levelId === filters.level) && (filters.classId === 'all' || item.classId === filters.classId) && (filters.status === 'all' || item.status === filters.status) && (filters.registrationType === 'all' || item.registrationType === filters.registrationType) && (!filters.enrollmentDate || item.enrollmentDate === filters.enrollmentDate)
  })
}
export function sortEnrollments(items: Enrollment[], sort: EnrollmentSortKey): Enrollment[] {
  const result = [...items]; const descending = sort.endsWith('Desc'); const key = sort.replace(/Asc$|Desc$/, '')
  return result.sort((a, b) => { const left = String(a[key as keyof Enrollment] ?? ''); const right = String(b[key as keyof Enrollment] ?? ''); return (left.localeCompare(right) || a.id.localeCompare(b.id)) * (descending ? -1 : 1) })
}
export function paginateEnrollments(items: Enrollment[], page: number, size: number): Enrollment[] { return items.slice((page - 1) * size, page * size) }
export function getEnrollmentStats(items: Enrollment[], currentYear: string) { return { total: items.length, active: items.filter((item) => item.status === 'active').length, pending: items.filter((item) => item.status === 'pending').length, cancelled: items.filter((item) => item.status === 'cancelled' || item.status === 'inactive').length, currentYear: items.filter((item) => item.academicYear === currentYear).length } }
