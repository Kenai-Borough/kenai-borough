import { LockKeyhole, LogIn } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Toast } from '../../components/ui/Toast'
import { useAuth } from '../../contexts/AuthContext'
import type { ToastState } from '../../types'

export function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('owner@kenaiborough.com')
  const [password, setPassword] = useState('demo-password')
  const [toast, setToast] = useState<ToastState | null>(null)
  const redirect = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = await signIn(email, password)
    if (result.error) {
      setToast({ title: 'Sign-in failed', description: result.error, variant: 'error' })
      return
    }
    setToast({ title: 'Welcome back', description: 'You are signed in and ready to manage your listing.', variant: 'success' })
    window.setTimeout(() => navigate(redirect), 400)
  }

  return (
    <div className="page-shell py-12">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr,0.9fr]">
        <div className="panel bg-alaska-forest text-white dark:bg-alaska-pine">
          <p className="section-kicker text-white/70">Business access</p>
          <h1 className="mt-3 text-4xl font-semibold">Sign in to manage your Kenai Borough presence.</h1>
          <p className="mt-4 text-sm text-white/80">Use a demo email like admin@kenaiborough.com or owner@kenaiborough.com when Supabase credentials are not configured.</p>
          <div className="mt-8 space-y-4 text-sm text-white/75">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">Track inquiries, views, and advertising in one place.</div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">Update photos, hours, services, and seasonal offers.</div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">Moderate events and connect with trip-planning visitors.</div>
          </div>
        </div>
        <div className="panel">
          <div className="flex items-center gap-3 text-alaska-ocean">
            <LockKeyhole className="h-5 w-5" />
            <p className="font-semibold">Secure sign in</p>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium">Email<input value={email} onChange={(event) => setEmail(event.target.value)} className="form-input mt-2" type="email" /></label>
            <label className="block text-sm font-medium">Password<input value={password} onChange={(event) => setPassword(event.target.value)} className="form-input mt-2" type="password" /></label>
            <button className="primary-button w-full" type="submit">
              <LogIn className="mr-2 h-4 w-4" /> Sign in
            </button>
          </form>
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">Need an account? <Link to="/sign-up" className="font-semibold text-alaska-ocean">Create one now</Link></p>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
