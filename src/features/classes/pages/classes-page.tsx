import { useEffect, useMemo, useState } from 'react'
import { GraduationCapIcon, PlusIcon, RotateCcwIcon } from 'lucide-react'

import { DataTablePagination } from '@/components/data-display/data-table/pagination'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { CardSkeleton, TableSkeleton } from '@/components/feedback/loading-skeletons'
import {
  PageActions,
  PageContainer,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/layout/page'
import { Button } from '@/components/ui/button'
import { getStudents } from '@/features/students/services/students.service'
import type { Student } from '@/features/students/types/students.types'
import { getTeachers } from '@/features/teachers/services/teachers.service'
import type { Teacher } from '@/features/teachers/types/teachers.types'
import { useDebouncedValue } from '@/hooks/use-debounce'
import { useI18n } from '@/hooks/use-i18n'
import { toast } from '@/lib/toast'

import { ClassesCardList } from '../components/classes-card-list'
import { ClassesStats } from '../components/classes-stats'
import { ClassesTable } from '../components/classes-table'
import { ClassesToolbar } from '../components/classes-toolbar'
import { ClassDeleteDialog } from '../components/class-delete-dialog'
import { ClassFormSheet } from '../components/class-form-sheet'
import { DEFAULT_CLASS_PAGE_SIZE, DEFAULT_CLASS_SORT } from '../constants/classes.constants'
import { createClass, deleteClass, getClasses, updateClass } from '../services/classes.service'
import type {
  ClassFilters,
  ClassFormValues,
  ClassSortKey,
  SchoolClass,
} from '../types/classes.types'
import {
  buildClassCounts,
  filterClasses,
  paginateClasses,
  sortClasses,
} from '../utils/classes.utils'

type LoadState = 'loading' | 'ready' | 'error'

const ALL_FILTERS: ClassFilters = {
  level: 'all',
  status: 'all',
}

/** Classes list page: stats, search/filters/sort, table + mobile cards, CRUD. */
export function ClassesPage() {
  const { t } = useI18n()

  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 250)
  const [filters, setFilters] = useState<ClassFilters>(ALL_FILTERS)
  const [sort, setSort] = useState<ClassSortKey>(DEFAULT_CLASS_SORT)
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [formClass, setFormClass] = useState<SchoolClass | null>(null)
  const [formBusy, setFormBusy] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<SchoolClass | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([getClasses(), getStudents(), getTeachers()])
      .then(([classesData, studentsData, teachersData]) => {
        if (!active) return
        setClasses(classesData)
        setStudents(studentsData)
        setTeachers(teachersData)
        setLoadState('ready')
      })
      .catch(() => {
        if (!active) return
        setLoadState('error')
      })
    return () => {
      active = false
    }
  }, [])

  const counts = useMemo(
    () => buildClassCounts(classes, students, teachers),
    [classes, students, teachers],
  )

  const filtered = useMemo(
    () => sortClasses(filterClasses(classes, debouncedSearch, filters), sort, counts),
    [classes, debouncedSearch, filters, sort, counts],
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / DEFAULT_CLASS_PAGE_SIZE))
  const pageRows = useMemo(
    () => paginateClasses(filtered, page, DEFAULT_CLASS_PAGE_SIZE),
    [filtered, page],
  )

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleFiltersChange(value: ClassFilters) {
    setFilters(value)
    setPage(1)
  }

  function handleSortChange(value: ClassSortKey) {
    setSort(value)
    setPage(1)
  }

  async function handleRetry() {
    setLoadState('loading')
    try {
      const [classesData, studentsData, teachersData] = await Promise.all([
        getClasses(),
        getStudents(),
        getTeachers(),
      ])
      setClasses(classesData)
      setStudents(studentsData)
      setTeachers(teachersData)
      setLoadState('ready')
    } catch {
      setLoadState('error')
    }
  }

  function openCreate() {
    setFormClass(null)
    setFormOpen(true)
  }

  function openEdit(schoolClass: SchoolClass) {
    setFormClass(schoolClass)
    setFormOpen(true)
  }

  async function handleSubmitForm(values: ClassFormValues) {
    setFormBusy(true)
    try {
      if (formClass) {
        const updated = await updateClass(formClass.id, values)
        setClasses((current) =>
          current.map((schoolClass) => (schoolClass.id === updated.id ? updated : schoolClass)),
        )
        toast.success(t('classes.toasts.updated'))
      } else {
        const created = await createClass(values)
        setClasses((current) => [created, ...current])
        toast.success(t('classes.toasts.created'))
      }
      setFormOpen(false)
    } catch {
      toast.error(t('classes.toasts.error'))
    } finally {
      setFormBusy(false)
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleteBusy(true)
    try {
      await deleteClass(deleteTarget.id)
      setClasses((current) => current.filter((schoolClass) => schoolClass.id !== deleteTarget.id))
      toast.success(t('classes.toasts.deleted'))
      setDeleteTarget(null)
    } catch {
      toast.error(t('classes.toasts.error'))
    } finally {
      setDeleteBusy(false)
    }
  }

  function resetFilters() {
    setFilters(ALL_FILTERS)
  }

  const hasActiveFilters = filters.level !== 'all' || filters.status !== 'all'

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>{t('classes.title')}</PageTitle>
          <PageDescription>{t('classes.subtitle')}</PageDescription>
        </div>
        <PageActions>
          <Button onClick={openCreate} data-testid="classes-add-button">
            <PlusIcon aria-hidden="true" />
            {t('classes.toolbar.addClass')}
          </Button>
        </PageActions>
      </PageHeader>

      {loadState === 'error' ? (
        <ErrorState
          title={t('classes.error.title')}
          description={t('classes.error.description')}
          onRetry={handleRetry}
        />
      ) : loadState === 'loading' ? (
        <div className="space-y-4" data-testid="classes-skeleton">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <TableSkeleton rows={5} columns={6} />
        </div>
      ) : (
        <>
          <ClassesStats classes={classes} />

          <ClassesToolbar
            search={search}
            onSearchChange={handleSearchChange}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            sort={sort}
            onSortChange={handleSortChange}
          />

          {filtered.length === 0 ? (
            <EmptyState
              icon={GraduationCapIcon}
              title={t('classes.empty.title')}
              description={t('classes.empty.description')}
              action={
                <Button onClick={openCreate}>
                  <PlusIcon aria-hidden="true" />
                  {t('classes.empty.add')}
                </Button>
              }
              secondaryAction={
                hasActiveFilters ? (
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <RotateCcwIcon aria-hidden="true" />
                    {t('classes.toolbar.reset')}
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <p className="text-muted-foreground text-sm">
                {t('classes.toolbar.count', { count: filtered.length })}
              </p>
              <ClassesTable
                classes={pageRows}
                counts={counts}
                teachers={teachers}
                sort={sort}
                onSortChange={setSort}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
              <ClassesCardList
                classes={pageRows}
                counts={counts}
                teachers={teachers}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
              <DataTablePagination
                pageIndex={page - 1}
                pageCount={pageCount}
                pageSize={DEFAULT_CLASS_PAGE_SIZE}
                totalRows={filtered.length}
                onPageChange={(index) => setPage(index + 1)}
              />
            </>
          )}
        </>
      )}

      <ClassFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        schoolClass={formClass}
        busy={formBusy}
        onSubmit={handleSubmitForm}
      />
      <ClassDeleteDialog
        schoolClass={deleteTarget}
        count={deleteTarget ? (counts[deleteTarget.id] ?? null) : null}
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        busy={deleteBusy}
        onConfirm={handleDeleteConfirm}
      />
    </PageContainer>
  )
}
