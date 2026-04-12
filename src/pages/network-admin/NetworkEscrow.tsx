/**
 * Kenai Borough Network — Escrow Administration Page
 *
 * Network-wide escrow transaction management with dispute resolution,
 * fund release controls, and platform configuration.
 *
 * This wraps the shared AdminDashboard component with the network-admin
 * layout context and Supabase data integration.
 */

import { useState } from 'react';
import AdminDashboard from '../../components/admin/AdminDashboard';

export function NetworkEscrow() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-400/80">Transaction Management</p>
            <h1 className="text-2xl font-bold text-white mt-1">Escrow Command Center</h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage escrow transactions, resolve disputes, and configure platform fees across all Kenai Network sites.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-400">Escrow system online</span>
          </div>
        </div>

        {/* Embedded dashboard — the shared AdminDashboard handles all tabs */}
        <AdminDashboard />
      </div>
    </div>
  );
}
