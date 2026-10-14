import { ArrowUpDownIcon, ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from 'lucide-react'
import type { RowData } from '@tanstack/react-table'
import type { LegacyColumn } from '@tanstack/react-table/legacy'

import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { cn } from '@/lib/utils'

interface ColumnButtonSort<TData extends RowData, TValue> {
  column: LegacyColumn<TData, TValue>
  label: string
}

/** Generic sorter/picker column header used by DataTable columns. */
export function DataTableColumnHeader<TData extends RowData, TValue = unknown>({
  column,
  label,
  align = 'start',
}: ColumnButtonSort<TData, TValue> & { align?: 'start' | 'end' | 'center' }) {
  if (!column.getCanSort()) {
    return (
      <span
        className={cn('text-muted-foreground text-sm font-medium', align === 'end' && 'text-end')}
      >
        {label}
      </span>
    )
  }

  const sorted = column.getIsSorted()

  return (
    <div
      className={cn(
        'flex items-center',
        align === 'end' && 'justify-end',
        align === 'center' && 'justify-center',
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(sorted === 'asc')}
        className="h-8 -ms-2 gap-1 data-[state=open]:bg-accent"
      >
        <span className="font-medium">{label}</span>
        {sorted === 'asc' ? (
          <ChevronUpIcon className="size-3.5" aria-hidden="true" />
        ) : sorted === 'desc' ? (
          <ChevronDownIcon className="size-3.5" aria-hidden="true" />
        ) : (
          <ChevronsUpDownIcon className="text-muted-foreground size-3.5" aria-hidden="true" />
        )}
      </Button>
    </div>
  )
}

/** Legacy alias kept for consumers that prefer a raw toggle button. */
export function DataTableSortToggle<TData extends RowData, TValue = unknown>({
  column,
  label,
}: ColumnButtonSort<TData, TValue>) {
  return (
    <IconButton
      label={`Sort by ${label}`}
      tooltip={column.getIsSorted() === 'asc' ? 'Sort ascending' : 'Sort descending'}
      variant="ghost"
      size="icon-sm"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {column.getIsSorted() === 'asc' ? (
        <ChevronUpIcon className="size-3.5" aria-hidden="true" />
      ) : column.getIsSorted() === 'desc' ? (
        <ChevronDownIcon className="size-3.5" aria-hidden="true" />
      ) : (
        <ArrowUpDownIcon className="size-3.5" aria-hidden="true" />
      )}
    </IconButton>
  )
}
