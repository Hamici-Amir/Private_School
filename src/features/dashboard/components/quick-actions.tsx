import { Link } from 'react-router'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/hooks/use-i18n'

import { DASHBOARD_QUICK_ACTIONS } from '../constants'

/** Shortcut buttons to the main management areas. */
export function QuickActions() {
  const { t } = useI18n()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{t('dashboard.quickActionsTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="gap-2.5">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {DASHBOARD_QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.id}
                to={action.to}
                className="hover:bg-accent hover:text-accent-foreground text-muted-foreground focus-visible:ring-ring/50 flex flex-col items-center gap-1.5 rounded-md border px-3 py-3 text-center text-xs font-medium outline-none focus-visible:ring-[3px]"
              >
                <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {t(`dashboard.quickActions.${action.id}`)}
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
