import { useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  BookUserIcon,
  CalendarClockIcon,
  ContactIcon,
  FileTextIcon,
  GraduationCapIcon,
  PencilIcon,
  SchoolIcon,
  StarIcon,
  StickyNoteIcon,
  UserRoundIcon,
  type LucideIcon,
} from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router'

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
import { formatDate, formatNumber } from '@/lib/format'

import { TeacherAvatar } from '../components/teacher-avatar'
import { TeacherFormSheet } from '../components/teacher-form-sheet'
import { TeachersClassesList } from '../components/teachers-classes-list'
import {
  TEACHER_GENDER_META,
  TEACHER_QUALIFICATION_META,
  TEACHER_SPECIALTY_META,
  TEACHER_STATUS_META,
} from '../constants/teachers.constants'
import type { Teacher, TeacherFormValues } from '../types/teachers.types'
import { getTeacher, updateTeacher } from '../services/teachers.service'
import {
  countClassStages,
  formatTeacherPhone,
  getTeacherFullName,
  resolveTeacherClasses,
} from '../utils/teachers.utils'

type DetailState = 'loading' | 'ready' | 'notfound' | 'error'

function PlaceholderTab({ icon: Icon }: { icon: LucideIcon }) {
  const { t } = useI18n()
  return (
    <EmptyState
      icon={Icon}
      title={t('teachers.details.comingSoon')}
      description={t('teachers.details.comingSoonDescription')}
    />
  )
}

/** Teacher profile page: real Overview + Classes tabs and placeholder sub-tabs. */
export function TeacherDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useI18n()

  if (!id) {
    return (
      <PageContainer>
        <EmptyState
          icon={UserRoundIcon}
          title={t('teachers.details.notFound')}
          description={t('teachers.details.notFoundDescription')}
          action={
            <Button asChild>
              <Link to="/teachers">{t('teachers.details.back')}</Link>
            </Button>
          }
        />
      </PageContainer>
    )
  }

  // Remounting per id resets the loading state without imperatively resetting it.
  return <TeacherProfile key={id} id={id} />
}

