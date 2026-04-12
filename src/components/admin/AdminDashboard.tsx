'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  ShieldCheck,
  FileText,
  Settings,
  Activity,
  Search,
  ChevronDown,
  ChevronRight,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Ban,
  UserCheck,
  RefreshCw,
  Menu,
  X,
  Globe,
  Landmark,
  Truck,
  Home,
  Scale,
  MessageSquare,
  Save,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NetworkSite {
  id: string;
  name: string;
  slug: string;
  status: 'online' | 'degraded' | 'offline';
  icon: React.ReactNode;
}

interface StatCard {
  label: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
}

type TxStatus = 'pending' | 'in_escrow' | 'inspection' | 'completed' | 'disputed' | 'cancelled';

interface Transaction {
  id: string;
  site: string;
  listing: string;
  buyer: string;
  seller: string;
  amount: number;
  status: TxStatus;
  created: string;
  timeline: { date: string; event: string }[];
}

interface NetworkUser {
  id: string;
  name: string;
  email: string;
  site: string;
  role: 'buyer' | 'seller' | 'admin';
  trustScore: number;
  verified: boolean;
  joined: string;
  txCount: number;
}

interface Dispute {
  id: string;
  transactionId: string;
  listing: string;
  amount: number;
  buyer: string;
  seller: string;
  buyerClaim: string;
  sellerClaim: string;
  evidence: string[];
  opened: string;
  status: 'open' | 'under_review' | 'resolved';
}

interface ActivityEvent {
  id: string;
  type: 'listing' | 'transaction' | 'verification' | 'dispute' | 'user';
  message: string;
  time: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const SITES: NetworkSite[] = [
  { id: 's1', name: 'Land Sales', slug: 'land', status: 'online', icon: <Globe className="w-3 h-3" /> },
  { id: 's2', name: 'Auto Sales', slug: 'auto', status: 'online', icon: <Truck className="w-3 h-3" /> },
  { id: 's3', name: 'Rentals', slug: 'rentals', status: 'online', icon: <Home className="w-3 h-3" /> },
  { id: 's4', name: 'Metals Exchange', slug: 'metals', status: 'degraded', icon: <Landmark className="w-3 h-3" /> },
  { id: 's5', name: 'Legal Work', slug: 'legal', status: 'online', icon: <Scale className="w-3 h-3" /> },
];

const STATS: StatCard[] = [
  { label: 'Total Active Listings', value: '1,247', trend: 12.4, icon: <FileText className="w-5 h-5 text-cyan-400" /> },
  { label: 'Active Transactions', value: '83', trend: 8.1, icon: <DollarSign className="w-5 h-5 text-cyan-400" /> },
  { label: 'Monthly Revenue', value: '$24,610', trend: -3.2, icon: <Landmark className="w-5 h-5 text-cyan-400" /> },
  { label: 'Network Users', value: '4,892', trend: 15.7, icon: <Users className="w-5 h-5 text-cyan-400" /> },
];

const TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-4801', site: 'Land Sales', listing: '2.5 Acre Parcel — Funny River Rd',
    buyer: 'Marcus Bell', seller: 'Kenai River Holdings LLC', amount: 47500,
    status: 'in_escrow', created: '2026-06-28',
    timeline: [
      { date: '2026-06-28', event: 'Transaction initiated by buyer' },
      { date: '2026-06-28', event: 'Escrow funded — $47,500 deposited' },
      { date: '2026-06-29', event: 'Seller acknowledged; inspection period started' },
    ],
  },
  {
    id: 'TX-4799', site: 'Auto Sales', listing: '2019 Toyota Tacoma TRD Off-Road',
    buyer: 'Sarah Kowalski', seller: 'Kenai Auto Group', amount: 31200,
    status: 'inspection', created: '2026-06-26',
    timeline: [
      { date: '2026-06-26', event: 'Transaction initiated' },
      { date: '2026-06-26', event: 'Escrow funded — $31,200' },
      { date: '2026-06-27', event: 'Inspection period started (7 days)' },
    ],
  },
  {
    id: 'TX-4792', site: 'Metals Exchange', listing: '10 oz Gold Bar — PAMP Suisse',
    buyer: 'David Nguyen', seller: 'Northern Metals Co', amount: 23480,
    status: 'disputed', created: '2026-06-22',
    timeline: [
      { date: '2026-06-22', event: 'Transaction initiated' },
      { date: '2026-06-22', event: 'Escrow funded — $23,480' },
      { date: '2026-06-24', event: 'Item shipped via insured carrier' },
      { date: '2026-06-26', event: 'Buyer filed dispute — item authenticity concern' },
    ],
  },
  {
    id: 'TX-4785', site: 'Rentals', listing: '3BR Cabin — Soldotna Riverside',
    buyer: 'Emily Torres', seller: 'Cook Inlet Properties', amount: 2400,
    status: 'completed', created: '2026-06-18',
    timeline: [
      { date: '2026-06-18', event: 'Lease deposit escrowed — $2,400' },
      { date: '2026-06-20', event: 'Lease signed by both parties' },
      { date: '2026-06-21', event: 'Funds released to landlord' },
    ],
  },
  {
    id: 'TX-4770', site: 'Land Sales', listing: '0.8 Acre — Sterling Hwy Frontage',
    buyer: 'Robert Fisk', seller: 'Peninsula Realty Trust', amount: 62000,
    status: 'cancelled', created: '2026-06-14',
    timeline: [
      { date: '2026-06-14', event: 'Transaction initiated' },
      { date: '2026-06-15', event: 'Buyer requested cancellation — financing fell through' },
      { date: '2026-06-15', event: 'Funds returned to buyer' },
    ],
  },
];

