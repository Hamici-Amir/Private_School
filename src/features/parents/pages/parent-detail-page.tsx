import { useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  BookUserIcon,
  BriefcaseBusinessIcon,
  ContactIcon,
  CreditCardIcon,
  FileTextIcon,
  MailIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  PencilIcon,
  PhoneIcon,
  StickyNoteIcon,
  UserRoundIcon,
  UsersRoundIcon,
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

import type { Student } from '@/features/students/types/students.types'
import { getStudents } from '@/features/students/services/students.service'

import { ParentAvatar } from '../components/parent-avatar'
import { ParentChildrenList } from '../components/parents-children-list'
import { ParentFormSheet } from '../components/parent-form-sheet'
import {
  PARENT_GENDER_META,
  PARENT_RELATIONSHIP_META,
  PARENT_STATUS_META,
} from '../constants/parents.constants'
import type { Parent, ParentFormValues } from '../types/parents.types'
import { getParent, updateParent } from '../services/parents.service'
import {
  formatParentPhone,
  getParentFullName,
  resolveParentChildren,
} from '../utils/parents.utils'

type DetailState = 'loading' | 'ready' | 'notfound' | 'error'

function PlaceholderTab({ icon: Icon }: { icon: typeof FileTextIcon }) {
  const { t } = useI18n()
  return (
    <EmptyState
      icon={Icon}
      title={t('parents.details.comingSoon')}
      description={t('parents.details.comingSoonDescription')}
    />
  )
}

function CommunicationChannel({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  const { t } = useI18n()
  return (
    <div className="border-border bg-card flex items-center justify-between gap-3 rounded-lg border p-4">
      <span className="flex min-w-0 items-center gap-3">
        <span className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium">{label}</span>
          <span className="text-muted-foreground block truncate text-xs" dir="ltr">
            {value}
          </span>
        </span>
      </span>
      <Button variant="outline" size="sm" disabled>
        {t('parents.details.communicationSoon')}
      </Button>
    </div>
  )
}

/** Parent profile page: real Overview + Children tabs and placeholder sub-tabs. */
export function ParentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useI18n()

  if (!id) {
    return (
      <PageContainer>
        <EmptyState
          icon={UserRoundIcon}
          title={t('parents.details.notFound')}
          description={t('parents.details.notFoundDescription')}
          action={
            <Button asChild>
              <Link to="/parents">{t('parents.details.back')}</Link>
            </Button>
          }
        />
      </PageContainer>
    )
  }

  // Remounting per id resets the loading state without imperatively resetting it.
  return <ParentProfile key={id} id={id} />
}

function ParentProfile({ id }: { id: string }) {
  const { t, locale } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()

  const [state, setState] = useState<DetailState>('loading')
  const [parent, setParent] = useState<Parent | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [editOpen, setEditOpen] = useState(false)
  const [editBusy, setEditBusy] = useState(false)
  const activeTab = searchParams.get('tab') === 'children' ? 'children' : 'overview'

  function handleTabChange(value: string) {
    const next = new URLSearchParams(searchParams)
    if (value === 'overview') next.delete('tab')
    else next.set('tab', value)
    setSearchParams(next)
  }

  useEffect(() => {
    let active = true
    Promise.all([getParent(id), getStudents()])
      .then(([found, studentData]) => {
        if (!active) return
        if (found) {
          setParent(found)
          setStudents(studentData)
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
      const [found, studentData] = await Promise.all([getParent(id), getStudents()])
      if (found) {
        setParent(found)
        setStudents(studentData)
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
          title={t('parents.details.notFound')}
          description={t('parents.details.notFoundDescription')}
          action={
            <Button asChild>
              <Link to="/parents">{t('parents.details.back')}</Link>
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
          title={t('parents.error.title')}
          description={t('parents.error.description')}
          onRetry={handleRetry}
        />
      </PageContainer>
    )
  }

  if (state === 'loading' || !parent) {
    return (
      <PageContainer data-testid="parent-detail-skeleton">
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

  const statusMeta = PARENT_STATUS_META[parent.status]
  const relationshipMeta = PARENT_RELATIONSHIP_META[parent.relationship]
  const children = resolveParentChildren(parent.childrenIds, students)
  const activeChildren = children.filter((student) => student.status === 'active').length
  const profile = parent

  async function handleSubmit(values: ParentFormValues) {
    setEditBusy(true)
    try {
      const updated = await updateParent(profile.id, values)
      setParent(updated)
      setEditOpen(false)
    } finally {
      setEditBusy(false)
    }
  }

  return (
    <PageContainer>
      <Button asChild variant="ghost" size="sm" className="-ms-2 w-fit">
        <Link to="/parents">
          <ArrowLeftIcon aria-hidden="true" />
          {t('parents.details.back')}
        </Link>
      </Button>

      <PageHeader>
        <div className="flex items-center gap-3">
          <ParentAvatar parent={parent} size="lg" />
          <div className="space-y-1">
            <PageTitle className="text-2xl">{getParentFullName(parent)}</PageTitle>
            <PageDescription className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{parent.parentNumber}</Badge>
              <Badge variant="outline">{t(relationshipMeta.labelKey)}</Badge>
              <StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>
            </PageDescription>
          </div>
        </div>
        <PageActions>
          <Button onClick={() => setEditOpen(true)} data-testid="parent-detail-edit">
            <PencilIcon aria-hidden="true" />
            {t('parents.actions.edit')}
          </Button>
        </PageActions>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start overflow-x-auto md:w-fit">
          <TabsTrigger value="overview">{t('parents.details.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="children">{t('parents.details.tabs.children')}</TabsTrigger>
          <TabsTrigger value="payments">{t('parents.details.tabs.payments')}</TabsTrigger>
          <TabsTrigger value="documents">{t('parents.details.tabs.documents')}</TabsTrigger>
          <TabsTrigger value="communication">{t('parents.details.tabs.communication')}</TabsTrigger>
          <TabsTrigger value="notes">{t('parents.details.tabs.notes')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <InfoCard title={t('parents.details.personal')} icon={BookUserIcon}>
              <KeyValue label={t('parents.details.firstName')} value={parent.firstName} />
              <KeyValue label={t('parents.details.lastName')} value={parent.lastName} />
              {parent.firstNameAr ? (
                <KeyValue label={t('parents.details.firstNameAr')} value={parent.firstNameAr} />
              ) : null}
              {parent.lastNameAr ? (
                <KeyValue label={t('parents.details.lastNameAr')} value={parent.lastNameAr} />
              ) : null}
              <KeyValue
                label={t('parents.details.gender')}
                value={t(PARENT_GENDER_META[parent.gender].labelKey)}
              />
              <KeyValue
                label={t('parents.details.parentNumber')}
                value={parent.parentNumber}
                mono
              />
              <KeyValue
                label={t('parents.details.createdAt')}
                value={formatDate(parent.createdAt, locale)}
              />
            </InfoCard>

            <InfoCard title={t('parents.details.relationshipSection')} icon={UsersRoundIcon}>
              <KeyValue
                label={t('parents.details.relationship')}
                value={t(relationshipMeta.labelKey)}
              />
              <KeyValue
                label={t('parents.details.childrenCount')}
                value={formatNumber(children.length, locale)}
              />
              <KeyValue
                label={t('parents.details.childrenSummary.active')}
                value={formatNumber(activeChildren, locale)}
              />
              <KeyValue
                label={t('parents.details.childrenSummary.inactive')}
                value={formatNumber(children.length - activeChildren, locale)}
              />
            </InfoCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <InfoCard title={t('parents.details.contact')} icon={ContactIcon}>
              <KeyValue
                label={t('parents.details.phone')}
                value={formatParentPhone(parent.phone)}
                mono
              />
              {parent.secondaryPhone ? (
                <KeyValue
                  label={t('parents.details.secondaryPhone')}
                  value={formatParentPhone(parent.secondaryPhone)}
                  mono
                />
              ) : null}
              <KeyValue label={t('parents.details.email')} value={parent.email ?? '—'} />
            </InfoCard>

            <InfoCard title={t('parents.details.professional')} icon={BriefcaseBusinessIcon}>
              <KeyValue label={t('parents.details.occupation')} value={parent.occupation ?? '—'} />
              <KeyValue
                label={t('parents.details.nationality')}
                value={parent.nationality ?? '—'}
              />
              <KeyValue label={t('parents.details.city')} value={parent.city ?? '—'} />
              <KeyValue label={t('parents.details.address')} value={parent.address ?? '—'} />
            </InfoCard>
          </div>
        </TabsContent>

        <TabsContent value="children" className="space-y-4">
          <ParentChildrenList children={children} />
        </TabsContent>
        <TabsContent value="payments">
          <PlaceholderTab icon={CreditCardIcon} />
        </TabsContent>
        <TabsContent value="documents">
          <PlaceholderTab icon={FileTextIcon} />
        </TabsContent>
        <TabsContent value="communication">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">{t('parents.details.communicationTitle')}</h3>
              <p className="text-muted-foreground text-sm">
                {t('parents.details.communicationDescription')}
              </p>
            </div>
            <div className="space-y-3">
              <CommunicationChannel
                icon={PhoneIcon}
                label={t('parents.actions.call')}
                value={formatParentPhone(parent.phone)}
              />
              <CommunicationChannel
                icon={MessageCircleIcon}
                label={t('parents.actions.sendSms')}
                value={formatParentPhone(parent.phone)}
              />
              <CommunicationChannel
                icon={MessageSquareIcon}
                label={t('parents.actions.switchWhatsApp')}
                value={formatParentPhone(parent.phone)}
              />
              {parent.email ? (
                <CommunicationChannel
                  icon={MailIcon}
                  label={t('parents.actions.sendEmail')}
                  value={parent.email}
                />
              ) : null}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="notes">
          <PlaceholderTab icon={StickyNoteIcon} />
        </TabsContent>
      </Tabs>

      <ParentFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        parent={parent}
        busy={editBusy}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  )
}