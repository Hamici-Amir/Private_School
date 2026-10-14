import { useI18n } from '@/hooks/use-i18n'

import { Spinner } from './spinner'

interface PageLoaderProps {
  label?: string
}

/** Full-page application/route loading state. */
export function PageLoader({ label }: PageLoaderProps) {
  const { t } = useI18n()
  return (
    <div className="flex min-h-svh flex-1 items-center justify-center">
      <Spinner label={label ?? t('common.loading')} />
    </div>
  )
}
