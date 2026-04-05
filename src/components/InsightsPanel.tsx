import type { DashboardInsights, SummaryValues } from '../types/finance'
import { formatCurrency } from '../utils/finance'

interface InsightsPanelProps {
  insights: DashboardInsights
  summary: SummaryValues
}

function InsightsPanel({ insights, summary }: InsightsPanelProps) {
  const savingsRate =
    summary.income === 0 ? 0 : ((summary.income - summary.expenses) / summary.income) * 100

  return (
    <section className="rounded-3xl border border-slate-900/10 bg-white/90 p-5 shadow-[0_20px_45px_-36px_rgba(15,23,42,0.95)] backdrop-blur dark:border-slate-600/35 dark:bg-slate-900/75 dark:shadow-[0_24px_50px_-36px_rgba(0,0,0,0.95)] sm:p-6">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Snapshot Notes
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Insights</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Quick observations based on current transactions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200/85 bg-gradient-to-b from-white to-slate-50 p-4 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.95)] dark:border-slate-600/35 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800/80 dark:shadow-none">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Highest Spend
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
            {insights.highestSpendingCategory
              ? insights.highestSpendingCategory.category
              : 'Not enough data'}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {insights.highestSpendingCategory
              ? formatCurrency(insights.highestSpendingCategory.value)
              : 'Add expense transactions to see this insight.'}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200/85 bg-gradient-to-b from-white to-slate-50 p-4 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.95)] dark:border-slate-600/35 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800/80 dark:shadow-none">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Monthly Comparison
          </p>
          {insights.monthlyComparison ? (
            <>
              <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                {insights.monthlyComparison.currentMonth} vs {insights.monthlyComparison.previousMonth}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Expense change:{' '}
                <span
                  className={
                    insights.monthlyComparison.deltaPercent > 0
                      ? 'font-semibold text-rose-600'
                      : 'font-semibold text-emerald-600'
                  }
                >
                  {insights.monthlyComparison.deltaPercent > 0 ? '+' : ''}
                  {insights.monthlyComparison.deltaPercent.toFixed(1)}%
                </span>
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Need at least two months of expenses for comparison.
            </p>
          )}
        </article>

        <article className="rounded-2xl border border-slate-200/85 bg-gradient-to-b from-white to-slate-50 p-4 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.95)] dark:border-slate-600/35 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800/80 dark:shadow-none">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Savings Health
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
            {summary.income === 0 ? 'No income data' : `${savingsRate.toFixed(1)}%`}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{insights.observation}</p>
        </article>
      </div>
    </section>
  )
}

export default InsightsPanel
