import { Grid2X2, List, MapPinned, Search, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { useSearchParams } from 'react-router-dom'
import { businesses, directoryCategories } from '../data/businesses'

const markerIcon = L.divIcon({ className: 'custom-pin', html: '<div class="map-pin"></div>', iconSize: [18, 18], iconAnchor: [9, 9] })

export function Directory() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [query, setQuery] = useState(searchParams.get('query') ?? '')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchesQuery = [business.name, business.town, business.description, business.category, business.tags.join(' ')].join(' ').toLowerCase().includes(query.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory
      return matchesQuery && matchesCategory
    })
  }, [query, selectedCategory])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value) {
      setSearchParams({ query: value })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="page-shell py-12">
      <div className="hero-grid gap-6">
        <div>
          <p className="section-kicker">Business directory</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Find trusted businesses all across the Kenai Peninsula.</h1>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
            Search fishing guides, lodging, restaurants, tours, shopping, services, real estate, and transportation with a live peninsula map and filters designed for travelers.
          </p>
        </div>
        <div className="panel">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950">
            <Search className="h-5 w-5 text-slate-500" />
            <input value={query} onChange={(event) => handleSearch(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search by town, service, or business name" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => setSelectedCategory('All')} className={selectedCategory === 'All' ? 'primary-button px-4 py-2 text-xs' : 'secondary-button px-4 py-2 text-xs'}>
              All
            </button>
            {directoryCategories.map((category) => (
              <button key={category} onClick={() => setSelectedCategory(category)} className={selectedCategory === category ? 'primary-button px-4 py-2 text-xs' : 'secondary-button px-4 py-2 text-xs'}>
                {category}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span>{filteredBusinesses.length} businesses</span>
            <span>•</span>
            <span>Live map view</span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="panel overflow-hidden p-3">
          <div className="mb-3 flex items-center justify-between px-3 pt-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <MapPinned className="h-4 w-4" /> Peninsula map
            </div>
          </div>
          <div className="h-[520px] overflow-hidden rounded-[1.5rem]">
            <MapContainer center={[60.3, -150.8]} zoom={7} scrollWheelZoom={false}>
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {filteredBusinesses.map((business) => (
                <Marker key={business.id} position={[business.latitude, business.longitude]} icon={markerIcon}>
                  <Popup>
                    <div className="space-y-1">
                      <strong>{business.name}</strong>
                      <div>{business.category}</div>
                      <div>{business.town}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Showing results for <span className="font-semibold text-slate-900 dark:text-white">{selectedCategory}</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setLayout('grid')} className={layout === 'grid' ? 'primary-button px-4 py-2' : 'secondary-button px-4 py-2'} aria-label="Grid view">
                <Grid2X2 className="h-4 w-4" />
              </button>
              <button onClick={() => setLayout('list')} className={layout === 'list' ? 'primary-button px-4 py-2' : 'secondary-button px-4 py-2'} aria-label="List view">
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className={layout === 'grid' ? 'grid gap-5 md:grid-cols-2' : 'grid gap-4'}>
            {filteredBusinesses.map((business, index) => (
              <motion.article key={business.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.02 }} whileHover={{ y: -4 }} className={layout === 'grid' ? 'glass-card overflow-hidden' : 'glass-card overflow-hidden md:flex'}>
                <img src={business.image} alt={business.name} className={layout === 'grid' ? 'h-48 w-full object-cover' : 'h-48 w-full object-cover md:h-auto md:w-56'} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-alaska-ocean">{business.category}</p>
                      <h2 className="mt-1 text-xl font-semibold">{business.name}</h2>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-3 py-1 text-sm font-semibold dark:bg-white/10">
                      <Star className="h-4 w-4 fill-current text-amber-400" /> {business.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{business.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {business.services.slice(0, 3).map((service) => (
                      <span key={service} className="rounded-full bg-slate-900/5 px-3 py-1 dark:bg-white/10">{service}</span>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">{business.town} · {business.hours}</div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
