import { useMemo, useState } from 'react'
import { DEFAULT_CATEGORIES } from '../data/mockTransactions'
import type { Transaction, TransactionDraft } from '../types/finance'

interface TransactionFormProps {
  mode: 'add' | 'edit'
  transaction: Transaction | null
  categories: string[]
  onCancel: () => void
  onSubmit: (draft: TransactionDraft) => void
}

function getInitialDraft(transaction: Transaction | null): TransactionDraft {
  if (transaction) {
    const { date, description, amount, category, type } = transaction
    return { date, description, amount, category, type }
  }

  return {
    date: new Date().toISOString().slice(0, 10),
    description: '',
    amount: 0,
    category: DEFAULT_CATEGORIES[0],
    type: 'expense',
  }
}

function TransactionForm({
  mode,
  transaction,
  categories,
  onCancel,
  onSubmit,
}: TransactionFormProps) {
  const [draft, setDraft] = useState<TransactionDraft>(() =>
    getInitialDraft(transaction),
  )
  const [error, setError] = useState('')

  const allCategories = useMemo(() => {
    const merged = [...categories, ...DEFAULT_CATEGORIES]
    return [...new Set(merged)].sort((a, b) => a.localeCompare(b))
  }, [categories])

  function updateDraft<Key extends keyof TransactionDraft>(
    key: Key,
    value: TransactionDraft[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!draft.description.trim()) {
      setError('Description is required.')
      return
    }

    if (draft.amount <= 0) {
      setError('Amount should be greater than zero.')
      return
    }

    if (!draft.date) {
      setError('Date is required.')
      return
    }

    setError('')
    onSubmit({
      ...draft,
      description: draft.description.trim(),
      category: draft.category.trim(),
    })
  }

  return (
    <section className="rounded-3xl border border-slate-900/10 bg-white/90 p-5 shadow-[0_20px_45px_-36px_rgba(15,23,42,0.95)] backdrop-blur sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Transaction Editor
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            {mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Date
          <input
            type="date"
            value={draft.date}
            onChange={(event) => updateDraft('date', event.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 outline-none transition focus:border-sky-500 focus:bg-white"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={draft.amount || ''}
            onChange={(event) =>
              updateDraft('amount', Number(event.target.value) || 0)
            }
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 outline-none transition focus:border-sky-500 focus:bg-white"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Description
          <input
            type="text"
            value={draft.description}
            onChange={(event) => updateDraft('description', event.target.value)}
            placeholder="Example: Grocery shopping"
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 outline-none transition focus:border-sky-500 focus:bg-white"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Category
          <select
            value={draft.category}
            onChange={(event) => updateDraft('category', event.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 outline-none transition focus:border-sky-500 focus:bg-white"
          >
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Type
          <select
            value={draft.type}
            onChange={(event) =>
              updateDraft('type', event.target.value as TransactionDraft['type'])
            }
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 outline-none transition focus:border-sky-500 focus:bg-white"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        {error ? (
          <p className="md:col-span-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {mode === 'add' ? 'Add Transaction' : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default TransactionForm
