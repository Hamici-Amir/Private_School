import type * as React from 'react'
import { type VariantProps } from 'class-variance-authority'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { Button } from './button'
import { type buttonVariants } from './button-variants'

type IconButtonProps = Omit<
  React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>,
  'size'
> & {
  /** Accessible label (required for icon-only buttons). */
  label: string
  /** Optional tooltip text; shown on hover/focus when provided. */
  tooltip?: string
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm'
}

/** Icon-only button with an accessible label and optional tooltip. */
function IconButton({ label, tooltip, className, ...props }: IconButtonProps) {
  const button = <Button size="icon" aria-label={label} className={className} {...props} />

  if (!tooltip) return button

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export { IconButton }
export type { IconButtonProps }
