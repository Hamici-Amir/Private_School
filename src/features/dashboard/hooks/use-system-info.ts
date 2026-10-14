import { useQuery } from '@tanstack/react-query'

import { getSystemInfo } from '@/services/system.service'

/** Loads system metadata through the current data source. */
export function useSystemInfo() {
  return useQuery({
    queryKey: ['system', 'info'],
    queryFn: getSystemInfo,
  })
}
