import { useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CalendarCheckIcon,
  ClipboardListIcon,
  ContactIcon,
  CreditCardIcon,
  FileTextIcon,
  GraduationCapIcon,
  IdCardIcon,
  PhoneIcon,
  PencilIcon,
  UserRoundIcon,
} from 'lucide-react'
import { Link, useParams } from 'react-router'

import { StatusBadge } from '@/components/data-display/status-badge'
import { InfoCard, KeyValue } from '@/components/data-display/info-card'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { CardSkeleton } from '@/components/feedback/loading-skeletons'
import { PageActions, PageContainer, PageDescription, PageHeader, PageTitle } from '@/components/layout/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useI18n } from '@/hooks/use-i18n'
import { formatDate } from '@/lib/format'

import { getParentsByStudentId } from '@/features/parents/services/parents.service'
import { getEnrollments } from '@/features/enrollments/services/enrollment.service'
import type { Enrollment } from '@/features/enrollments/types/enrollments.types'
import { getParentFullName } from '@/features/parents/utils/parents.utils'
import type { Parent } from '@/features/parents/types/parents.types'

import { StudentAvatar } from '../components/student-avatar'
import { StudentFormSheet } from '../components/student-form-sheet'
import {
  STUDENT_GENDER_META,
  STUDENT_STATUS_META,
  findStudentClass,
  levelLabelKey,
} from '../constants/students.constants'
import { getStudent, updateStudent } from '../services/students.service'
import type { Student, StudentFormValues } from '../types/students.types'
import {
  formatStudentPhone,
  getStudentAge,
  getStudentFullName,
} from '../utils/students.utils'

type DetailState = 'loading' | 'ready' | 'notfound' | 'error'

function PlaceholderTab({ icon: Icon }: { icon: typeof IdCardIcon }) {
  const { t } = useI18n()
  return (
    <EmptyState
      icon={Icon}
      title={t('students.details.comingSoon')}
      description={t('students.details.comingSoonDescription')}
    />
  )
}

/** Student profile page: a real Overview tab and placeholder sub-tabs. */
export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useI18n()

  if (!id) {
    return (
      <PageContainer>
        <EmptyState
          icon={UserRoundIcon}
          title={t('students.details.notFound')}
          description={t('students.details.notFoundDescription')}
          action={
            <Button asChild>
              <Link to="/students">{t('students.details.back')}</Link>
            </Button>
          }
        />
      </PageContainer>
    )
  }

  // Remounting per id resets the loading state without imperatively resetting it.
  return <StudentProfile key={id} id={id} />
}

