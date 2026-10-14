import { PanelLeftCloseIcon, PanelLeftOpenIcon, SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { AppLogo } from '@/components/common/app-logo'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useI18n } from '@/hooks/use-i18n'
import { useAppShellStore } from '@/store/app-shell.store'
import { cn } from '@/lib/utils'

import { NavList } from './nav-list'

/** Desktop fixed sidebar with expand/collapse rail mode (RTL-aware). */
export function Sidebar({ className }: { className?: string }) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const collapsed = useAppShellStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useAppShellStore((state) => state.toggleSidebar)

  return (
    <aside
      data-collapsed={collapsed || undefined}
      className={cn(
        'bg-card border-border sticky top-0 hidden h-svh shrink-0 flex-col border-e lg:flex',
        collapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-14 shrink-0 items-center border-b px-4',
          collapsed ? 'justify-center px-0' : 'px-4',
        )}
      >
        <AppLogo withText={!collapsed} />
      </div>

      <div className="flex-1 overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <NavList context="sidebar" collapsed={collapsed} />
      </div>

      <div className="border-t p-2">
        <div className={cn('flex items-center gap-1', collapsed && 'flex-col gap-2')}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(collapsed && 'w-full', 'size-8')}
                aria-label={t('shell.toggleSidebar')}
                onClick={toggleSidebar}
              >
                {collapsed ? (
                  <PanelLeftOpenIcon className="size-[18px]" aria-hidden="true" />
                ) : (
                  <PanelLeftCloseIcon className="size-[18px]" aria-hidden="true" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{t('shell.toggleSidebar')}</TooltipContent>
          </Tooltip>

          {!collapsed && <Separator className="h-5" orientation="vertical" />}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(collapsed && 'w-full', 'size-8')}
                aria-label={t('nav.settings')}
                onClick={() => navigate('/settings')}
              >
                <SettingsIcon className="size-[18px]" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{t('nav.settings')}</TooltipContent>
          </Tooltip>

          {!collapsed && (
            <p className="text-muted-foreground ms-auto text-xs">{t('common.foundation')} · v0.1</p>
          )}
        </div>
      </div>
    </aside>
  )
}
