import type { ServiceResult } from '@/types/feature'

/** Trend direction for a KPI delta compared with the previous period. */
export type TrendDirection = 'up' | 'down' | 'flat'

/** Severity used by alerts and today-summary items. */
export type Severity = 'info' | 'success' | 'warning' | 'error'

/** KPI cards rendered on the dashboard. */
export type DashboardKpiId =
  | 'students'
  | 'registrations'
  | 'teachers'
  | 'classes'
  | 'monthlyPayments'
  | 'pendingPayments'
  | 'attendanceRate'
  | 'collectionRate'

export interface KpiTrend {
  direction: TrendDirection
  /** Non-negative percentage delta, e.g. 12.5. */
  value: number
}

export interface DashboardKpi {
  /** Absolute value displayed on the card. */
  value: number
  trend: KpiTrend
}

/** One point of the registrations chart ("2026-03" → month + count). */
export interface RegistrationPoint {
  /** ISO month key, e.g. "2026-03". */
  month: string
  count: number
}

/** One point of the payments chart (collected vs expected amounts). */
export interface PaymentPoint {
  month: string
  /** Amount collected in DZD. */
  collected: number
  /** Amount expected in DZD. */
  expected: number
}

/** One point of the attendance chart. */
export interface AttendancePoint {
  month: string
  /** Attendance rate in percent (0–100). */
  rate: number
}

/** Aggregate financial figures of the current month. */
export interface PaymentOverview {
  collected: number
  expected: number
  pendingCount: number
}

export type ActivityType = 'enrollment' | 'payment' | 'attendance' | 'invoice' | 'document'

/** A recent event shown in the activity feed. */
export interface DashboardActivity {
  id: string
  type: ActivityType
  /** Displayed title (translated on render). */
  title: string
  /** Epoch milliseconds of the event. */
  at: number
}

/** An important alert highlighted to the director. */
export interface DashboardAlert {
  id: string
  severity: Severity
  title: string
  at: number
}

export type SummaryKind =
  'classesToday' | 'present' | 'absent' | 'pendingPayments' | 'upcomingExams'

/** One metric of the "today" summary strip. */
export interface TodaySummaryItem {
  id: string
  kind: SummaryKind
  count: number
}

/** An upcoming scheduled session. */
export interface ScheduleItem {
  id: string
  group: string
  subject: string
  teacher: string
  room: string
  /** Epoch milliseconds of the start. */
  startsAt: number
  /** Epoch milliseconds of the end. */
  endsAt: number
}

/** Full payload consumed by the dashboard page. */
export interface DashboardData {
  kpis: Record<DashboardKpiId, DashboardKpi>
  registrations: RegistrationPoint[]
  payments: PaymentPoint[]
  attendance: AttendancePoint[]
  paymentOverview: PaymentOverview
  activity: DashboardActivity[]
  alerts: DashboardAlert[]
  summary: TodaySummaryItem[]
  schedule: ScheduleItem[]
}

export type DashboardDataResult = ServiceResult<DashboardData>
