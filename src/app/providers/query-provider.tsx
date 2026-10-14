import type { ReactNode } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/app/config/query-client'

interface QueryProviderProps {
  children: ReactNode
}

/** Provides the shared TanStack Query client to the application. */
export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
