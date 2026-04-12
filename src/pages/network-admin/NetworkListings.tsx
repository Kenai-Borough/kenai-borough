import { format } from 'date-fns'
import { CheckCheck, Flag, Sparkles, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AdminShellCard, Badge, FilterButton, PageHeader, SearchField, TableFrame } from '../../components/network-admin/NetworkAdminUI'
import { getSiteName, networkListings } from '../../data/networkAdmin'
import type { NetworkListing, NetworkListingCategory, NetworkListingStatus } from '../../types/networkAdmin'

const tabs: Array<{ label: string; value: 'all' | NetworkListingCategory }> = [
  { label: 'All', value: 'all' },
  { label: 'Properties', value: 'properties' },
  { label: 'Land', value: 'land' },
  { label: 'Rentals', value: 'rentals' },
  { label: 'Homes', value: 'homes' },
  { label: 'Vehicles', value: 'vehicles' },
  { label: 'Classifieds', value: 'classifieds' },
  { label: 'Businesses', value: 'businesses' },
]
const statuses: Array<'all' | NetworkListingStatus> = ['all', 'active', 'pending review', 'flagged', 'expired', 'sold']

export function NetworkListings() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['value']>('all')
  const [statusFilter, setStatusFilter] = useState<(typeof statuses)[number]>('all')
  const [search, setSearch] = useState('')
  const [listings, setListings] = useState(networkListings)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filteredListings = useMemo(
    () =>
      listings.filter((listing) => {
        const matchesTab = activeTab === 'all' || listing.category === activeTab
        const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
        const matchesSearch = [listing.title, listing.location, listing.priceLabel].some((value) => value.toLowerCase().includes(search.toLowerCase()))
        return matchesTab && matchesStatus && matchesSearch
      }),
    [activeTab, listings, search, statusFilter],
  )

  function updateListing(ids: string[], updater: (listing: NetworkListing) => NetworkListing) {
    setListings((current) => current.map((listing) => (ids.includes(listing.id) ? updater(listing) : listing)))
    setSelectedIds([])
  }

  function toggleSelection(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cross-site moderation"
        title="Review every listing type in one queue"
        description="Switch between properties, land, rentals, homes, vehicles, classifieds, and business placements to approve, flag, remove, or feature inventory across the Kenai network."
        action={<button className="rounded-full border border-cyan-400/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100">Launch review sweep</button>}
      />

      <AdminShellCard>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <FilterButton key={tab.value} active={activeTab === tab.value} onClick={() => setActiveTab(tab.value)}>
              {tab.label}
            </FilterButton>
          ))}
        </div>
      </AdminShellCard>

      <AdminShellCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 lg:flex-row">
            <SearchField value={search} onChange={setSearch} placeholder="Search title, location, or price" />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none">
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All statuses' : status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => updateListing(selectedIds, (listing) => ({ ...listing, status: 'active' }))} disabled={selectedIds.length === 0} className="rounded-full border border-emerald-500/20 px-4 py-2 text-sm text-emerald-100 transition hover:bg-emerald-500/10 disabled:opacity-40">
              Approve selected
            </button>
            <button type="button" onClick={() => updateListing(selectedIds, (listing) => ({ ...listing, status: 'expired', featured: false }))} disabled={selectedIds.length === 0} className="rounded-full border border-rose-500/20 px-4 py-2 text-sm text-rose-100 transition hover:bg-rose-500/10 disabled:opacity-40">
              Remove selected
            </button>
          </div>
        </div>
      </AdminShellCard>

      <div className="grid gap-4 md:grid-cols-4">
        <AdminShellCard><p className="text-sm text-slate-400">Visible listings</p><p className="mt-3 text-3xl font-semibold text-white">{filteredListings.length}</p></AdminShellCard>
        <AdminShellCard><p className="text-sm text-slate-400">Flagged</p><p className="mt-3 text-3xl font-semibold text-white">{listings.filter((item) => item.status === 'flagged').length}</p></AdminShellCard>
        <AdminShellCard><p className="text-sm text-slate-400">Pending review</p><p className="mt-3 text-3xl font-semibold text-white">{listings.filter((item) => item.status === 'pending review').length}</p></AdminShellCard>
        <AdminShellCard><p className="text-sm text-slate-400">Featured placements</p><p className="mt-3 text-3xl font-semibold text-white">{listings.filter((item) => item.featured).length}</p></AdminShellCard>
      </div>

      <TableFrame>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="px-5 py-4 font-medium"><input type="checkbox" checked={selectedIds.length > 0 && selectedIds.length === filteredListings.length} onChange={() => setSelectedIds(selectedIds.length === filteredListings.length ? [] : filteredListings.map((listing) => listing.id))} /></th>
                {['Listing', 'Site', 'Status', 'Performance', 'Created', 'Actions'].map((heading) => (
                  <th key={heading} className="px-5 py-4 font-medium">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredListings.slice(0, 36).map((listing) => (
                <tr key={listing.id} className="hover:bg-white/5">
                  <td className="px-5 py-4 align-top"><input type="checkbox" checked={selectedIds.includes(listing.id)} onChange={() => toggleSelection(listing.id)} /></td>
                  <td className="px-5 py-4 align-top">
                    <div>
                      <p className="font-medium text-white">{listing.title}</p>
                      <p className="mt-1 text-slate-400">{listing.location} · {listing.priceLabel}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge tone="default">{listing.category}</Badge>
                        {listing.featured ? <Badge tone="info">featured</Badge> : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top text-slate-300">{getSiteName(listing.site)}</td>
                  <td className="px-5 py-4 align-top"><Badge tone={listing.status === 'active' ? 'success' : listing.status === 'flagged' ? 'danger' : listing.status === 'pending review' ? 'warning' : 'default'}>{listing.status}</Badge></td>
                  <td className="px-5 py-4 align-top text-slate-300">{listing.views} views · {listing.inquiries} inquiries</td>
                  <td className="px-5 py-4 align-top text-slate-300">{format(new Date(listing.createdAt), 'MMM d, yyyy')}</td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => updateListing([listing.id], (item) => ({ ...item, status: 'active' }))} className="rounded-full border border-emerald-500/20 p-2 text-emerald-200 hover:bg-emerald-500/10"><CheckCheck className="h-4 w-4" /></button>
                      <button type="button" onClick={() => updateListing([listing.id], (item) => ({ ...item, status: 'flagged' }))} className="rounded-full border border-amber-500/20 p-2 text-amber-200 hover:bg-amber-500/10"><Flag className="h-4 w-4" /></button>
                      <button type="button" onClick={() => updateListing([listing.id], (item) => ({ ...item, featured: !item.featured }))} className="rounded-full border border-cyan-500/20 p-2 text-cyan-200 hover:bg-cyan-500/10"><Sparkles className="h-4 w-4" /></button>
                      <button type="button" onClick={() => updateListing([listing.id], (item) => ({ ...item, status: 'expired', featured: false }))} className="rounded-full border border-rose-500/20 p-2 text-rose-200 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableFrame>
    </div>
  )
}
