import { addDays, differenceInCalendarDays, format } from 'date-fns'
import { Download, Send } from 'lucide-react'
import { useMemo, useState } from 'react'
import { activities } from '../data/activities'
import { businesses } from '../data/businesses'
import { events } from '../data/events'
import { Toast } from '../components/ui/Toast'
import type { ToastState } from '../types'

const interestOptions = ['Fishing', 'Wildlife', 'Food', 'Arts', 'Family', 'Luxury', 'Winter adventure']

export function TripPlanner() {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 3), 'yyyy-MM-dd'))
  const [groupSize, setGroupSize] = useState('4')
  const [interests, setInterests] = useState<string[]>(['Fishing', 'Wildlife'])
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>(['b1', 'b4', 'b22'])
  const [toast, setToast] = useState<ToastState | null>(null)

  const tripLength = Math.max(1, differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1)

  const suggestedItinerary = useMemo(() => {
    const picks = activities.filter((activity) => {
      if (interests.includes('Fishing') && activity.category.includes('Fishing')) return true
      if (interests.includes('Wildlife') && (activity.category.includes('Bear') || activity.category.includes('Wildlife') || activity.category.includes('Aurora'))) return true
      if (interests.includes('Winter adventure') && activity.seasons.includes('winter')) return true
      return interests.includes('Family') && activity.difficulty !== 'Challenging'
    })

    return Array.from({ length: tripLength }, (_, index) => ({
      day: index + 1,
      label: format(addDays(new Date(startDate), index), 'EEE, MMM d'),
      morning: picks[index % picks.length] ?? activities[0],
      afternoon: businesses[(index + 4) % businesses.length],
      evening: events[index % events.length],
    }))
  }, [interests, startDate, tripLength])

  const toggleInterest = (value: string) => {
    setInterests((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]))
  }

  const toggleBusiness = (id: string) => {
    setSelectedBusinesses((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const sendInquiry = () => {
    setToast({ title: 'Trip inquiry sent', description: 'Your itinerary request has been shared with selected businesses.', variant: 'success' })
  }

  const exportPlan = () => {
    const lines = suggestedItinerary.map((day) => 'Day ' + day.day + ' - ' + day.label + ': ' + day.morning.title + ' / ' + day.afternoon.name + ' / ' + day.evening.title)
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'kenai-trip-plan.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page-shell py-12">
      <div className="hero-grid gap-8">
        <div>
          <p className="section-kicker">Trip planner</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Build a suggested Kenai itinerary around your dates and interests.</h1>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
            Choose your travel window, group size, and interests to generate a polished concept itinerary, then send one inquiry to multiple local businesses.
          </p>
        </div>
        <div className="panel">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium">Start date<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="form-input mt-2" /></label>
            <label className="text-sm font-medium">End date<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="form-input mt-2" /></label>
          </div>
          <label className="mt-3 block text-sm font-medium">Group size<input value={groupSize} onChange={(event) => setGroupSize(event.target.value)} className="form-input mt-2" placeholder="4 guests" /></label>
          <div className="mt-4 flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button key={interest} onClick={() => toggleInterest(interest)} className={interests.includes(interest) ? 'primary-button px-4 py-2 text-xs' : 'secondary-button px-4 py-2 text-xs'}>
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="section-kicker">Suggested itinerary</p>
              <h2 className="mt-2 text-2xl font-semibold">{tripLength}-day concept itinerary</h2>
            </div>
            <button onClick={exportPlan} className="secondary-button">
              <Download className="mr-2 h-4 w-4" /> Export concept
            </button>
          </div>
          <div className="mt-6 grid gap-4">
            {suggestedItinerary.map((day) => (
              <div key={day.day} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
                <p className="text-sm font-semibold text-alaska-ocean dark:text-alaska-aurora">Day {day.day} · {day.label}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Morning</p>
                    <p className="mt-2 font-semibold">{day.morning.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{day.morning.town}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Afternoon</p>
                    <p className="mt-2 font-semibold">{day.afternoon.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{day.afternoon.category}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Evening</p>
                    <p className="mt-2 font-semibold">{day.evening.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{day.evening.venue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <p className="section-kicker">Send one inquiry to many</p>
          <h2 className="mt-2 text-2xl font-semibold">Choose which businesses should receive your trip request.</h2>
          <div className="mt-5 grid gap-3">
            {businesses.slice(0, 8).map((business) => (
              <label key={business.id} className="flex items-start gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <input type="checkbox" checked={selectedBusinesses.includes(business.id)} onChange={() => toggleBusiness(business.id)} className="mt-1 h-4 w-4 rounded border-slate-300 text-alaska-forest focus:ring-alaska-ocean" />
                <div>
                  <p className="font-semibold">{business.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{business.category} · {business.town}</p>
                </div>
              </label>
            ))}
          </div>
          <textarea className="form-input mt-5 min-h-[140px]" defaultValue={'Travel dates: ' + startDate + ' to ' + endDate + '\nGroup size: ' + groupSize + '\nInterests: ' + interests.join(', ')} />
          <button onClick={sendInquiry} className="primary-button mt-4 w-full">
            <Send className="mr-2 h-4 w-4" /> Send itinerary inquiry
          </button>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