function StudentProfile({ id }: { id: string }) {
  const { t, locale } = useI18n()

  const [state, setState] = useState<DetailState>('loading')
  const [student, setStudent] = useState<Student | null>(null)
  const [linkedParents, setLinkedParents] = useState<Parent[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [editOpen, setEditOpen] = useState(false)
  const [editBusy, setEditBusy] = useState(false)

  useEffect(() => {
    let active = true
    getStudent(id)
      .then((found) => {
        if (!active) return
        if (found) {
          setStudent(found)
          setState('ready')
        } else {
          setState('notfound')
        }
      })
      .catch(() => {
        if (active) setState('error')
      })
    return () => {
      active = false
    }
  }, [id])

  useEffect(() => {
    let active = true
    getEnrollments()
      .then((items) => {
        if (active) setEnrollments(items.filter((item) => item.studentId === id))
      })
      .catch(() => {
        if (active) setEnrollments([])
      })
    return () => {
      active = false
    }
  }, [id])

  useEffect(() => {
    let active = true
    getParentsByStudentId(id)
      .then((parents) => {
        if (active) setLinkedParents(parents)
      })
      .catch(() => {
        if (active) setLinkedParents([])
      })
    return () => {
      active = false
    }
  }, [id])

  async function handleRetry() {
    setState('loading')
    try {
      const found = await getStudent(id)
      if (found) {
        setStudent(found)
        setState('ready')
      } else {
        setState('notfound')
      }
    } catch {
      setState('error')
    }
  }

  if (state === 'notfound') {
    return (
      <PageContainer>
        <EmptyState
          icon={UserRoundIcon}
          title={t('students.details.notFound')}
          description={t('students.details.notFoundDescription')}
          action={
            <Button asChild>
              <Link to="/students">{t('students.details.back')}</Link>
            </Button>
          }
        />
      </PageContainer>
    )
  }

  if (state === 'error') {
    return (
      <PageContainer>
        <ErrorState
          title={t('students.error.title')}
          description={t('students.error.description')}
          onRetry={handleRetry}
        />
      </PageContainer>
    )
  }

  if (state === 'loading' || !student) {
    return (
      <PageContainer data-testid="student-detail-skeleton">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CardSkeleton className="size-14 rounded-full" />
            <div className="space-y-2">
              <CardSkeleton className="h-5 w-48" />
              <CardSkeleton className="h-3 w-32" />
            </div>
          </div>
          <CardSkeleton className="h-48" />
          <CardSkeleton className="h-48" />
        </div>
      </PageContainer>
    )
  }

  const statusMeta = STUDENT_STATUS_META[student.status]
  const studentClass = findStudentClass(student.classId)
  const age = getStudentAge(student.birthDate)
  const profile = student

  async function handleSubmit(values: StudentFormValues) {
    setEditBusy(true)
    try {
      const updated = await updateStudent(profile.id, values)
      setStudent(updated)
      setEditOpen(false)
    } finally {
      setEditBusy(false)
    }
  }

  return (
    <PageContainer>
      <Button asChild variant="ghost" size="sm" className="-ms-2 w-fit">
        <Link to="/students">
          <ArrowLeftIcon aria-hidden="true" />
          {t('students.details.back')}
        </Link>
      </Button>

      <PageHeader>
        <div className="flex items-center gap-3">
          <StudentAvatar student={student} size="lg" />
          <div className="space-y-1">
            <PageTitle className="text-2xl">{getStudentFullName(student)}</PageTitle>
            <PageDescription className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{student.level}</Badge>
              {studentClass ? <Badge variant="outline">{studentClass.label}</Badge> : null}
              <StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>
            </PageDescription>
          </div>
        </div>
        <PageActions>
          <Button onClick={() => setEditOpen(true)} data-testid="student-detail-edit">
            <PencilIcon aria-hidden="true" />
            {t('students.actions.edit')}
          </Button>
        </PageActions>
      </PageHeader>

      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start overflow-x-auto md:w-fit">
          <TabsTrigger value="overview">{t('students.details.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="payments">{t('students.details.tabs.payments')}</TabsTrigger>
          <TabsTrigger value="attendance">{t('students.details.tabs.attendance')}</TabsTrigger>
          <TabsTrigger value="grades">{t('students.details.tabs.grades')}</TabsTrigger>
          <TabsTrigger value="documents">{t('students.details.tabs.documents')}</TabsTrigger>
          <TabsTrigger value="enrollments">{t('students.details.tabs.enrollments')}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <InfoCard title={t('students.details.identity')} icon={IdCardIcon}>
              <KeyValue label={t('students.details.firstName')} value={student.firstName} />
              <KeyValue label={t('students.details.lastName')} value={student.lastName} />
              <KeyValue
                label={t('students.details.gender')}
                value={t(STUDENT_GENDER_META[student.gender].labelKey)}
              />
              <KeyValue
                label={t('students.details.birthDate')}
                value={`${formatDate(student.birthDate, locale)} · ${age} ${t('students.details.age')}`}
              />
              <KeyValue
                label={t('students.details.status')}
                value={<StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>}
              />
            </InfoCard>

            <InfoCard title={t('students.details.guardian')} icon={PhoneIcon}>
              <KeyValue label={t('students.details.guardianName')} value={student.guardianName} />
              <KeyValue
                label={t('students.details.guardianPhone')}
                value={formatStudentPhone(student.guardianPhone)}
                mono
              />
              <KeyValue
                label={t('students.details.parent')}
                value={
                  linkedParents.length > 0 ? (
                    <Link
                      to={`/parents/${linkedParents[0].id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {getParentFullName(linkedParents[0])}
                    </Link>
                  ) : (
                    '—'
                  )
                }
              />
            </InfoCard>

            <InfoCard title={t('students.details.contact')} icon={ContactIcon}>
              <KeyValue label={t('students.details.email')} value={student.email ?? '—'} />
              <KeyValue label={t('students.details.address')} value={student.address ?? '—'} />
            </InfoCard>

            <InfoCard title={t('students.details.academics')} icon={GraduationCapIcon}>
              <KeyValue
                label={t('students.details.level')}
                value={`${student.level} — ${t(levelLabelKey(student.level))}`}
              />
              <KeyValue label={t('students.details.classId')} value={studentClass?.label ?? '—'} />
              <KeyValue
                label={t('students.details.enrollmentDate')}
                value={formatDate(student.enrollmentDate, locale)}
              />
            </InfoCard>
          </div>
        </TabsContent>
        <TabsContent value="payments">
          <PlaceholderTab icon={CreditCardIcon} />
        </TabsContent>
        <TabsContent value="attendance">
          <PlaceholderTab icon={CalendarCheckIcon} />
        </TabsContent>
        <TabsContent value="grades">
          <PlaceholderTab icon={BookOpenIcon} />
        </TabsContent>
        <TabsContent value="documents">
          <PlaceholderTab icon={FileTextIcon} />
        </TabsContent>
        <TabsContent value="enrollments">
          <InfoCard title={t('enrollments.title')} icon={ClipboardListIcon}>
            {enrollments.length === 0 ? (
              <p className="text-muted-foreground text-sm">{t('enrollments.empty.description')}</p>
            ) : (
              enrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex flex-wrap items-center justify-between gap-2 border-b py-2 last:border-0">
                  <Link to={`/enrollments/${enrollment.id}`} className="font-medium hover:underline">
                    {enrollment.academicYear} · {enrollment.className}
                  </Link>
                  <StatusBadge tone={enrollment.status === 'active' ? 'success' : enrollment.status === 'pending' ? 'pending' : enrollment.status === 'cancelled' ? 'error' : 'info'}>
                    {t(`enrollments.status.${enrollment.status}` as never)}
                  </StatusBadge>
                </div>
              ))
            )}
          </InfoCard>
        </TabsContent>
      </Tabs>

      <StudentFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        student={student}
        busy={editBusy}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  )
}