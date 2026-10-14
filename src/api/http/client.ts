import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'

import { env } from '@/app/config/env'
import { ApiError, NetworkError } from './errors'

function normalizeError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string
      code?: string
      fieldErrors?: Record<string, string[]>
    }>
    if (axiosError.response) {
      const { data, status } = axiosError.response
      return new ApiError(status, {
        message: data?.message,
        code: data?.code,
        fieldErrors: data?.fieldErrors,
      })
    }
    return new NetworkError(axiosError.message, axiosError.cause)
  }
  return error instanceof Error ? error : new Error(String(error))
}

/** Shared Axios instance with base URL, timeout and normalized errors. */
export const httpClient = axios.create({
  baseURL: env.VITE_API_BASE_URL || undefined,
  timeout: env.VITE_API_TIMEOUT,
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
)

/** Typed GET shorthand. */
export async function httpGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.get<T>(url, config)
  return response.data
}

/** Typed POST shorthand. */
export async function httpPost<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.post<T>(url, data, config)
  return response.data
}
