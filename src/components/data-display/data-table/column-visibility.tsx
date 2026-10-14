import type { RowData } from '@tanstack/react-table'
import type { LegacyTable } from '@tanstack/react-table/legacy'
import { ColumnsIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useI18n } from '@/hooks/use-i18n'
import { cn } from '@/lib/utils'

/** Column visibility picker for the DataTable. */
export function DataTableColumnVisibilityToggle<TData extends RowData>({
  table,
}: {
  table: LegacyTable<TData>
}) {
  const { t } = useI18n()
  const columns = table.getAllLeafColumns()
  const visibleCount = columns.filter((column) => column.getIsVisible()).length
  const canHide = columns.some((column) => column.getCanHide())

  if (!canHide) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <ColumnsIcon className="size-4" aria-hidden="true" />
          {t('dataTable.columns')}
          <span className="text-muted-foreground">
            {visibleCount}/{columns.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <ul className="space-y-1">
          {columns.map((column) => {
            const label =
              typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id
            const disabled = !column.getCanHide()
            return (
              <li key={column.id}>
                <label
                  className={cn(
                    'hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                    disabled && 'cursor-default opacity-50',
                  )}
                >
                  <Checkbox
                    checked={column.getIsVisible()}
                    disabled={disabled}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  />
                  <span className="truncate">{label}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
