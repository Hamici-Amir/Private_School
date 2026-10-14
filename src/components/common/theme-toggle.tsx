import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/use-i18n'
import { useTheme } from '@/hooks/use-theme'

/** Light / Dark / System theme switcher. */
export function ThemeToggle() {
  const { t } = useI18n()
  const { theme, setTheme } = useTheme()

  const options = [
    { value: 'light', label: t('theme.light'), icon: SunIcon },
    { value: 'dark', label: t('theme.dark'), icon: MoonIcon },
    { value: 'system', label: t('theme.system'), icon: MonitorIcon },
  ] as const

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label={t('theme.label')}>
          <SunIcon className="size-5 dark:hidden" aria-hidden="true" />
          <MoonIcon className="hidden size-5 dark:block" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6}>
        <DropdownMenuLabel>{t('theme.label')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className={theme === value ? 'bg-accent' : undefined}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
