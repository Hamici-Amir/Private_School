import { useEffect, useMemo, useState } from 'react'
import { DownloadIcon, PrinterIcon, SearchIcon } from 'lucide-react'

import { DataTablePagination } from '@/components/data-display/data-table/pagination'
import { StatCard } from '@/components/data-display/stat-card'
import { StatusBadge } from '@/components/data-display/status-badge'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { CardSkeleton, TableSkeleton } from '@/components/feedback/loading-skeletons'
import { PageActions, PageContainer, PageDescription, PageHeader, PageTitle } from '@/components/layout/page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebouncedValue } from '@/hooks/use-debounce'
import { useI18n } from '@/hooks/use-i18n'
import { formatNumber, formatPercent } from '@/lib/format'
import { toast } from '@/lib/toast'
import { getGrades, type GradeRecord } from '../services/grades.service'

const PAGE_SIZE = 10
const ALL = 'all'
type GradeStatus = GradeRecord['status']
type LoadState = 'loading' | 'ready' | 'error'

function GradeStatusBadge({ status }: { status: GradeStatus }) { const { t } = useI18n(); return <StatusBadge tone={status === 'passed' ? 'success' : 'warning'}>{t(`grades.status.${status}` as 'grades.status.passed')}</StatusBadge> }

export function GradesPage() {
  const { t, locale } = useI18n()
  const [state, setState] = useState<LoadState>('loading')
  const [grades, setGrades] = useState<GradeRecord[]>([])
  const [search, setSearch] = useState('')
  const query = useDebouncedValue(search, 250)
  const [level, setLevel] = useState(ALL)
  const [status, setStatus] = useState<GradeStatus | typeof ALL>(ALL)
  const [page, setPage] = useState(1)

  async function load() { setState('loading'); try { setGrades(await getGrades()); setState('ready') } catch { setState('error') } }
  // Initial service loading intentionally transitions the page state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [])

  const filtered = useMemo(() => grades.filter((grade) => { const text = `${grade.studentName} ${grade.subjectName} ${grade.classId}`.toLocaleLowerCase(); return (!query || text.includes(query.toLocaleLowerCase())) && (level === ALL || grade.level === level) && (status === ALL || grade.status === status) }), [grades, query, level, status])
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const average = grades.length ? grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length : 0
  const passed = grades.filter((grade) => grade.status === 'passed').length
  const attention = grades.filter((grade) => grade.status === 'attention').length

  function resetFilters() { setSearch(''); setLevel(ALL); setStatus(ALL); setPage(1) }
  function exportCsv() { const csv = [['Student', 'Level', 'Class', 'Subject', 'Score', 'Status'], ...filtered.map((grade) => [grade.studentName, grade.level, grade.classId, grade.subjectName, String(grade.score), grade.status])].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'grades-report.csv'; anchor.click(); URL.revokeObjectURL(url); toast.success(t('grades.toasts.exported')) }

  return <PageContainer><PageHeader><div><PageTitle>{t('grades.title')}</PageTitle><PageDescription>{t('grades.subtitle')}</PageDescription></div><PageActions><Button variant="outline" onClick={() => window.print()}><PrinterIcon aria-hidden="true" />{t('grades.actions.print')}</Button><Button variant="outline" onClick={exportCsv} disabled={!filtered.length}><DownloadIcon aria-hidden="true" />{t('grades.actions.export')}</Button></PageActions></PageHeader>{state === 'error' ? <ErrorState title={t('grades.error.title')} description={t('grades.error.description')} onRetry={() => void load()} /> : state === 'loading' ? <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div><TableSkeleton rows={6} columns={7} /></> : <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard title={t('grades.stats.average')} value={`${formatNumber(average, locale)} / 20`} /><StatCard title={t('grades.stats.passed')} value={formatPercent(grades.length ? passed / grades.length * 100 : 0, locale)} /><StatCard title={t('grades.stats.attention')} value={String(attention)} /><StatCard title={t('grades.stats.records')} value={String(grades.length)} /></div><div className="flex flex-col gap-3 rounded-lg border bg-card p-3 lg:flex-row"><div className="relative min-w-0 flex-1"><SearchIcon className="text-muted-foreground absolute start-3 top-2.5 size-4" aria-hidden="true" /><Input className="ps-9" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder={t('grades.filters.search')} aria-label={t('grades.filters.search')} /></div><Select value={level} onValueChange={(value) => { setLevel(value); setPage(1) }}><SelectTrigger className="lg:w-40"><SelectValue placeholder={t('grades.filters.level')} /></SelectTrigger><SelectContent><SelectItem value={ALL}>{t('grades.filters.allLevels')}</SelectItem>{[...new Set(grades.map((grade) => grade.level))].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select><Select value={status} onValueChange={(value) => { setStatus(value as GradeStatus | typeof ALL); setPage(1) }}><SelectTrigger className="lg:w-40"><SelectValue placeholder={t('grades.filters.status')} /></SelectTrigger><SelectContent><SelectItem value={ALL}>{t('grades.filters.allStatuses')}</SelectItem><SelectItem value="passed">{t('grades.status.passed')}</SelectItem><SelectItem value="attention">{t('grades.status.attention')}</SelectItem></SelectContent></Select><Button variant="ghost" onClick={resetFilters}>{t('grades.actions.reset')}</Button></div>{rows.length === 0 ? <EmptyState title={grades.length ? t('grades.empty.filteredTitle') : t('grades.empty.title')} description={t('grades.empty.description')} /> : <><div className="hidden overflow-x-auto rounded-lg border md:block"><table className="w-full text-sm"><thead><tr className="border-b bg-muted/40"><th className="p-3 text-start">{t('grades.fields.student')}</th><th className="p-3 text-start">{t('grades.fields.level')}</th><th className="p-3 text-start">{t('grades.fields.class')}</th><th className="p-3 text-start">{t('grades.fields.subject')}</th><th className="p-3 text-end">{t('grades.fields.score')}</th><th className="p-3 text-start">{t('grades.fields.status')}</th></tr></thead><tbody>{rows.map((grade) => <tr key={grade.id} className="border-b last:border-0"><td className="p-3 font-medium">{grade.studentName}</td><td className="p-3">{grade.level}</td><td className="p-3">{grade.classId}</td><td className="p-3">{grade.subjectName}</td><td className="p-3 text-end font-medium">{formatNumber(grade.score, locale)} / 20</td><td className="p-3"><GradeStatusBadge status={grade.status} /></td></tr>)}</tbody></table></div><div className="grid gap-3 md:hidden">{rows.map((grade) => <div key={grade.id} className="rounded-lg border bg-card p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{grade.studentName}</p><p className="text-muted-foreground text-sm">{grade.subjectName} · {grade.classId}</p></div><GradeStatusBadge status={grade.status} /></div><div className="mt-3 flex justify-between text-sm"><span className="text-muted-foreground">{t('grades.fields.score')}</span><span className="font-medium">{formatNumber(grade.score, locale)} / 20</span></div></div>)}</div><DataTablePagination pageIndex={page - 1} pageCount={pageCount} totalRows={filtered.length} pageSize={PAGE_SIZE} onPageChange={(nextPage) => setPage(nextPage + 1)} /></>}</> }</PageContainer>
}