const USERS: NetworkUser[] = [
  { id: 'U-1001', name: 'Marcus Bell', email: 'marcus.b@email.com', site: 'Land Sales', role: 'buyer', trustScore: 92, verified: true, joined: '2025-11-03', txCount: 7 },
  { id: 'U-1002', name: 'Sarah Kowalski', email: 'sarah.k@email.com', site: 'Auto Sales', role: 'buyer', trustScore: 88, verified: true, joined: '2025-08-19', txCount: 3 },
  { id: 'U-1003', name: 'David Nguyen', email: 'david.n@email.com', site: 'Metals Exchange', role: 'buyer', trustScore: 74, verified: false, joined: '2026-02-11', txCount: 5 },
  { id: 'U-1004', name: 'Cook Inlet Properties', email: 'admin@cookinlet.com', site: 'Rentals', role: 'seller', trustScore: 97, verified: true, joined: '2025-05-01', txCount: 42 },
  { id: 'U-1005', name: 'Northern Metals Co', email: 'ops@northernmetals.co', site: 'Metals Exchange', role: 'seller', trustScore: 81, verified: true, joined: '2025-09-14', txCount: 28 },
  { id: 'U-1006', name: 'Peninsula Realty Trust', email: 'info@peninsularealty.com', site: 'Land Sales', role: 'seller', trustScore: 95, verified: true, joined: '2025-03-22', txCount: 63 },
];

const DISPUTES: Dispute[] = [
  {
    id: 'D-301', transactionId: 'TX-4792', listing: '10 oz Gold Bar — PAMP Suisse', amount: 23480,
    buyer: 'David Nguyen', seller: 'Northern Metals Co',
    buyerClaim: 'Bar serial number does not match PAMP registry. Suspect counterfeit. Requesting full refund and return shipping label.',
    sellerClaim: 'Bar is authentic and sourced directly from PAMP distributor. Serial is from a 2025 batch not yet in public registry. Will provide distributor invoice.',
    evidence: ['buyer_photo_serial.jpg', 'seller_invoice_pamp.pdf', 'buyer_assay_request.pdf'],
    opened: '2026-06-26', status: 'open',
  },
  {
    id: 'D-298', transactionId: 'TX-4761', listing: '1997 Ford F-250 — Plow Truck', amount: 8900,
    buyer: 'James Ortega', seller: 'Kenai Auto Group',
    buyerClaim: 'Engine has a cracked head gasket not disclosed in listing. Repair estimate $3,200.',
    sellerClaim: 'Vehicle sold as-is per listing. Buyer had full inspection period and chose not to inspect.',
    evidence: ['buyer_mechanic_report.pdf', 'original_listing_screenshot.png'],
    opened: '2026-06-20', status: 'under_review',
  },
];

