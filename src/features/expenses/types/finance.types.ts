export type PaymentMethod = 'cash' | 'bank-transfer' | 'card' | 'other'
export type ExpenseStatus = 'paid' | 'pending' | 'cancelled'
export type CashSessionStatus = 'open' | 'closed'
export type CashMovementType = 'income' | 'expense'
export interface ExpenseCategory { id: string; nameAr: string; nameFr: string; nameEn: string; isActive: boolean; description: string; createdAt: string; updatedAt: string }
export interface Expense { id: string; reference: string; categoryId: string; categoryName: string; description: string; amount: number; paymentMethod: PaymentMethod; date: string; supplier: string; createdBy: string; notes: string; status: ExpenseStatus; createdAt: string; updatedAt: string }
export interface ExpenseFormValues { categoryId: string; description: string; amount: number; paymentMethod: PaymentMethod; date: string; supplier: string; status: ExpenseStatus; notes: string }
export interface Payment { id: string; reference: string; description: string; amount: number; paymentMethod: PaymentMethod; date: string; status: 'paid' | 'pending' | 'cancelled'; createdBy: string }
export interface CashRegisterSession { id: string; reference: string; date: string; openedAt: string; closedAt: string | null; openingBalance: number; totalCashIncome: number; totalCashExpenses: number; expectedClosingBalance: number; actualClosingBalance: number | null; difference: number | null; status: CashSessionStatus; openedBy: string; closedBy: string | null; notes: string; createdAt: string; updatedAt: string }
export interface CashMovement { id: string; sessionId: string; type: CashMovementType; reference: string; description: string; amount: number; sourceId: string; sourceType: 'payment' | 'expense'; paymentMethod: PaymentMethod; date: string; createdBy: string }
export interface CashCloseValues { actualClosingBalance: number; notes: string }
export interface ExpenseFilters { categoryId: string; paymentMethod: PaymentMethod | 'all'; status: ExpenseStatus | 'all'; date: string; minAmount: string; maxAmount: string; createdBy: string }
export type ExpenseSortKey = 'dateDesc' | 'dateAsc' | 'amountDesc' | 'amountAsc' | 'categoryAsc' | 'referenceAsc' | 'statusAsc'
