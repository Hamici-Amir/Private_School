import { Suspense } from 'react'
import { Outlet } from 'react-router'

import { AppErrorBoundary } from '@/components/feedback/app-error-boundary'
import { PageLoader } from '@/components/feedback/page-loader'

import { AppProviders } from './providers'

/** Composition root: providers + error boundary + suspense for routed content. */
export function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </AppProviders>
    </AppErrorBoundary>
  )
}
