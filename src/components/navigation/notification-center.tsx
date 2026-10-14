import { BellIcon, CheckCheckIcon, ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useI18n } from '@/hooks/use-i18n'
import { formatRelativeTime } from '@/lib/format'
import type { NotificationKind } from '@/store/notifications-store'
import { useNotificationsStore } from '@/store/notifications-store'

const KIND_LABEL: Record<NotificationKind, string> = {
  student: 'bg-success/15 text-success',
  payment: 'bg-warning/15 text-warning',
  attendance: 'bg-info/15 text-info',
  system: 'bg-secondary text-secondary-foreground',
}

/** Notification bell with unread badge and dropdown list. */
export function NotificationCenter() {
  const { locale, t } = useI18n()
  const notifications = useNotificationsStore((state) => state.notifications)
  const unreadCount = useNotificationsStore((state) => state.unreadCount)
  const markAsRead = useNotificationsStore((state) => state.markAsRead)
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative"
          size="icon"
          aria-label={t('shell.notifications')}
        >
          <BellIcon className="size-5" aria-hidden="true" />
          {unreadCount > 0 ? (
            <span className="bg-destructive text-destructive-foreground absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold">
              {unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-80 p-0">
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-semibold">{t('shell.notifications')}</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground h-7 gap-1 text-xs"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheckIcon className="size-3.5" aria-hidden="true" />
            {t('shell.markAllAsRead')}
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-0" />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-1 px-3 py-8 text-center">
            <BellIcon className="text-muted-foreground size-6" aria-hidden="true" />
            <p className="text-sm font-medium">{t('shell.noNotifications')}</p>
            <p className="text-muted-foreground text-xs">{t('shell.noNotificationsDescription')}</p>
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="items-start gap-3 px-3 py-2.5 data-[variant=destructive]:focus:bg-accent"
                onSelect={(event) => {
                  event.preventDefault()
                  markAsRead(notification.id)
                }}
              >
                <span
                  className={`mt-0.5 flex size-2 shrink-0 rounded-full ${KIND_LABEL[notification.kind]}`}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{t(notification.titleKey)}</span>
                    {!notification.read ? (
                      <span
                        className="bg-primary size-1.5 shrink-0 rounded-full"
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                  <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-xs">
                    {t(notification.descriptionKey)}
                  </span>
                  <span className="text-muted-foreground mt-1 block text-xs">
                    {formatRelativeTime(notification.createdAt, locale)}
                  </span>
                </span>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
        <DropdownMenuSeparator className="my-0" />
        <DropdownMenuItem asChild className="justify-center py-2.5">
          <Link to="/notifications">
            {t('shell.viewAllNotifications')}
            <ArrowRightIcon className="size-3.5" aria-hidden="true" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
