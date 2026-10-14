import { useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  BookUserIcon,
  CalendarClockIcon,
  FileTextIcon,
  PencilIcon,
  SchoolIcon,
  StickyNoteIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router'

import { StatusBadge } from '@/components/data-display/status-badge'
import { InfoCard, KeyValue } from '@/components/data-display/info-card'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { CardSkeleton } from '@/components/feedback/loading-skeletons'
import {
  PageActions,
  PageContainer,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/layout/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { levelLabelKey } from '@/features/students/constants/students.constants'
import { getStudents } from '@/features/students/services/students.service'
import type { Student } from '@/features/students/types/students.types'
import { getTeachers } from '@/features/teachers/services/teachers.service'
import { getTeacherFullName } from '@/features/teachers/utils/teachers.utils'
import type { Teacher } from '@/features/teachers/types/teachers.types'
import { useI18n } from '@/hooks/use-i18n'
import { formatDate, formatNumber } from '@/lib/format'

import { ClassAvatar } from '../components/class-avatar'
import { ClassFormSheet } from '../components/class-form-sheet'
import { ClassesStudentsList } from '../components/classes-students-list'
import { ClassesTeachersList } from '../components/classes-teachers-list'
import { CLASS_STATUS_META } from '../constants/classes.constants'
import type { ClassCounts, ClassFormValues, SchoolClass } from '../types/classes.types'
import { getClass, updateClass } from '../services/classes.service'
import { resolveClassStudents, resolveClassTeachers } from '../utils/classes.utils'

type DetailState = 'loading' | 'ready' | 'notfound' | 'error'

function PlaceholderTab({ icon: Icon }: { icon: LucideIcon }) {
  const { t } = useI18n()
  return (
    <EmptyState
      icon={Icon}
      title={t('classes.details.comingSoon')}
      description={t('classes.details.comingSoonDescription')}
    />
  )
}

/** Class detail page: real Overview/Students/Teachers tabs and placeholder sub-tabs. */
export function ClassDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useI18n()

  if (!id) {
    return (
      <PageContainer>
        <EmptyState
          icon={SchoolIcon}
          title={t('classes.details.notFound')}
          description={t('classes.details.notFoundDescription')}
          action={
            <Button asChild>
              <Link to="/classes">{t('classes.details.back')}</Link>
            </Button>
          }
        />
      </PageContainer>
    )
  }

  // Remounting per id resets the loading state without imperatively resetting it.
  return <ClassDetail key={id} id={id} />
}

function ClassDetail({ id }: { id: string }) {
  const { t, locale } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()

  const [state, setState] = useState<DetailState>('loading')
  const [schoolClass, setSchoolClass] = useState<SchoolClass | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [editOpen, setEditOpen] = useState(false)
  const [editBusy, setEditBusy] = useState(false)
  const activeTab = (() => {
    const tab = searchParams.get('tab')
    if (tab === 'students') return 'students'
    if (tab === 'teachers') return 'teachers'
    return 'overview'
  })()

  function handleTabChange(value: string) {
    const next = new URLSearchParams(searchParams)
    if (value === 'overview') next.delete('tab')
    else next.set('tab', value)
    setSearchParams(next)
  }

  useEffect(() => {
    let active = true
    Promise.all([getClass(id), getStudents(), getTeachers()])
      .then(([found, studentsData, teachersData]) => {
        if (!active) return
        if (found) {
          setSchoolClass(found)
          setStudents(studentsData)
          setTeachers(teachersData)
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

  async function handleRetry() {
    setState('loading')
    try {
      const [found, studentsData, teachersData] = await Promise.all([
        getClass(id),
        getStudents(),
        getTeachers(),
      ])
      if (found) {
        setSchoolClass(found)
        setStudents(studentsData)
        setTeachers(teachersData)
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
          icon={SchoolIcon}
          title={t('classes.details.notFound')}
          description={t('classes.details.notFoundDescription')}
          action={
            <Button asChild>
              <Link to="/classes">{t('classes.details.back')}</Link>
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
          title={t('classes.error.title')}
          description={t('classes.error.description')}
          onRetry={handleRetry}
        />
      </PageContainer>
    )
  }

  if (state === 'loading' || !schoolClass) {
    return (
      <PageContainer data-testid="class-detail-skeleton">
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

  const statusMeta = CLASS_STATUS_META[schoolClass.status]
  const profile = schoolClass
  const enrolledStudents = resolveClassStudents(profile.id, students)
  const assignedTeachers = resolveClassTeachers(profile.id, teachers)
  const counts: ClassCounts = {
    students: enrolledStudents.length,
    teachers: assignedTeachers.length,
  }
  const headTeacher = teachers.find((teacher) => teacher.id === profile.headTeacherId)

  async function handleSubmit(values: ClassFormValues) {
    setEditBusy(true)
    try {
      const updated = await updateClass(profile.id, values)
      setSchoolClass(updated)
      setEditOpen(false)
    } finally {
      setEditBusy(false)
    }
  }

  return (
    <PageContainer>
      <Button asChild variant="ghost" size="sm" className="-ms-2 w-fit">
        <Link to="/classes">
          <ArrowLeftIcon aria-hidden="true" />
          {t('classes.details.back')}
        </Link>
      </Button>

      <PageHeader>
        <div className="flex items-center gap-3">
          <ClassAvatar label={profile.label} size="lg" />
          <div className="space-y-1">
            <PageTitle className="text-2xl">{profile.label}</PageTitle>
            <PageDescription className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{t(levelLabelKey(profile.level))}</Badge>
              <Badge variant="outline">
                {t('classes.details.room')} {profile.room}
              </Badge>
              <StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>
            </PageDescription>
          </div>
        </div>
        <PageActions>
          <Button onClick={() => setEditOpen(true)} data-testid="class-detail-edit">
            <PencilIcon aria-hidden="true" />
            {t('classes.actions.edit')}
          </Button>
        </PageActions>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start overflow-x-auto md:w-fit">
          <TabsTrigger value="overview">{t('classes.details.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="students">{t('classes.details.tabs.students')}</TabsTrigger>
          <TabsTrigger value="teachers">{t('classes.details.tabs.teachers')}</TabsTrigger>
          <TabsTrigger value="schedule">{t('classes.details.tabs.schedule')}</TabsTrigger>
          <TabsTrigger value="documents">{t('classes.details.tabs.documents')}</TabsTrigger>
          <TabsTrigger value="notes">{t('classes.details.tabs.notes')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <InfoCard title={t('classes.details.identity')} icon={SchoolIcon}>
              <KeyValue label={t('classes.table.class')} value={profile.label} />
              <KeyValue label={t('classes.table.level')} value={t(levelLabelKey(profile.level))} />
              <KeyValue label={t('classes.details.room')} value={profile.room} mono />
              <KeyValue label={t('classes.table.status')} value={t(statusMeta.labelKey)} />
              <KeyValue
                label={t('classes.details.createdAt')}
                value={formatDate(profile.createdAt, locale)}
              />
            </InfoCard>

            <InfoCard title={t('classes.details.enrollment')} icon={UsersIcon}>
              <KeyValue
                label={t('classes.table.students')}
                value={formatNumber(counts.students, locale)}
              />
              <KeyValue
                label={t('classes.table.capacity')}
                value={formatNumber(profile.capacity, locale)}
              />
            </InfoCard>
          </div>

          <InfoCard title={t('classes.details.assignment')} icon={BookUserIcon}>
            <KeyValue
              label={t('classes.details.headTeacher')}
              value={
                headTeacher ? (
                  <Link
                    to={`/teachers/${headTeacher.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {getTeacherFullName(headTeacher)}
                  </Link>
                ) : (
                  t('classes.details.noHeadTeacher')
                )
              }
            />
            <KeyValue
              label={t('classes.table.teachers')}
              value={formatNumber(counts.teachers, locale)}
            />
          </InfoCard>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <ClassesStudentsList students={enrolledStudents} />
        </TabsContent>
        <TabsContent value="teachers" className="space-y-4">
          <ClassesTeachersList teachers={assignedTeachers} />
        </TabsContent>
        <TabsContent value="schedule">
          <PlaceholderTab icon={CalendarClockIcon} />
        </TabsContent>
        <TabsContent value="documents">
          <PlaceholderTab icon={FileTextIcon} />
        </TabsContent>
        <TabsContent value="notes">
          <PlaceholderTab icon={StickyNoteIcon} />
        </TabsContent>
      </Tabs>

      <ClassFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        schoolClass={schoolClass}
        busy={editBusy}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  )
}
