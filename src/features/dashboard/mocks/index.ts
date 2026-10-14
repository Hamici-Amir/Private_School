import { MOCK_DELAY } from '@/constants/app'
import { delay } from '@/utils/async'

/**
 * Mock dashboard payload.
 * NOTE (boundary rule): mocks must not import from "@types", "@features/*" or "@api/*".
 * The shape is declared inline below and confirmed structurally by the service layer.
 */

interface MockKpiTrend {
  direction: 'up' | 'down' | 'flat'
  value: number
}

type MockKpiId =
  | 'students'
  | 'registrations'
  | 'teachers'
  | 'classes'
  | 'monthlyPayments'
  | 'pendingPayments'
  | 'attendanceRate'
  | 'collectionRate'

interface MockKpi {
  value: number
  trend: MockKpiTrend
}

interface MockPoint {
  month: string
  count: number
}

interface MockPaymentPoint {
  month: string
  collected: number
  expected: number
}

interface MockAttendancePoint {
  month: string
  rate: number
}

interface MockSummaryItem {
  id: string
  kind: 'classesToday' | 'present' | 'absent' | 'pendingPayments' | 'upcomingExams'
  count: number
}

interface MockScheduleItem {
  id: string
  group: string
  subject: string
  teacher: string
  room: string
  startsAt: number
  endsAt: number
}

interface MockDashboardData {
  kpis: Record<MockKpiId, MockKpi>
  registrations: MockPoint[]
  payments: MockPaymentPoint[]
  attendance: MockAttendancePoint[]
  paymentOverview: { collected: number; expected: number; pendingCount: number }
  activity: {
    id: string
    type: 'enrollment' | 'payment' | 'attendance' | 'invoice' | 'document'
    title: string
    at: number
  }[]
  alerts: {
    id: string
    severity: 'info' | 'success' | 'warning' | 'error'
    title: string
    at: number
  }[]
  summary: MockSummaryItem[]
  schedule: MockScheduleItem[]
}

const HOUR = 3_600_000
const DAY = 24 * HOUR
const now = Date.now()

const kpis: Record<MockKpiId, MockKpi> = {
  students: { value: 128, trend: { direction: 'up', value: 4.2 } },
  registrations: { value: 12, trend: { direction: 'up', value: 20 } },
  teachers: { value: 16, trend: { direction: 'flat', value: 0 } },
  classes: { value: 9, trend: { direction: 'up', value: 12.5 } },
  monthlyPayments: { value: 4_250_000, trend: { direction: 'up', value: 8.3 } },
  pendingPayments: { value: 4, trend: { direction: 'down', value: 20 } },
  attendanceRate: { value: 92.5, trend: { direction: 'down', value: 1.4 } },
  collectionRate: { value: 87.6, trend: { direction: 'up', value: 3.1 } },
}

export async function fetchDashboardMock(): Promise<MockDashboardData> {
  await delay(MOCK_DELAY)

  return {
    kpis,
    registrations: [
      { month: '2025-09', count: 118 },
      { month: '2025-10', count: 14 },
      { month: '2025-11', count: 8 },
      { month: '2025-12', count: 6 },
      { month: '2026-01', count: 11 },
      { month: '2026-02', count: 9 },
      { month: '2026-03', count: 15 },
      { month: '2026-04', count: 10 },
      { month: '2026-05', count: 7 },
      { month: '2026-06', count: 5 },
    ],
    payments: [
      { month: '2026-02', collected: 3_610_000, expected: 4_050_000 },
      { month: '2026-03', collected: 3_845_000, expected: 4_210_000 },
      { month: '2026-04', collected: 3_920_000, expected: 4_180_000 },
      { month: '2026-05', collected: 3_680_000, expected: 4_120_000 },
      { month: '2026-06', collected: 3_410_000, expected: 3_980_000 },
      { month: '2026-07', collected: 2_960_000, expected: 3_850_000 },
      { month: '2026-08', collected: 4_250_000, expected: 4_850_000 },
    ],
    attendance: [
      { month: '2025-10', rate: 94.1 },
      { month: '2025-11', rate: 93.4 },
      { month: '2025-12', rate: 91.8 },
      { month: '2026-01', rate: 92.6 },
      { month: '2026-02', rate: 93.9 },
      { month: '2026-03', rate: 90.7 },
      { month: '2026-04', rate: 91.2 },
      { month: '2026-05', rate: 92.5 },
    ],
    paymentOverview: { collected: 4_250_000, expected: 4_850_000, pendingCount: 4 },
    activity: [
      {
        id: 'act-1',
        type: 'enrollment',
        title: 'Amine Benali (3A)',
        at: now - 24 * HOUR,
      },
      {
        id: 'act-2',
        type: 'payment',
        title: 'Yasmine Bouzid (2B)',
        at: now - 2 * HOUR,
      },
      {
        id: 'act-3',
        type: 'attendance',
        title: '3A',
        at: now - 26 * HOUR,
      },
      {
        id: 'act-4',
        type: 'invoice',
        title: 'Facture #2491',
        at: now - 3 * DAY,
      },
      {
        id: 'act-5',
        type: 'document',
        title: 'Bulletin 2B',
        at: now - 4 * DAY,
      },
    ],
    alerts: [
      {
        id: 'alert-1',
        severity: 'warning',
        title: 'Paiements en retard du mois de juillet',
        at: now - 5 * HOUR,
      },
      {
        id: 'alert-2',
        severity: 'error',
        title: 'Absences répétées détectées',
        at: now - 30 * HOUR,
      },
      {
        id: 'alert-3',
        severity: 'info',
        title: 'Réunion des enseignants demain',
        at: now - DAY,
      },
    ],
    summary: [
      { id: 'sum-1', kind: 'classesToday', count: 18 },
      { id: 'sum-2', kind: 'present', count: 118 },
      { id: 'sum-3', kind: 'absent', count: 10 },
      { id: 'sum-4', kind: 'pendingPayments', count: 4 },
      { id: 'sum-5', kind: 'upcomingExams', count: 3 },
    ],
    schedule: [
      {
        id: 'sch-1',
        group: '3A',
        subject: 'Mathématiques',
        teacher: 'M. Khelifi',
        room: 'Salle 4',
        startsAt: now + 2 * HOUR,
        endsAt: now + 4 * HOUR,
      },
      {
        id: 'sch-2',
        group: '2B',
        subject: 'Sciences',
        teacher: 'Mme Haddad',
        room: 'Salle 7',
        startsAt: now + 3 * HOUR,
        endsAt: now + 5 * HOUR,
      },
      {
        id: 'sch-3',
        group: '1A',
        subject: 'Français',
        teacher: 'M. Benkhelifa',
        room: 'Salle 2',
        startsAt: now + DAY,
        endsAt: now + DAY + 2 * HOUR,
      },
    ],
  }
}
