import { getClasses } from '@/features/classes/services/classes.service'
import { getDocuments } from '@/features/documents/services/documents.service'
import { getEnrollments } from '@/features/enrollments/services/enrollment.service'
import { getExpenses } from '@/features/expenses/services/expense.service'
import { getPayments, getOpenCashRegister } from '@/features/expenses/services/cash-register.service'
import { getStudents } from '@/features/students/services/students.service'
import { getTeachers } from '@/features/teachers/services/teachers.service'
import { calculateCashExpenses, calculateCashIncome, calculateNetCashFlow } from '@/features/expenses/utils/finance.utils'
import type { Student } from '@/features/students/types/students.types'
import type { Enrollment } from '@/features/enrollments/types/enrollments.types'
import type { Expense, Payment } from '@/features/expenses/types/finance.types'
import type { SchoolClass } from '@/features/classes/types/classes.types'
import type { Teacher } from '@/features/teachers/types/teachers.types'
import type { SchoolDocument } from '@/features/documents/types/documents.types'

export interface ReportFilters { academicYear: string; from: string; to: string; level: string; classId: string; status: string; gender: string; paymentMethod: string; category: string }
export interface ReportData { students: Student[]; enrollments: Enrollment[]; payments: Payment[]; expenses: Expense[]; classes: SchoolClass[]; teachers: Teacher[]; documents: SchoolDocument[]; cash: { opening: number; expected: number; actual: number | null } }
export interface ReportSummary { totalStudents: number; activeStudents: number; newEnrollments: number; totalPayments: number; outstandingDebts: number; totalExpenses: number; cashIncome: number; cashExpenses: number; netCashFlow: number; attendanceRate: null; averageGrade: null }

function inRange(date: string, filters: ReportFilters): boolean { return (!filters.from || date >= filters.from) && (!filters.to || date <= filters.to) }
function matchesStudent(student: Student, filters: ReportFilters): boolean { return (!filters.level || student.level === filters.level) && (!filters.classId || student.classId === filters.classId) && (!filters.status || student.status === filters.status) && (!filters.gender || student.gender === filters.gender) && inRange(student.enrollmentDate, filters) }
function matchesEnrollment(item: Enrollment, filters: ReportFilters): boolean { return (!filters.academicYear || item.academicYear === filters.academicYear) && (!filters.level || item.levelId === filters.level) && (!filters.classId || item.classId === filters.classId) && (!filters.status || item.status === filters.status) && inRange(item.enrollmentDate, filters) }
function matchesPayment(item: Payment, filters: ReportFilters): boolean { return (!filters.paymentMethod || item.paymentMethod === filters.paymentMethod) && inRange(item.date, filters) }
function matchesExpense(item: Expense, filters: ReportFilters): boolean { return (!filters.paymentMethod || item.paymentMethod === filters.paymentMethod) && (!filters.category || item.categoryId === filters.category) && inRange(item.date, filters) }

export function calculateAttendanceRate(): null { return null }
export function calculateAverage(values: number[]): number { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0 }
export function calculateTotal(values: number[]): number { return values.reduce((sum, value) => sum + value, 0) }
export function calculatePercentage(value: number, total: number): number { return total ? (value / total) * 100 : 0 }
export function groupByMonth<T extends { date: string }>(items: T[]): { month: string; count: number }[] { const grouped = new Map<string, number>(); items.forEach((item) => grouped.set(item.date.slice(0, 7), (grouped.get(item.date.slice(0, 7)) ?? 0) + 1)); return [...grouped.entries()].sort().map(([month, count]) => ({ month, count })) }
export function groupByLevel(students: Student[]): { label: string; count: number }[] { const grouped = new Map<string, number>(); students.forEach((student) => grouped.set(student.level, (grouped.get(student.level) ?? 0) + 1)); return [...grouped.entries()].sort().map(([label, count]) => ({ label, count })) }

export async function getReportData(filters: ReportFilters): Promise<ReportData> { const [students, enrollments, payments, expenses, classes, teachers, documents, open] = await Promise.all([getStudents(), getEnrollments(), getPayments(), getExpenses(), getClasses(), getTeachers(), getDocuments(), getOpenCashRegister()]); return { students: students.filter((item) => matchesStudent(item, filters)), enrollments: enrollments.filter((item) => matchesEnrollment(item, filters)), payments: payments.filter((item) => matchesPayment(item, filters)), expenses: expenses.filter((item) => matchesExpense(item, filters)), classes, teachers, documents, cash: { opening: open?.openingBalance ?? 0, expected: open?.expectedClosingBalance ?? 0, actual: open?.actualClosingBalance ?? null } } }
export function getReportSummary(data: ReportData): ReportSummary { const paidPayments = data.payments.filter((item) => item.status === 'paid'); const paidExpenses = data.expenses.filter((item) => item.status === 'paid'); const totalPayments = calculateTotal(paidPayments.map((item) => item.amount)); const cashIncome = calculateCashIncome(data.payments); const cashExpenses = calculateCashExpenses(data.expenses); return { totalStudents: data.students.length, activeStudents: data.students.filter((item) => item.status === 'active').length, newEnrollments: data.enrollments.filter((item) => item.registrationType === 'new').length, totalPayments, outstandingDebts: calculateTotal(data.payments.filter((item) => item.status === 'pending').map((item) => item.amount)), totalExpenses: calculateTotal(paidExpenses.map((item) => item.amount)), cashIncome, cashExpenses, netCashFlow: calculateNetCashFlow(data.payments, data.expenses), attendanceRate: null, averageGrade: null } }
export function getPaymentMethods(data: ReportData): { label: string; amount: number }[] { return ['cash', 'bank-transfer', 'card', 'other'].map((method) => ({ label: method, amount: calculateTotal(data.payments.filter((item) => item.paymentMethod === method && item.status === 'paid').map((item) => item.amount)) })).filter((item) => item.amount > 0) }
export function getExpenseCategories(data: ReportData): { label: string; amount: number }[] { const grouped = new Map<string, number>(); data.expenses.filter((item) => item.status === 'paid').forEach((item) => grouped.set(item.categoryName, (grouped.get(item.categoryName) ?? 0) + item.amount)); return [...grouped.entries()].map(([label, amount]) => ({ label, amount })).sort((a, b) => b.amount - a.amount) }
export function getClassStatistics(data: ReportData): { label: string; level: string; students: number; capacity: number; occupancy: number }[] { return data.classes.map((schoolClass) => { const students = data.students.filter((student) => student.classId === schoolClass.id).length; return { label: schoolClass.label, level: schoolClass.level, students, capacity: schoolClass.capacity, occupancy: calculatePercentage(students, schoolClass.capacity) } }) }
