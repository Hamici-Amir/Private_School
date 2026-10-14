/** Where feature data originates from at runtime. */
export type DataSource = 'mock' | 'api'

/** Generic shape returned by every service layer (mock or real). */
export interface ServiceResult<T> {
  data: T
  source: DataSource
}

/** Standard pagination parameters accepted by list services. */
export interface Pagination {
  page?: number
  perPage?: number
}

/** Standard search / filter parameters accepted by list services. */
export interface QueryFilters {
  [key: string]: string | number | boolean | undefined
}
