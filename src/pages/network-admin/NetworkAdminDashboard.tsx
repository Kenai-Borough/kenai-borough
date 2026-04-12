import { formatDistanceToNow } from 'date-fns'
import { Activity, BarChart3, CircleDollarSign, MessageSquareText, UsersRound } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AdminShellCard, Badge, MetricCard, PageHeader, StatusDot } from '../../components/network-admin/NetworkAdminUI'
import { formatMoney, getSiteName, inquiriesTrend, listingsBySite, overviewStats, recentActivity, siteHealthCards, userGrowth } from '../../data/networkAdmin'

const activityTone = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
} as const

export function NetworkAdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Centralized operations"
        title="Single-pane control for the full Kenai network"
        description="Monitor unified SSO adoption, listing health, inquiries, and revenue signals across all six Kenai bundle sites from one master console."
        action={<button className="rounded-full border border-cyan-400/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100">Export executive snapshot</button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Network users" value={overviewStats.totalUsers.toString()} helper={`${overviewStats.verifiedUsers} verified profiles across unified SSO`} accent="linear-gradient(135deg, rgba(34,211,238,0.18), rgba(99,102,241,0.28))">
          <div className="flex flex-wrap gap-2">
            {overviewStats.roleBreakdown.map((item) => (
              <Badge key={item.role} tone="info">
                {item.role}: {item.count}
              </Badge>
            ))}
          </div>
        </MetricCard>
        <MetricCard label="Active listings" value={overviewStats.totalListings.toString()} helper="Properties, parcels, rentals, homes, vehicles, classifieds, and business placements" accent="linear-gradient(135deg, rgba(52,211,153,0.18), rgba(16,185,129,0.28))" />
        <MetricCard label="Inquiries this week" value={overviewStats.weeklyInquiries.toString()} helper="Cross-network form responses, DMs, and lead submissions" accent="linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.3))" />
        <MetricCard label="Revenue overview" value={formatMoney(overviewStats.monthlyRevenue)} helper="Advertising tiers and platform fees placeholder forecast" accent="linear-gradient(135deg, rgba(244,114,182,0.18), rgba(99,102,241,0.28))" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr,0.9fr]">
        <AdminShellCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">User growth over time</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Unified account adoption</h2>
            </div>
            <UsersRound className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: '#020617' }} />
                <Line type="monotone" dataKey="users" stroke="#38bdf8" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="verified" stroke="#818cf8" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AdminShellCard>

        <AdminShellCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Listings by site</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Current live inventory</h2>
            </div>
            <BarChart3 className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={listingsBySite}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: '#020617' }} />
                <Bar dataKey="active" fill="#22d3ee" radius={[10, 10, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <AdminShellCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Inquiries trend</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Weekly lead velocity</h2>
            </div>
            <MessageSquareText className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inquiriesTrend}>
                <defs>
                  <linearGradient id="inquiries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="messages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: '#020617' }} />
                <Area type="monotone" dataKey="inquiries" stroke="#38bdf8" fill="url(#inquiries)" strokeWidth={3} />
                <Area type="monotone" dataKey="messages" stroke="#818cf8" fill="url(#messages)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminShellCard>

        <AdminShellCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Recent activity feed</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Latest operator signals</h2>
            </div>
            <Activity className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="mt-6 space-y-3">
            {recentActivity.slice(0, 8).map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge tone={activityTone[item.tone]}>{getSiteName(item.site)}</Badge>
                    <p className="text-sm font-medium text-white">{item.summary}</p>
                  </div>
                  <span className="text-xs text-slate-500">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{item.action.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        </AdminShellCard>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">Site health</p>
            <h2 className="text-2xl font-semibold text-white">All six bundle sites at a glance</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <CircleDollarSign className="h-4 w-4 text-cyan-300" />
            Revenue placeholders ready for Stripe integration
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {siteHealthCards.map((site) => (
            <AdminShellCard key={site.site} className="relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: site.accent }} />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusDot status={site.status} />
                    <p className="text-lg font-semibold text-white">{site.displayName}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{site.domain}</p>
                </div>
                <Badge tone={site.status === 'active' ? 'success' : 'warning'}>{site.status}</Badge>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-slate-500">Listings</p>
                  <p className="mt-2 text-lg font-semibold text-white">{site.listingCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-slate-500">Users</p>
                  <p className="mt-2 text-lg font-semibold text-white">{site.userCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-slate-500">Last deploy</p>
                  <p className="mt-2 text-sm font-semibold text-white">{site.lastDeploy}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-slate-500">Uptime</p>
                  <p className="mt-2 text-sm font-semibold text-white">{site.uptime}</p>
                </div>
              </div>
              <a href={`https://${site.domain}`} className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
                Open site
              </a>
            </AdminShellCard>
          ))}
        </div>
      </div>
    </div>
  )
}
