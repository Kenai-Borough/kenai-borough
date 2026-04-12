import { ArrowRight, Compass, MapPinned, Search, Sparkles, Trees } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { businesses, featuredBusinesses } from '../data/businesses'
import { events } from '../data/events'
import { CrossTrafficAds } from '../components/CrossTrafficAds'

const seasonalHighlights = [
  { season: 'Summer', title: 'Salmon fishing and glacier days', summary: 'Peak river runs, long daylight hours, harbor festivals, and full-guided touring energy across the peninsula.' },
  { season: 'Winter', title: 'Aurora nights and dog sledding', summary: 'Snowy forests, heated aurora camps, cozy lodges, and memorable winter storytelling for small groups.' },
  { season: 'Fall', title: 'Golden tundra and shoulder-season calm', summary: 'Colorful trails, quieter charters, wildlife movement, and harvest events that feel distinctly local.' },
  { season: 'Spring', title: 'Wildlife, migration, and fresh thaw', summary: 'Birding, whale watching, early hiking, and community events that celebrate the return of the light.' },
]

export function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' })
  const upcomingEvents = useMemo(() => events.slice(0, 4), [])

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(13,31,18,0.9),rgba(74,144,217,0.85))] py-20 text-white">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80"
            alt="Kenai Peninsula mountains, glaciers, and river valleys"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="page-shell relative hero-grid gap-10">
          <div>
            <p className="section-kicker text-white/80">Mountains. Glaciers. World-class fishing.</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl">
              The central community hub for exploring Alaska’s Kenai Peninsula.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80">
              Connect with trusted local businesses, browse activities and events, and build a polished trip plan centered on Kenai, Soldotna, Homer, Seward, and the communities in between.
            </p>
            <div className="mt-8 flex flex-col gap-3 rounded-[1.75rem] bg-white/10 p-3 shadow-glacier backdrop-blur sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-[1.25rem] bg-white/10 px-4 py-3">
                <Search className="h-5 w-5 text-white/70" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search businesses, events, fishing guides, lodging..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/60"
                />
              </div>
              <button onClick={() => navigate('/directory?query=' + encodeURIComponent(query))} className="primary-button bg-white text-alaska-forest hover:bg-white/90">
                Search the hub
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/85">
              {['Salmon fishing', 'Glacier hikes', 'Aurora stays', 'Family itineraries'].map((item) => (
                <span key={item} className="rounded-full border border-white/20 px-4 py-2 backdrop-blur">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-4">
              {[
                { value: '30+', label: 'Featured local businesses' },
                { value: '15+', label: 'Bookable activities' },
                { value: '10+', label: 'Community events live now' },
                { value: '9', label: 'Peninsula communities mapped' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-3xl font-semibold">{stat.value}</p>
                  <p className="mt-2 text-sm text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="panel bg-white/15 text-white dark:bg-white/10">
              <p className="section-kicker text-white/80">Plan your trip</p>
              <h2 className="mt-3 text-2xl font-semibold">Build a custom itinerary in minutes.</h2>
              <p className="mt-3 text-sm text-white/75">
                Choose your dates, interests, and group size. We’ll suggest stays, adventures, dining, and events that fit your pace.
              </p>
              <Link to="/trip-planner" className="primary-button mt-6 bg-white text-alaska-forest hover:bg-white/90">
                Start planning <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 text-alaska-forest dark:text-alaska-aurora">
                  <Trees className="h-5 w-5" />
                  <span className="text-sm font-semibold">Wilderness first</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Built to spotlight glaciers, fishing, wildlife, and locally run operators.</p>
              </div>
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 text-alaska-forest dark:text-alaska-aurora">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-semibold">Community powered</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Event tools, inquiry flows, and business dashboards for the peninsula network.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Featured businesses</p>
            <h2 className="section-title mt-3">Trusted local operators, lodges, and dining favorites.</h2>
          </div>
          <Link to="/directory" className="secondary-button">Browse full directory</Link>
        </div>
        <div className="mt-8 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {featuredBusinesses.map((business, index) => (
              <motion.article
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -6 }}
                className="glass-card min-w-0 flex-[0_0_88%] overflow-hidden sm:flex-[0_0_48%] xl:flex-[0_0_32%]"
              >
                <img src={business.image} alt={business.name} className="h-52 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-alaska-ocean">{business.category}</p>
                      <h3 className="mt-1 text-xl font-semibold">{business.name}</h3>
                    </div>
                    <span className="rounded-full bg-alaska-forest px-3 py-1 text-xs font-semibold text-white">{business.rating.toFixed(1)}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{business.shortDescription}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {business.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-900/5 px-3 py-1 dark:bg-white/10">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/70 py-16 dark:bg-white/5">
        <div className="page-shell grid gap-10 lg:grid-cols-[1fr,1fr]">
          <div>
            <p className="section-kicker">Upcoming events</p>
            <h2 className="section-title mt-3">What’s happening around the peninsula next.</h2>
            <div className="mt-8 grid gap-4">
              {upcomingEvents.map((event, index) => (
                <motion.div key={event.id} initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="glass-card flex gap-4 overflow-hidden p-4">
                  <img src={event.image} alt={event.title} className="h-28 w-28 rounded-2xl object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-alaska-ocean">{event.category}</p>
                    <h3 className="mt-1 text-lg font-semibold">{event.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{format(new Date(event.startDate), 'MMM d • h:mm a')} · {event.venue}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{event.summary}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <p className="section-kicker">Seasonal highlights</p>
            <h2 className="section-title mt-3">Adventure changes beautifully with the seasons.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {seasonalHighlights.map((item, index) => (
                <motion.div key={item.season} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="glass-card p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-alaska-ocean dark:text-alaska-aurora">{item.season}</p>
                  <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
          <div className="panel">
            <div className="flex items-center gap-3 text-alaska-forest dark:text-alaska-aurora">
              <Compass className="h-5 w-5" />
              <p className="section-kicker">Plan by community</p>
            </div>
            <h2 className="mt-3 text-2xl font-semibold">Kenai, Soldotna, Homer, Seward, and beyond.</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Explore waterfront harbor towns, world-class rivers, arts communities, and trail gateways with one connected search experience.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {['Kenai', 'Soldotna', 'Homer', 'Seward', 'Cooper Landing', 'Anchor Point'].map((community) => (
                <div key={community} className="rounded-2xl bg-slate-900/5 px-4 py-3 text-sm dark:bg-white/5">
                  {community}
                </div>
              ))}
            </div>
          </div>
          <div className="panel bg-alaska-forest text-white dark:bg-alaska-pine">
            <div className="flex items-center gap-3 text-white/90">
              <MapPinned className="h-5 w-5" />
              <p className="section-kicker text-white/70">Plan your trip</p>
            </div>
            <h2 className="mt-3 text-2xl font-semibold">Ready for a Kenai itinerary?</h2>
            <p className="mt-3 text-sm text-white/75">
              Tell us when you’re visiting, what you love, and how your group wants to travel. We’ll match you with the right businesses and experiences.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {['Fishing + wildlife', 'Family travel', 'Food + culture'].map((interest) => (
                <div key={interest} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm">
                  {interest}
                </div>
              ))}
            </div>
            <Link to="/trip-planner" className="primary-button mt-6 bg-white text-alaska-forest hover:bg-white/90">Plan your trip now</Link>
          </div>
        </div>
      </section>

      <section className="page-shell pb-16">
        <div className="panel bg-gradient-to-r from-alaska-forest to-alaska-ocean text-white dark:from-alaska-pine dark:to-alaska-ocean">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="section-kicker text-white/70">Live directory coverage</p>
              <h2 className="mt-3 text-3xl font-semibold">Browse {businesses.length} businesses and counting.</h2>
              <p className="mt-3 max-w-2xl text-sm text-white/80">Find guides, stays, restaurants, transportation, services, and community anchors built to support tourism and year-round local life.</p>
            </div>
            <Link to="/directory" className="primary-button bg-white text-alaska-forest hover:bg-white/90">
              Open directory <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
          <CrossTrafficAds />
</>
  )
}
