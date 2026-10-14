import { useEffect, useState } from 'react'
import { ArrowLeftIcon, CalendarIcon, GraduationCapIcon, IdCardIcon, PencilIcon, UserRoundIcon } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { InfoCard, KeyValue } from '@/components/data-display/info-card'
import { StatusBadge } from '@/components/data-display/status-badge'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { CardSkeleton } from '@/components/feedback/loading-skeletons'
import { PageActions, PageContainer, PageDescription, PageHeader, PageTitle } from '@/components/layout/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/use-i18n'
import { formatDate } from '@/lib/format'
import { getEnrollmentById } from '../services/enrollment.service'
import { ENROLLMENT_STATUS_LABELS, ENROLLMENT_STATUS_TONE, REGISTRATION_TYPE_LABELS } from '../constants/enrollments.constants'
import type { Enrollment } from '../types/enrollments.types'

export function EnrollmentDetailPage() {
  const { id } = useParams<{ id: string }>(); const { t, locale } = useI18n(); const [item, setItem] = useState<Enrollment | null>(null); const [state, setState] = useState<'loading' | 'ready' | 'notfound' | 'error'>('loading')
  // The route id changes without remounting this page.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (!id) { setState('notfound'); return }; getEnrollmentById(id).then((found) => { setItem(found ?? null); setState(found ? 'ready' : 'notfound') }).catch(() => setState('error')) }, [id])
  if (state === 'loading') return <PageContainer><CardSkeleton className="h-56" /><CardSkeleton className="h-56" /></PageContainer>
  if (state === 'error') return <PageContainer><ErrorState title={t('enrollments.error.title')} description={t('enrollments.error.description')} /></PageContainer>
  if (state === 'notfound' || !item) return <PageContainer><EmptyState icon={UserRoundIcon} title={t('enrollments.notFound')} description={t('enrollments.notFoundDescription')} action={<Button asChild><Link to="/enrollments">{t('enrollments.back')}</Link></Button>} /></PageContainer>
  return <PageContainer><Button asChild variant="ghost" size="sm" className="-ms-2 w-fit"><Link to="/enrollments"><ArrowLeftIcon aria-hidden="true" />{t('enrollments.back')}</Link></Button><PageHeader><div><PageTitle>{item.studentName}</PageTitle><PageDescription className="flex flex-wrap items-center gap-2"><Badge variant="secondary">{item.academicYear}</Badge><Badge variant="outline">{item.className}</Badge><StatusBadge tone={ENROLLMENT_STATUS_TONE[item.status]}>{t(ENROLLMENT_STATUS_LABELS[item.status] as never)}</StatusBadge></PageDescription></div><PageActions><Button variant="outline" asChild><Link to="/enrollments"><PencilIcon aria-hidden="true" />{t('common.edit')}</Link></Button></PageActions></PageHeader><div className="grid gap-4 lg:grid-cols-2"><InfoCard title={t('enrollments.sections.student')} icon={IdCardIcon}><KeyValue label={t('enrollments.fields.student')} value={item.studentName} /><KeyValue label={t('enrollments.studentIdentifier')} value={item.studentId} /></InfoCard><InfoCard title={t('enrollments.sections.parent')} icon={UserRoundIcon}><KeyValue label={t('enrollments.fields.parent')} value={item.parentName || t('enrollments.noParent')} /></InfoCard><InfoCard title={t('enrollments.sections.academic')} icon={GraduationCapIcon}><KeyValue label={t('enrollments.fields.academicYear')} value={item.academicYear} /><KeyValue label={t('enrollments.fields.level')} value={item.levelName} /><KeyValue label={t('enrollments.fields.class')} value={item.className} /></InfoCard><InfoCard title={t('enrollments.sections.enrollment')} icon={CalendarIcon}><KeyValue label={t('enrollments.fields.enrollmentDate')} value={formatDate(item.enrollmentDate, locale)} /><KeyValue label={t('enrollments.fields.registrationType')} value={t(REGISTRATION_TYPE_LABELS[item.registrationType] as never)} /><KeyValue label={t('enrollments.fields.status')} value={<StatusBadge tone={ENROLLMENT_STATUS_TONE[item.status]}>{t(ENROLLMENT_STATUS_LABELS[item.status] as never)}</StatusBadge>} /></InfoCard></div><InfoCard title={t('enrollments.sections.notes')} icon={CalendarIcon}><p className="text-muted-foreground text-sm">{item.notes || t('enrollments.noNotes')}</p></InfoCard></PageContainer>
}
