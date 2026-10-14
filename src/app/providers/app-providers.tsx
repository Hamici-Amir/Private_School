import type { ReactNode } from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'

import { ToastProvider } from './toast-provider'
import { DirectionProvider } from './direction-provider'
import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'

interface AppProvidersProps {
  children: ReactNode
}

/** Composition root for global providers. */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <DirectionProvider>
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            <ToastProvider>{children}</ToastProvider>
          </TooltipProvider>
        </ThemeProvider>
      </DirectionProvider>
    </QueryProvider>
  )
}
