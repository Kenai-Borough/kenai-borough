import { useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, Cell, Funnel, FunnelChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Download, TrendingUp } from 'lucide-react'
import { AdminShellCard, Badge, FilterButton, PageHeader } from '../../components/network-admin/NetworkAdminUI'
import { analyticsByRange, conversionFunnel, formatMoney, geoDistribution, listingsByCategory, networkSites, revenueBySite, usersBySite } from '../../data/networkAdmin'

const ranges = ['7d', '30d', '90d', '1y'] as const

export function NetworkAnalytics() {
  const [range, setRange] = useState<(typeof ranges)[number]>('30d')
  const metrics = analyticsByRange[range]

  const totals = useMemo(
    () =>
      metrics.reduce(
        (accumulator, point) => ({
          pageviews: accumulator.pageviews + point.pageviews,
          signups: accumulator.signups + point.signups,
          listings: accumulator.listings + point.listings,
          transactions: accumulator.transactions + point.transactions,
        }),
        { pageviews: 0, signups: 0, listings: 0, transactions: 0 },
      ),
    [metrics],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Network intelligence"
        title="See the health of the full Kenai growth engine"
        description="Explore traffic, conversion, geographic density, and monetization trends across the bundle with one date-range switcher."
        action={<button className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100"><Download className="h-4 w-4" /> Export CSV</button>}
      />

      <div className="flex flex-wrap gap-2">
        {ranges.map((item) => (
          <FilterButton key={item} active={range === item} onClick={() => setRange(item)}>
            {item}
          </FilterButton>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <AdminShellCard><p className="text-sm text-slate-400">Pageviews</p><p className="mt-3 text-3xl font-semibold text-white">{totals.pageviews.toLocaleString()}</p></AdminShellCard>
        <AdminShellCard><p className="text-sm text-slate-400">Signups</p><p className="mt-3 text-3xl font-semibold text-white">{totals.signups.toLocaleString()}</p></AdminShellCard>
        <AdminShellCard><p className="text-sm text-slate-400">Listings created</p><p className="mt-3 text-3xl font-semibold text-white">{totals.listings.toLocaleString()}</p></AdminShellCard>
        <AdminShellCard><p className="text-sm text-slate-400">Revenue run rate</p><p className="mt-3 text-3xl font-semibold text-white">{formatMoney(revenueBySite.reduce((sum, site) => sum + site.revenue, 0))}</p></AdminShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr,0.75fr]">
        <AdminShellCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Total pageviews</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Network traffic trend</h2>
            </div>
            <TrendingUp className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="traffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: '#020617' }} />
                <Area type="monotone" dataKey="pageviews" stroke="#38bdf8" fill="url(#traffic)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminShellCard>

        <AdminShellCard>
          <p className="text-sm text-slate-400">Users by site</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Network audience mix</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={usersBySite} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {usersBySite.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: '#020617' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {usersBySite.map((entry) => (
              <Badge key={entry.name} tone="info">{entry.name}: {entry.value}</Badge>
            ))}
          </div>
        </AdminShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <AdminShellCard>
          <p className="text-sm text-slate-400">Listings by category</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Cross-site inventory composition</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={listingsByCategory}>
                <XAxis dataKey="category" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: '#020617' }} />
                {networkSites.map((site) => (
                  <Bar key={site.site} dataKey={site.site} stackId="inventory" fill={site.accent} radius={[8, 8, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminShellCard>

        <AdminShellCard>
          <p className="text-sm text-slate-400">Conversion funnel</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Visits → signups → listings → transactions</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: '#020617' }} />
                <Funnel dataKey="value" data={conversionFunnel} isAnimationActive>
                  {conversionFunnel.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </AdminShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <AdminShellCard>
          <p className="text-sm text-slate-400">Geographic distribution</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Kenai Peninsula operator map</h2>
          <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
            <div className="relative h-80 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_50%),linear-gradient(180deg,_rgba(15,23,42,0.95),_rgba(2,6,23,1))]">
              <div className="absolute inset-8 rounded-[40%_60%_58%_42%/34%_30%_70%_66%] border border-cyan-400/20 bg-cyan-400/5" />
              {geoDistribution.map((point) => (
                <div key={point.town} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-300 shadow-[0_0_0_8px_rgba(34,211,238,0.15)]" />
                  <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/90 px-3 py-2 text-xs text-slate-200 shadow-xl shadow-black/30">
                    <p className="font-medium text-white">{point.town}</p>
                    <p>{point.users} users · {point.listings} listings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminShellCard>

        <AdminShellCard>
          <p className="text-sm text-slate-400">Revenue breakdown</p>
          <h2 className="mt-1 text-xl font-semibold text-white">By site and premium tier</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueBySite}>
                <XAxis dataKey="site" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip formatter={(value: number) => formatMoney(value)} contentStyle={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: '#020617' }} />
                <Bar dataKey="featured" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                <Bar dataKey="premium" fill="#818cf8" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="#34d399" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminShellCard>
      </div>
    </div>
  )
}
