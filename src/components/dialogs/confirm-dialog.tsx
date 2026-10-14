import type * as React from 'react'
import { useId } from 'react'
import { AlertTriangleIcon, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
  loading?: boolean
  icon?: LucideIcon
  onConfirm?: () => void
  /** Render an external trigger instead of relying on `open` only. */
  trigger?: React.ReactNode
  /** Extra content shown between the header and the footer. */
  children?: React.ReactNode
}

/**
 * Reusable confirmation dialog. Use `variant="destructive"` for
 * irreversible actions. Supports an async-ish loading state.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
  icon: Icon = AlertTriangleIcon,
  onConfirm,
  trigger,
  children,
}: ConfirmDialogProps) {
  const titleId = useId()

  const dialog = (
    <AlertDialog open={open} onOpenChange={(value) => onOpenChange(value && !loading)}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent aria-describedby={titleId}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span
              className={
                variant === 'destructive'
                  ? 'bg-destructive/10 text-destructive flex size-8 items-center justify-center rounded-full'
                  : 'bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full'
              }
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
            {title}
          </AlertDialogTitle>
          {description ? (
            <AlertDialogDescription id={titleId}>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={variant === 'destructive' ? 'destructive' : 'default'}
              loading={loading}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return dialog
}
