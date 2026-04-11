import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { Toast } from '../components/ui/Toast'
import type { ToastState } from '../types'

export function Contact() {
  const [toast, setToast] = useState<ToastState | null>(null)

  return (
    <div className="page-shell py-12">
      <div className="hero-grid gap-8">
        <div>
          <p className="section-kicker">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Ask a general question about planning your Kenai Peninsula trip.</h1>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
            Use the community hub to ask about travel timing, interests, partner businesses, or event opportunities. We’ll route you to the right next step.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Mail, label: 'Email', value: 'hello@kenaiborough.com' },
              { icon: Phone, label: 'Phone', value: '(907) 555-0404' },
              { icon: MapPin, label: 'Base', value: 'Kenai Peninsula, Alaska' },
            ].map((item) => (
              <div key={item.label} className="glass-card p-5">
                <item.icon className="h-5 w-5 text-alaska-ocean" />
                <p className="mt-3 text-sm font-semibold">{item.label}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="form-input" placeholder="Full name" />
            <input className="form-input" placeholder="Email address" />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input className="form-input" placeholder="Interests (fishing, family, food, events)" />
            <input className="form-input" placeholder="Travel dates" />
          </div>
          <textarea className="form-input mt-3 min-h-[180px]" placeholder="Tell us what kind of trip or support you need." />
          <button onClick={() => setToast({ title: 'Inquiry received', description: 'Thanks for reaching out. A Kenai Borough response will follow shortly.', variant: 'success' })} className="primary-button mt-4 w-full">
            Send inquiry
          </button>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