function TeacherProfile({ id }: { id: string }) {
  const { t, locale } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()

  const [state, setState] = useState<DetailState>('loading')
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editBusy, setEditBusy] = useState(false)
  const activeTab = searchParams.get('tab') === 'classes' ? 'classes' : 'overview'

  function handleTabChange(value: string) {
    const next = new URLSearchParams(searchParams)
    if (value === 'overview') next.delete('tab')
    else next.set('tab', value)
    setSearchParams(next)
  }

  useEffect(() => {
    let active = true
    getTeacher(id)
      .then((found) => {
        if (!active) return
        if (found) {
          setTeacher(found)
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
      const found = await getTeacher(id)
      if (found) {
        setTeacher(found)
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
          title={t('teachers.details.notFound')}
          description={t('teachers.details.notFoundDescription')}
          action={
            <Button asChild>
              <Link to="/teachers">{t('teachers.details.back')}</Link>
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
          title={t('teachers.error.title')}
          description={t('teachers.error.description')}
          onRetry={handleRetry}
        />
      </PageContainer>
    )
  }

  if (state === 'loading' || !teacher) {
    return (
      <PageContainer data-testid="teacher-detail-skeleton">
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

  const statusMeta = TEACHER_STATUS_META[teacher.status]
  const classes = resolveTeacherClasses(teacher.classIds)
  const stages = countClassStages(teacher.classIds)
  const profile = teacher

  async function handleSubmit(values: TeacherFormValues) {
    setEditBusy(true)
    try {
      const updated = await updateTeacher(profile.id, values)
      setTeacher(updated)
      setEditOpen(false)
    } finally {
      setEditBusy(false)
    }
  }

  return (
    <PageContainer>
      <Button asChild variant="ghost" size="sm" className="-ms-2 w-fit">
        <Link to="/teachers">
          <ArrowLeftIcon aria-hidden="true" />
          {t('teachers.details.back')}
        </Link>
      </Button>

      <PageHeader>
        <div className="flex items-center gap-3">
          <TeacherAvatar teacher={teacher} size="lg" />
          <div className="space-y-1">
            <PageTitle className="text-2xl">{getTeacherFullName(teacher)}</PageTitle>
            <PageDescription className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{teacher.teacherNumber}</Badge>
              <Badge variant="outline">{t(TEACHER_SPECIALTY_META[teacher.specialty].labelKey)}</Badge>
              <StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>
            </PageDescription>
          </div>
        </div>
        <PageActions>
          <Button onClick={() => setEditOpen(true)} data-testid="teacher-detail-edit">
            <PencilIcon aria-hidden="true" />
            {t('teachers.actions.edit')}
          </Button>
        </PageActions>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start overflow-x-auto md:w-fit">
          <TabsTrigger value="overview">{t('teachers.details.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="classes">{t('teachers.details.tabs.classes')}</TabsTrigger>
          <TabsTrigger value="schedule">{t('teachers.details.tabs.schedule')}</TabsTrigger>
          <TabsTrigger value="grades">{t('teachers.details.tabs.grades')}</TabsTrigger>
          <TabsTrigger value="documents">{t('teachers.details.tabs.documents')}</TabsTrigger>
          <TabsTrigger value="notes">{t('teachers.details.tabs.notes')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <InfoCard title={t('teachers.details.identity')} icon={BookUserIcon}>
              <KeyValue label={t('teachers.details.firstName')} value={teacher.firstName} />
              <KeyValue label={t('teachers.details.lastName')} value={teacher.lastName} />
              {teacher.firstNameAr ? (
                <KeyValue label={t('teachers.details.firstNameAr')} value={teacher.firstNameAr} />
              ) : null}
              {teacher.lastNameAr ? (
                <KeyValue label={t('teachers.details.lastNameAr')} value={teacher.lastNameAr} />
              ) : null}
              <KeyValue
                label={t('teachers.details.gender')}
                value={t(TEACHER_GENDER_META[teacher.gender].labelKey)}
              />
              <KeyValue
                label={t('teachers.details.birthDate')}
                value={formatDate(teacher.birthDate, locale)}
              />
              <KeyValue
                label={t('teachers.details.teacherNumber')}
                value={teacher.teacherNumber}
                mono
              />
              <KeyValue
                label={t('teachers.details.createdAt')}
                value={formatDate(teacher.createdAt, locale)}
              />
            </InfoCard>

            <InfoCard title={t('teachers.details.contact')} icon={ContactIcon}>
              <KeyValue
                label={t('teachers.details.phone')}
                value={formatTeacherPhone(teacher.phone)}
                mono
              />
              <KeyValue label={t('teachers.details.email')} value={teacher.email ?? '—'} />
              <KeyValue label={t('teachers.details.city')} value={teacher.city ?? '—'} />
              <KeyValue label={t('teachers.details.address')} value={teacher.address ?? '—'} />
            </InfoCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <InfoCard title={t('teachers.details.professional')} icon={GraduationCapIcon}>
              <KeyValue
                label={t('teachers.details.specialty')}
                value={t(TEACHER_SPECIALTY_META[teacher.specialty].labelKey)}
              />
              <KeyValue
                label={t('teachers.details.qualification')}
                value={t(TEACHER_QUALIFICATION_META[teacher.qualification].labelKey)}
              />
              <KeyValue
                label={t('teachers.details.hireDate')}
                value={formatDate(teacher.hireDate, locale)}
              />
              <KeyValue
                label={t('teachers.table.status')}
                value={t(statusMeta.labelKey)}
              />
            </InfoCard>

            <InfoCard title={t('teachers.details.classesSummaryTitle')} icon={SchoolIcon}>
              <KeyValue
                label={t('teachers.details.classesCount')}
                value={formatNumber(classes.length, locale)}
              />
              <KeyValue
                label={t('teachers.classes.stages.primary')}
                value={formatNumber(stages.primary, locale)}
              />
              <KeyValue
                label={t('teachers.classes.stages.middle')}
                value={formatNumber(stages.middle, locale)}
              />
              <KeyValue
                label={t('teachers.classes.stages.secondary')}
                value={formatNumber(stages.secondary, locale)}
              />
            </InfoCard>
          </div>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <TeachersClassesList classes={classes} />
        </TabsContent>
        <TabsContent value="schedule">
          <PlaceholderTab icon={CalendarClockIcon} />
        </TabsContent>
        <TabsContent value="grades">
          <PlaceholderTab icon={StarIcon} />
        </TabsContent>
        <TabsContent value="documents">
          <PlaceholderTab icon={FileTextIcon} />
        </TabsContent>
        <TabsContent value="notes">
          <PlaceholderTab icon={StickyNoteIcon} />
        </TabsContent>
      </Tabs>

      <TeacherFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        teacher={teacher}
        busy={editBusy}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  )
}