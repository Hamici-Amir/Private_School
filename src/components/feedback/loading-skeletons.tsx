import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

/** Rows × columns skeleton grid used by data tables while loading. */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn('w-full', className)} aria-hidden="true">
      <div className="flex items-center justify-between gap-4 py-2">
        <Skeleton className="h-8 w-40 max-w-full" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-3 w-16" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, row) => (
            <TableRow key={row} className="hover:bg-transparent">
              {Array.from({ length: columns }).map((_, col) => (
                <TableCell key={col}>
                  <Skeleton className="h-3.5 w-20" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/** Card-shaped placeholder used for dashboard/metric widgets. */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('bg-card border-border rounded-lg border p-4 shadow-card', className)}
      aria-hidden="true"
    >
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-8 w-16" />
      <Skeleton className="mt-3 h-3 w-3/4" />
    </div>
  )
}

/** Linear form skeleton matching the standard form layout. */
export function FormSkeleton({ fields = 3, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn('space-y-5', className)} aria-hidden="true">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <Skeleton className="h-9 w-28" />
    </div>
  )
}

/** Vertical list skeleton (contacts, activity, settings rows…). */
export function ListSkeleton({ items = 4, className }: { items?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)} aria-hidden="true">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
