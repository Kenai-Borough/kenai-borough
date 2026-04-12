import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import type { ReactNode } from 'react'

const statusStyles = {
  active: 'bg-emerald-400',
  warning: 'bg-amber-400',
  down: 'bg-rose-400',
}

export function AdminShellCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur ${className}`}>{children}</div>
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300/80">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">{description}</p>
      </div>
      {action}
    </div>
  )
}

export function MetricCard({ label, value, helper, accent, children }: { label: string; value: string; helper: string; accent?: string; children?: ReactNode }) {
  return (
    <AdminShellCard className="overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{helper}</p>
        </div>
        <div className="h-14 w-14 rounded-2xl" style={{ background: accent ?? 'linear-gradient(135deg, rgba(56,189,248,0.24), rgba(99,102,241,0.28))' }} />
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </AdminShellCard>
  )
}

export function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  const tones = {
    default: 'border-white/10 bg-white/5 text-slate-200',
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    danger: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
    info: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-200',
  }
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>
}

export function StatusDot({ status }: { status: keyof typeof statusStyles }) {
  return <span className={`inline-flex h-2.5 w-2.5 rounded-full ${statusStyles[status]}`} />
}

export function SearchField({ value, onChange, placeholder = 'Search' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="flex min-w-[220px] items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
      <Search className="h-4 w-4 text-slate-500" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full bg-transparent outline-none placeholder:text-slate-500" />
    </label>
  )
}

export function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={active ? 'rounded-full border border-cyan-400/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100' : 'rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10'}
      type="button"
    >
      {children}
    </button>
  )
}

export function TableFrame({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/75">{children}</div>
}

export function PaginationControls({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm text-slate-400">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPageChange(Math.max(1, page - 1))} className="rounded-full border border-white/10 px-3 py-1.5 hover:bg-white/10" disabled={page === 1}>
          Previous
        </button>
        <button type="button" onClick={() => onPageChange(Math.min(totalPages, page + 1))} className="rounded-full border border-white/10 px-3 py-1.5 hover:bg-white/10" disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  )
}

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300 hover:bg-white/10">
                Close
              </button>
            </div>
            <div className="mt-6">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
