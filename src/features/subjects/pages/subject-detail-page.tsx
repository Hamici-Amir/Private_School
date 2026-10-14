import { useEffect, useState } from 'react'
import { ArrowLeftIcon, BookOpenIcon, CalendarIcon, PencilIcon, UsersIcon } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { InfoCard, KeyValue } from '@/components/data-display/info-card'
import { StatusBadge } from '@/components/data-display/status-badge'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { CardSkeleton } from '@/components/feedback/loading-skeletons'
import { PageActions, PageContainer, PageDescription, PageHeader, PageTitle } from '@/components/layout/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTeachers } from '@/features/teachers/services/teachers.service'
import type { Teacher } from '@/features/teachers/types/teachers.types'
import { getTeacherFullName } from '@/features/teachers/utils/teachers.utils'
import { useI18n } from '@/hooks/use-i18n'
import { getSubject } from '../services/subjects.service'
import { SUBJECT_LEVEL_LABELS, SUBJECT_STATUS_META } from '../constants/subjects.constants'
import type { Subject } from '../types/subjects.types'

export function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>(); const { t, locale } = useI18n(); const [subject, setSubject] = useState<Subject | null>(null); const [teachers, setTeachers] = useState<Teacher[]>([]); const [state, setState] = useState<'loading' | 'ready' | 'notfound' | 'error'>('loading')
  // Route params can change without remounting this detail page.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (!id) { setState('notfound'); return }; Promise.all([getSubject(id), getTeachers()]).then(([found, teacherData]) => { setSubject(found ?? null); setTeachers(teacherData); setState(found ? 'ready' : 'notfound') }).catch(() => setState('error')) }, [id])
  const name = (item: Subject) => locale === 'ar' ? item.nameAr : locale === 'fr' ? item.nameFr : item.name
  if (state === 'loading') return <PageContainer><CardSkeleton className="h-48" /><CardSkeleton className="h-48" /></PageContainer>
  if (state === 'error') return <PageContainer><ErrorState title={t('subjects.error.title')} description={t('subjects.error.description')} /></PageContainer>
  if (state === 'notfound' || !subject) return <PageContainer><EmptyState icon={BookOpenIcon} title={t('subjects.notFound')} description={t('subjects.notFoundDescription')} action={<Button asChild><Link to="/subjects">{t('subjects.back')}</Link></Button>} /></PageContainer>
  return <PageContainer><Button asChild variant="ghost" size="sm" className="-ms-2 w-fit"><Link to="/subjects"><ArrowLeftIcon aria-hidden="true" />{t('subjects.back')}</Link></Button><PageHeader><div><PageTitle>{name(subject)}</PageTitle><PageDescription className="flex flex-wrap items-center gap-2"><Badge variant="secondary">{subject.code}</Badge><StatusBadge tone={SUBJECT_STATUS_META[subject.status].tone}>{t(SUBJECT_STATUS_META[subject.status].labelKey)}</StatusBadge></PageDescription></div><PageActions><Button variant="outline" asChild><Link to="/subjects"><PencilIcon aria-hidden="true" />{t('common.edit')}</Link></Button></PageActions></PageHeader><div className="grid gap-4 lg:grid-cols-2"><InfoCard title={t('subjects.sections.identity')} icon={BookOpenIcon}><KeyValue label={t('subjects.fields.name')} value={name(subject)} /><KeyValue label={t('subjects.fields.code')} value={subject.code} /><KeyValue label={t('subjects.fields.nameFr')} value={subject.nameFr} /><KeyValue label={t('subjects.fields.nameAr')} value={subject.nameAr} /></InfoCard><InfoCard title={t('subjects.sections.academic')} icon={UsersIcon}><KeyValue label={t('subjects.fields.levels')} value={<div className="flex flex-wrap gap-1">{subject.levels.map((level) => <Badge key={level} variant="outline">{level} · {t(SUBJECT_LEVEL_LABELS[level])}</Badge>)}</div>} /><KeyValue label={t('subjects.fields.teachers')} value={subject.teacherIds.length ? subject.teacherIds.map((teacherId) => getTeacherFullName(teachers.find((teacher) => teacher.id === teacherId) ?? { firstName: teacherId, lastName: '' } as Teacher)).join(', ') : '—'} /></InfoCard></div><InfoCard title={t('subjects.sections.description')} icon={CalendarIcon}><p className="text-muted-foreground text-sm">{subject.description || t('subjects.noDescription')}</p></InfoCard></PageContainer>
}
