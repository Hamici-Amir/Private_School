import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useI18n } from '@/hooks/use-i18n'

interface DataTablePaginationProps {
  pageIndex: number
  pageCount: number
  pageSize: number
  totalRows: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

/** Pagination controls for the DataTable (prev/next + page size). */
export function DataTablePagination({
  pageIndex,
  pageCount,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  const { t } = useI18n()
  const hasPrevious = pageIndex > 0
  const hasNext = pageIndex < pageCount - 1

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-2 py-3 text-sm sm:flex-row">
      <p className="text-muted-foreground text-xs">
        {t('dataTable.pagination', {
          from: totalRows === 0 ? 0 : pageIndex * pageSize + 1,
          to: Math.min(totalRows, (pageIndex + 1) * pageSize),
          total: totalRows,
        })}
      </p>
      <div className="flex items-center gap-3">
        {onPageSizeChange ? (
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger size="sm" className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} / {t('dataTable.page')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={!hasPrevious}
          >
            {t('dataTable.previous')}
          </Button>
          <span className="text-muted-foreground min-w-14 px-1 text-center text-xs">
            {pageCount === 0 ? 0 : pageIndex + 1} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={!hasNext}
          >
            {t('dataTable.next')}
          </Button>
        </div>
      </div>
    </div>
  )
}
