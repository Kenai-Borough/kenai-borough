import { CheckCircle2, MessageSquareWarning, ShieldCheck, Users2 } from 'lucide-react'
import { StatCard } from '../../components/ui/StatCard'

export function AdminDashboard() {
  return (
    <div className="page-shell py-12">
      <div className="max-w-4xl">
        <p className="section-kicker">Admin dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold">Review platform health, approvals, and moderation across the community hub.</h1>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Pending approvals" value="6" helper="New business listings awaiting review." icon={<CheckCircle2 className="h-5 w-5 text-alaska-ocean" />} />
        <StatCard title="Platform users" value="1,284" helper="Visitors, owners, and admins across the network." icon={<Users2 className="h-5 w-5 text-alaska-ocean" />} />
        <StatCard title="Flagged content" value="3" helper="Listings or events needing moderator attention." icon={<MessageSquareWarning className="h-5 w-5 text-alaska-ocean" />} />
        <StatCard title="RLS coverage" value="100%" helper="Core tables protected through Supabase policies." icon={<ShieldCheck className="h-5 w-5 text-alaska-ocean" />} />
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <h2 className="text-2xl font-semibold">Business approvals</h2>
          <div className="mt-5 space-y-3">
            {[
              'Soldotna River Lodge — awaiting photo review',
              'Homer Wharf Bikes — category verification pending',
              'Seward Trails Transport — insurance document uploaded',
            ].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[1.5rem] bg-slate-900/5 p-4 text-sm dark:bg-white/5">
                <span>{item}</span>
                <button className="primary-button px-4 py-2 text-xs">Approve</button>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2 className="text-2xl font-semibold">Moderation queue</h2>
          <div className="mt-5 space-y-3">
            {[
              'Event update needs date confirmation before publishing.',
              'One review flagged for potential spam language.',
              'Trip planner inquiry routing rule updated successfully.',
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] bg-slate-900/5 p-4 text-sm dark:bg-white/5">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
