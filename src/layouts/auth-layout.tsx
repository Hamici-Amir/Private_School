import { Outlet } from 'react-router'

import { AppLogo } from '@/components/common/app-logo'
import { useI18n } from '@/hooks/use-i18n'

/** Public (auth) layout: centered brand + card. */
export function AuthLayout() {
  const { t } = useI18n()

  return (
    <div className="bg-muted/40 flex min-h-svh items-center justify-center p-6">
      <main id="main" role="main" className="flex w-full max-w-md flex-col gap-6">
        <AppLogo className="justify-center" />
        <Outlet />
        <p className="text-muted-foreground text-center text-xs">{t('common.appFullName')}</p>
      </main>
    </div>
  )
}
