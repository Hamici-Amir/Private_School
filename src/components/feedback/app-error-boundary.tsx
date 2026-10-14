import { Component, type ErrorInfo, type ReactNode } from 'react'

import { ErrorFallback } from './error-fallback'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  error: Error | null
}

/**
 * Application-level error boundary.
 * Catches render/lifecycle errors so the app never blanks out entirely.
 * Route-level errors are handled separately by the router errorElement.
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      // In production this would be forwarded to an error-reporting service.
      console.error('[AppErrorBoundary]', error, errorInfo)
    }
  }

  private handleRetry = () => {
    this.setState({ error: null })
  }

  private handleHome = () => {
    window.location.assign('/')
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          message={this.state.error.message}
          details={
            import.meta.env.DEV
              ? { name: this.state.error.name, message: this.state.error.message }
              : undefined
          }
          onRetry={this.handleRetry}
          onHome={this.handleHome}
        />
      )
    }

    return this.props.children
  }
}
