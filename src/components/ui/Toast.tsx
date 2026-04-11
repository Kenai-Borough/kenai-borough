import { useEffect } from 'react'
import { CheckCircle2, Info, OctagonAlert, X } from 'lucide-react'
import type { ToastState } from '../../types'

const styles = {
  success: {
    icon: CheckCircle2,
    tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100',
  },
  info: {
    icon: Info,
    tone: 'border-sky-500/30 bg-sky-500/10 text-sky-900 dark:text-sky-100',
  },
  error: {
    icon: OctagonAlert,
    tone: 'border-red-500/30 bg-red-500/10 text-red-900 dark:text-red-100',
  },
}

export function Toast({ toast, onClose }: { toast: ToastState | null; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(onClose, 3200)
    return () => window.clearTimeout(timer)
  }, [onClose, toast])

  if (!toast) return null

  const variant = styles[toast.variant ?? 'info']
  const Icon = variant.icon

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className={"rounded-2xl border p-4 shadow-glacier backdrop-blur " + variant.tone}>
        <div className="flex items-start gap-3">
          <Icon className="mt-0.5 h-5 w-5 flex-none" />
          <div className="flex-1">
            <p className="font-semibold">{toast.title}</p>
            <p className="mt-1 text-sm opacity-90">{toast.description}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 transition hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close toast">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
