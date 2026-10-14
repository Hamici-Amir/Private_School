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
import { formatCurrency, formatDate } from '@/lib/format'
import { toast } from '@/lib/toast'
import { getPayments } from '@/features/expenses/services/cash-register.service'
import type { Payment, PaymentMethod } from '@/features/expenses/types/finance.types'

const PAGE_SIZE = 10
const ALL = 'all'
type PaymentStatus = Payment['status']
type LoadState = 'loading' | 'ready' | 'error'

function matchesPayment(payment: Payment, query: string, method: PaymentMethod | typeof ALL, status: PaymentStatus | typeof ALL) {
  const searchable = `${payment.reference} ${payment.description} ${payment.createdBy}`.toLocaleLowerCase()
  return (!query || searchable.includes(query.toLocaleLowerCase())) &&
    (method === ALL || payment.paymentMethod === method) &&
    (status === ALL || payment.status === status)
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { t } = useI18n()
  return <StatusBadge tone={status === 'paid' ? 'success' : status === 'pending' ? 'pending' : 'error'}>{t(`payments.status.${status}` as 'payments.status.paid')}</StatusBadge>
}

function PaymentMethodLabel({ method }: { method: PaymentMethod }) {
  const { t } = useI18n()
  return <>{t(`finance.paymentMethods.${method}` as 'finance.paymentMethods.cash')}</>
}

