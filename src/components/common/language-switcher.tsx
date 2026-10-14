import { CheckIcon, LanguagesIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { SUPPORTED_LANGUAGES } from '@/constants/app'
import { useI18n } from '@/hooks/use-i18n'
import { useLocale } from '@/hooks/use-locale'
import type { Locale } from '@/types/app'

const LOCALES = Object.keys(SUPPORTED_LANGUAGES) as Locale[]

/** Arabic ⇄ French switcher (RTL/LTR aware). */
export function LanguageSwitcher() {
  const { t } = useI18n()
  const { locale, setLocale } = useLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={t('language.label')}>
          <LanguagesIcon className="size-5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6}>
        <DropdownMenuLabel>{t('language.label')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LOCALES.map((value) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setLocale(value)}
            className={locale === value ? 'bg-accent' : undefined}
          >
            <span className="min-w-16">{SUPPORTED_LANGUAGES[value]}</span>
            {locale === value && <CheckIcon className="ms-auto size-4" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
