import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { CategoryBreakdownPoint } from '../types/finance'
import { formatCurrency } from '../utils/finance'
import EmptyState from './EmptyState'

interface SpendingBreakdownChartProps {
  data: CategoryBreakdownPoint[]
}

const PIE_COLORS = [
  '#0ea5e9',
  '#14b8a6',
  '#f97316',
  '#f59e0b',
  '#22c55e',
  '#ef4444',
  '#64748b',
]

function SpendingBreakdownChart({ data }: SpendingBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No expense breakdown"
        description="Expense categories will appear here once expense transactions are added."
      />
    )
  }

  return (
    <div className="rounded-3xl border border-slate-900/10 bg-white/90 p-5 shadow-[0_20px_45px_-36px_rgba(15,23,42,0.95)] backdrop-blur sm:p-6">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Expense Mix
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">Spending Breakdown</h2>
        <p className="text-sm text-slate-600">
          Distribution of expenses across categories.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="h-64 rounded-2xl bg-slate-50/80 px-2 py-1 lg:col-span-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="category"
                innerRadius={58}
                outerRadius={94}
                paddingAngle={1.5}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  formatCurrency(typeof value === 'number' ? value : Number(value) || 0)
                }
                contentStyle={{
                  borderRadius: '14px',
                  border: '1px solid #dbeafe',
                  backgroundColor: '#f8fbff',
                  boxShadow: '0 16px 35px -28px rgba(15, 23, 42, 0.9)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="space-y-2 lg:col-span-2">
          {data.map((entry, index) => (
            <li
              key={entry.category}
              className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 shadow-[0_10px_25px_-24px_rgba(15,23,42,0.95)]"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                />
                {entry.category}
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {formatCurrency(entry.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SpendingBreakdownChart
