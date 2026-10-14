import { MenuIcon, PanelLeftIcon, SearchIcon } from 'lucide-react'

import { LanguageSwitcher } from '@/components/common/language-switcher'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/use-i18n'
import { cn } from '@/lib/utils'
import { useAppShellStore } from '@/store/app-shell.store'

import { GlobalSearchTrigger } from './global-search'
import { NotificationCenter } from './notification-center'
import { UserMenu } from './user-menu'

/** Application header: nav controls, search, notifications and user menu. */
export function Header({ className }: { className?: string }) {
  const { t } = useI18n()
  const toggleSidebar = useAppShellStore((state) => state.toggleSidebar)
  const openMobileNav = useAppShellStore((state) => state.openMobileNav)
  const mobileNavOpen = useAppShellStore((state) => state.mobileNavOpen)
  const openCommand = useAppShellStore((state) => state.openCommand)

  return (
    <header
      className={cn(
        'border-border bg-background sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b px-3 sm:px-4',
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label={t('shell.openNavigation')}
        aria-expanded={mobileNavOpen}
        onClick={openMobileNav}
      >
        <MenuIcon className="size-5" aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:inline-flex"
        aria-label={t('shell.toggleSidebar')}
        onClick={toggleSidebar}
      >
        <PanelLeftIcon className="size-5" aria-hidden="true" />
      </Button>

      <div className="flex flex-1 items-center justify-end gap-2">
        <GlobalSearchTrigger />
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={t('shell.searchTrigger')}
          onClick={openCommand}
        >
          <SearchIcon className="size-5" aria-hidden="true" />
        </Button>
        <NotificationCenter />
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
