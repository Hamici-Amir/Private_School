/** Base API envelope returned by the backend for single resources. */
export interface ApiEnvelope<T> {
  data: T
}

/** Metadata attached to list endpoints. */
export interface ApiListEnvelope<T> {
  data: T[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

/** Normalized error payload sent by the API error interceptor. */
export interface ApiErrorPayload {
  code?: string
  message: string
  fieldErrors?: Record<string, string[]>
}
