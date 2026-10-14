import { useI18n } from '@/hooks/use-i18n'

import { Spinner } from './spinner'

interface RouteLoaderProps {
  label?: string
}

/** Suspense fallback used by lazy-loaded routes. */
export function RouteLoader({ label }: RouteLoaderProps) {
  const { t } = useI18n()
  return (
    <div className="flex min-h-40 flex-1 items-center justify-center p-8">
      <Spinner label={label ?? t('common.loading')} />
    </div>
  )
}
