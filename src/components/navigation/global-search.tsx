import { useEffect } from 'react'
import { SearchIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { NAV_ITEMS } from '@/constants/navigation'
import { useI18n } from '@/hooks/use-i18n'
import type { TranslationKey } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useAppShellStore } from '@/store/app-shell.store'

interface SearchAction {
  key: string
  labelKey: TranslationKey
  run: () => void
}

/** Global command palette: navigate to modules or trigger quick actions. */
export function GlobalSearch() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const open = useAppShellStore((state) => state.commandOpen)
  const setOpen = useAppShellStore((state) => state.closeCommand)

  // Keyboard shortcut: Cmd/Ctrl + K toggles the palette.
  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        const { commandOpen, closeCommand, openCommand } = useAppShellStore.getState()
        if (commandOpen) closeCommand()
        else openCommand()
      }
      if (event.key === 'Escape') setOpen()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setOpen])

  const actions: SearchAction[] = [
    { key: 'profile', labelKey: 'userMenu.profile', run: () => navigate('/profile') },
    {
      key: 'notifications',
      labelKey: 'shell.viewAllNotifications',
      run: () => navigate('/notifications'),
    },
    { key: 'settings', labelKey: 'userMenu.settings', run: () => navigate('/settings') },
  ]

  function reset() {
    useAppShellStore.getState().closeCommand()
  }

  function handleOpenChange(value: boolean) {
    if (value) useAppShellStore.getState().openCommand()
    else useAppShellStore.getState().closeCommand()
  }

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange} title={t('shell.searchTrigger')}>
      <CommandInput placeholder={t('shell.searchPlaceholder')} autoFocus />
      <CommandList>
        <CommandEmpty>{t('shell.searchNoResults')}</CommandEmpty>
        <CommandGroup heading={t('shell.searchPages')}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <CommandItem
                key={item.key}
                value={`${t(item.labelKey)} ${item.href}`}
                onSelect={() => {
                  navigate(item.href)
                  reset()
                }}
              >
                {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
                <span>{t(item.labelKey)}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
        <CommandGroup heading={t('shell.searchActions')}>
          {actions.map((action) => (
            <CommandItem
              key={action.key}
              value={`${t(action.labelKey)} action`}
              onSelect={() => {
                action.run()
                reset()
              }}
            >
              <span>{t(action.labelKey)}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

/** Header trigger for the command palette with a keyboard shortcut hint. */
export function GlobalSearchTrigger() {
  const { t } = useI18n()
  const openCommand = useAppShellStore((state) => state.openCommand)

  return (
    <button
      type="button"
      onClick={openCommand}
      aria-haspopup="dialog"
      aria-label={t('shell.searchTrigger')}
      className={cn(
        'ring-offset-background focus-visible:ring-ring inline-flex h-9 w-56 items-center gap-2 rounded-md border bg-muted/50 px-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden max-lg:hidden',
      )}
    >
      <SearchIcon className="size-4 shrink-0" aria-hidden="true" />
      <span className="flex-1 truncate text-start text-sm">{t('shell.search')}</span>
      <kbd className="text-muted-foreground pointer-events-none text-xs">⌘K</kbd>
    </button>
  )
}
