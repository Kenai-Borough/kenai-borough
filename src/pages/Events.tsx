import { addDays, eachDayOfInterval, endOfMonth, format, isSameMonth, startOfMonth } from 'date-fns'
import { Calendar, CalendarPlus2, LayoutGrid } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { events } from '../data/events'
import { Toast } from '../components/ui/Toast'
import type { EventItem, ToastState } from '../types'

const categories = ['All', 'Arts', 'Sports', 'Markets', 'Festivals', 'Community'] as const

export function Events() {
  const [category, setCategory] = useState<(typeof categories)[number]>('All')
  const [view, setView] = useState<'grid' | 'calendar'>('grid')
  const [toast, setToast] = useState<ToastState | null>(null)

  const filteredEvents = useMemo(() => {
    return events.filter((event) => category === 'All' || event.category === category)
  }, [category])

  const monthStart = startOfMonth(new Date())
  const monthEnd = endOfMonth(addDays(monthStart, 10))
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const eventsByDay = useMemo(() => {
    return days.map((day) => ({
      day,
      items: filteredEvents.filter((event) => format(new Date(event.startDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')),
    }))
  }, [days, filteredEvents])

  const submitEvent = () => {
    setToast({ title: 'Submission received', description: 'Your business event has been added to the moderation queue.', variant: 'success' })
  }

  return (
    <div className="page-shell py-12">
      <div className="hero-grid gap-6">
        <div>
          <p className="section-kicker">Events calendar</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Markets, festivals, arts, sports, and community events around Kenai.</h1>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
            Browse what’s happening across the peninsula with flexible grid and calendar views, then submit events as a participating business.
          </p>
        </div>
        <div className="panel">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button key={item} onClick={() => setCategory(item)} className={category === item ? 'primary-button px-4 py-2 text-xs' : 'secondary-button px-4 py-2 text-xs'}>
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setView('grid')} className={view === 'grid' ? 'primary-button px-4 py-2 text-xs' : 'secondary-button px-4 py-2 text-xs'}>
              <LayoutGrid className="mr-2 h-4 w-4" /> Grid view
            </button>
            <button onClick={() => setView('calendar')} className={view === 'calendar' ? 'primary-button px-4 py-2 text-xs' : 'secondary-button px-4 py-2 text-xs'}>
              <Calendar className="mr-2 h-4 w-4" /> Calendar view
            </button>
          </div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-10 panel overflow-hidden">
          <div className="grid gap-px overflow-hidden rounded-[1.5rem] bg-slate-200 dark:bg-white/10 md:grid-cols-7">
            {eventsByDay.map(({ day, items }) => (
              <div key={day.toISOString()} className={isSameMonth(day, monthStart) ? 'min-h-[150px] bg-white p-4 dark:bg-slate-950/90' : 'min-h-[150px] bg-slate-50 p-4 dark:bg-slate-950/60'}>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{format(day, 'EEE d')}</div>
                <div className="mt-3 grid gap-2">
                  {items.length === 0 ? <div className="text-xs text-slate-400">No events yet</div> : null}
                  {items.map((event) => (
                    <div key={event.id} className="rounded-2xl bg-alaska-sky/15 p-3 text-xs dark:bg-white/5">
                      <p className="font-semibold text-slate-900 dark:text-white">{event.title}</p>
                      <p className="mt-1 text-slate-500 dark:text-slate-400">{event.town}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="panel">
          <p className="section-kicker">Event submission</p>
          <h2 className="mt-3 text-2xl font-semibold">Promote a business event, market, or community gathering.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <input className="form-input" placeholder="Business name" />
            <input className="form-input" placeholder="Contact email" />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input className="form-input" placeholder="Event title" />
            <select className="form-input default:bg-white dark:default:bg-slate-950">
              {categories.slice(1).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input className="form-input" placeholder="Date and time" />
            <input className="form-input" placeholder="Venue / town" />
          </div>
          <textarea className="form-input mt-3 min-h-[140px]" placeholder="Describe the event, its audience, and any ticket information" />
          <button onClick={submitEvent} className="primary-button mt-4">
            <CalendarPlus2 className="mr-2 h-4 w-4" /> Submit event for review
          </button>
        </div>
        <div className="panel bg-alaska-forest text-white dark:bg-alaska-pine">
          <p className="section-kicker text-white/70">Why list here?</p>
          <h2 className="mt-3 text-2xl font-semibold">Put events in front of visitors and locals planning their next stop.</h2>
          <ul className="mt-6 space-y-3 text-sm text-white/80">
            <li>• Calendar and grid visibility across high-intent trip planning traffic.</li>
            <li>• Exposure alongside lodging, guides, transportation, and itinerary tools.</li>
            <li>• A moderation queue that helps keep listings trustworthy and current.</li>
          </ul>
        </div>
      </section>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}

function EventCard({ event, index }: { event: EventItem; index: number }) {
  return (
    <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} whileHover={{ y: -6 }} className="glass-card overflow-hidden">
      <img src={event.image} alt={event.title} className="h-56 w-full object-cover" />
      <div className="p-5">
        <p className="text-sm font-semibold text-alaska-ocean dark:text-alaska-aurora">{event.category}</p>
        <h2 className="mt-2 text-2xl font-semibold">{event.title}</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{event.summary}</p>
        <div className="mt-4 grid gap-2 text-sm text-slate-500 dark:text-slate-400">
          <div>{format(new Date(event.startDate), 'EEE, MMM d · h:mm a')}</div>
          <div>{event.venue}, {event.town}</div>
          <div>{event.priceLabel}</div>
        </div>
      </div>
    </motion.article>
  )
}
