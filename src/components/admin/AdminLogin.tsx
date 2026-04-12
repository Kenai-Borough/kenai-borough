'use client';

import React, { useState } from 'react';
import { ShieldCheck, LogIn, AlertCircle, Loader2, KeyRound } from 'lucide-react';

// Default: admin@kenaiborough.com / KenaiAdmin2026!
// Change via: Supabase dashboard > Authentication > Users
// Or via admin config panel after login

export interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await onLogin(email, password);
      if (!result.success) {
        setError(result.error ?? 'Authentication failed. Verify your credentials.');
      }
    } catch {
      setError('Network error. Could not reach authentication service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Floating accent lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage:
            'linear-gradient(135deg, transparent 40%, rgba(34,211,238,0.02) 40%, rgba(34,211,238,0.02) 40.5%, transparent 40.5%), linear-gradient(225deg, transparent 60%, rgba(34,211,238,0.015) 60%, rgba(34,211,238,0.015) 60.5%, transparent 60.5%)',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo / branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 mb-5">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Kenai Borough Network</h1>
          <p className="mt-1.5 text-sm text-slate-400 flex items-center justify-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            Administrative Access
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-5 shadow-2xl shadow-black/40"
        >
          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="admin-email" className="block text-xs font-medium text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@kenaiborough.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="admin-password" className="block text-xs font-medium text-slate-400 mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
              bg-gradient-to-r from-cyan-500 to-teal-500 text-white
              hover:from-cyan-400 hover:to-teal-400 hover:shadow-lg hover:shadow-cyan-500/20
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {loading ? 'Authenticating…' : 'Enter the Matrix'}
          </button>

          {/* Forgot password */}
          <div className="text-center">
            <button
              type="button"
              className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-slate-600">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
}
