import {
  Suspense,
  lazy,
  type ComponentType,
  type LazyExoticComponent,
  type ReactElement,
} from 'react'

import { Navigate, createBrowserRouter } from 'react-router'

import { RouteErrorBoundary } from '@/components/feedback/route-error-boundary'
import { RouteLoader } from '@/components/feedback/route-loader'
import { findNavItem } from '@/constants/navigation'
import type { NavItemStatus } from '@/constants/navigation'
import { AppShell } from '@/layouts/app-shell'
import { AuthLayout } from '@/layouts/auth-layout'
import { RootLayout } from '@/layouts/root-layout'
import type { TranslationKey } from '@/lib/i18n'
import { ModulePlaceholderPage } from '@/pages/module-placeholder-page'

import { App } from '../App'

const LoginPage = lazyNamed(() => import('@pages/auth/login-page'), 'LoginPage')
const DashboardPage = lazyNamed(
  () => import('@features/dashboard/pages/dashboard-page'),
  'DashboardPage',
)
const StudentsPage = lazyNamed(
  () => import('@features/students/pages/students-page'),
  'StudentsPage',
)
const StudentDetailPage = lazyNamed(
  () => import('@features/students/pages/student-detail-page'),
  'StudentDetailPage',
)
const ParentsPage = lazyNamed(
  () => import('@features/parents/pages/parents-page'),
  'ParentsPage',
)
const ParentDetailPage = lazyNamed(
  () => import('@features/parents/pages/parent-detail-page'),
  'ParentDetailPage',
)
const TeachersPage = lazyNamed(
  () => import('@features/teachers/pages/teachers-page'),
  'TeachersPage',
)
const TeacherDetailPage = lazyNamed(
  () => import('@features/teachers/pages/teacher-detail-page'),
  'TeacherDetailPage',
)
const ClassesPage = lazyNamed(
  () => import('@features/classes/pages/classes-page'),
  'ClassesPage',
)
const ClassDetailPage = lazyNamed(
  () => import('@features/classes/pages/class-detail-page'),
  'ClassDetailPage',
)
const EnrollmentsPage = lazyNamed(
  () => import('@features/enrollments/pages/enrollments-page'),
  'EnrollmentsPage',
)
const EnrollmentDetailPage = lazyNamed(
  () => import('@features/enrollments/pages/enrollment-detail-page'),
  'EnrollmentDetailPage',
)
const SubjectsPage = lazyNamed(() => import('@features/subjects/pages/subjects-page'), 'SubjectsPage')
const SubjectDetailPage = lazyNamed(
  () => import('@features/subjects/pages/subject-detail-page'),
  'SubjectDetailPage',
)
  const FinanceOverviewPage = lazyNamed(() => import('@features/expenses/pages/finance-overview-page'), 'FinanceOverviewPage')
  const ExpensesPage = lazyNamed(() => import('@features/expenses/pages/expenses-page'), 'ExpensesPage')
  const CashRegisterPage = lazyNamed(() => import('@features/expenses/pages/cash-register-page'), 'CashRegisterPage')
  const ExpenseDetailPage = lazyNamed(() => import('@features/expenses/pages/expense-detail-page'), 'ExpenseDetailPage')
  const CashRegisterDetailPage = lazyNamed(() => import('@features/expenses/pages/cash-register-detail-page'), 'CashRegisterDetailPage')
  const DocumentsPage = lazyNamed(() => import('@features/documents/pages/documents-page'), 'DocumentsPage')
  const SettingsPage = lazyNamed(() => import('@features/settings/pages/settings-page'), 'SettingsPage')
  const PaymentsPage = lazyNamed(() => import('@features/payments/pages/payments-page'), 'PaymentsPage')
  const GradesPage = lazyNamed(() => import('@features/grades/pages/grades-page'), 'GradesPage')
  const AttendancePage = lazyNamed(() => import('@features/attendance/pages/attendance-page'), 'AttendancePage')
  const DocumentDetailPage = lazyNamed(() => import('@features/documents/pages/document-detail-page'), 'DocumentDetailPage')
  const ReportsPage = lazyNamed(() => import('@features/reports/pages/reports-page'), 'ReportsPage')
const FoundationPage = lazyNamed(() => import('@pages/foundation-page'), 'FoundationPage')
const DesignSystemPage = lazyNamed(() => import('@pages/design-system-page'), 'DesignSystemPage')
const ComingSoonPage = lazyNamed(() => import('@pages/coming-soon-page'), 'ComingSoonPage')
const NotFoundPage = lazyNamed(() => import('@pages/not-found-page'), 'NotFoundPage')

