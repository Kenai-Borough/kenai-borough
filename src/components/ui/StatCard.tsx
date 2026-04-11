import type { ReactNode } from 'react'

export function StatCard({ title, value, helper, icon }: { title: string; value: string; helper: string; icon?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-glacier backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        {icon}
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
    </div>
  )
}
