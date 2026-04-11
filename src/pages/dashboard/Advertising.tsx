const tiers = [
  { name: 'Free', price: '$0', details: 'Basic listing, directory presence, and map pin.', perks: ['Directory listing', 'Map visibility', 'Public contact details'] },
  { name: 'Featured', price: '$49/mo', details: 'Elevated listing for businesses ready to grow visibility.', perks: ['Featured badge', 'Preferred search placement', 'Seasonal highlight eligibility'] },
  { name: 'Premium', price: '$99/mo', details: 'Home page priority and richer promotional placement.', perks: ['Home page carousel opportunities', 'Analytics upgrades', 'Lead priority support'] },
  { name: 'Enterprise', price: 'Custom', details: 'For networks, destination partners, and multi-location operators.', perks: ['Network placements', 'Campaign support', 'Custom integrations'] },
]

export function Advertising() {
  return (
    <div className="page-shell py-12">
      <div className="max-w-4xl">
        <p className="section-kicker">Advertising</p>
        <h1 className="mt-3 text-4xl font-semibold">Choose the right visibility tier for your Kenai Borough business.</h1>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier) => (
          <div key={tier.name} className={tier.name === 'Premium' ? 'panel bg-alaska-forest text-white dark:bg-alaska-pine' : 'panel'}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-alaska-ocean dark:text-alaska-aurora">{tier.name}</p>
            <h2 className="mt-4 text-3xl font-semibold">{tier.price}</h2>
            <p className="mt-3 text-sm opacity-80">{tier.details}</p>
            <ul className="mt-5 space-y-2 text-sm opacity-90">
              {tier.perks.map((perk) => (
                <li key={perk}>• {perk}</li>
              ))}
            </ul>
            <button className={tier.name === 'Premium' ? 'primary-button mt-6 bg-white text-alaska-forest hover:bg-white/90' : 'primary-button mt-6'}>Choose tier</button>
          </div>
        ))}
      </div>
    </div>
  )
}