export function PaymentsPage() {
  const { t, locale } = useI18n()
  const [state, setState] = useState<LoadState>('loading')
  const [payments, setPayments] = useState<Payment[]>([])
  const [search, setSearch] = useState('')
  const query = useDebouncedValue(search, 250)
  const [method, setMethod] = useState<PaymentMethod | typeof ALL>(ALL)
  const [status, setStatus] = useState<PaymentStatus | typeof ALL>(ALL)
  const [page, setPage] = useState(1)

  async function load() {
    setState('loading')
    try {
      setPayments(await getPayments())
      setState('ready')
    } catch {
      setState('error')
    }
  }

  // Initial service loading intentionally transitions the page state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [])

  const filtered = useMemo(() => payments.filter((payment) => matchesPayment(payment, query, method, status)), [payments, query, method, status])
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const paid = payments.filter((payment) => payment.status === 'paid')
  const pending = payments.filter((payment) => payment.status === 'pending')
  const cancelled = payments.filter((payment) => payment.status === 'cancelled')
  const total = paid.reduce((sum, payment) => sum + payment.amount, 0)
  const pendingTotal = pending.reduce((sum, payment) => sum + payment.amount, 0)

  function resetFilters() { setSearch(''); setMethod(ALL); setStatus(ALL); setPage(1) }
  function exportCsv() {
    const csv = [['Reference', 'Description', 'Date', 'Payment method', 'Amount', 'Status'], ...filtered.map((payment) => [payment.reference, payment.description, payment.date, payment.paymentMethod, String(payment.amount), payment.status])].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'payments-report.csv'; anchor.click(); URL.revokeObjectURL(url)
    toast.success(t('payments.toasts.exported'))
  }

  return <PageContainer>
    <PageHeader>
      <div><PageTitle>{t('payments.title')}</PageTitle><PageDescription>{t('payments.subtitle')}</PageDescription></div>
      <PageActions><Button variant="outline" onClick={() => window.print()}><PrinterIcon aria-hidden="true" />{t('payments.actions.print')}</Button><Button variant="outline" onClick={exportCsv} disabled={!filtered.length}><DownloadIcon aria-hidden="true" />{t('payments.actions.export')}</Button></PageActions>
    </PageHeader>
    {state === 'error' ? <ErrorState title={t('payments.error.title')} description={t('payments.error.description')} onRetry={() => void load()} /> : state === 'loading' ? <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div><TableSkeleton rows={6} columns={7} /></> : <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard title={t('payments.stats.total')} value={formatCurrency(total, locale)} /><StatCard title={t('payments.stats.count')} value={String(paid.length)} /><StatCard title={t('payments.stats.pending')} value={formatCurrency(pendingTotal, locale)} /><StatCard title={t('payments.stats.cancelled')} value={String(cancelled.length)} /></div>
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 lg:flex-row"><div className="relative min-w-0 flex-1"><SearchIcon className="text-muted-foreground absolute start-3 top-2.5 size-4" aria-hidden="true" /><Input className="ps-9" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder={t('payments.filters.search')} aria-label={t('payments.filters.search')} /></div><Select value={method} onValueChange={(value) => { setMethod(value as PaymentMethod | typeof ALL); setPage(1) }}><SelectTrigger className="lg:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>{t('finance.allMethods')}</SelectItem>{(['cash', 'bank-transfer', 'card', 'other'] as PaymentMethod[]).map((item) => <SelectItem key={item} value={item}><PaymentMethodLabel method={item} /></SelectItem>)}</SelectContent></Select><Select value={status} onValueChange={(value) => { setStatus(value as PaymentStatus | typeof ALL); setPage(1) }}><SelectTrigger className="lg:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>{t('finance.allStatuses')}</SelectItem>{(['paid', 'pending', 'cancelled'] as PaymentStatus[]).map((item) => <SelectItem key={item} value={item}>{t(`payments.status.${item}` as 'payments.status.paid')}</SelectItem>)}</SelectContent></Select><Button variant="ghost" onClick={resetFilters}>{t('payments.actions.reset')}</Button></div>
      {rows.length === 0 ? <EmptyState title={payments.length ? t('payments.empty.filteredTitle') : t('payments.empty.title')} description={t('payments.empty.description')} /> : <><div className="hidden overflow-x-auto rounded-lg border md:block"><table className="w-full text-sm"><thead><tr className="border-b bg-muted/40 text-start"><th className="p-3 text-start">{t('finance.table.reference')}</th><th className="p-3 text-start">{t('finance.table.description')}</th><th className="p-3 text-start">{t('finance.table.date')}</th><th className="p-3 text-start">{t('finance.table.paymentMethod')}</th><th className="p-3 text-end">{t('finance.table.amount')}</th><th className="p-3 text-start">{t('finance.table.status')}</th></tr></thead><tbody>{rows.map((payment) => <tr key={payment.id} className="border-b last:border-0"><td className="p-3 font-medium">{payment.reference}</td><td className="p-3">{payment.description}</td><td className="p-3">{formatDate(payment.date, locale)}</td><td className="p-3"><PaymentMethodLabel method={payment.paymentMethod} /></td><td className="p-3 text-end font-medium">{formatCurrency(payment.amount, locale)}</td><td className="p-3"><PaymentStatusBadge status={payment.status} /></td></tr>)}</tbody></table></div><div className="grid gap-3 md:hidden">{rows.map((payment) => <div key={payment.id} className="rounded-lg border bg-card p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{payment.reference}</p><p className="text-muted-foreground text-sm">{payment.description}</p></div><PaymentStatusBadge status={payment.status} /></div><div className="mt-3 grid grid-cols-2 gap-2 text-sm"><span className="text-muted-foreground">{t('finance.table.date')}</span><span className="text-end">{formatDate(payment.date, locale)}</span><span className="text-muted-foreground">{t('finance.table.paymentMethod')}</span><span className="text-end"><PaymentMethodLabel method={payment.paymentMethod} /></span><span className="text-muted-foreground">{t('finance.table.amount')}</span><span className="text-end font-medium">{formatCurrency(payment.amount, locale)}</span></div></div>)}</div><DataTablePagination pageIndex={page - 1} pageCount={pageCount} totalRows={filtered.length} pageSize={PAGE_SIZE} onPageChange={(nextPage) => setPage(nextPage + 1)} /></>}
    </>}
  </PageContainer>
}
