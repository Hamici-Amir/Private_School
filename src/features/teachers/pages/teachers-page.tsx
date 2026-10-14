import { useEffect, useMemo, useState } from 'react'
import { RotateCcwIcon, UserPlusIcon } from 'lucide-react'

import { DataTablePagination } from '@/components/data-display/data-table/pagination'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { CardSkeleton, TableSkeleton } from '@/components/feedback/loading-skeletons'
import { PageActions, PageContainer, PageDescription, PageHeader, PageTitle } from '@/components/layout/page'
import { Button } from '@/components/ui/button'
import { useDebouncedValue } from '@/hooks/use-debounce'
import { useI18n } from '@/hooks/use-i18n'
import { toast } from '@/lib/toast'

import { TeachersCardList } from '../components/teachers-card-list'
import { TeachersStats } from '../components/teachers-stats'
import { TeachersTable } from '../components/teachers-table'
import { TeachersToolbar } from '../components/teachers-toolbar'
import { TeacherDeleteDialog } from '../components/teacher-delete-dialog'
import { TeacherFormSheet } from '../components/teacher-form-sheet'
import { DEFAULT_TEACHER_PAGE_SIZE, DEFAULT_TEACHER_SORT } from '../constants/teachers.constants'
import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  updateTeacher,
} from '../services/teachers.service'
import type { Teacher, TeacherFilters, TeacherFormValues, TeacherSortKey } from '../types/teachers.types'
import { filterTeachers, paginateTeachers, sortTeachers } from '../utils/teachers.utils'

type LoadState = 'loading' | 'ready' | 'error'

const ALL_FILTERS: TeacherFilters = {
  specialty: 'all',
  status: 'all',
  city: 'all',
  qualification: 'all',
}

/** Teachers list page: stats, search/filters/sort, table + mobile cards, CRUD. */
export function TeachersPage() {
  const { t } = useI18n()

  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [teachers, setTeachers] = useState<Teacher[]>([])

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 250)
  const [filters, setFilters] = useState<TeacherFilters>(ALL_FILTERS)
  const [sort, setSort] = useState<TeacherSortKey>(DEFAULT_TEACHER_SORT)
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [formTeacher, setFormTeacher] = useState<Teacher | null>(null)
  const [formBusy, setFormBusy] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  useEffect(() => {
    let active = true
    getTeachers()
      .then((data) => {
        if (!active) return
        setTeachers(data)
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

  const filtered = useMemo(
    () => sortTeachers(filterTeachers(teachers, debouncedSearch, filters), sort),
    [teachers, debouncedSearch, filters, sort],
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / DEFAULT_TEACHER_PAGE_SIZE))
  const pageRows = useMemo(
    () => paginateTeachers(filtered, page, DEFAULT_TEACHER_PAGE_SIZE),
    [filtered, page],
  )

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleFiltersChange(value: TeacherFilters) {
    setFilters(value)
    setPage(1)
  }

  function handleSortChange(value: TeacherSortKey) {
    setSort(value)
    setPage(1)
  }

  async function handleRetry() {
    setLoadState('loading')
    try {
      const data = await getTeachers()
      setTeachers(data)
      setLoadState('ready')
    } catch {
      setLoadState('error')
    }
  }

  function openCreate() {
    setFormTeacher(null)
    setFormOpen(true)
  }

  function openEdit(teacher: Teacher) {
    setFormTeacher(teacher)
    setFormOpen(true)
  }

  async function handleSubmitForm(values: TeacherFormValues) {
    setFormBusy(true)
    try {
      if (formTeacher) {
        const updated = await updateTeacher(formTeacher.id, values)
        setTeachers((current) =>
          current.map((teacher) => (teacher.id === updated.id ? updated : teacher)),
        )
        toast.success(t('teachers.toasts.updated'))
      } else {
        const created = await createTeacher(values)
        setTeachers((current) => [created, ...current])
        toast.success(t('teachers.toasts.created'))
      }
      setFormOpen(false)
    } catch {
      toast.error(t('teachers.toasts.error'))
    } finally {
      setFormBusy(false)
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleteBusy(true)
    try {
      await deleteTeacher(deleteTarget.id)
      setTeachers((current) => current.filter((teacher) => teacher.id !== deleteTarget.id))
      toast.success(t('teachers.toasts.deleted'))
      setDeleteTarget(null)
    } catch {
      toast.error(t('teachers.toasts.error'))
    } finally {
      setDeleteBusy(false)
    }
  }

  function resetFilters() {
    setFilters(ALL_FILTERS)
  }

  const hasActiveFilters =
    filters.specialty !== 'all' ||
    filters.status !== 'all' ||
    filters.city !== 'all' ||
    filters.qualification !== 'all'

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>{t('teachers.title')}</PageTitle>
          <PageDescription>{t('teachers.subtitle')}</PageDescription>
        </div>
        <PageActions>
          <Button onClick={openCreate} data-testid="teachers-add-button">
            <UserPlusIcon aria-hidden="true" />
            {t('teachers.toolbar.addTeacher')}
          </Button>
        </PageActions>
      </PageHeader>

      {loadState === 'error' ? (
        <ErrorState
          title={t('teachers.error.title')}
          description={t('teachers.error.description')}
          onRetry={handleRetry}
        />
      ) : loadState === 'loading' ? (
        <div className="space-y-4" data-testid="teachers-skeleton">
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
          <TeachersStats teachers={teachers} />

          <TeachersToolbar
            search={search}
            onSearchChange={handleSearchChange}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            sort={sort}
            onSortChange={handleSortChange}
          />

          {filtered.length === 0 ? (
            <EmptyState
              icon={UserPlusIcon}
              title={t('teachers.empty.title')}
              description={t('teachers.empty.description')}
              action={
                <Button onClick={openCreate}>
                  <UserPlusIcon aria-hidden="true" />
                  {t('teachers.empty.add')}
                </Button>
              }
              secondaryAction={
                hasActiveFilters ? (
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <RotateCcwIcon aria-hidden="true" />
                    {t('teachers.toolbar.reset')}
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <p className="text-muted-foreground text-sm">
                {t('teachers.toolbar.count', { count: filtered.length })}
              </p>
              <TeachersTable
                teachers={pageRows}
                sort={sort}
                onSortChange={setSort}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
              <TeachersCardList
                teachers={pageRows}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
              <DataTablePagination
                pageIndex={page - 1}
                pageCount={pageCount}
                pageSize={DEFAULT_TEACHER_PAGE_SIZE}
                totalRows={filtered.length}
                onPageChange={(index) => setPage(index + 1)}
              />
            </>
          )}
        </>
      )}

      <TeacherFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        teacher={formTeacher}
        busy={formBusy}
        onSubmit={handleSubmitForm}
      />
      <TeacherDeleteDialog
        teacher={deleteTarget}
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