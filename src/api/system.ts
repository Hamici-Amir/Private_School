import { httpGet } from './http'

export interface SystemInfoApi {
  name: string
  version: string
  environment: string
}

/** Fetches system metadata from the live API (used when mock mode is off). */
export async function fetchSystemInfo(): Promise<SystemInfoApi> {
  return httpGet<SystemInfoApi>('/system/info')
}
