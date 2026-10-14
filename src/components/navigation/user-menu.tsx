import {
  ChevronsUpDownIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  UserRoundIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/hooks/use-i18n'
import { MOCK_USER } from '@/mocks/user'
import { toast } from '@/lib/toast'
import type { TranslationKey } from '@/lib/i18n'
import type { Role } from '@/types/app'

const ROLE_LABEL: Record<Role, TranslationKey> = {
  admin: 'role.admin',
  director: 'role.director',
  teacher: 'role.teacher',
  parent: 'role.parent',
  accountant: 'role.accountant',
}

/** Initials fallback for the avatar (handles Arabic/Latin names). */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Signed-in user dropdown: account info, navigation and sign out. */
export function UserMenu() {
  const { t } = useI18n()

  function handleSignOut() {
    toast.info(t('userMenu.signOutHint'))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2" aria-label={t('shell.userMenu')}>
          <Avatar className="size-8">
            <AvatarFallback>{initials(MOCK_USER.name)}</AvatarFallback>
          </Avatar>
          <span className="hidden min-w-0 text-start md:block">
            <span className="block truncate text-sm font-medium">{MOCK_USER.name}</span>
            <span className="text-muted-foreground block truncate text-xs">
              {t(ROLE_LABEL[MOCK_USER.role])}
            </span>
          </span>
          <ChevronsUpDownIcon
            className="text-muted-foreground hidden size-3.5 md:block"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-64">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-1 py-1.5">
            <Avatar size="lg">
              <AvatarFallback>{initials(MOCK_USER.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{MOCK_USER.name}</p>
              <p className="text-muted-foreground truncate text-xs">{MOCK_USER.email}</p>
              <Badge variant="secondary" className="mt-1">
                {t(ROLE_LABEL[MOCK_USER.role])}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <UserRoundIcon aria-hidden="true" />
            {t('userMenu.profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard">
            <LayoutDashboardIcon aria-hidden="true" />
            {t('userMenu.dashboard')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <SettingsIcon aria-hidden="true" />
            {t('userMenu.settings')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOutIcon aria-hidden="true" />
          {t('userMenu.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
