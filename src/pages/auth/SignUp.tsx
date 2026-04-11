import { UserPlus2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Toast } from '../../components/ui/Toast'
import { useAuth } from '../../contexts/AuthContext'
import type { Role, ToastState } from '../../types'

export function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('Kenai Business Owner')
  const [email, setEmail] = useState('owner@kenaiborough.com')
  const [password, setPassword] = useState('demo-password')
  const [role, setRole] = useState<Role>('business_owner')
  const [toast, setToast] = useState<ToastState | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = await signUp(fullName, email, password, role)
    if (result.error) {
      setToast({ title: 'Signup failed', description: result.error, variant: 'error' })
      return
    }
    setToast({ title: 'Account created', description: 'Your Kenai Borough account is ready.', variant: 'success' })
    window.setTimeout(() => navigate(role === 'admin' ? '/admin' : '/dashboard'), 400)
  }

  return (
    <div className="page-shell py-12">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr,1fr]">
        <div className="panel">
          <div className="flex items-center gap-3 text-alaska-ocean">
            <UserPlus2 className="h-5 w-5" />
            <p className="font-semibold">Create an account</p>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium">Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} className="form-input mt-2" /></label>
            <label className="block text-sm font-medium">Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="form-input mt-2" /></label>
            <label className="block text-sm font-medium">Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="form-input mt-2" /></label>
            <label className="block text-sm font-medium">Role
              <select value={role} onChange={(event) => setRole(event.target.value as Role)} className="form-input mt-2">
                <option value="visitor">Visitor</option>
                <option value="business_owner">Business owner</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <button className="primary-button w-full" type="submit">Create account</button>
          </form>
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">Already have an account? <Link to="/sign-in" className="font-semibold text-alaska-ocean">Sign in</Link></p>
        </div>
        <div className="panel bg-white/70 dark:bg-white/5">
          <p className="section-kicker">Built for the community</p>
          <h1 className="mt-3 text-4xl font-semibold">List your business, answer inquiries, and grow visibility.</h1>
          <div className="mt-8 grid gap-4">
            {['Manage listing details and media', 'Submit and moderate events', 'Track analytics and advertising invoices'].map((item) => (
              <div key={item} className="rounded-[1.5rem] bg-slate-900/5 p-4 text-sm dark:bg-white/5">{item}</div>
            ))}
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
