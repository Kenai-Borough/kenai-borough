import { ArrowRight, Eye, Inbox, LineChart, Megaphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatCard } from '../../components/ui/StatCard'
import { analyticsSeries, sampleInquiries } from '../../data/events'

export function BusinessDashboard() {
  const latest = analyticsSeries[analyticsSeries.length - 1]

  return (
    <div className="page-shell py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">Business dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold">Overview of listing health, inquiries, and growth.</h1>
        </div>
        <Link to="/dashboard/manage-business" className="primary-button">Manage business <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Listing status" value="Approved" helper="Visible in the public directory and map." icon={<Megaphone className="h-5 w-5 text-alaska-ocean" />} />
        <StatCard title="Views this month" value={String(latest.views)} helper="Strong seasonal traffic from trip planners." icon={<Eye className="h-5 w-5 text-alaska-ocean" />} />
        <StatCard title="Clicks" value={String(latest.clicks)} helper="Visitors moving into listings and contact actions." icon={<LineChart className="h-5 w-5 text-alaska-ocean" />} />
        <StatCard title="Open inquiries" value={String(sampleInquiries.filter((item) => item.status === 'new').length)} helper="Respond quickly to increase booking confidence." icon={<Inbox className="h-5 w-5 text-alaska-ocean" />} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr,0.9fr]">
        <div className="panel">
          <h2 className="text-2xl font-semibold">Recent activity</h2>
          <div className="mt-6 space-y-4">
            {[
              'New inquiry received for a July family fishing trip.',
              'Your featured photo gallery was viewed 124 times this week.',
              'Upcoming event submission approved and now live on the events page.',
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] bg-slate-900/5 p-4 text-sm dark:bg-white/5">{item}</div>
            ))}
          </div>
        </div>
        <div className="panel bg-alaska-forest text-white dark:bg-alaska-pine">
          <h2 className="text-2xl font-semibold">Recommended next steps</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/80">
            <li>• Add more gallery images for summer and winter appeal.</li>
            <li>• Upgrade to Premium for larger placement on the home page carousel.</li>
            <li>• Reply to open inquiries within 24 hours for better conversion.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
