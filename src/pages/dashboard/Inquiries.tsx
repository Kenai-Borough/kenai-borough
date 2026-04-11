import { useState } from 'react'
import { sampleInquiries } from '../../data/events'
import { Toast } from '../../components/ui/Toast'
import type { ToastState } from '../../types'

export function Inquiries() {
  const [selected, setSelected] = useState(sampleInquiries[0]?.id)
  const [toast, setToast] = useState<ToastState | null>(null)
  const inquiry = sampleInquiries.find((item) => item.id === selected) ?? sampleInquiries[0]

  return (
    <div className="page-shell py-12">
      <div className="max-w-4xl">
        <p className="section-kicker">Inquiries</p>
        <h1 className="mt-3 text-4xl font-semibold">Respond to travelers and manage your inbox.</h1>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr,1.15fr]">
        <div className="panel">
          <div className="space-y-3">
            {sampleInquiries.map((item) => (
              <button key={item.id} onClick={() => setSelected(item.id)} className={selected === item.id ? 'w-full rounded-[1.5rem] border border-alaska-ocean/20 bg-alaska-sky/15 p-4 text-left' : 'w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-left dark:border-white/10 dark:bg-white/5'}>
                <p className="font-semibold">{item.guestName}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.businessName}</p>
                <p className="mt-2 text-xs text-slate-400">{item.receivedAt}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="panel">
          <p className="text-sm font-semibold text-alaska-ocean">Selected inquiry</p>
          <h2 className="mt-2 text-2xl font-semibold">{inquiry.guestName}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{inquiry.email} · {inquiry.travelDates}</p>
          <div className="mt-5 rounded-[1.5rem] bg-slate-900/5 p-5 text-sm leading-7 dark:bg-white/5">{inquiry.message}</div>
          <textarea className="form-input mt-5 min-h-[180px]" placeholder="Write a helpful reply with next steps, availability, and questions." />
          <button onClick={() => setToast({ title: 'Reply saved', description: 'Your response is ready to send to the guest.', variant: 'success' })} className="primary-button mt-4">Send reply</button>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
