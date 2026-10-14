import type { ApiErrorPayload } from '@/types/api'

/** Base error thrown by the HTTP client on failed requests. */
export class ApiError extends Error {
  readonly code?: string
  readonly status: number
  readonly fieldErrors?: Record<string, string[]>

  constructor(status: number, payload: Partial<ApiErrorPayload> = {}) {
    super(payload.message ?? `Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.code = payload.code
    this.fieldErrors = payload.fieldErrors
  }
}

/** Network-level failure (offline, timeout, unreachable host). */
export class NetworkError extends Error {
  readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'NetworkError'
    this.cause = cause
  }
}

/** Convenience guard for ApiError instances. */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
