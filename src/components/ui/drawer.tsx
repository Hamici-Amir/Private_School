import type * as React from 'react'

import { cn } from '@/lib/utils'

import {
  SheetContent,
  SheetFooter as DrawerFooter,
  SheetHeader as DrawerHeader,
  SheetTitle as DrawerTitle,
  SheetDescription as DrawerDescription,
} from './sheet'
import { Dialog as Drawer } from './dialog'
import { SheetClose as DrawerClose } from './sheet'
import { SheetOverlay as DrawerOverlay } from './sheet'
import { SheetPortal as DrawerPortal } from './sheet'
import { SheetTrigger as DrawerTrigger } from './sheet'

function DrawerContent({
  className,
  side = 'bottom',
  showHandle = true,
  children,
  ...props
}: React.ComponentProps<typeof SheetContent> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  showHandle?: boolean
}) {
  return (
    <SheetContent side={side} className={cn('gap-0 p-0', className)} {...props}>
      {side === 'bottom' && showHandle ? (
        <div
          aria-hidden="true"
          className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-border"
        />
      ) : null}
      {children}
    </SheetContent>
  )
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
}
