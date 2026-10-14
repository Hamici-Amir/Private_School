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
  TEACHER_CITIES,
  TEACHER_QUALIFICATIONS,
  TEACHER_QUALIFICATION_META,
  TEACHER_SORT_OPTIONS,
  TEACHER_SPECIALTIES,
  TEACHER_SPECIALTY_META,
  TEACHER_STATUSES,
  TEACHER_STATUS_META,
} from '../constants/teachers.constants'
import type { TeacherFilters, TeacherSortKey } from '../types/teachers.types'

interface TeachersToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  filters: TeacherFilters
  onFiltersChange: (filters: TeacherFilters) => void
  sort: TeacherSortKey
  onSortChange: (sort: TeacherSortKey) => void
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
 * Search + filter + sort controls for the teacher list. On narrow screens
 * the filter selects collapse into a side sheet.
 */
export function TeachersToolbar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
}: TeachersToolbarProps) {
  const { t } = useI18n()
  const [sheetOpen, setSheetOpen] = useState(false)

  const activeCount =
    (filters.specialty !== ALL ? 1 : 0) +
    (filters.status !== ALL ? 1 : 0) +
    (filters.city !== ALL ? 1 : 0) +
    (filters.qualification !== ALL ? 1 : 0)

  function updateFilters(patch: Partial<TeacherFilters>) {
    onFiltersChange({ ...filters, ...patch })
  }

  function resetFilters() {
    onFiltersChange({ specialty: ALL, status: ALL, city: ALL, qualification: ALL })
  }

  const specialtyOptions = [
    { value: ALL, label: t('teachers.toolbar.allSpecialties') },
    ...TEACHER_SPECIALTIES.map((specialty) => ({
      value: specialty,
      label: t(TEACHER_SPECIALTY_META[specialty].labelKey),
    })),
  ]

  const statusOptions = [
    { value: ALL, label: t('teachers.toolbar.allStatuses') },
    ...TEACHER_STATUSES.map((status) => ({
      value: status,
      label: t(TEACHER_STATUS_META[status].labelKey),
    })),
  ]

  const cityOptions = [
    { value: ALL, label: t('teachers.toolbar.allCities') },
    ...TEACHER_CITIES.map((city) => ({ value: city, label: city })),
  ]

  const qualificationOptions = [
    { value: ALL, label: t('teachers.toolbar.allQualifications') },
    ...TEACHER_QUALIFICATIONS.map((qualification) => ({
      value: qualification,
      label: t(TEACHER_QUALIFICATION_META[qualification].labelKey),
    })),
  ]

  const sortOptions = TEACHER_SORT_OPTIONS.map((option) => ({
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
              placeholder={t('teachers.toolbar.search')}
              aria-label={t('teachers.toolbar.search')}
              className="h-9 ps-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={(value) => onSortChange(value as TeacherSortKey)}>
              <SelectTrigger
                size="sm"
                aria-label={t('teachers.toolbar.sortLabel')}
                className="w-full flex-1 sm:w-auto"
              >
                <span className="text-muted-foreground">{t('teachers.toolbar.sortLabel')}</span>
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
              {t('teachers.toolbar.filters')}
              {activeCount > 0 ? <Badge variant="secondary">{activeCount}</Badge> : null}
            </Button>
          </div>
        </div>

        <div className="hidden flex-wrap items-center gap-2 md:flex">
          <FilterSelect
            value={filters.specialty}
            onValueChange={(value) =>
              updateFilters({ specialty: value as TeacherFilters['specialty'] })
            }
            options={specialtyOptions}
            ariaLabel={t('teachers.toolbar.allSpecialties')}
          />
          <FilterSelect
            value={filters.status}
            onValueChange={(value) => updateFilters({ status: value as TeacherFilters['status'] })}
            options={statusOptions}
            ariaLabel={t('teachers.toolbar.allStatuses')}
          />
          <FilterSelect
            value={filters.city}
            onValueChange={(value) => updateFilters({ city: value })}
            options={cityOptions}
            ariaLabel={t('teachers.toolbar.allCities')}
          />
          <FilterSelect
            value={filters.qualification}
            onValueChange={(value) =>
              updateFilters({ qualification: value as TeacherFilters['qualification'] })
            }
            options={qualificationOptions}
            ariaLabel={t('teachers.toolbar.allQualifications')}
          />
          {activeCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RotateCcwIcon aria-hidden="true" />
              {t('teachers.toolbar.reset')}
            </Button>
          ) : null}
        </div>
      </CardContent>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>{t('teachers.toolbar.filters')}</SheetTitle>
            <SheetDescription>{t('teachers.toolbar.filtersDescription')}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4">
            <div className="grid gap-1.5">
              <Label>{t('teachers.details.specialty')}</Label>
              <FilterSelect
                value={filters.specialty}
                onValueChange={(value) =>
                  updateFilters({ specialty: value as TeacherFilters['specialty'] })
                }
                options={specialtyOptions}
                ariaLabel={t('teachers.details.specialty')}
                className="w-full"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>{t('teachers.table.status')}</Label>
              <FilterSelect
                value={filters.status}
                onValueChange={(value) =>
                  updateFilters({ status: value as TeacherFilters['status'] })
                }
                options={statusOptions}
                ariaLabel={t('teachers.table.status')}
                className="w-full"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>{t('teachers.details.city')}</Label>
              <FilterSelect
                value={filters.city}
                onValueChange={(value) => updateFilters({ city: value })}
                options={cityOptions}
                ariaLabel={t('teachers.toolbar.allCities')}
                className="w-full"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>{t('teachers.details.qualification')}</Label>
              <FilterSelect
                value={filters.qualification}
                onValueChange={(value) =>
                  updateFilters({ qualification: value as TeacherFilters['qualification'] })
                }
                options={qualificationOptions}
                ariaLabel={t('teachers.toolbar.allQualifications')}
                className="w-full"
              />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcwIcon aria-hidden="true" />
              {t('teachers.toolbar.reset')}
            </Button>
            <Button onClick={() => setSheetOpen(false)}>{t('common.close')}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Card>
  )
}