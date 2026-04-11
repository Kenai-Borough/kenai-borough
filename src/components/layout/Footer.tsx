const sisterSites = [
  { name: 'Alaska Guide Search', href: 'https://alaskaguidesearch.com' },
  { name: 'Alaska Listings', href: 'https://alaskalistings.com' },
  { name: 'Alaska Metals Exchange', href: 'https://alaskametalsexchange.com' },
  { name: 'Juneau Air Work', href: 'https://juneauairwork.com' },
  { name: 'Kenai Auto Sales', href: 'https://kenaiautosales.com' },
  { name: 'Kenai Land Sales', href: 'https://kenailandsales.com' },
  { name: 'Kenai Listings', href: 'https://kenailistings.com' },
  { name: 'Kenai Peninsula Rentals', href: 'https://kenaipeninsularentals.com' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/60 bg-slate-950 text-white dark:border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr,0.8fr] lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-alaska-aurora">Kenai network</p>
          <h2 className="mt-3 text-3xl font-semibold">The central hub for Peninsula visitors, residents, and businesses.</h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-300">
            Discover local stories, book unforgettable adventures, support community events, and connect with businesses across Kenai, Soldotna, Homer, Seward, Cooper Landing, Sterling, Nikiski, and beyond.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">Sister sites</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {sisterSites.map((site) => (
              <a key={site.name} href={site.href} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:border-alaska-aurora/50 hover:bg-white/5" target="_blank" rel="noreferrer">
                {site.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
