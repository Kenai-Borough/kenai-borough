import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Megaphone } from 'lucide-react'
import { useMemo } from 'react'
import { AdminShellCard, Badge, PageHeader, TableFrame } from '../../components/network-admin/NetworkAdminUI'
import { formatMoney, getSiteName, networkAdvertisers, networkUpgradeRequests, revenueByTier } from '../../data/networkAdmin'

const tierDescriptions = {
  Free: 'Basic placement with organic discovery only',
  Featured: 'Boosted search placement and sitewide highlights',
  Premium: 'Homepage takeovers, spotlight modules, and retargeting slots',
  Enterprise: 'Bundle-wide presence with concierge support and sponsored content',
}

export function NetworkAdvertising() {
  const totalRevenue = useMemo(() => networkAdvertisers.reduce((sum, advertiser) => sum + advertiser.revenue, 0), [])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Revenue operations"
        title="Manage advertising across the Kenai bundle"
        description="Track active advertisers, compare tiers, review upgrade demand, and preview bundle placements that monetize the network."
        action={<button className="rounded-full border border-cyan-400/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100">Create placement package</button>}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <AdminShellCard><p className="text-sm text-slate-400">Active advertisers</p><p className="mt-3 text-3xl font-semibold text-white">{networkAdvertisers.length}</p></AdminShellCard>
        <AdminShellCard><p className="text-sm text-slate-400">Monthly recurring</p><p className="mt-3 text-3xl font-semibold text-white">{formatMoney(totalRevenue)}</p></AdminShellCard>
        <AdminShellCard><p className="text-sm text-slate-400">Upgrade requests</p><p className="mt-3 text-3xl font-semibold text-white">{networkUpgradeRequests.length}</p></AdminShellCard>
        <AdminShellCard><p className="text-sm text-slate-400">Expiring soon</p><p className="mt-3 text-3xl font-semibold text-white">{networkAdvertisers.filter((advertiser) => advertiser.status === 'expiring soon').length}</p></AdminShellCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {revenueByTier.map((tier) => (
          <AdminShellCard key={tier.tier}>
            <p className="text-sm text-slate-400">{tier.tier}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{formatMoney(tier.revenue)}</p>
            <p className="mt-3 text-sm text-slate-400">{tierDescriptions[tier.tier]}</p>
          </AdminShellCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <TableFrame>
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2 text-white">
              <Megaphone className="h-5 w-5 text-cyan-300" />
              <h2 className="text-lg font-semibold">Active advertisers</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-slate-400">
                <tr>
                  {['Business', 'Tier', 'Site', 'Revenue', 'Expiry', 'Status'].map((heading) => (
                    <th key={heading} className="px-5 py-4 font-medium">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {networkAdvertisers.map((advertiser) => (
                  <tr key={advertiser.id} className="hover:bg-white/5">
                    <td className="px-5 py-4 align-top">
                      <p className="font-medium text-white">{advertiser.businessName}</p>
                      <p className="mt-1 text-slate-400">{advertiser.contact}</p>
                    </td>
                    <td className="px-5 py-4 align-top"><Badge tone={advertiser.tier === 'Enterprise' ? 'info' : advertiser.tier === 'Premium' ? 'success' : advertiser.tier === 'Featured' ? 'warning' : 'default'}>{advertiser.tier}</Badge></td>
                    <td className="px-5 py-4 align-top text-slate-300">{getSiteName(advertiser.site)}</td>
                    <td className="px-5 py-4 align-top text-slate-300">{formatMoney(advertiser.revenue)}</td>
                    <td className="px-5 py-4 align-top text-slate-300">{advertiser.expiry}</td>
                    <td className="px-5 py-4 align-top"><Badge tone={advertiser.status === 'active' ? 'success' : advertiser.status === 'expiring soon' ? 'warning' : 'default'}>{advertiser.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableFrame>

        <div className="space-y-6">
          <AdminShellCard>
            <p className="text-sm text-slate-400">Revenue by tier</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Bundle monetization mix</h2>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByTier}>
                  <XAxis dataKey="tier" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip formatter={(value: number) => formatMoney(value)} contentStyle={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: '#020617' }} />
                  <Bar dataKey="revenue" fill="#38bdf8" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AdminShellCard>

          <AdminShellCard>
            <p className="text-sm text-slate-400">Pending upgrade requests</p>
            <div className="mt-4 space-y-3">
              {networkUpgradeRequests.map((request) => (
                <div key={request.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{request.businessName}</p>
                      <p className="mt-1 text-sm text-slate-400">{getSiteName(request.site)}</p>
                    </div>
                    <Badge tone="info">{request.currentTier} → {request.requestedTier}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{request.notes}</p>
                </div>
              ))}
            </div>
          </AdminShellCard>

          <AdminShellCard>
            <p className="text-sm text-slate-400">Ad placement preview</p>
            <div className="mt-4 space-y-3">
              {['Homepage hero spotlight', 'Search result sponsored row', 'Newsletter sponsor tile'].map((placement) => (
                <div key={placement} className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-400/10 via-indigo-500/10 to-emerald-400/10 p-4">
                  <p className="text-sm font-medium text-white">{placement}</p>
                  <p className="mt-2 text-sm text-slate-300">Premium and Enterprise advertisers can reserve this network-wide slot for seasonal Kenai campaigns.</p>
                </div>
              ))}
            </div>
          </AdminShellCard>
        </div>
      </div>
    </div>
  )
}
