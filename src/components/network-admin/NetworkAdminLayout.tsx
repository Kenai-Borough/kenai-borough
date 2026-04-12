import { motion } from 'framer-motion'
import { ArrowLeft, BellRing, ChevronRight, LayoutDashboard, LineChart, Megaphone, Menu, Settings2, Shield, ShieldAlert, TableProperties, Users, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const navigation = [
  { to: '/network-admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/network-admin/users', label: 'Users', icon: Users },
  { to: '/network-admin/listings', label: 'Listings', icon: TableProperties },
  { to: '/network-admin/analytics', label: 'Analytics', icon: LineChart },
  { to: '/network-admin/escrow', label: 'Escrow', icon: Shield },
  { to: '/network-admin/moderation', label: 'Moderation', icon: ShieldAlert },
  { to: '/network-admin/advertising', label: 'Advertising', icon: Megaphone },
  { to: '/network-admin/settings', label: 'Settings', icon: Settings2 },
]

function breadcrumbLabel(pathname: string) {
  return navigation.find((item) => item.to === pathname)?.label ?? 'Overview'
}

export function NetworkAdminLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()
  const initials = useMemo(
    () =>
      (user?.fullName ?? 'Kenai Operator')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [user?.fullName],
  )

  const sidebar = (
    <div className="flex h-full flex-col justify-between gap-8 rounded-r-3xl border-r border-white/10 bg-slate-950/95 px-4 py-6 backdrop-blur lg:rounded-none">
      <div>
        <div className="flex items-center justify-between">
          <Link to="/network-admin" className="flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-semibold shadow-lg shadow-cyan-500/20">KN</span>
            <span>
              <span className="block text-xs uppercase tracking-[0.3em] text-cyan-300/80">Kenai bundle</span>
              <span className="text-lg font-semibold">Network Admin</span>
            </span>
          </Link>
          <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/10 p-2 text-slate-300 lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-8 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/network-admin'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-3 rounded-2xl border border-cyan-400/30 bg-cyan-400/15 px-4 py-3 text-sm font-medium text-cyan-100'
                    : 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white'
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-50">
          <p className="font-semibold">Single Supabase control plane</p>
          <p className="mt-2 text-cyan-100/80">Unified SSO, moderation, and ad inventory for all six Kenai bundle sites.</p>
        </div>
        <Link to="/" className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Main Site
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 lg:block">{sidebar}</aside>
        {open ? <div className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" /> : null}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 transition lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>{sidebar}</aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07111f]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setOpen(true)} className="rounded-2xl border border-white/10 p-2 text-slate-300 lg:hidden">
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-slate-400">
                    <span>Dashboard</span>
                    <ChevronRight className="h-3 w-3" />
                    <span>{breadcrumbLabel(location.pathname)}</span>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-white">Kenai Network Admin</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 sm:flex">
                  <BellRing className="h-4 w-4 text-cyan-300" />
                  4 alerts need attention
                </div>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-semibold text-slate-950">{initials}</div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white">{user?.fullName ?? 'Kenai Operator'}</p>
                    <p className="text-xs text-slate-400">Network admin session</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <motion.main key={location.pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  )
}
