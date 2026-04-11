import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Kenai Borough UI error', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="rounded-full bg-red-500/10 px-4 py-1 text-sm font-semibold text-red-500">Unexpected error</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">The community hub hit rough weather.</h1>
          <p className="text-slate-600 dark:text-slate-300">Refresh the page to continue exploring the Kenai Peninsula.</p>
        </div>
      )
    }

    return this.props.children
  }
}