const ACTIVITY_FEED: ActivityEvent[] = [
  { id: 'e1', type: 'transaction', message: 'TX-4801 escrow funded — $47,500', time: '2 min ago' },
  { id: 'e2', type: 'listing', message: 'New listing: 5 Acre Homestead — Kasilof', time: '8 min ago' },
  { id: 'e3', type: 'verification', message: 'Marcus Bell identity verified', time: '15 min ago' },
  { id: 'e4', type: 'dispute', message: 'Dispute D-301 evidence uploaded', time: '22 min ago' },
  { id: 'e5', type: 'user', message: 'New user registered: Amy Chen', time: '31 min ago' },
  { id: 'e6', type: 'transaction', message: 'TX-4799 inspection period started', time: '1 hr ago' },
  { id: 'e7', type: 'listing', message: 'Listing updated: 2019 Tacoma — price drop', time: '1 hr ago' },
  { id: 'e8', type: 'transaction', message: 'TX-4785 funds released', time: '3 hr ago' },
  { id: 'e9', type: 'verification', message: 'Cook Inlet Properties re-verified', time: '4 hr ago' },
  { id: 'e10', type: 'user', message: 'User suspended: flagged_account_42', time: '5 hr ago' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_STYLES: Record<TxStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  in_escrow: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  inspection: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  disputed: 'bg-red-500/20 text-red-400 border-red-500/30',
  cancelled: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const statusLabel = (s: TxStatus) => s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

const activityIcon = (type: ActivityEvent['type']) => {
  const map = {
    listing: <FileText className="w-3.5 h-3.5 text-cyan-400" />,
    transaction: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
    verification: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />,
    dispute: <AlertTriangle className="w-3.5 h-3.5 text-red-400" />,
    user: <Users className="w-3.5 h-3.5 text-purple-400" />,
  };
  return map[type];
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type Tab = 'transactions' | 'users' | 'disputes' | 'config';

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'transactions', label: 'Transactions', icon: <DollarSign className="w-4 h-4" /> },
  { key: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
  { key: 'disputes', label: 'Disputes', icon: <AlertTriangle className="w-4 h-4" /> },
  { key: 'config', label: 'Platform Config', icon: <Settings className="w-4 h-4" /> },
];

// -- Stat Card ---------------------------------------------------------------

const StatCardComponent: React.FC<{ stat: StatCard }> = ({ stat }) => {
  const up = stat.trend >= 0;
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-xl bg-cyan-400/10">{stat.icon}</div>
        <span className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
          {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(stat.trend)}%
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{stat.value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
      </div>
    </div>
  );
};

// -- Transaction Table -------------------------------------------------------

const TransactionTable: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TxStatus | 'all'>('all');

  const filtered = statusFilter === 'all' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.status === statusFilter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400">Filter:</span>
        {(['all', 'pending', 'in_escrow', 'inspection', 'completed', 'disputed', 'cancelled'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              statusFilter === s
                ? 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
            }`}
          >
            {s === 'all' ? 'All' : statusLabel(s as TxStatus)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-xs text-slate-500 uppercase border-b border-white/5">
              <th className="py-3 px-4 font-medium">ID</th>
              <th className="py-3 px-4 font-medium">Site</th>
              <th className="py-3 px-4 font-medium">Listing</th>
              <th className="py-3 px-4 font-medium">Buyer</th>
              <th className="py-3 px-4 font-medium">Seller</th>
              <th className="py-3 px-4 font-medium text-right">Amount</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Created</th>
              <th className="py-3 px-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(tx => (
              <React.Fragment key={tx.id}>
                <tr
                  className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
                >
                  <td className="py-3 px-4 font-mono text-cyan-400">{tx.id}</td>
                  <td className="py-3 px-4 text-slate-300">{tx.site}</td>
                  <td className="py-3 px-4 text-white max-w-[200px] truncate">{tx.listing}</td>
                  <td className="py-3 px-4 text-slate-300">{tx.buyer}</td>
                  <td className="py-3 px-4 text-slate-300">{tx.seller}</td>
                  <td className="py-3 px-4 text-right text-white font-medium">{fmt(tx.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full border ${STATUS_STYLES[tx.status]}`}>
                      {statusLabel(tx.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{tx.created}</td>
                  <td className="py-3 px-4">
                    {expandedId === tx.id
                      ? <ChevronDown className="w-4 h-4 text-slate-500" />
                      : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  </td>
                </tr>
                {expandedId === tx.id && (
                  <tr>
                    <td colSpan={9} className="px-4 py-4 bg-white/[0.02]">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <h4 className="text-xs text-slate-500 uppercase mb-2">Timeline</h4>
                          <ol className="space-y-2 border-l border-white/10 pl-4">
                            {tx.timeline.map((e, i) => (
                              <li key={i} className="text-sm">
                                <span className="text-slate-500 mr-2">{e.date}</span>
                                <span className="text-slate-300">{e.event}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div className="flex flex-wrap gap-2 items-start">
                          {(tx.status === 'in_escrow' || tx.status === 'inspection') && (
                            <button className="px-3 py-1.5 text-xs rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                              <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> Release Funds
                            </button>
                          )}
                          {tx.status === 'disputed' && (
                            <button className="px-3 py-1.5 text-xs rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors">
                              <Scale className="w-3.5 h-3.5 inline mr-1" /> Resolve Dispute
                            </button>
                          )}
                          {tx.status !== 'completed' && tx.status !== 'cancelled' && (
                            <button className="px-3 py-1.5 text-xs rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors">
                              <XCircle className="w-3.5 h-3.5 inline mr-1" /> Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -- User Management ---------------------------------------------------------

const UserManagement: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const results = query.length > 0
    ? USERS.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))
    : USERS;

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search users by name or email…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50"
        />
      </div>

      <div className="grid gap-3">
        {results.map(user => (
          <div
            key={user.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium truncate">{user.name}</p>
                    {user.verified && <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{user.site}</span>
                <span className="capitalize">{user.role}</span>
                <span>Trust: <span className={user.trustScore >= 80 ? 'text-emerald-400' : 'text-yellow-400'}>{user.trustScore}</span></span>
                <span>{user.txCount} txns</span>
                <span>Joined {user.joined}</span>
              </div>

              <div className="flex gap-2">
                {!user.verified && (
                  <button className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors" title="Verify Identity">
                    <UserCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  className="p-2 rounded-lg bg-white/5 text-slate-400 border border-white/10 hover:border-white/20 transition-colors"
                  title="View History"
                  onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors" title="Suspend User">
                  <Ban className="w-4 h-4" />
                </button>
              </div>
            </div>

            {selectedUser === user.id && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <h4 className="text-xs text-slate-500 uppercase mb-2">Transaction History</h4>
                <div className="space-y-1.5">
                  {TRANSACTIONS.filter(tx => tx.buyer === user.name || tx.seller === user.name).map(tx => (
                    <div key={tx.id} className="flex items-center justify-between text-sm">
                      <span className="text-cyan-400 font-mono">{tx.id}</span>
                      <span className="text-slate-300 truncate mx-3 flex-1">{tx.listing}</span>
                      <span className="text-white font-medium">{fmt(tx.amount)}</span>
                      <span className={`ml-3 px-2 py-0.5 text-xs rounded-full border ${STATUS_STYLES[tx.status]}`}>{statusLabel(tx.status)}</span>
                    </div>
                  ))}
                  {TRANSACTIONS.filter(tx => tx.buyer === user.name || tx.seller === user.name).length === 0 && (
                    <p className="text-xs text-slate-500 italic">No transactions found in current dataset.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// -- Dispute Resolution ------------------------------------------------------

const DisputeResolution: React.FC = () => (
  <div className="space-y-4">
    {DISPUTES.map(d => (
      <div key={d.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-cyan-400 text-sm">{d.id}</span>
              <span className="text-slate-500 text-xs">→ {d.transactionId}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full border ${
                d.status === 'open' ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : d.status === 'under_review' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {d.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-white mt-1">{d.listing}</p>
            <p className="text-sm text-slate-400">{fmt(d.amount)} · Opened {d.opened}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
            <p className="text-xs text-slate-500 uppercase mb-1">Buyer Claim — {d.buyer}</p>
            <p className="text-sm text-slate-300">{d.buyerClaim}</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
            <p className="text-xs text-slate-500 uppercase mb-1">Seller Claim — {d.seller}</p>
            <p className="text-sm text-slate-300">{d.sellerClaim}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 uppercase mb-2">Evidence / Documents</p>
          <div className="flex flex-wrap gap-2">
            {d.evidence.map(f => (
              <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-slate-300">
                <FileText className="w-3.5 h-3.5 text-slate-500" /> {f}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          <button className="px-4 py-2 text-xs rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
            <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" /> Refund Buyer
          </button>
          <button className="px-4 py-2 text-xs rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5" /> Release to Seller
          </button>
          <button className="px-4 py-2 text-xs rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors">
            <Scale className="w-3.5 h-3.5 inline mr-1.5" /> Split 50/50
          </button>
          <button className="px-4 py-2 text-xs rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:border-white/20 transition-colors">
            <MessageSquare className="w-3.5 h-3.5 inline mr-1.5" /> Custom Resolution
          </button>
        </div>
      </div>
    ))}
  </div>
);

// -- Platform Config ---------------------------------------------------------

const PlatformConfig: React.FC = () => {
  const [config, setConfig] = useState({
    flatFeeLand: '150',
    flatFeeAuto: '99',
    flatFeeRentals: '50',
    flatFeeMetals: '75',
    escrowPercent: '2.5',
    inspectionDays: '10',
    disputeWindowDays: '14',
    llmEndpoint: 'http://localhost:8095/v1',
    llmModel: 'Qwen3.5-9B',
    stripeWebhookStatus: 'active',
    stripeLastPing: '2026-06-30T14:22:00Z',
  });

  const field = (label: string, key: keyof typeof config, suffix?: string, disabled?: boolean) => (
    <div key={key}>
      <label className="block text-xs text-slate-500 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={config[key]}
          onChange={e => setConfig(prev => ({ ...prev, [key]: e.target.value }))}
          disabled={disabled}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 disabled:opacity-50"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-sm font-semibold text-white mb-4">Fee Structure</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {field('Land Sales — Flat Fee', 'flatFeeLand', '$')}
          {field('Auto Sales — Flat Fee', 'flatFeeAuto', '$')}
          {field('Rentals — Flat Fee', 'flatFeeRentals', '$')}
          {field('Metals Exchange — Flat Fee', 'flatFeeMetals', '$')}
          {field('Escrow Percentage', 'escrowPercent', '%')}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-white mb-4">Transaction Timings</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {field('Default Inspection Period', 'inspectionDays', 'days')}
          {field('Dispute Window After Delivery', 'disputeWindowDays', 'days')}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-white mb-4">LLM Configuration</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {field('LLM Endpoint', 'llmEndpoint')}
          {field('Model', 'llmModel')}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-white mb-4">Stripe Integration</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Webhook Status</label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-emerald-400 font-medium">Active</span>
            </div>
          </div>
          {field('Last Ping', 'stripeLastPing', '', true)}
        </div>
      </section>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 rounded-xl text-sm font-medium hover:bg-cyan-400/30 transition-colors">
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------

export interface AdminDashboardProps {
  adminEmail?: string;
  onLogout?: () => void;
}

export default function AdminDashboard({ adminEmail = 'admin@kenaiborough.com', onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('transactions');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const tabContent: Record<Tab, React.ReactNode> = {
    transactions: <TransactionTable />,
    users: <UserManagement />,
    disputes: <DisputeResolution />,
    config: <PlatformConfig />,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <LayoutDashboard className="w-5 h-5 text-cyan-400" />
            <h1 className="text-sm font-bold tracking-wide">
              <span className="text-cyan-400">Kenai Borough Network</span>
              <span className="text-slate-500 mx-1.5">—</span>
              <span className="text-slate-300">Command Center</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Network status dots */}
            <div className="hidden md:flex items-center gap-2">
              {SITES.map(s => (
                <div key={s.id} className="flex items-center gap-1.5 text-xs text-slate-400" title={`${s.name}: ${s.status}`}>
                  <span className={`w-2 h-2 rounded-full ${
                    s.status === 'online' ? 'bg-emerald-400' : s.status === 'degraded' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                  }`} />
                  {s.icon}
                </div>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              {adminEmail}
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(s => <StatCardComponent key={s.label} stat={s} />)}
          </div>

          {/* Tabs */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex border-b border-white/5 overflow-x-auto">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === t.key
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.icon} {t.label}
                  {t.key === 'disputes' && DISPUTES.filter(d => d.status === 'open').length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-red-500/30 text-red-400">{DISPUTES.filter(d => d.status === 'open').length}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="p-5">{tabContent[activeTab]}</div>
          </div>
        </main>

        {/* Activity Feed Sidebar */}
        {sidebarOpen && (
          <aside className={`
            ${mobileSidebarOpen ? 'fixed inset-y-0 right-0 z-40' : 'hidden lg:block'}
            w-72 border-l border-white/5 bg-slate-950/90 backdrop-blur-xl overflow-y-auto
          `}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Activity Feed
                </div>
                <button
                  onClick={() => { setSidebarOpen(false); setMobileSidebarOpen(false); }}
                  className="p-1 rounded text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {ACTIVITY_FEED.map(evt => (
                  <div key={evt.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="mt-0.5 shrink-0">{activityIcon(evt.type)}</div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-300 leading-relaxed">{evt.message}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{evt.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Sidebar toggle (when closed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex fixed right-4 bottom-4 z-30 items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-xs text-slate-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <Activity className="w-4 h-4 text-cyan-400" /> Feed
          </button>
        )}
      </div>
    </div>
  );
}
