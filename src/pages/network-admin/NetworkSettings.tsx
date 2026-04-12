import { useState } from 'react'
import { DatabaseBackup, Globe2, KeyRound, Mail, Save } from 'lucide-react'
import { AdminShellCard, Badge, PageHeader } from '../../components/network-admin/NetworkAdminUI'
import { networkAnnouncements, networkSiteConfig } from '../../data/networkAdmin'

export function NetworkSettings() {
  const [sites, setSites] = useState(networkSiteConfig)
  const [announcements, setAnnouncements] = useState(networkAnnouncements)
  const [bannerText, setBannerText] = useState('Bundle-wide spring launch is live across all Kenai properties.')

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Global controls"
        title="Configure network-wide operations"
        description="Adjust site health toggles, publish announcements, review integrations, and stage export or backup workflows from the Kenai master panel."
        action={<button className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100"><Save className="h-4 w-4" /> Save network settings</button>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <AdminShellCard>
          <div className="flex items-center gap-2 text-white">
            <Globe2 className="h-5 w-5 text-cyan-300" />
            <h2 className="text-lg font-semibold">Site list</h2>
          </div>
          <div className="mt-5 space-y-4">
            {sites.map((site, index) => (
              <div key={site.site} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="font-medium text-white">{site.displayName}</p>
                    <p className="mt-1 text-sm text-slate-400">{site.domain}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <select value={site.status} onChange={(event) => setSites((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, status: event.target.value as typeof item.status } : item)))} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none">
                      <option value="active">active</option>
                      <option value="maintenance">maintenance</option>
                      <option value="disabled">disabled</option>
                    </select>
                    <label className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
                      <input type="checkbox" checked={site.maintenanceMode} onChange={() => setSites((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, maintenanceMode: !item.maintenanceMode } : item)))} />
                      Maintenance mode
                    </label>
                    <Badge tone={site.status === 'active' ? 'success' : site.status === 'maintenance' ? 'warning' : 'danger'}>{site.status}</Badge>
                  </div>
                </div>
                <textarea value={site.maintenanceMessage ?? ''} onChange={(event) => setSites((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, maintenanceMessage: event.target.value } : item)))} className="mt-4 min-h-[90px] w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none" placeholder="Maintenance message" />
              </div>
            ))}
          </div>
        </AdminShellCard>

        <div className="space-y-6">
          <AdminShellCard>
            <p className="text-sm text-slate-400">Global announcements</p>
            <input value={bannerText} onChange={(event) => setBannerText(event.target.value)} className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none" />
            <div className="mt-4 space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{announcement.title}</p>
                    <button type="button" onClick={() => setAnnouncements((current) => current.map((item) => (item.id === announcement.id ? { ...item, active: !item.active } : item)))} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200 hover:bg-white/10">{announcement.active ? 'Pause' : 'Resume'}</button>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{announcement.message}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge tone={announcement.active ? 'success' : 'default'}>{announcement.active ? 'active' : 'paused'}</Badge>
                    <Badge tone="info">{announcement.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </AdminShellCard>

          <AdminShellCard>
            <div className="flex items-center gap-2 text-white"><Mail className="h-5 w-5 text-cyan-300" /><h2 className="text-lg font-semibold">Email templates</h2></div>
            <p className="mt-4 text-sm text-slate-300">Placeholder for broadcast, verification, suspension, and advertiser upsell templates with site-specific merge fields.</p>
          </AdminShellCard>

          <AdminShellCard>
            <div className="flex items-center gap-2 text-white"><KeyRound className="h-5 w-5 text-cyan-300" /><h2 className="text-lg font-semibold">API keys & integrations</h2></div>
            <div className="mt-4 grid gap-3">
              {['Supabase project', 'Stripe billing', 'Transactional email provider'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">{item} · placeholder secret reference</div>
              ))}
            </div>
          </AdminShellCard>

          <AdminShellCard>
            <div className="flex items-center gap-2 text-white"><DatabaseBackup className="h-5 w-5 text-cyan-300" /><h2 className="text-lg font-semibold">Backups & export</h2></div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" className="rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10">Create CSV export</button>
              <button type="button" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">Queue Supabase backup</button>
            </div>
          </AdminShellCard>
        </div>
      </div>
    </div>
  )
}
