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
import { useI18n } from '@/hooks/use-i18n'
import { cn } from '@/lib/utils'

import {
  STUDENT_LEVELS,
  STUDENT_SORT_OPTIONS,
  STUDENT_STATUSES,
  getClassesForLevel,
  levelLabelKey,
} from '../constants/students.constants'
import type {
  StudentFilters,
  StudentSortKey,
} from '../types/students.types'

interface StudentsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  filters: StudentFilters
  onFiltersChange: (filters: StudentFilters) => void
  sort: StudentSortKey
  onSortChange: (sort: StudentSortKey) => void
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
 * Search + filter + sort controls for the student list. On narrow screens
 * the filter selects collapse into a side sheet.
 */
export function StudentsToolbar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
}: StudentsToolbarProps) {
  const { t } = useI18n()
  const [sheetOpen, setSheetOpen] = useState(false)

  const activeCount =
    (filters.level !== ALL ? 1 : 0) + (filters.classId !== ALL ? 1 : 0) + (filters.status !== ALL ? 1 : 0)

  function updateFilters(patch: Partial<StudentFilters>) {
    const next: StudentFilters = { ...filters, ...patch }
    if (patch.level && patch.level !== filters.level) {
      const classStillValid = getClassesForLevel(patch.level).some(
        (studentClass) => studentClass.id === next.classId,
      )
      if (!classStillValid) next.classId = ALL
    }
    onFiltersChange(next)
  }

  function resetFilters() {
    onFiltersChange({ level: ALL, classId: ALL, status: ALL })
  }

  const levelOptions = [
    { value: ALL, label: t('students.toolbar.allLevels') },
    ...STUDENT_LEVELS.map((level) => ({
      value: level,
      label: `${level} — ${t(levelLabelKey(level))}`,
    })),
  ]

  const classOptions = [
    { value: ALL, label: t('students.toolbar.allClasses') },
    ...getClassesForLevel(filters.level).map((studentClass) => ({
      value: studentClass.id,
      label: studentClass.label,
    })),
  ]

  const statusOptions = [
    { value: ALL, label: t('students.toolbar.allStatuses') },
    ...STUDENT_STATUSES.map((status) => ({
      value: status,
      label: t(`students.statuses.${status}` as const),
    })),
  ]

  const sortOptions = STUDENT_SORT_OPTIONS.map((option) => ({
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
              placeholder={t('students.toolbar.search')}
              aria-label={t('students.toolbar.search')}
              className="h-9 ps-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={(value) => onSortChange(value as StudentSortKey)}>
              <SelectTrigger
                size="sm"
                aria-label={t('students.toolbar.sortLabel')}
                className="w-full flex-1 sm:w-auto"
              >
                <span className="text-muted-foreground">{t('students.toolbar.sortLabel')}</span>
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
              {t('students.toolbar.filters')}
              {activeCount > 0 ? <Badge variant="secondary">{activeCount}</Badge> : null}
            </Button>
          </div>
        </div>

        <div className="hidden flex-wrap items-center gap-2 md:flex">
          <FilterSelect
            value={filters.level}
            onValueChange={(value) => updateFilters({ level: value as StudentFilters['level'] })}
            options={levelOptions}
            ariaLabel={t('students.toolbar.allLevels')}
          />
          <FilterSelect
            value={filters.classId}
            onValueChange={(value) => updateFilters({ classId: value })}
            options={classOptions}
            ariaLabel={t('students.toolbar.allClasses')}
          />
          <FilterSelect
            value={filters.status}
            onValueChange={(value) => updateFilters({ status: value as StudentFilters['status'] })}
            options={statusOptions}
            ariaLabel={t('students.toolbar.allStatuses')}
          />
          {activeCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RotateCcwIcon aria-hidden="true" />
              {t('students.toolbar.reset')}
            </Button>
          ) : null}
        </div>
      </CardContent>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>{t('students.toolbar.filters')}</SheetTitle>
            <SheetDescription>{t('students.toolbar.filtersDescription')}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4">
            <div className="grid gap-1.5">
              <Label>{t('students.table.level')}</Label>
              <FilterSelect
                value={filters.level}
                onValueChange={(value) =>
                  updateFilters({ level: value as StudentFilters['level'] })
                }
                options={levelOptions}
                ariaLabel={t('students.table.level')}
                className="w-full"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>{t('students.table.className')}</Label>
              <FilterSelect
                value={filters.classId}
                onValueChange={(value) => updateFilters({ classId: value })}
                options={classOptions}
                ariaLabel={t('students.table.className')}
                className="w-full"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>{t('students.table.status')}</Label>
              <FilterSelect
                value={filters.status}
                onValueChange={(value) =>
                  updateFilters({ status: value as StudentFilters['status'] })
                }
                options={statusOptions}
                ariaLabel={t('students.table.status')}
                className="w-full"
              />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcwIcon aria-hidden="true" />
              {t('students.toolbar.reset')}
            </Button>
            <Button onClick={() => setSheetOpen(false)}>{t('common.close')}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Card>
  )
}