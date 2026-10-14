import {
  BanknoteIcon,
  BarChart3Icon,
  CalendarCheckIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  ClipboardListIcon,
  FileTextIcon,
  InfoIcon,
  SchoolIcon,
  TriangleAlertIcon,
  UserPlusIcon,
  type LucideIcon,
} from 'lucide-react'

import type { BadgeVariant } from '@/components/ui/badge-variants'

import type { DashboardKpiId, Severity } from '../types'

/** How a KPI card renders its value. */
export type KpiFormat = 'number' | 'currency' | 'percent'

export interface DashboardKpiConfig {
  id: DashboardKpiId
  icon: LucideIcon
  format: KpiFormat
  /** When true, a decreasing trend is considered positive (e.g. pending payments). */
  goodWhenDown?: boolean
}

/** Ordered KPI configuration; every card is rendered from this list. */
export const DASHBOARD_KPIS: readonly DashboardKpiConfig[] = [
  { id: 'students', icon: SchoolIcon, format: 'number' },
  { id: 'registrations', icon: UserPlusIcon, format: 'number' },
  { id: 'teachers', icon: ClipboardListIcon, format: 'number' },
  { id: 'classes', icon: CalendarCheckIcon, format: 'number' },
  { id: 'monthlyPayments', icon: BanknoteIcon, format: 'currency' },
  { id: 'pendingPayments', icon: CircleAlertIcon, format: 'number', goodWhenDown: true },
  { id: 'attendanceRate', icon: CalendarCheckIcon, format: 'percent' },
  { id: 'collectionRate', icon: BanknoteIcon, format: 'percent' },
]

/** Identifier of a dashboard quick action (maps to a translation key). */
export type DashboardQuickActionId =
  | 'registerStudent'
  | 'recordPayment'
  | 'takeAttendance'
  | 'addExpense'
  | 'manageClasses'
  | 'viewReports'

export interface DashboardQuickAction {
  id: DashboardQuickActionId
  icon: LucideIcon
  /** Relative route the action navigates to. */
  to: string
}

/** Quick actions offered on the dashboard. */
export const DASHBOARD_QUICK_ACTIONS: readonly DashboardQuickAction[] = [
  { id: 'registerStudent', icon: UserPlusIcon, to: '/students' },
  { id: 'recordPayment', icon: BanknoteIcon, to: '/payments' },
  { id: 'takeAttendance', icon: CalendarCheckIcon, to: '/attendance' },
  { id: 'addExpense', icon: FileTextIcon, to: '/expenses' },
  { id: 'manageClasses', icon: ClipboardListIcon, to: '/classes' },
  { id: 'viewReports', icon: BarChart3Icon, to: '/reports' },
]

export interface SeverityMeta {
  badgeVariant: Extract<BadgeVariant, 'info' | 'success' | 'warning' | 'destructive-soft'>
  icon: LucideIcon
}

/** Visual meta per alert severity. */
export const SEVERITY_META: Record<Severity, SeverityMeta> = {
  info: { badgeVariant: 'info', icon: InfoIcon },
  success: { badgeVariant: 'success', icon: CircleCheckIcon },
  warning: { badgeVariant: 'warning', icon: TriangleAlertIcon },
  error: { badgeVariant: 'destructive-soft', icon: CircleAlertIcon },
}

/** CSS variable references used by the Recharts widgets (theme-aware). */
export const CHART_COLORS = {
  primary: 'var(--primary)',
  muted: 'var(--muted-foreground)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  destructive: 'var(--destructive)',
  grid: 'var(--border)',
} as const
