import { useEffect, useMemo, useState } from 'react'
import BalanceTrendChart from './components/BalanceTrendChart.tsx'
import InsightsPanel from './components/InsightsPanel'
import SpendingBreakdownChart from './components/SpendingBreakdownChart'
import SummaryCards from './components/SummaryCards'
import TransactionForm from './components/TransactionForm'
import TransactionsSection from './components/TransactionsSection'
import { mockTransactions } from './data/mockTransactions'
import type {
  SortOption,
  Transaction,
  TransactionDraft,
  TypeFilter,
  UserRole,
} from './types/finance'
import {
  buildCategoryBreakdown,
  buildInsights,
  buildMonthlyTrend,
  filterTransactions,
  getSummaryValues,
  getUniqueCategories,
  hasActiveFilters,
  sortTransactions,
} from './utils/finance'

const ROLE_STORAGE_KEY = 'finance-dashboard-role'
const TRANSACTION_STORAGE_KEY = 'finance-dashboard-transactions'

function getInitialRole(): UserRole {
  const stored = window.localStorage.getItem(ROLE_STORAGE_KEY)
  if (stored === 'admin' || stored === 'viewer') {
    return stored
  }
  return 'viewer'
}

function getInitialTransactions(): Transaction[] {
  const stored = window.localStorage.getItem(TRANSACTION_STORAGE_KEY)

  if (!stored) {
    return mockTransactions
  }

  try {
    const parsed = JSON.parse(stored) as Transaction[]
    return parsed.length > 0 ? parsed : mockTransactions
  } catch {
    return mockTransactions
  }
}

function App() {
  const [role, setRole] = useState<UserRole>(getInitialRole)
  const [transactions, setTransactions] = useState<Transaction[]>(
    getInitialTransactions,
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortOption, setSortOption] = useState<SortOption>('newest')

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null,
  )
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(ROLE_STORAGE_KEY, role)

    if (role === 'viewer') {
      setIsFormOpen(false)
      setEditingTransaction(null)
    }
  }, [role])

  useEffect(() => {
    window.localStorage.setItem(
      TRANSACTION_STORAGE_KEY,
      JSON.stringify(transactions),
    )
  }, [transactions])

  const categories = useMemo(
    () => getUniqueCategories(transactions),
    [transactions],
  )

  const filteredTransactions = useMemo(
    () =>
      filterTransactions(transactions, {
        searchTerm,
        typeFilter,
        categoryFilter,
      }),
    [transactions, searchTerm, typeFilter, categoryFilter],
  )

  const sortedTransactions = useMemo(
    () => sortTransactions(filteredTransactions, sortOption),
    [filteredTransactions, sortOption],
  )

  const isFilteredView = hasActiveFilters(searchTerm, typeFilter, categoryFilter)

  const analyticsTransactions = isFilteredView
    ? filteredTransactions
    : transactions

  const summary = useMemo(
    () => getSummaryValues(analyticsTransactions),
    [analyticsTransactions],
  )

  const monthlyTrend = useMemo(
    () => buildMonthlyTrend(analyticsTransactions),
    [analyticsTransactions],
  )

  const categoryBreakdown = useMemo(
    () => buildCategoryBreakdown(analyticsTransactions),
    [analyticsTransactions],
  )

  const insights = useMemo(
    () => buildInsights(analyticsTransactions),
    [analyticsTransactions],
  )

  function openAddTransaction() {
    setEditingTransaction(null)
    setIsFormOpen(true)
  }

  function openEditTransaction(transaction: Transaction) {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingTransaction(null)
  }

  function handleSaveTransaction(draft: TransactionDraft) {
    if (editingTransaction) {
      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id === editingTransaction.id
            ? { ...editingTransaction, ...draft }
            : transaction,
        ),
      )
    } else {
      const nextTransaction: Transaction = {
        id: `txn-${crypto.randomUUID()}`,
        ...draft,
      }

      setTransactions((current) => [nextTransaction, ...current])
    }

    closeForm()
  }

  function clearFilters() {
    setSearchTerm('')
    setTypeFilter('all')
    setCategoryFilter('all')
    setSortOption('newest')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(140deg,#fff8ee_0%,#f5f8ff_45%,#eefbf4_100%)] px-4 py-6 sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-36 h-80 w-80 rounded-full bg-sky-200/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 left-1/3 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />

      <div className="relative mx-auto max-w-7xl space-y-6">
        <header className="animate-[fadeIn_500ms_ease-out] rounded-[2rem] border border-slate-900/10 bg-white/80 p-5 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.85)] backdrop-blur sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                Personal Finance Workspace
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                MoneyMap Ledger
              </h1>
              <p className="mt-2 text-sm text-slate-700 sm:text-base">
                A clear, daily-friendly view of where money comes from, where it goes,
                and how your month is trending.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-700" htmlFor="role-select">
                  Access
                </label>
                <select
                  id="role-select"
                  value={role}
                  onChange={(event) => setRole(event.target.value as UserRole)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <p
            className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
              role === 'admin'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
          >
            {role === 'admin'
              ? 'Admin mode is active. You can add and edit transactions.'
              : 'Viewer mode is active. Data exploration is available, editing is locked.'}
          </p>
        </header>

        <SummaryCards summary={summary} />

        <div className="grid gap-6 lg:grid-cols-2">
          <BalanceTrendChart data={monthlyTrend} />
          <SpendingBreakdownChart data={categoryBreakdown} />
        </div>

        <InsightsPanel insights={insights} summary={summary} />

        {role === 'admin' && isFormOpen ? (
          <TransactionForm
            mode={editingTransaction ? 'edit' : 'add'}
            transaction={editingTransaction}
            categories={categories}
            onCancel={closeForm}
            onSubmit={handleSaveTransaction}
          />
        ) : null}

        <TransactionsSection
          role={role}
          transactions={sortedTransactions}
          categories={categories}
          searchTerm={searchTerm}
          typeFilter={typeFilter}
          categoryFilter={categoryFilter}
          sortOption={sortOption}
          hasActiveFilters={isFilteredView}
          onSearchTermChange={setSearchTerm}
          onTypeFilterChange={setTypeFilter}
          onCategoryFilterChange={setCategoryFilter}
          onSortOptionChange={setSortOption}
          onClearFilters={clearFilters}
          onOpenAddTransaction={openAddTransaction}
          onOpenEditTransaction={openEditTransaction}
        />
      </div>
    </div>
  )
}

export default App
