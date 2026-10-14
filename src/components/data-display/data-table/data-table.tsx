import { useEffect, useMemo, useState } from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useLegacyTable,
} from '@tanstack/react-table/legacy'
import {
  flexRender,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table'
import { SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { useI18n } from '@/hooks/use-i18n'
import { cn } from '@/lib/utils'

import { DataTableColumnVisibilityToggle } from './column-visibility'
import { DataTablePagination } from './pagination'
import type { DataTableProps } from './types'

/**
 * Generic DataTable foundation for every future module.
 *
 * Built on @tanstack/react-table: sorting, search, pagination, row
 * selection, bulk actions and column visibility are wired consistently.
 * Loading / empty / error states are built-in. Tables are horizontally
 * scrollable on narrow screens.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  searchableColumns,
  searchPlaceholder,
  toolbar,
  bulkActions,
  onSelectionChange,
  initialSort,
  initialColumnVisibility,
  pageSize = 10,
  loading = false,
  empty,
  error,
  className,
}: DataTableProps<TData>) {
  const { t } = useI18n()
  const [sorting, setSorting] = useState<SortingState>(initialSort ?? [])
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(
    initialColumnVisibility ?? {},
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [query, setQuery] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  /** Client-side search across the declared columns. */
  const searched = useMemo(() => {
    if (!searchableColumns?.length || !query.trim()) return data
    const needle = query.trim().toLowerCase()
    return data.filter((row) =>
      searchableColumns.some((id) =>
        String((row as Record<string, unknown>)[id] ?? '')
          .toLowerCase()
          .includes(needle),
      ),
    )
  }, [data, searchableColumns, query])

  const table = useLegacyTable({
    data: searched,
    columns,
    getRowId,
    state: { sorting, columnVisibility, rowSelection, columnFilters },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize },
    },
  })

  const selectedRows = table.getSelectedRowModel().rows
  const hasSelection = selectedRows.length > 0
  const columnCount = Math.max(columns.length, 1)
  const pageCount = table.getPageCount()

  useEffect(() => {
    onSelectionChange?.(selectedRows.map((row) => row.id))
  }, [onSelectionChange, selectedRows])

  useEffect(() => {
    table.setPageIndex(0)
  }, [query, table])

  return (
    <div data-slot="data-table" className={cn('space-y-3', className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {hasSelection && bulkActions ? (
            <>
              <span className="text-muted-foreground text-sm">
                {t('dataTable.selectedCount', { count: selectedRows.length })}
              </span>
              {bulkActions(selectedRows.map((row) => row.original))}
              <Button variant="ghost" size="sm" onClick={() => table.resetRowSelection()}>
                {t('dataTable.clearSelection')}
              </Button>
            </>
          ) : (
            <>
              {toolbar}
              {searchableColumns?.length ? (
                <div className="relative w-full sm:w-56">
                  <SearchIcon
                    className="text-muted-foreground absolute start-2.5 top-1/2 size-4 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={searchPlaceholder ?? t('dataTable.search')}
                    aria-label={t('dataTable.search')}
                    className="h-9 ps-8"
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
        <DataTableColumnVisibilityToggle table={table} />
      </div>

      <div className="border-border bg-card overflow-x-auto rounded-lg border shadow-card">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                <TableHead className="w-10">
                  <Checkbox
                    aria-label={t('dataTable.selectedCount', { count: 0 })}
                    checked={
                      table.getIsAllPageRowsSelected() ||
                      (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  />
                </TableHead>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {error ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columnCount + 1} className="h-64 p-0">
                  <ErrorState
                    title={error.title}
                    description={error.description}
                    onRetry={error.onRetry}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : loading ? (
            <TableBody>
              {Array.from({ length: Math.min(5, pageSize) }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell>
                    <div className="bg-muted size-4 rounded-sm" />
                  </TableCell>
                  {columns.map((_, col) => (
                    <TableCell key={col}>
                      <div className="bg-muted h-3.5 w-3/4 rounded-sm" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : table.getRowModel().rows.length ? (
            <TableBody>
              {table.getRowModel().rows.map((row) => {
                const selected = row.getIsSelected()
                return (
                  <TableRow key={row.id} data-state={selected ? 'selected' : undefined}>
                    <TableCell>
                      <Checkbox
                        aria-label={t('dataTable.selectedCount', { count: 0 })}
                        checked={selected}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                      />
                    </TableCell>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columnCount + 1} className="h-64 p-0">
                  <EmptyState
                    icon={empty?.icon}
                    title={empty?.title ?? t('dataTable.noResults')}
                    description={empty?.description ?? t('dataTable.noResultsDescription')}
                    action={empty?.action}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </div>

      {!error && !loading && pageCount > 0 ? (
        <DataTablePagination
          pageIndex={table.getState().pagination.pageIndex}
          pageCount={pageCount}
          pageSize={table.getState().pagination.pageSize}
          totalRows={table.getFilteredRowModel().rows.length}
          onPageChange={(page) => table.setPageIndex(page)}
          onPageSizeChange={(size) => table.setPageSize(size)}
        />
      ) : null}
    </div>
  )
}
