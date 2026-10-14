import { AppLogo } from '@/components/common/app-logo'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useDirection } from '@/hooks/use-direction'
import { useI18n } from '@/hooks/use-i18n'
import { useAppShellStore } from '@/store/app-shell.store'

import { NavList } from './nav-list'

/** Mobile navigation drawer (opens from the document start side, RTL-aware). */
export function MobileNav() {
  const { t } = useI18n()
  const { direction } = useDirection()
  const open = useAppShellStore((state) => state.mobileNavOpen)
  const setOpen = useAppShellStore((state) => state.closeMobileNav)

  return (
    <Sheet open={open} onOpenChange={(value) => (value ? undefined : setOpen())}>
      <SheetContent side={direction === 'rtl' ? 'right' : 'left'} className="flex flex-col p-0">
        <SheetHeader className="border-b">
          <SheetTitle asChild>
            <div className="flex h-16 items-center px-4">
              <AppLogo />
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-3">
          <NavList context="mobile" onNavigate={() => setOpen()} />
        </div>
        <SheetFooter className="border-t">
          <p className="text-muted-foreground my-2 text-xs">{t('common.foundation')}</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
