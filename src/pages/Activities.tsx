import { CalendarRange, Compass, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { activities } from '../data/activities'
import { businesses } from '../data/businesses'
import { Toast } from '../components/ui/Toast'
import type { ToastState } from '../types'

const seasons = ['all', 'spring', 'summer', 'fall', 'winter'] as const

export function Activities() {
  const [season, setSeason] = useState<(typeof seasons)[number]>('all')
  const [activeInquiry, setActiveInquiry] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => season === 'all' || activity.seasons.includes(season))
  }, [season])

  const submitInquiry = (activityTitle: string) => {
    setToast({ title: 'Inquiry sent', description: 'Your booking interest for ' + activityTitle + ' has been captured.', variant: 'success' })
    setActiveInquiry(null)
  }

  return (
    <div className="page-shell py-12">
      <div className="hero-grid gap-6">
        <div>
          <p className="section-kicker">Activities</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">From salmon fishing to aurora viewing, adventure starts here.</h1>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
            Explore Kenai River and Russian River salmon fishing, glacier hiking, sea kayaking, bear viewing, flightseeing, dog sledding, and winter aurora experiences with locally operated businesses.
          </p>
        </div>
        <div className="panel">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-100">
            <Compass className="h-5 w-5 text-alaska-ocean" />
            <p className="font-semibold">Seasonal filters</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {seasons.map((item) => (
              <button key={item} onClick={() => setSeason(item)} className={season === item ? 'primary-button px-4 py-2 text-xs capitalize' : 'secondary-button px-4 py-2 text-xs capitalize'}>
                {item}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Showing {filteredActivities.length} bookable activities with season-aware inspiration.</p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {filteredActivities.map((activity, index) => {
          const business = businesses.find((item) => item.id === activity.businessId)
          return (
            <motion.article key={activity.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.03 }} whileHover={{ y: -6 }} className="glass-card overflow-hidden">
              <img src={activity.image} alt={activity.title} className="h-60 w-full object-cover" />
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-alaska-ocean dark:text-alaska-aurora">
                  <span>{activity.category}</span>
                  <span>•</span>
                  <span>{activity.town}</span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold">{activity.title}</h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{activity.description}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-900/5 p-3 text-sm dark:bg-white/5">
                    <p className="font-semibold">Season</p>
                    <p className="mt-1 capitalize text-slate-500 dark:text-slate-400">{activity.seasons.join(', ')}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/5 p-3 text-sm dark:bg-white/5">
                    <p className="font-semibold">Duration</p>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">{activity.duration}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/5 p-3 text-sm dark:bg-white/5">
                    <p className="font-semibold">Difficulty</p>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">{activity.difficulty}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {activity.highlights.map((highlight) => (
                    <span key={highlight} className="rounded-full bg-slate-900/5 px-3 py-1 dark:bg-white/10">{highlight}</span>
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.price}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Hosted by {business?.name}</p>
                  </div>
                  <button onClick={() => setActiveInquiry(activeInquiry === activity.id ? null : activity.id)} className="primary-button">
                    <CalendarRange className="mr-2 h-4 w-4" /> Request details
                  </button>
                </div>
                {activeInquiry === activity.id && (
                  <div className="mt-5 rounded-[1.5rem] border border-alaska-ocean/20 bg-alaska-sky/10 p-4 dark:bg-white/5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input className="form-input" placeholder="Your name" />
                      <input className="form-input" placeholder="Email address" />
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <input className="form-input" placeholder="Preferred dates" />
                      <input className="form-input" placeholder="Group size" />
                    </div>
                    <textarea className="form-input mt-3 min-h-[120px]" placeholder="Tell us what kind of trip you want to plan" />
                    <button onClick={() => submitInquiry(activity.title)} className="primary-button mt-3">
                      <Send className="mr-2 h-4 w-4" /> Send booking inquiry
                    </button>
                  </div>
                )}
              </div>
            </motion.article>
          )
        })}
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
