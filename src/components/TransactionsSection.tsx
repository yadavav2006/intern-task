import type {
  SortOption,
  Transaction,
  TypeFilter,
  UserRole,
} from '../types/finance'
import { calculateSignedAmount, formatCurrency, formatDate } from '../utils/finance'
import EmptyState from './EmptyState'

interface TransactionsSectionProps {
  role: UserRole
  transactions: Transaction[]
  categories: string[]
  searchTerm: string
  typeFilter: TypeFilter
  categoryFilter: string
  sortOption: SortOption
  hasActiveFilters: boolean
  onSearchTermChange: (value: string) => void
  onTypeFilterChange: (value: TypeFilter) => void
  onCategoryFilterChange: (value: string) => void
  onSortOptionChange: (value: SortOption) => void
  onClearFilters: () => void
  onOpenAddTransaction: () => void
  onOpenEditTransaction: (transaction: Transaction) => void
}

function TransactionsSection({
  role,
  transactions,
  categories,
  searchTerm,
  typeFilter,
  categoryFilter,
  sortOption,
  hasActiveFilters,
  onSearchTermChange,
  onTypeFilterChange,
  onCategoryFilterChange,
  onSortOptionChange,
  onClearFilters,
  onOpenAddTransaction,
  onOpenEditTransaction,
}: TransactionsSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-900/10 bg-white/90 p-5 shadow-[0_20px_45px_-36px_rgba(15,23,42,0.95)] backdrop-blur sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Ledger
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Transactions</h2>
          <p className="text-sm text-slate-600">{transactions.length} records in view</p>
        </div>

        {role === 'admin' ? (
          <button
            type="button"
            onClick={onOpenAddTransaction}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Add Transaction
          </button>
        ) : (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
            Viewer: read-only mode
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Search description/category"
          className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
        />

        <select
          value={typeFilter}
          onChange={(event) => onTypeFilterChange(event.target.value as TypeFilter)}
          className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) => onCategoryFilterChange(event.target.value)}
          className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(event) => onSortOptionChange(event.target.value as SortOption)}
          className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
        >
          <option value="newest">Sort: Newest first</option>
          <option value="oldest">Sort: Oldest first</option>
          <option value="amount-high">Sort: Highest amount</option>
          <option value="amount-low">Sort: Lowest amount</option>
        </select>
      </div>

      <div className="mt-5">
        {transactions.length === 0 ? (
          <div className="space-y-3">
            <EmptyState
              title="No transactions found"
              description="Try changing filters or add a new transaction in Admin mode."
            />
            {hasActiveFilters ? (
              <div className="text-center">
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Clear Filters
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
            <div className="hidden bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 md:grid md:grid-cols-12">
              <span className="md:col-span-2">Date</span>
              <span className="md:col-span-3">Description</span>
              <span className="md:col-span-2">Category</span>
              <span className="md:col-span-2">Type</span>
              <span className="md:col-span-2 text-right">Amount</span>
              <span className="md:col-span-1 text-right">Action</span>
            </div>

            <ul className="divide-y divide-slate-200/90">
              {transactions.map((transaction) => {
                const signedAmount = calculateSignedAmount(transaction)
                const amountTextColor =
                  transaction.type === 'income' ? 'text-emerald-700' : 'text-rose-700'

                return (
                  <li
                    key={transaction.id}
                    className="grid gap-2 px-4 py-3 transition-colors hover:bg-slate-50/70 md:grid-cols-12 md:items-center"
                  >
                    <span className="text-sm text-slate-600 md:col-span-2">
                      {formatDate(transaction.date)}
                    </span>
                    <span className="text-sm font-medium text-slate-900 md:col-span-3">
                      {transaction.description}
                    </span>
                    <span className="text-sm text-slate-700 md:col-span-2">
                      {transaction.category}
                    </span>
                    <span className="md:col-span-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
                          transaction.type === 'income'
                            ? 'border border-emerald-200 bg-emerald-100 text-emerald-700'
                            : 'border border-rose-200 bg-rose-100 text-rose-700'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </span>
                    <span
                      className={`text-sm font-semibold md:col-span-2 md:text-right ${amountTextColor}`}
                    >
                      {signedAmount > 0 ? '+' : '-'}
                      {formatCurrency(Math.abs(signedAmount))}
                    </span>
                    <span className="md:col-span-1 md:text-right">
                      {role === 'admin' ? (
                        <button
                          type="button"
                          onClick={() => onOpenEditTransaction(transaction)}
                          className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

export default TransactionsSection
