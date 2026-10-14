import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface PageSkeletonProps {
  className?: string
}

/** Reusable block skeleton layout for content that is still loading. */
export function PageSkeleton({ className }: PageSkeletonProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  )
}
