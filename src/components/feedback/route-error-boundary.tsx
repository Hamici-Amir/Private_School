import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router'

import { ErrorFallback } from './error-fallback'

function extractMessage(error: unknown): string | undefined {
  if (isRouteErrorResponse(error)) {
    if (error.data && typeof error.data === 'object' && 'message' in error.data) {
      return String(error.data.message)
    }
    return `HTTP ${error.status} ${error.statusText}`
  }
  if (error instanceof Error) return error.message
  return undefined
}

/** Error boundary installed as the router `errorElement`. */
export function RouteErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  return (
    <ErrorFallback
      message={extractMessage(error)}
      details={import.meta.env.DEV ? error : undefined}
      onRetry={() => navigate(0)}
      onHome={() => navigate('/')}
    />
  )
}
