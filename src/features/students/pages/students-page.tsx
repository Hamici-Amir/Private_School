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

import { StudentsCardList } from '../components/students-card-list'
import { StudentsStats } from '../components/students-stats'
import { StudentsTable } from '../components/students-table'
import { StudentsToolbar } from '../components/students-toolbar'
import { StudentDeleteDialog } from '../components/student-delete-dialog'
import { StudentFormSheet } from '../components/student-form-sheet'
import { StudentStatusDialog } from '../components/student-status-dialog'
import { DEFAULT_STUDENT_PAGE_SIZE, DEFAULT_STUDENT_SORT } from '../constants/students.constants'
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
  updateStudentStatus,
} from '../services/students.service'
import type {
  Student,
  StudentFilters,
  StudentFormValues,
  StudentSortKey,
  StudentStatus,
} from '../types/students.types'
import {
  filterStudents,
  paginateStudents,
  sortStudents,
} from '../utils/students.utils'

type LoadState = 'loading' | 'ready' | 'error'

const ALL_FILTERS: StudentFilters = { level: 'all', classId: 'all', status: 'all' }

/** Students list page: stats, search/filters/sort, table + mobile cards, CRUD. */
export function StudentsPage() {
  const { t } = useI18n()

  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [students, setStudents] = useState<Student[]>([])

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 250)
  const [filters, setFilters] = useState<StudentFilters>(ALL_FILTERS)
  const [sort, setSort] = useState<StudentSortKey>(DEFAULT_STUDENT_SORT)
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [formStudent, setFormStudent] = useState<Student | null>(null)
  const [formBusy, setFormBusy] = useState(false)

  const [statusTarget, setStatusTarget] = useState<Student | null>(null)
  const [statusBusy, setStatusBusy] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  useEffect(() => {
    let active = true
    getStudents()
      .then((data) => {
        if (!active) return
        setStudents(data)
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
    () => sortStudents(filterStudents(students, debouncedSearch, filters), sort),
    [students, debouncedSearch, filters, sort],
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / DEFAULT_STUDENT_PAGE_SIZE))
  const pageRows = useMemo(
    () => paginateStudents(filtered, page, DEFAULT_STUDENT_PAGE_SIZE),
    [filtered, page],
  )

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleFiltersChange(value: StudentFilters) {
    setFilters(value)
    setPage(1)
  }

  function handleSortChange(value: StudentSortKey) {
    setSort(value)
    setPage(1)
  }

  async function handleRetry() {
    setLoadState('loading')
    try {
      const data = await getStudents()
      setStudents(data)
      setLoadState('ready')
    } catch {
      setLoadState('error')
    }
  }

  function openCreate() {
    setFormStudent(null)
    setFormOpen(true)
  }

  function openEdit(student: Student) {
    setFormStudent(student)
    setFormOpen(true)
  }

  async function handleSubmitForm(values: StudentFormValues) {
    setFormBusy(true)
    try {
      if (formStudent) {
        const updated = await updateStudent(formStudent.id, values)
        setStudents((current) =>
          current.map((student) => (student.id === updated.id ? updated : student)),
        )
        toast.success(t('students.toasts.updated'))
      } else {
        const created = await createStudent(values)
        setStudents((current) => [created, ...current])
        toast.success(t('students.toasts.created'))
      }
      setFormOpen(false)
    } catch {
      toast.error(t('students.toasts.error'))
    } finally {
      setFormBusy(false)
    }
  }

  async function handleStatusSubmit(status: StudentStatus) {
    if (!statusTarget) return
    setStatusBusy(true)
    try {
      const updated = await updateStudentStatus(statusTarget.id, status)
      setStudents((current) =>
        current.map((student) => (student.id === updated.id ? updated : student)),
      )
      toast.success(t('students.toasts.statusUpdated'))
      setStatusTarget(null)
    } catch {
      toast.error(t('students.toasts.error'))
    } finally {
      setStatusBusy(false)
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleteBusy(true)
    try {
      await deleteStudent(deleteTarget.id)
      setStudents((current) => current.filter((student) => student.id !== deleteTarget.id))
      toast.success(t('students.toasts.deleted'))
      setDeleteTarget(null)
    } catch {
      toast.error(t('students.toasts.error'))
    } finally {
      setDeleteBusy(false)
    }
  }

  function resetFilters() {
    setFilters(ALL_FILTERS)
  }

  const hasActiveFilters =
    filters.level !== 'all' || filters.classId !== 'all' || filters.status !== 'all'

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>{t('students.title')}</PageTitle>
          <PageDescription>{t('students.subtitle')}</PageDescription>
        </div>
        <PageActions>
          <Button onClick={openCreate} data-testid="students-add-button">
            <UserPlusIcon aria-hidden="true" />
            {t('students.toolbar.addStudent')}
          </Button>
        </PageActions>
      </PageHeader>

      {loadState === 'error' ? (
        <ErrorState
          title={t('students.error.title')}
          description={t('students.error.description')}
          onRetry={handleRetry}
        />
      ) : loadState === 'loading' ? (
        <div className="space-y-4" data-testid="students-skeleton">
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
          <StudentsStats students={students} />

          <StudentsToolbar
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
              title={t('students.empty.title')}
              description={t('students.empty.description')}
              action={
                <Button onClick={openCreate}>
                  <UserPlusIcon aria-hidden="true" />
                  {t('students.empty.add')}
                </Button>
              }
              secondaryAction={
                hasActiveFilters ? (
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <RotateCcwIcon aria-hidden="true" />
                    {t('students.toolbar.reset')}
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <p className="text-muted-foreground text-sm">
                {t('students.toolbar.count', { count: filtered.length })}
              </p>
              <StudentsTable
                students={pageRows}
                sort={sort}
                onSortChange={setSort}
                onEdit={openEdit}
                onChangeStatus={setStatusTarget}
                onDelete={setDeleteTarget}
              />
              <StudentsCardList
                students={pageRows}
                onEdit={openEdit}
                onChangeStatus={setStatusTarget}
                onDelete={setDeleteTarget}
              />
              <DataTablePagination
                pageIndex={page - 1}
                pageCount={pageCount}
                pageSize={DEFAULT_STUDENT_PAGE_SIZE}
                totalRows={filtered.length}
                onPageChange={(index) => setPage(index + 1)}
              />
            </>
          )}
        </>
      )}

      <StudentFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        student={formStudent}
        busy={formBusy}
        onSubmit={handleSubmitForm}
      />
      <StudentStatusDialog
        key={statusTarget?.id ?? 'none'}
        student={statusTarget}
        open={statusTarget !== null}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null)
        }}
        busy={statusBusy}
        onSubmit={handleStatusSubmit}
      />
      <StudentDeleteDialog
        student={deleteTarget}
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