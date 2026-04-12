import { formatDistanceToNow } from 'date-fns'
import { Ban, Shield, ShieldAlert, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AdminShellCard, Badge, PageHeader, TableFrame } from '../../components/network-admin/NetworkAdminUI'
import { getSiteName, networkReports, networkUsers } from '../../data/networkAdmin'
import type { NetworkReport } from '../../types/networkAdmin'

export function NetworkModeration() {
  const [reports, setReports] = useState(networkReports)

  const pendingReports = useMemo(() => reports.filter((report) => report.status === 'pending'), [reports])
  const avgResponseHours = 3.7

  function updateReport(id: string, status: NetworkReport['status']) {
    setReports((current) => current.map((report) => (report.id === id ? { ...report, status } : report)))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Moderation command"
        title="Resolve flagged content across all six sites"
        description="Review reported listings, messages, users, and reviews in a single queue so moderators can respond consistently across the network."
        action={<button className="rounded-full border border-cyan-400/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100">Escalation policy</button>}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <AdminShellCard><p className="text-sm text-slate-400">Resolved today</p><p className="mt-3 text-3xl font-semibold text-white">6</p></AdminShellCard>
        <AdminShellCard><p className="text-sm text-slate-400">Pending queue</p><p className="mt-3 text-3xl font-semibold text-white">{pendingReports.length}</p></AdminShellCard>
        <AdminShellCard><p className="text-sm text-slate-400">Avg response time</p><p className="mt-3 text-3xl font-semibold text-white">{avgResponseHours}h</p></AdminShellCard>
        <AdminShellCard><p className="text-sm text-slate-400">Warned users</p><p className="mt-3 text-3xl font-semibold text-white">{reports.filter((report) => report.targetType === 'user').length}</p></AdminShellCard>
      </div>

      <TableFrame>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                {['Report details', 'Reporter', 'Site', 'Status', 'Date', 'Actions'].map((heading) => (
                  <th key={heading} className="px-5 py-4 font-medium">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.map((report) => {
                const reporter = networkUsers.find((user) => user.id === report.reporterId)
                return (
                  <tr key={report.id} className="hover:bg-white/5">
                    <td className="px-5 py-4 align-top">
                      <p className="font-medium text-white">{report.reason}</p>
                      <p className="mt-1 max-w-lg text-slate-400">{report.details}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge tone="default">{report.targetType}</Badge>
                        <Badge tone="warning">{report.targetId}</Badge>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-slate-300">{reporter?.fullName ?? 'Unknown reporter'}</td>
                    <td className="px-5 py-4 align-top text-slate-300">{getSiteName(report.site)}</td>
                    <td className="px-5 py-4 align-top"><Badge tone={report.status === 'pending' ? 'warning' : report.status === 'resolved' ? 'success' : report.status === 'dismissed' ? 'default' : 'info'}>{report.status}</Badge></td>
                    <td className="px-5 py-4 align-top text-slate-300">{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => updateReport(report.id, 'dismissed')} className="rounded-full border border-white/10 p-2 text-slate-200 hover:bg-white/10"><Shield className="h-4 w-4" /></button>
                        <button type="button" onClick={() => updateReport(report.id, 'reviewed')} className="rounded-full border border-amber-500/20 p-2 text-amber-200 hover:bg-amber-500/10"><ShieldAlert className="h-4 w-4" /></button>
                        <button type="button" onClick={() => updateReport(report.id, 'resolved')} className="rounded-full border border-rose-500/20 p-2 text-rose-200 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button>
                        <button type="button" onClick={() => updateReport(report.id, 'resolved')} className="rounded-full border border-cyan-500/20 p-2 text-cyan-200 hover:bg-cyan-500/10"><Ban className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </TableFrame>
    </div>
  )
}
