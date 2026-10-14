import { useQuery } from '@tanstack/react-query'

import { getDashboardData } from '@/services/system.service'

/** Loads the dashboard payload through the current data source. */
export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard', 'data'],
    queryFn: getDashboardData,
  })
}