function lazyNamed<M extends Record<string, ComponentType>>(
  importer: () => Promise<M>,
  exportName: keyof M,
): LazyExoticComponent<ComponentType> {
  return lazy(() => importer().then((module) => ({ default: module[exportName] })))
}

function lazyElement(component: LazyExoticComponent<ComponentType>): ReactElement {
  const Component = component
  return (
    <Suspense fallback={<RouteLoader />}>
      <Component />
    </Suspense>
  )
}

interface PlaceholderSpec {
  labelKey: TranslationKey
  href: string
  status?: NavItemStatus
  navKey?: string
}

/** Route spec for every module placeholder; resolves data from the nav config. */
function placeholderSpec(key: string): PlaceholderSpec {
  const item = findNavItem(key)
  if (item) return { labelKey: item.labelKey, href: item.href, status: item.status, navKey: key }
  const utility: Record<string, PlaceholderSpec> = {
    profile: { labelKey: 'userMenu.profile', href: '/profile', status: 'new' },
    notifications: { labelKey: 'shell.notifications', href: '/notifications', status: 'new' },
  }
  return utility[key] ?? { labelKey: 'nav.dashboard', href: '/dashboard' }
}

/** Renders a module placeholder fed by the matching nav item. */
function modulePlaceholder(key: string): ReactElement {
  const { labelKey, href, status } = placeholderSpec(key)
  return (
    <Suspense fallback={<RouteLoader />}>
      <ModulePlaceholderPage labelKey={labelKey} href={href} status={status} />
    </Suspense>
  )
}

/** Application route tree. */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        element: <RootLayout />,
        children: [
          {
            element: <AuthLayout />,
            children: [{ path: 'login', element: lazyElement(LoginPage) }],
          },
          {
            path: 'design-system',
            element: lazyElement(DesignSystemPage),
          },
          {
            element: <AppShell />,
            children: [
              { path: 'dashboard', element: lazyElement(DashboardPage) },
              { path: 'foundation', element: lazyElement(FoundationPage) },
              { path: 'coming-soon', element: lazyElement(ComingSoonPage) },
              { path: 'students', element: lazyElement(StudentsPage) },
              { path: 'students/:id', element: lazyElement(StudentDetailPage) },
              { path: 'parents', element: lazyElement(ParentsPage) },
              { path: 'parents/:id', element: lazyElement(ParentDetailPage) },
{ path: 'teachers', element: lazyElement(TeachersPage) },
      { path: 'teachers/:id', element: lazyElement(TeacherDetailPage) },
      { path: 'classes', element: lazyElement(ClassesPage) },
      { path: 'classes/:id', element: lazyElement(ClassDetailPage) },
              { path: 'subjects', element: lazyElement(SubjectsPage) },
              { path: 'subjects/:id', element: lazyElement(SubjectDetailPage) },
              { path: 'enrollments', element: lazyElement(EnrollmentsPage) },
              { path: 'enrollments/:id', element: lazyElement(EnrollmentDetailPage) },
              { path: 'attendance', element: lazyElement(AttendancePage) },
              { path: 'grades', element: lazyElement(GradesPage) },
              { path: 'finance', element: lazyElement(FinanceOverviewPage) },
              { path: 'finance/expenses', element: lazyElement(ExpensesPage) },
              { path: 'finance/expenses/:id', element: lazyElement(ExpenseDetailPage) },
              { path: 'finance/cash-register', element: lazyElement(CashRegisterPage) },
              { path: 'finance/cash-register/:id', element: lazyElement(CashRegisterDetailPage) },
              { path: 'payments', element: lazyElement(PaymentsPage) },
              { path: 'expenses', element: <Navigate to="/finance/expenses" replace /> },
              { path: 'documents', element: lazyElement(DocumentsPage) },
              { path: 'documents/:id', element: lazyElement(DocumentDetailPage) },
              { path: 'reports', element: lazyElement(ReportsPage) },
              { path: 'reports/:section', element: lazyElement(ReportsPage) },
              { path: 'settings', element: lazyElement(SettingsPage) },
              { path: 'settings/:section', element: lazyElement(SettingsPage) },
              { path: 'profile', element: modulePlaceholder('profile') },
              { path: 'notifications', element: modulePlaceholder('notifications') },
            ],
          },
          { path: '*', element: lazyElement(NotFoundPage) },
        ],
      },
    ],
  },
])
