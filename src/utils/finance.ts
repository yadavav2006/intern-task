import type {
  CategoryBreakdownPoint,
  DashboardInsights,
  MonthlyTrendPoint,
  SortOption,
  SummaryValues,
  Transaction,
  TypeFilter,
} from '../types/finance'

interface FilterOptions {
  searchTerm: string
  typeFilter: TypeFilter
  categoryFilter: string
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const monthLabelFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: '2-digit',
})

function toMonthKey(date: string): string {
  return date.slice(0, 7)
}

function fromMonthKey(monthKey: string): Date {
  return new Date(`${monthKey}-01`)
}

function signedAmount(transaction: Transaction): number {
  return transaction.type === 'income' ? transaction.amount : -transaction.amount
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value))
}

export function getSummaryValues(transactions: Transaction[]): SummaryValues {
  return transactions.reduce<SummaryValues>(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        summary.income += transaction.amount
      } else {
        summary.expenses += transaction.amount
      }

      summary.balance = summary.income - summary.expenses
      return summary
    },
    {
      income: 0,
      expenses: 0,
      balance: 0,
    },
  )
}

export function getUniqueCategories(transactions: Transaction[]): string[] {
  return [...new Set(transactions.map((transaction) => transaction.category))].sort(
    (a, b) => a.localeCompare(b),
  )
}

export function filterTransactions(
  transactions: Transaction[],
  options: FilterOptions,
): Transaction[] {
  const normalizedSearch = options.searchTerm.trim().toLowerCase()

  return transactions.filter((transaction) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      transaction.description.toLowerCase().includes(normalizedSearch) ||
      transaction.category.toLowerCase().includes(normalizedSearch)

    const matchesType =
      options.typeFilter === 'all' || transaction.type === options.typeFilter

    const matchesCategory =
      options.categoryFilter === 'all' ||
      transaction.category === options.categoryFilter

    return matchesSearch && matchesType && matchesCategory
  })
}

export function sortTransactions(
  transactions: Transaction[],
  sortOption: SortOption,
): Transaction[] {
  const sorted = [...transactions]

  sorted.sort((first, second) => {
    if (sortOption === 'amount-high') {
      return second.amount - first.amount
    }

    if (sortOption === 'amount-low') {
      return first.amount - second.amount
    }

    const firstTime = new Date(first.date).getTime()
    const secondTime = new Date(second.date).getTime()

    return sortOption === 'oldest' ? firstTime - secondTime : secondTime - firstTime
  })

  return sorted
}

export function buildMonthlyTrend(transactions: Transaction[]): MonthlyTrendPoint[] {
  const monthMap = new Map<string, { income: number; expenses: number }>()

  transactions.forEach((transaction) => {
    const monthKey = toMonthKey(transaction.date)
    const record = monthMap.get(monthKey) ?? { income: 0, expenses: 0 }

    if (transaction.type === 'income') {
      record.income += transaction.amount
    } else {
      record.expenses += transaction.amount
    }

    monthMap.set(monthKey, record)
  })

  const sortedMonths = [...monthMap.keys()].sort((a, b) =>
    fromMonthKey(a).getTime() - fromMonthKey(b).getTime(),
  )

  let runningBalance = 0

  return sortedMonths.map((monthKey) => {
    const record = monthMap.get(monthKey)

    if (!record) {
      return {
        month: monthLabelFormatter.format(fromMonthKey(monthKey)),
        income: 0,
        expenses: 0,
        balance: runningBalance,
      }
    }

    runningBalance += record.income - record.expenses

    return {
      month: monthLabelFormatter.format(fromMonthKey(monthKey)),
      income: record.income,
      expenses: record.expenses,
      balance: runningBalance,
    }
  })
}

export function buildCategoryBreakdown(
  transactions: Transaction[],
): CategoryBreakdownPoint[] {
  const categoryMap = new Map<string, number>()

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      const total = categoryMap.get(transaction.category) ?? 0
      categoryMap.set(transaction.category, total + transaction.amount)
    })

  return [...categoryMap.entries()]
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value)
}

export function buildInsights(transactions: Transaction[]): DashboardInsights {
  const summary = getSummaryValues(transactions)
  const categoryBreakdown = buildCategoryBreakdown(transactions)
  const highestSpendingCategory = categoryBreakdown[0] ?? null

  const monthlyExpenses = new Map<string, number>()

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      const monthKey = toMonthKey(transaction.date)
      const total = monthlyExpenses.get(monthKey) ?? 0
      monthlyExpenses.set(monthKey, total + transaction.amount)
    })

  const months = [...monthlyExpenses.keys()].sort((a, b) =>
    fromMonthKey(a).getTime() - fromMonthKey(b).getTime(),
  )

  let monthlyComparison = null

  if (months.length >= 2) {
    const previousMonthKey = months[months.length - 2]
    const currentMonthKey = months[months.length - 1]

    const previousExpense = monthlyExpenses.get(previousMonthKey) ?? 0
    const currentExpense = monthlyExpenses.get(currentMonthKey) ?? 0

    const deltaPercent =
      previousExpense === 0
        ? currentExpense === 0
          ? 0
          : 100
        : ((currentExpense - previousExpense) / previousExpense) * 100

    monthlyComparison = {
      previousMonth: monthLabelFormatter.format(fromMonthKey(previousMonthKey)),
      currentMonth: monthLabelFormatter.format(fromMonthKey(currentMonthKey)),
      previousExpense,
      currentExpense,
      deltaPercent,
    }
  }

  let observation = 'Add a few transactions to generate tailored insights.'

  if (transactions.length > 0) {
    if (summary.income === 0 && summary.expenses > 0) {
      observation =
        'Expenses exist without recorded income. Add income entries to track savings health accurately.'
    } else if (summary.income > 0) {
      const savingsRate = ((summary.income - summary.expenses) / summary.income) * 100

      if (savingsRate < 0) {
        observation =
          'Current spending exceeds income. Focus on reducing non-essential categories this month.'
      } else if (savingsRate < 15) {
        observation =
          'Savings are positive but slim. A 5-10% cut in variable costs can improve your buffer.'
      } else {
        observation =
          'Savings rate is healthy. Keep this trend and consider increasing investment allocations.'
      }
    }
  }

  return {
    highestSpendingCategory,
    monthlyComparison,
    observation,
  }
}

export function hasActiveFilters(
  searchTerm: string,
  typeFilter: TypeFilter,
  categoryFilter: string,
): boolean {
  return (
    searchTerm.trim().length > 0 || typeFilter !== 'all' || categoryFilter !== 'all'
  )
}

export function calculateSignedAmount(transaction: Transaction): number {
  return signedAmount(transaction)
}
