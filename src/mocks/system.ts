import { MOCK_DELAY } from '@/constants/app'
import { delay } from '@/utils/async'

/**
 * Mock system information.
 * NOTE (boundary rule): mocks must not import from "@types", "@features/*" or "@api/*".
 * Feature types consumed by mocks are declared inline below and confirmed structurally
 * by the service layer.
 */
interface MockSystemInfo {
  name: string
  version: string
  environment: string
  usesMockApi: boolean
}

const system: MockSystemInfo = {
  name: 'Private School Management System',
  version: '1.0.0',
  environment: import.meta.env.MODE,
  usesMockApi: true,
}

export async function fetchSystemInfoMock(): Promise<MockSystemInfo> {
  await delay(MOCK_DELAY)
  return { ...system }
}
