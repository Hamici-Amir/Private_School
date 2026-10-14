import { LoaderCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

interface SpinnerProps {
  className?: string
  /** Accessible label shown next to the icon (defaults to nothing). */
  label?: string
}

/** Small circular loading spinner with an optional accessible label. */
export function Spinner({ className, label }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center gap-2">
      <LoaderCircle className={cn(className)} aria-hidden="true" />
      {label ? <span className="text-muted-foreground text-sm">{label}</span> : null}
      <span className="sr-only">Loading</span>
    </span>
  )
}
