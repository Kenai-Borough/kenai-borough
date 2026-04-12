import { motion } from 'framer-motion'
import { ArrowRight, BedDouble, Briefcase, Building2, CarFront, House, Newspaper, Trees } from 'lucide-react'

const promos = [
  { icon: Building2, title: "Buy or Sell Property", description: "Compare FSBO-ready homes, pricing tools, and seller workflows built for the peninsula.", href: "https://kenaiboroughrealty.com", cta: "Visit realty", panelClass: "from-cyan-500/15 to-slate-950/0", accentClass: "bg-cyan-400" },
  { icon: Trees, title: "Find Your Perfect Land", description: "Browse acreage, waterfront parcels, and off-grid lots across the Kenai Peninsula.", href: "https://kenailandsales.com", cta: "Explore land", panelClass: "from-emerald-500/15 to-slate-950/0", accentClass: "bg-emerald-400" },
  { icon: BedDouble, title: "Vacation Rentals & Cabins", description: "Line up lodges, cabins, and longer stays before your trip or relocation begins.", href: "https://kenaipeninsularentals.com", cta: "See rentals", panelClass: "from-amber-500/15 to-slate-950/0", accentClass: "bg-amber-400" },
  { icon: House, title: "Homes for Sale", description: "Jump straight into local home searches with neighborhood context and buyer tools.", href: "https://kenaihomesales.com", cta: "Browse homes", panelClass: "from-sky-500/15 to-slate-950/0", accentClass: "bg-sky-400" },
  { icon: CarFront, title: "Vehicles & Equipment", description: "Need a truck, trailer, snowmachine, or work rig for your Alaska plans?", href: "https://kenaiautosales.com", cta: "Shop vehicles", panelClass: "from-orange-500/15 to-slate-950/0", accentClass: "bg-orange-400" },
  { icon: Briefcase, title: "Classifieds & Jobs", description: "Find services, jobs, gear, and community listings from around the borough.", href: "https://kenailistings.com", cta: "Open classifieds", panelClass: "from-lime-500/15 to-slate-950/0", accentClass: "bg-lime-400" },
  { icon: Newspaper, title: "Local News", description: "Stay current with local headlines, borough updates, and Peninsula stories.", href: "https://kenainews.com", cta: "Read news", panelClass: "from-fuchsia-500/15 to-slate-950/0", accentClass: "bg-fuchsia-400" },
] as const

export function CrossTrafficAds() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-8 shadow-xl dark:border-white/10 dark:bg-white/5">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-alaska-ocean dark:text-alaska-aurora">Kenai Peninsula network</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Keep your search moving across the Kenai ecosystem.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">Helpful next steps from sister sites across the peninsula—property, rentals, vehicles, classifieds, and local guides that fit the moment naturally.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {promos.map((promo, index) => {
            const Icon = promo.icon
            return (
              <motion.a
                key={promo.href}
                href={promo.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className={"relative overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/95 p-6 shadow-lg transition dark:border-white/10 dark:bg-slate-950/50" + ' bg-gradient-to-br ' + promo.panelClass}
              >
                <span className={'absolute inset-y-4 left-0 w-1 rounded-full ' + promo.accentClass} />
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-slate-900 dark:bg-white/5 dark:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">{promo.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{promo.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-alaska-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-alaska-ocean">
                  {promo.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
