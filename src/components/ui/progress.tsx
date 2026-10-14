import type * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const offset = `${100 - (value || 0)}%`

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 [transform:translateX(calc(var(--progress-offset)*-1))]"
        style={{ '--progress-offset': offset } as React.CSSProperties}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
