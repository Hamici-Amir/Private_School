import type * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'
import { LoaderCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

import { buttonVariants } from './button-variants'

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'
  const isDisabled = !asChild && (loading || Boolean(props.disabled))
  const isLoading = loading && !asChild

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      aria-disabled={loading || props.disabled || undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <LoaderCircleIcon aria-hidden="true" />
          <span className="sr-only">{props['aria-label'] ?? 'Loading'}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button }
