import { format } from 'date-fns'
import { ShieldCheck, UserRoundSearch } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AdminShellCard, Badge, FilterButton, Modal, PageHeader, PaginationControls, SearchField, TableFrame } from '../../components/network-admin/NetworkAdminUI'
import { getSiteName, getUserActivity, getUserListings, networkUsers } from '../../data/networkAdmin'
import type { NetworkUser } from '../../types/networkAdmin'

const verificationFilters = ['all', 'verified', 'unverified'] as const
const pageSize = 12

export function NetworkUsers() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [verificationFilter, setVerificationFilter] = useState<(typeof verificationFilters)[number]>('all')
  const [sortBy, setSortBy] = useState<'created' | 'name' | 'activity'>('created')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<NetworkUser | null>(null)

  const roleOptions = useMemo(() => ['all', ...Array.from(new Set(networkUsers.flatMap((user) => user.siteRoles))).sort()], [])

  const filteredUsers = useMemo(() => {
    return networkUsers
      .filter((user) => {
        const matchesSearch = [user.fullName, user.email].some((value) => value.toLowerCase().includes(search.toLowerCase()))
        const matchesRole = roleFilter === 'all' || user.siteRoles.includes(roleFilter)
        const matchesVerification = verificationFilter === 'all' || (verificationFilter === 'verified' ? user.verified : !user.verified)
        return matchesSearch && matchesRole && matchesVerification
      })
      .sort((left, right) => {
        if (sortBy === 'name') return left.fullName.localeCompare(right.fullName)
        if (sortBy === 'activity') return right.lastActiveAt.localeCompare(left.lastActiveAt)
        return right.createdAt.localeCompare(left.createdAt)
      })
  }, [roleFilter, search, sortBy, verificationFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize)

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Unified SSO users"
          title="Manage every Kenai profile from one roster"
          description="Search unified kenai_profiles data, review role badges per site, and jump into profile-level activity across the full network."
          action={<button className="rounded-full border border-cyan-400/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100">Invite network admin</button>}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <AdminShellCard>
            <p className="text-sm text-slate-400">Total profiles</p>
            <p className="mt-3 text-3xl font-semibold text-white">{networkUsers.length}</p>
          </AdminShellCard>
          <AdminShellCard>
            <p className="text-sm text-slate-400">Verified</p>
            <p className="mt-3 text-3xl font-semibold text-white">{networkUsers.filter((user) => user.verified).length}</p>
          </AdminShellCard>
          <AdminShellCard>
            <p className="text-sm text-slate-400">Suspended</p>
            <p className="mt-3 text-3xl font-semibold text-white">{networkUsers.filter((user) => user.suspended).length}</p>
          </AdminShellCard>
        </div>

        <AdminShellCard>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-3 lg:flex-row">
              <SearchField value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search by name or email" />
              <select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1) }} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none">
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role === 'all' ? 'All site roles' : role}
                  </option>
                ))}
              </select>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'created' | 'name' | 'activity')} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none">
                <option value="created">Newest created</option>
                <option value="name">Alphabetical</option>
                <option value="activity">Most recent activity</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {verificationFilters.map((filter) => (
                <FilterButton key={filter} active={verificationFilter === filter} onClick={() => { setVerificationFilter(filter); setPage(1) }}>
                  {filter}
                </FilterButton>
              ))}
            </div>
          </div>
        </AdminShellCard>

        <TableFrame>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-slate-400">
                <tr>
                  {['Name', 'Site roles', 'Verified', 'Created', 'Last active site', 'Actions'].map((heading) => (
                    <th key={heading} className="px-5 py-4 font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-slate-950" style={{ backgroundColor: `hsl(${user.avatarHue} 80% 75%)` }}>
                          {user.fullName
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.fullName}</p>
                          <p className="text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        {user.siteRoles.map((role) => (
                          <Badge key={role} tone={role.includes('admin') ? 'info' : role === 'moderator' ? 'warning' : 'default'}>
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <Badge tone={user.verified ? 'success' : 'warning'}>{user.verified ? 'Verified' : 'Unverified'}</Badge>
                      {user.suspended ? (
                        <div className="mt-2">
                          <Badge tone="danger">Suspended</Badge>
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 align-top text-slate-300">{format(new Date(user.createdAt), 'MMM d, yyyy')}</td>
                    <td className="px-5 py-4 align-top text-slate-300">{getSiteName(user.lastActiveSite)}</td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => setSelectedUser(user)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10">
                          View profile
                        </button>
                        <button type="button" className="rounded-full border border-cyan-400/30 px-3 py-1.5 text-xs text-cyan-100 hover:bg-cyan-400/10">
                          Edit roles
                        </button>
                        <button type="button" className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10">
                          {user.verified ? 'Unverify' : 'Verify'}
                        </button>
                        <button type="button" className="rounded-full border border-rose-500/20 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/10">
                          {user.suspended ? 'Restore' : 'Suspend'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
        </TableFrame>
      </div>

      <Modal open={Boolean(selectedUser)} title={selectedUser ? `${selectedUser.fullName} · Profile detail` : 'Profile detail'} onClose={() => setSelectedUser(null)}>
        {selectedUser ? (
          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
              <AdminShellCard className="bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold text-slate-950" style={{ backgroundColor: `hsl(${selectedUser.avatarHue} 80% 75%)` }}>
                    {selectedUser.fullName
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">{selectedUser.fullName}</h4>
                    <p className="text-sm text-slate-400">{selectedUser.email}</p>
                    <p className="mt-1 text-sm text-slate-400">{selectedUser.phone}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Home site</p>
                    <p className="mt-2 text-sm font-medium text-white">{getSiteName(selectedUser.homeSite)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Last active</p>
                    <p className="mt-2 text-sm font-medium text-white">{format(new Date(selectedUser.lastActiveAt), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {selectedUser.siteRoles.map((role) => (
                    <Badge key={role} tone={role.includes('admin') ? 'info' : 'default'}>
                      {role}
                    </Badge>
                  ))}
                </div>
              </AdminShellCard>

              <AdminShellCard className="bg-white/5">
                <div className="flex items-center gap-2 text-white">
                  <ShieldCheck className="h-5 w-5 text-cyan-300" />
                  <h4 className="text-lg font-semibold">Cross-site summary</h4>
                </div>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Verification status</p>
                    <div className="mt-2"><Badge tone={selectedUser.verified ? 'success' : 'warning'}>{selectedUser.verified ? 'Verified profile' : 'Needs verification'}</Badge></div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Network inquiries handled</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{selectedUser.inquiryCount}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Listings across sites</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{selectedUser.listingIds.length}</p>
                  </div>
                </div>
              </AdminShellCard>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <AdminShellCard className="bg-white/5">
                <div className="flex items-center gap-2 text-white">
                  <UserRoundSearch className="h-5 w-5 text-cyan-300" />
                  <h4 className="text-lg font-semibold">Activity history</h4>
                </div>
                <div className="mt-5 space-y-3">
                  {getUserActivity(selectedUser.id).map((activity) => (
                    <div key={activity.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-sm text-white">{activity.summary}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">{format(new Date(activity.createdAt), 'MMM d · h:mm a')}</p>
                    </div>
                  ))}
                </div>
              </AdminShellCard>

              <AdminShellCard className="bg-white/5">
                <h4 className="text-lg font-semibold text-white">Listings across sites</h4>
                <div className="mt-5 space-y-3">
                  {getUserListings(selectedUser.id).map((listing) => (
                    <div key={listing.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-white">{listing.title}</p>
                          <p className="mt-1 text-xs text-slate-400">{getSiteName(listing.site)} · {listing.location}</p>
                        </div>
                        <Badge tone={listing.featured ? 'info' : 'default'}>{listing.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </AdminShellCard>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
