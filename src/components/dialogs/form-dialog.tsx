import type * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  /** Submit label of the primary action button. */
  submitLabel?: string
  cancelLabel?: string
  /** Disables the footer actions; use with `children` wrapping a real form. */
  hideFooter?: boolean
  loading?: boolean
  /** Triggered when the primary action is pressed. */
  onSubmit?: () => void
  trigger?: React.ReactNode
  children?: React.ReactNode
}

/**
 * Modal dialog optimized for forms ("Create X", "Edit X"). The footer
 * renders Cancel + Submit; keyboard/Escape close is preserved, and the
 * dialog is non-dismissable while `loading`.
 */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  hideFooter = false,
  loading = false,
  onSubmit,
  trigger,
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => onOpenChange(value && !loading)}>
      {trigger ? <>{trigger}</> : null}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="space-y-4">{children}</div>
        {!hideFooter ? (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button type="button" loading={loading} onClick={onSubmit}>
              {submitLabel}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

interface InfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  icon?: React.ReactNode
  closeLabel?: string
  children?: React.ReactNode
}

/** Simple informational dialog with a single dismiss action. */
export function InfoDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  closeLabel = 'Close',
  children,
}: InfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {icon ? (
            <div className="mb-2 flex items-center justify-center">
              <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
                {icon}
              </div>
            </div>
          ) : null}
          <DialogTitle className="text-center">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-center">{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children ? <div className="space-y-4">{children}</div> : null}
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {closeLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface LoadingDialogProps {
  open: boolean
  label?: string
}

/** Non-dismissable blocking dialog for in-flight operations. */
export function LoadingDialog({ open, label = 'Loading…' }: LoadingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center justify-center gap-3 py-10 sm:max-w-sm"
      >
        <span role="status" className="flex items-center gap-2 text-sm">
          <span
            className="border-primary size-5 rounded-full border-2 border-t-transparent"
            aria-hidden="true"
          />
          <span className="text-muted-foreground">{label}</span>
          <span className="sr-only">Loading</span>
        </span>
      </DialogContent>
    </Dialog>
  )
}
