import { env } from '@/app/config/env'
import { fetchSystemInfo } from '@/api/system'
import { fetchSystemInfoMock } from '@/mocks/system'
import type { DashboardData } from '@/features/dashboard/types'
import { fetchDashboardMock } from '@/features/dashboard/mocks'
import type { ServiceResult } from '@/types/feature'

export interface SystemInfo {
  name: string
  version: string
  environment: string
}

/** Returns system metadata from the active source (mock or live API). */
export async function getSystemInfo(): Promise<ServiceResult<SystemInfo>> {
  if (env.VITE_USE_MOCK_API) {
    const data = await fetchSystemInfoMock()
    return { data, source: 'mock' }
  }
  const data = await fetchSystemInfo()
  return { data, source: 'api' }
}

/** Returns the dashboard payload (mock-backed until the API ships). */
export async function getDashboardData(): Promise<ServiceResult<DashboardData>> {
  const data = await fetchDashboardMock()
  return { data, source: env.VITE_USE_MOCK_API ? 'mock' : 'api' }
}
