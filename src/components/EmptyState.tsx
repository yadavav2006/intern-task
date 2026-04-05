interface EmptyStateProps {
  title: string
  description: string
}

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-6 text-center shadow-[0_18px_35px_-34px_rgba(15,23,42,0.9)] dark:border-slate-600/50 dark:bg-slate-900/70 dark:shadow-[0_20px_40px_-32px_rgba(0,0,0,0.95)]">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  )
}

export default EmptyState
