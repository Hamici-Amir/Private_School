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
  PARENT_CITIES,
  PARENT_RELATIONSHIPS,
  PARENT_RELATIONSHIP_META,
  PARENT_SORT_OPTIONS,
  PARENT_STATUSES,
  PARENT_STATUS_META,
} from '../constants/parents.constants'
import type { ParentFilters, ParentSortKey } from '../types/parents.types'

interface ParentsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  filters: ParentFilters
  onFiltersChange: (filters: ParentFilters) => void
  sort: ParentSortKey
  onSortChange: (sort: ParentSortKey) => void
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
 * Search + filter + sort controls for the parent list. On narrow screens
 * the filter selects collapse into a side sheet.
 */
export function ParentsToolbar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
}: ParentsToolbarProps) {
  const { t } = useI18n()
  const [sheetOpen, setSheetOpen] = useState(false)

  const activeCount =
    (filters.relationship !== ALL ? 1 : 0) +
    (filters.status !== ALL ? 1 : 0) +
    (filters.city !== ALL ? 1 : 0) +
    (filters.children !== ALL ? 1 : 0)

  function updateFilters(patch: Partial<ParentFilters>) {
    onFiltersChange({ ...filters, ...patch })
  }

  function resetFilters() {
    onFiltersChange({ relationship: ALL, status: ALL, city: ALL, children: ALL })
  }

  const relationshipOptions = [
    { value: ALL, label: t('parents.toolbar.allRelationships') },
    ...PARENT_RELATIONSHIPS.map((relationship) => ({
      value: relationship,
      label: t(PARENT_RELATIONSHIP_META[relationship].labelKey),
    })),
  ]

  const statusOptions = [
    { value: ALL, label: t('parents.toolbar.allStatuses') },
    ...PARENT_STATUSES.map((status) => ({
      value: status,
      label: t(PARENT_STATUS_META[status].labelKey),
    })),
  ]

  const cityOptions = [
    { value: ALL, label: t('parents.toolbar.allCities') },
    ...PARENT_CITIES.map((city) => ({ value: city, label: city })),
  ]

  const childNumberOptions = [
    { value: ALL, label: t('parents.toolbar.allChildNumbers') },
    { value: 'one', label: t('parents.toolbar.oneChild') },
    { value: 'multiple', label: t('parents.toolbar.multipleChildren') },
  ]

  const sortOptions = PARENT_SORT_OPTIONS.map((option) => ({
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
              placeholder={t('parents.toolbar.search')}
              aria-label={t('parents.toolbar.search')}
              className="h-9 ps-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={(value) => onSortChange(value as ParentSortKey)}>
              <SelectTrigger
                size="sm"
                aria-label={t('parents.toolbar.sortLabel')}
                className="w-full flex-1 sm:w-auto"
              >
                <span className="text-muted-foreground">{t('parents.toolbar.sortLabel')}</span>
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
              {t('parents.toolbar.filters')}
              {activeCount > 0 ? <Badge variant="secondary">{activeCount}</Badge> : null}
            </Button>
          </div>
        </div>

        <div className="hidden flex-wrap items-center gap-2 md:flex">
          <FilterSelect
            value={filters.relationship}
            onValueChange={(value) =>
              updateFilters({ relationship: value as ParentFilters['relationship'] })
            }
            options={relationshipOptions}
            ariaLabel={t('parents.toolbar.allRelationships')}
          />
          <FilterSelect
            value={filters.status}
            onValueChange={(value) => updateFilters({ status: value as ParentFilters['status'] })}
            options={statusOptions}
            ariaLabel={t('parents.toolbar.allStatuses')}
          />
          <FilterSelect
            value={filters.city}
            onValueChange={(value) => updateFilters({ city: value })}
            options={cityOptions}
            ariaLabel={t('parents.toolbar.allCities')}
          />
          <FilterSelect
            value={filters.children}
            onValueChange={(value) =>
              updateFilters({ children: value as ParentFilters['children'] })
            }
            options={childNumberOptions}
            ariaLabel={t('parents.toolbar.allChildNumbers')}
          />
          {activeCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RotateCcwIcon aria-hidden="true" />
              {t('parents.toolbar.reset')}
            </Button>
          ) : null}
        </div>
      </CardContent>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>{t('parents.toolbar.filters')}</SheetTitle>
            <SheetDescription>{t('parents.toolbar.filtersDescription')}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4">
            <div className="grid gap-1.5">
              <Label>{t('parents.table.relationship')}</Label>
              <FilterSelect
                value={filters.relationship}
                onValueChange={(value) =>
                  updateFilters({ relationship: value as ParentFilters['relationship'] })
                }
                options={relationshipOptions}
                ariaLabel={t('parents.table.relationship')}
                className="w-full"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>{t('parents.table.status')}</Label>
              <FilterSelect
                value={filters.status}
                onValueChange={(value) =>
                  updateFilters({ status: value as ParentFilters['status'] })
                }
                options={statusOptions}
                ariaLabel={t('parents.table.status')}
                className="w-full"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>{t('parents.details.city')}</Label>
              <FilterSelect
                value={filters.city}
                onValueChange={(value) => updateFilters({ city: value })}
                options={cityOptions}
                ariaLabel={t('parents.toolbar.allCities')}
                className="w-full"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>{t('parents.table.children')}</Label>
              <FilterSelect
                value={filters.children}
                onValueChange={(value) =>
                  updateFilters({ children: value as ParentFilters['children'] })
                }
                options={childNumberOptions}
                ariaLabel={t('parents.toolbar.allChildNumbers')}
                className="w-full"
              />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcwIcon aria-hidden="true" />
              {t('parents.toolbar.reset')}
            </Button>
            <Button onClick={() => setSheetOpen(false)}>{t('common.close')}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Card>
  )
}