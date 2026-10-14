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

import type { Student } from '@/features/students/types/students.types'
import { getStudents } from '@/features/students/services/students.service'

import { ParentsCardList } from '../components/parents-card-list'
import { ParentsStats } from '../components/parents-stats'
import { ParentsTable } from '../components/parents-table'
import { ParentsToolbar } from '../components/parents-toolbar'
import { ParentDeleteDialog } from '../components/parent-delete-dialog'
import { ParentFormSheet } from '../components/parent-form-sheet'
import { DEFAULT_PARENT_PAGE_SIZE, DEFAULT_PARENT_SORT } from '../constants/parents.constants'
import {
  createParent,
  deleteParent,
  getParents,
  updateParent,
} from '../services/parents.service'
import type { Parent, ParentFilters, ParentFormValues, ParentSortKey } from '../types/parents.types'
import { filterParents, paginateParents, sortParents } from '../utils/parents.utils'

type LoadState = 'loading' | 'ready' | 'error'

const ALL_FILTERS: ParentFilters = { relationship: 'all', status: 'all', city: 'all', children: 'all' }

/** Parents list page: stats, search/filters/sort, table + mobile cards, CRUD. */
export function ParentsPage() {
  const { t } = useI18n()

  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [parents, setParents] = useState<Parent[]>([])
  const [students, setStudents] = useState<Student[]>([])

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 250)
  const [filters, setFilters] = useState<ParentFilters>(ALL_FILTERS)
  const [sort, setSort] = useState<ParentSortKey>(DEFAULT_PARENT_SORT)
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [formParent, setFormParent] = useState<Parent | null>(null)
  const [formBusy, setFormBusy] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Parent | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([getParents(), getStudents()])
      .then(([parentData, studentData]) => {
        if (!active) return
        setParents(parentData)
        setStudents(studentData)
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
    () => sortParents(filterParents(parents, debouncedSearch, filters), sort),
    [parents, debouncedSearch, filters, sort],
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / DEFAULT_PARENT_PAGE_SIZE))
  const pageRows = useMemo(
    () => paginateParents(filtered, page, DEFAULT_PARENT_PAGE_SIZE),
    [filtered, page],
  )

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleFiltersChange(value: ParentFilters) {
    setFilters(value)
    setPage(1)
  }

  function handleSortChange(value: ParentSortKey) {
    setSort(value)
    setPage(1)
  }

  async function handleRetry() {
    setLoadState('loading')
    try {
      const [parentData, studentData] = await Promise.all([getParents(), getStudents()])
      setParents(parentData)
      setStudents(studentData)
      setLoadState('ready')
    } catch {
      setLoadState('error')
    }
  }

  function openCreate() {
    setFormParent(null)
    setFormOpen(true)
  }

  function openEdit(parent: Parent) {
    setFormParent(parent)
    setFormOpen(true)
  }

  async function handleSubmitForm(values: ParentFormValues) {
    setFormBusy(true)
    try {
      if (formParent) {
        const updated = await updateParent(formParent.id, values)
        setParents((current) =>
          current.map((parent) => (parent.id === updated.id ? updated : parent)),
        )
        toast.success(t('parents.toasts.updated'))
      } else {
        const created = await createParent(values)
        setParents((current) => [created, ...current])
        toast.success(t('parents.toasts.created'))
      }
      setFormOpen(false)
    } catch {
      toast.error(t('parents.toasts.error'))
    } finally {
      setFormBusy(false)
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleteBusy(true)
    try {
      await deleteParent(deleteTarget.id)
      setParents((current) => current.filter((parent) => parent.id !== deleteTarget.id))
      toast.success(t('parents.toasts.deleted'))
      setDeleteTarget(null)
    } catch {
      toast.error(t('parents.toasts.error'))
    } finally {
      setDeleteBusy(false)
    }
  }

  function resetFilters() {
    setFilters(ALL_FILTERS)
  }

  const hasActiveFilters =
    filters.relationship !== 'all' ||
    filters.status !== 'all' ||
    filters.city !== 'all' ||
    filters.children !== 'all'

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>{t('parents.title')}</PageTitle>
          <PageDescription>{t('parents.subtitle')}</PageDescription>
        </div>
        <PageActions>
          <Button onClick={openCreate} data-testid="parents-add-button">
            <UserPlusIcon aria-hidden="true" />
            {t('parents.toolbar.addParent')}
          </Button>
        </PageActions>
      </PageHeader>

      {loadState === 'error' ? (
        <ErrorState
          title={t('parents.error.title')}
          description={t('parents.error.description')}
          onRetry={handleRetry}
        />
      ) : loadState === 'loading' ? (
        <div className="space-y-4" data-testid="parents-skeleton">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <TableSkeleton rows={5} columns={7} />
        </div>
      ) : (
        <>
          <ParentsStats parents={parents} />

          <ParentsToolbar
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
              title={t('parents.empty.title')}
              description={t('parents.empty.description')}
              action={
                <Button onClick={openCreate}>
                  <UserPlusIcon aria-hidden="true" />
                  {t('parents.empty.add')}
                </Button>
              }
              secondaryAction={
                hasActiveFilters ? (
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <RotateCcwIcon aria-hidden="true" />
                    {t('parents.toolbar.reset')}
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <p className="text-muted-foreground text-sm">
                {t('parents.toolbar.count', { count: filtered.length })}
              </p>
              <ParentsTable
                parents={pageRows}
                students={students}
                sort={sort}
                onSortChange={setSort}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
              <ParentsCardList
                parents={pageRows}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
              <DataTablePagination
                pageIndex={page - 1}
                pageCount={pageCount}
                pageSize={DEFAULT_PARENT_PAGE_SIZE}
                totalRows={filtered.length}
                onPageChange={(index) => setPage(index + 1)}
              />
            </>
          )}
        </>
      )}

      <ParentFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        parent={formParent}
        busy={formBusy}
        onSubmit={handleSubmitForm}
      />
      <ParentDeleteDialog
        parent={deleteTarget}
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