export function LoadingSpinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-alaska-sky/30 border-t-alaska-forest dark:border-white/20 dark:border-t-alaska-aurora" />
      <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  )
}
