export type TransactionType = 'income' | 'expense'

export type UserRole = 'viewer' | 'admin'

export type TypeFilter = 'all' | TransactionType

export type SortOption = 'newest' | 'oldest' | 'amount-high' | 'amount-low'

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: TransactionType
}

export interface TransactionDraft {
  date: string
  description: string
  amount: number
  category: string
  type: TransactionType
}

export interface SummaryValues {
  income: number
  expenses: number
  balance: number
}

export interface MonthlyTrendPoint {
  month: string
  income: number
  expenses: number
  balance: number
}

export interface CategoryBreakdownPoint {
  category: string
  value: number
}

export interface MonthlyComparison {
  previousMonth: string
  currentMonth: string
  previousExpense: number
  currentExpense: number
  deltaPercent: number
}

export interface DashboardInsights {
  highestSpendingCategory: CategoryBreakdownPoint | null
  monthlyComparison: MonthlyComparison | null
  observation: string
}
