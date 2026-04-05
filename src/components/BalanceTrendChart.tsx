import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyTrendPoint } from '../types/finance'
import { formatCurrency } from '../utils/finance'
import EmptyState from './EmptyState'

interface BalanceTrendChartProps {
  data: MonthlyTrendPoint[]
  isDark: boolean
}

function BalanceTrendChart({ data, isDark }: BalanceTrendChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No trend available"
        description="Add transactions to visualize month-by-month balance movement."
      />
    )
  }

  return (
    <div className="rounded-3xl border border-slate-900/10 bg-white/90 p-5 shadow-[0_20px_45px_-36px_rgba(15,23,42,0.95)] backdrop-blur dark:border-slate-600/35 dark:bg-slate-900/75 dark:shadow-[0_24px_50px_-36px_rgba(0,0,0,0.95)] sm:p-6">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Cash Flow Signal
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Balance Trend</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Cumulative month-end balance based on recorded transactions.
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 14, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.42} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 5"
              stroke={isDark ? '#334155' : '#dbe3ef'}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#475569' }}
            />
            <YAxis
              tickFormatter={(value: number) =>
                `${Math.round(value / 1000).toFixed(0)}k`
              }
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#475569' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '14px',
                border: isDark ? '1px solid #334155' : '1px solid #bae6fd',
                backgroundColor: isDark ? '#0f172a' : '#f8fcff',
                color: isDark ? '#e2e8f0' : '#0f172a',
                boxShadow: isDark
                  ? '0 18px 40px -30px rgba(0, 0, 0, 0.95)'
                  : '0 16px 35px -28px rgba(15, 23, 42, 0.9)',
              }}
              formatter={(value) =>
                formatCurrency(typeof value === 'number' ? value : Number(value) || 0)
              }
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#0284c7"
              fillOpacity={1}
              fill="url(#balanceFill)"
              strokeWidth={2.8}
              dot={{ r: 4, fill: '#0284c7', stroke: '#e0f2fe', strokeWidth: 1.5 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BalanceTrendChart
