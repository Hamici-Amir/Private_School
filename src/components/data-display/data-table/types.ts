import type { LucideIcon } from 'lucide-react'
import type { RowData, SortingState } from '@tanstack/react-table'
import type { LegacyColumnDef } from '@tanstack/react-table/legacy'

export interface DataTableEmptyState {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
}

export interface DataTableErrorState {
  title?: string
  description?: string
  onRetry?: () => void
}

/**
 * Column definition accepted by the DataTable.
 *
 * @tanstack/react-table v9 templates are invariant over the value type, so
 * accessor columns (typed e.g. `string`) are not assignable to `unknown`.
 * `any` is the deliberately lossy value type used for the definition list.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumn<TData extends RowData> = LegacyColumnDef<TData, any>

export interface DataTableProps<TData extends RowData> {
  /** TanStack Table column definitions. */
  columns: DataTableColumn<TData>[]
  data: TData[]
  /** Stable row id resolver used for selection and keys. */
  getRowId: (row: TData) => string
  /**
   * Column ids used for the built-in global search input.
   * Pass an empty array to hide the search field.
   */
  searchableColumns?: string[]
  /** Placeholder for the search input. */
  searchPlaceholder?: string
  /** Extra toolbar content rendered before the search field. */
  toolbar?: React.ReactNode
  /** Rendered in place of the search row when at least one row is selected. */
  bulkActions?: (selectedRows: TData[]) => React.ReactNode
  /** Called whenever the set of selected row ids changes. */
  onSelectionChange?: (ids: string[]) => void
  /** Default sort state (column id + direction). */
  initialSort?: SortingState
  /** Default column visibility (keyed by column id). */
  initialColumnVisibility?: Record<string, boolean>
  pageSize?: number
  loading?: boolean
  empty?: DataTableEmptyState
  error?: DataTableErrorState
  className?: string
}
