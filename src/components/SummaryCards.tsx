import type { SummaryValues } from '../types/finance'
import { formatCurrency } from '../utils/finance'

interface SummaryCardsProps {
  summary: SummaryValues
}

function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Balance',
      value: summary.balance,
      textColor: 'text-slate-900',
      bgClass: 'bg-gradient-to-br from-white via-sky-50 to-cyan-100 border-sky-100',
      accentClass: 'bg-sky-500',
      note: summary.balance >= 0 ? 'Runway looks stable' : 'Spending is above income',
    },
    {
      title: 'Income',
      value: summary.income,
      textColor: 'text-emerald-900',
      bgClass:
        'bg-gradient-to-br from-white via-emerald-50 to-lime-100 border-emerald-100',
      accentClass: 'bg-emerald-500',
      note: 'Total inflow captured in current view',
    },
    {
      title: 'Expenses',
      value: summary.expenses,
      textColor: 'text-rose-900',
      bgClass:
        'bg-gradient-to-br from-white via-rose-50 to-orange-100 border-rose-100',
      accentClass: 'bg-rose-500',
      note: 'Total outflow captured in current view',
    },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <article
          key={card.title}
          className={`animate-[fadeInUp_500ms_ease-out] rounded-3xl border p-5 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.85)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-34px_rgba(15,23,42,0.55)] ${card.bgClass}`}
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <span className={`mb-4 inline-flex h-1.5 w-12 rounded-full ${card.accentClass}`} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {card.title}
          </p>
          <p className={`mt-3 text-3xl font-bold leading-none ${card.textColor}`}>
            {formatCurrency(card.value)}
          </p>
          <p className="mt-3 text-sm text-slate-600">{card.note}</p>
        </article>
      ))}
    </section>
  )
}

export default SummaryCards
