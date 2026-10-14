import { useState } from 'react'
import { RotateCcwIcon, SearchIcon, SlidersHorizontalIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { levelLabelKey, STUDENT_LEVELS } from '@/features/students/constants/students.constants'
import { useI18n } from '@/hooks/use-i18n'
import { cn } from '@/lib/utils'

import {
  CLASS_SORT_OPTIONS,
  CLASS_STATUSES,
  CLASS_STATUS_META,
} from '../constants/classes.constants'
import type { ClassFilters, ClassSortKey } from '../types/classes.types'

interface ClassesToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  filters: ClassFilters
  onFiltersChange: (filters: ClassFilters) => void
  sort: ClassSortKey
  onSortChange: (sort: ClassSortKey) => void
}

const ALL = 'all'

function FilterSelect({
  value,
  onValueChange,
  options,
  ariaLabel,
  className,
}: {
  value: string
  onValueChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  ariaLabel: string
  className?: string
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger size="sm" aria-label={ariaLabel} className={cn('w-full sm:w-44', className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/**
 * Search + filter + sort controls for the class list. On narrow screens
 * the filter selects collapse into a side sheet.
 */
export function ClassesToolbar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
}: ClassesToolbarProps) {
  const { t } = useI18n()
  const [sheetOpen, setSheetOpen] = useState(false)

  const activeCount = (filters.level !== ALL ? 1 : 0) + (filters.status !== ALL ? 1 : 0)

  function updateFilters(patch: Partial<ClassFilters>) {
    onFiltersChange({ ...filters, ...patch })
  }

  function resetFilters() {
    onFiltersChange({ level: ALL, status: ALL })
  }

  const levelOptions = [
    { value: ALL, label: t('classes.toolbar.allLevels') },
    ...STUDENT_LEVELS.map((level) => ({
      value: level,
      label: `${level} — ${t(levelLabelKey(level))}`,
    })),
  ]

  const statusOptions = [
    { value: ALL, label: t('classes.toolbar.allStatuses') },
    ...CLASS_STATUSES.map((status) => ({
      value: status,
      label: t(CLASS_STATUS_META[status].labelKey),
    })),
  ]

  const sortOptions = CLASS_SORT_OPTIONS.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  }))

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <SearchIcon
              className="text-muted-foreground absolute start-2.5 top-1/2 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t('classes.toolbar.search')}
              aria-label={t('classes.toolbar.search')}
              className="h-9 ps-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={(value) => onSortChange(value as ClassSortKey)}>
              <SelectTrigger
                size="sm"
                aria-label={t('classes.toolbar.sortLabel')}
                className="w-full flex-1 sm:w-auto"
              >
                <span className="text-muted-foreground">{t('classes.toolbar.sortLabel')}</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setSheetOpen(true)}
            >
              <SlidersHorizontalIcon aria-hidden="true" />
              {t('classes.toolbar.filters')}
              {activeCount > 0 ? <Badge variant="secondary">{activeCount}</Badge> : null}
            </Button>
          </div>
        </div>

        <div className="hidden flex-wrap items-center gap-2 md:flex">
          <FilterSelect
            value={filters.level}
            onValueChange={(value) => updateFilters({ level: value as ClassFilters['level'] })}
            options={levelOptions}
            ariaLabel={t('classes.toolbar.allLevels')}
          />
          <FilterSelect
            value={filters.status}
            onValueChange={(value) => updateFilters({ status: value as ClassFilters['status'] })}
            options={statusOptions}
            ariaLabel={t('classes.toolbar.allStatuses')}
          />
          {activeCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RotateCcwIcon aria-hidden="true" />
              {t('classes.toolbar.reset')}
            </Button>
          ) : null}
        </div>
      </CardContent>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>{t('classes.toolbar.filters')}</SheetTitle>
            <SheetDescription>{t('classes.toolbar.filtersDescription')}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4">
            <div className="grid gap-1.5">
              <Label>{t('classes.table.level')}</Label>
              <FilterSelect
                value={filters.level}
                onValueChange={(value) => updateFilters({ level: value as ClassFilters['level'] })}
                options={levelOptions}
                ariaLabel={t('classes.toolbar.allLevels')}
                className="w-full"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>{t('classes.table.status')}</Label>
              <FilterSelect
                value={filters.status}
                onValueChange={(value) =>
                  updateFilters({ status: value as ClassFilters['status'] })
                }
                options={statusOptions}
                ariaLabel={t('classes.toolbar.allStatuses')}
                className="w-full"
              />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcwIcon aria-hidden="true" />
              {t('classes.toolbar.reset')}
            </Button>
            <Button onClick={() => setSheetOpen(false)}>{t('common.close')}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Card>
  )
}
