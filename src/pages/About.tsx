import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'

const communities = [
  { name: 'Kenai', latitude: 60.5544, longitude: -151.2583 },
  { name: 'Soldotna', latitude: 60.4864, longitude: -151.0623 },
  { name: 'Homer', latitude: 59.6425, longitude: -151.5483 },
  { name: 'Seward', latitude: 60.1042, longitude: -149.4421 },
  { name: 'Cooper Landing', latitude: 60.4869, longitude: -149.8284 },
  { name: 'Sterling', latitude: 60.5375, longitude: -150.7637 },
  { name: 'Nikiski', latitude: 60.6903, longitude: -151.2888 },
  { name: 'Anchor Point', latitude: 59.7787, longitude: -151.831 },
  { name: 'Ninilchik', latitude: 60.048, longitude: -151.666 },
  { name: 'Clam Gulch', latitude: 60.2263, longitude: -151.3926 },
  { name: 'Kasilof', latitude: 60.3416, longitude: -151.2903 },
]

const markerIcon = L.divIcon({ className: 'custom-pin', html: '<div class="map-pin"></div>', iconSize: [18, 18], iconAnchor: [9, 9] })

export function About() {
  return (
    <div className="page-shell py-12">
      <div className="hero-grid gap-8">
        <div>
          <p className="section-kicker">About the peninsula</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">A rugged, creative, wildlife-rich region shaped by glaciers and community.</h1>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
            The Kenai Peninsula stretches from the road-accessible river corridor to coastal harbor towns and glacier-fed fjords. It is one of Alaska’s signature destinations for anglers, artists, wildlife lovers, and independent travelers.
          </p>
        </div>
        <div className="panel bg-alaska-forest text-white dark:bg-alaska-pine">
          <h2 className="text-2xl font-semibold">Snapshot</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>• Geography: river systems, coastal bluffs, fjords, alpine ridges, and massive icefields.</li>
            <li>• History: Dena’ina homelands, Russian colonial influence, fishing culture, and homestead resilience.</li>
            <li>• Wildlife: salmon, moose, bears, otters, eagles, puffins, whales, and migratory birds.</li>
            <li>• Climate: cool maritime summers, vibrant shoulder seasons, and snowy aurora-friendly winters.</li>
          </ul>
        </div>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <h2 className="text-2xl font-semibold">Geography and access</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            The peninsula blends road-trip accessibility with true wilderness scale. Visitors can base in Kenai or Soldotna for river access, continue south to Homer for coastal culture and Kachemak Bay, or head east to Seward for glacier and fjord exploration in Kenai Fjords country.
          </p>
          <h3 className="mt-6 text-xl font-semibold">History and culture</h3>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Communities across the peninsula are shaped by Dena’ina stewardship, working harbors, commercial and sport fishing, artists, makers, and small business owners who keep the region connected year-round.
          </p>
        </div>
        <div className="panel">
          <h2 className="text-2xl font-semibold">Wildlife and climate</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Summer is famous for salmon, long daylight, and boat traffic; fall brings color and calmer pacing; winter offers dog sledding and aurora photography; spring wakes up birding, wildlife migrations, and shoulder-season explorations.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {['Glaciers', 'Salmon runs', 'Aurora nights', 'Coastal wildlife'].map((item) => (
              <div key={item} className="rounded-[1.5rem] bg-slate-900/5 p-4 text-sm dark:bg-white/5">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Gallery placeholders</p>
            <h2 className="section-title mt-3">Imagery slots for mountains, rivers, glaciers, and wildlife.</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['Mountain sunrise', 'Glacier overlook', 'Kenai River salmon run', 'Harbor culture'].map((item, index) => (
            <div key={item} className="glass-card overflow-hidden">
              <div className="h-56 bg-gradient-to-br from-alaska-forest via-alaska-ocean to-alaska-sky opacity-90" />
              <div className="p-4">
                <p className="text-sm font-semibold">Placeholder {index + 1}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 panel overflow-hidden p-3">
        <div className="px-3 py-3">
          <p className="section-kicker">Community map</p>
          <h2 className="mt-2 text-2xl font-semibold">From Kenai and Soldotna to Homer, Seward, and Anchor Point.</h2>
        </div>
        <div className="h-[520px] overflow-hidden rounded-[1.5rem]">
          <MapContainer center={[60.15, -150.8]} zoom={7} scrollWheelZoom={false}>
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {communities.map((community) => (
              <Marker key={community.name} position={[community.latitude, community.longitude]} icon={markerIcon}>
                <Popup>{community.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>
    </div>
  )
}
