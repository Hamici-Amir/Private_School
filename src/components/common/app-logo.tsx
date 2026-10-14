import { GraduationCapIcon } from 'lucide-react'

import { useI18n } from '@/hooks/use-i18n'
import { cn } from '@/lib/utils'

interface AppLogoProps {
  className?: string
  withText?: boolean
}

/** Brand mark used in layouts, auth screens and error pages. */
export function AppLogo({ className, withText = true }: AppLogoProps) {
  const { t } = useI18n()

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="bg-primary text-primary-foreground inline-flex size-10 shrink-0 items-center justify-center rounded-lg">
        <GraduationCapIcon className="size-6" aria-hidden="true" />
      </span>
      {withText && <span className="text-xl font-bold tracking-tight">{t('common.appName')}</span>}
    </span>
  )
}
