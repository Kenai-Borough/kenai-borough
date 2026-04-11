import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="page-shell py-24">
      <div className="mx-auto max-w-2xl panel text-center">
        <p className="section-kicker">404</p>
        <h1 className="mt-3 text-4xl font-semibold">This trail isn’t on the map yet.</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Return home to keep exploring businesses, events, and itineraries across the Kenai Peninsula.</p>
        <Link to="/" className="primary-button mt-6">Back to home</Link>
      </div>
    </div>
  )
}
