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
import { formatDate, formatNumber, formatPercent } from '@/lib/format'
import { toast } from '@/lib/toast'
import { getAttendance, type AttendanceRecord, type AttendanceStatus } from '../services/attendance.service'

const PAGE_SIZE = 10
const ALL = 'all'
type LoadState = 'loading' | 'ready' | 'error'

function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) { const { t } = useI18n(); const tone = status === 'present' ? 'success' : status === 'late' ? 'warning' : status === 'excused' ? 'info' : 'error'; return <StatusBadge tone={tone}>{t(`attendance.status.${status}` as 'attendance.status.present')}</StatusBadge> }

export function AttendancePage() {
  const { t, locale } = useI18n()
  const [state, setState] = useState<LoadState>('loading')
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [search, setSearch] = useState('')
  const query = useDebouncedValue(search, 250)
  const [status, setStatus] = useState<AttendanceStatus | typeof ALL>(ALL)
  const [date, setDate] = useState('')
  const [page, setPage] = useState(1)

  async function load() { setState('loading'); try { setRecords(await getAttendance()); setState('ready') } catch { setState('error') } }
  // Initial service loading intentionally transitions the page state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [])

  const filtered = useMemo(() => records.filter((record) => { const text = `${record.studentName} ${record.classId} ${record.level}`.toLocaleLowerCase(); return (!query || text.includes(query.toLocaleLowerCase())) && (status === ALL || record.status === status) && (!date || record.date === date) }), [records, query, status, date])
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const present = records.filter((record) => record.status === 'present').length
  const absent = records.filter((record) => record.status === 'absent').length
  const late = records.filter((record) => record.status === 'late').length
  const excused = records.filter((record) => record.status === 'excused').length
  const rate = records.length ? present / records.length * 100 : 0

  function resetFilters() { setSearch(''); setStatus(ALL); setDate(''); setPage(1) }
  function exportCsv() { const csv = [['Student', 'Level', 'Class', 'Date', 'Status'], ...filtered.map((record) => [record.studentName, record.level, record.classId, record.date, record.status])].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'attendance-report.csv'; anchor.click(); URL.revokeObjectURL(url); toast.success(t('attendance.toasts.exported')) }

  return <PageContainer><PageHeader><div><PageTitle>{t('attendance.title')}</PageTitle><PageDescription>{t('attendance.subtitle')}</PageDescription></div><PageActions><Button variant="outline" onClick={() => window.print()}><PrinterIcon aria-hidden="true" />{t('attendance.actions.print')}</Button><Button variant="outline" onClick={exportCsv} disabled={!filtered.length}><DownloadIcon aria-hidden="true" />{t('attendance.actions.export')}</Button></PageActions></PageHeader>{state === 'error' ? <ErrorState title={t('attendance.error.title')} description={t('attendance.error.description')} onRetry={() => void load()} /> : state === 'loading' ? <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div><TableSkeleton rows={6} columns={6} /></> : <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><StatCard title={t('attendance.stats.rate')} value={formatPercent(rate, locale)} /><StatCard title={t('attendance.stats.present')} value={formatNumber(present, locale)} /><StatCard title={t('attendance.stats.absent')} value={formatNumber(absent, locale)} /><StatCard title={t('attendance.stats.late')} value={formatNumber(late, locale)} /><StatCard title={t('attendance.stats.excused')} value={formatNumber(excused, locale)} /></div><div className="flex flex-col gap-3 rounded-lg border bg-card p-3 lg:flex-row"><div className="relative min-w-0 flex-1"><SearchIcon className="text-muted-foreground absolute start-3 top-2.5 size-4" aria-hidden="true" /><Input className="ps-9" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder={t('attendance.filters.search')} aria-label={t('attendance.filters.search')} /></div><Input className="lg:w-44" type="date" value={date} onChange={(event) => { setDate(event.target.value); setPage(1) }} aria-label={t('attendance.filters.date')} /><Select value={status} onValueChange={(value) => { setStatus(value as AttendanceStatus | typeof ALL); setPage(1) }}><SelectTrigger className="lg:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>{t('attendance.filters.allStatuses')}</SelectItem>{(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((item) => <SelectItem key={item} value={item}>{t(`attendance.status.${item}` as 'attendance.status.present')}</SelectItem>)}</SelectContent></Select><Button variant="ghost" onClick={resetFilters}>{t('attendance.actions.reset')}</Button></div>{rows.length === 0 ? <EmptyState title={records.length ? t('attendance.empty.filteredTitle') : t('attendance.empty.title')} description={t('attendance.empty.description')} /> : <><div className="hidden overflow-x-auto rounded-lg border md:block"><table className="w-full text-sm"><thead><tr className="border-b bg-muted/40"><th className="p-3 text-start">{t('attendance.fields.student')}</th><th className="p-3 text-start">{t('attendance.fields.level')}</th><th className="p-3 text-start">{t('attendance.fields.class')}</th><th className="p-3 text-start">{t('attendance.fields.date')}</th><th className="p-3 text-start">{t('attendance.fields.status')}</th></tr></thead><tbody>{rows.map((record) => <tr key={record.id} className="border-b last:border-0"><td className="p-3 font-medium">{record.studentName}</td><td className="p-3">{record.level}</td><td className="p-3">{record.classId}</td><td className="p-3">{formatDate(record.date, locale)}</td><td className="p-3"><AttendanceStatusBadge status={record.status} /></td></tr>)}</tbody></table></div><div className="grid gap-3 md:hidden">{rows.map((record) => <div key={record.id} className="rounded-lg border bg-card p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{record.studentName}</p><p className="text-muted-foreground text-sm">{record.classId} · {formatDate(record.date, locale)}</p></div><AttendanceStatusBadge status={record.status} /></div></div>)}</div><DataTablePagination pageIndex={page - 1} pageCount={pageCount} totalRows={filtered.length} pageSize={PAGE_SIZE} onPageChange={(nextPage) => setPage(nextPage + 1)} /></>}</> }</PageContainer>
}
