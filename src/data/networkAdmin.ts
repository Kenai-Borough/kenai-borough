import { format, subDays } from 'date-fns'
import type {
  NetworkActivityEntry,
  NetworkAdvertiser,
  NetworkAnnouncement,
  NetworkGeoPoint,
  NetworkListing,
  NetworkListingCategory,
  NetworkListingStatus,
  NetworkMetricPoint,
  NetworkReport,
  NetworkSite,
  NetworkSiteConfig,
  NetworkSiteHealthCard,
  NetworkSiteKey,
  NetworkUpgradeRequest,
  NetworkUser,
  RevenueTier,
} from '../types/networkAdmin'

const now = new Date('2026-04-12T12:00:00Z')
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const networkSites: NetworkSite[] = [
  {
    site: 'borough',
    displayName: 'Kenai Borough',
    domain: 'kenaiborough.com',
    accent: '#38bdf8',
    shortName: 'Borough',
    focus: 'Classifieds, business directory, and civic marketplace traffic',
    categoryLabels: ['classifieds', 'businesses'],
  },
  {
    site: 'realty',
    displayName: 'Kenai Borough Realty',
    domain: 'kenaiboroughrealty.com',
    accent: '#818cf8',
    shortName: 'Realty',
    focus: 'Residential and commercial property listings',
    categoryLabels: ['properties'],
  },
  {
    site: 'land',
    displayName: 'Kenai Land Sales',
    domain: 'kenailandsales.com',
    accent: '#34d399',
    shortName: 'Land',
    focus: 'Parcels, acreage, and development opportunities',
    categoryLabels: ['land'],
  },
  {
    site: 'rentals',
    displayName: 'Kenai Peninsula Rentals',
    domain: 'kenaipeninsularentals.com',
    accent: '#f59e0b',
    shortName: 'Rentals',
    focus: 'Vacation stays and long-term rentals across the peninsula',
    categoryLabels: ['rentals'],
  },
  {
    site: 'homes',
    displayName: 'Kenai Home Sales',
    domain: 'kenaihomesales.com',
    accent: '#fb7185',
    shortName: 'Homes',
    focus: 'Single-family homes, cabins, and waterfront homes',
    categoryLabels: ['homes'],
  },
  {
    site: 'auto',
    displayName: 'Kenai Auto Sales',
    domain: 'kenaiautosales.com',
    accent: '#22d3ee',
    shortName: 'Auto',
    focus: 'Vehicles, equipment, and dealer inventory',
    categoryLabels: ['vehicles'],
  },
]

const roleMatrix: Record<NetworkSiteKey, string[]> = {
  borough: ['borough_admin', 'moderator', 'classifieds_seller', 'business_owner'],
  realty: ['realty_admin', 'realty_agent', 'broker'],
  land: ['land_admin', 'land_broker', 'parcel_seller'],
  rentals: ['rentals_admin', 'rental_manager', 'host'],
  homes: ['homes_admin', 'home_specialist', 'builder'],
  auto: ['auto_admin', 'dealer_manager', 'vehicle_seller'],
}

const towns = ['Kenai', 'Soldotna', 'Nikiski', 'Sterling', 'Homer', 'Seward', 'Cooper Landing', 'Kasilof']
const firstNames = ['Avery', 'Sawyer', 'Harper', 'Talon', 'Emerson', 'Juneau', 'Brooks', 'Willow', 'Kai', 'Lena', 'Mason', 'Skye', 'Rowan']
const lastNames = ['Adams', 'Berg', 'Caldwell', 'Dawson', 'Ellis', 'Fisher', 'Gray', 'Holt', 'Iverson', 'Jensen', 'Keller', 'Larson']
const listingAdjectives = ['Aurora', 'Glacier', 'Tundra', 'Ridge', 'Harbor', 'Spruce', 'Midnight', 'Denali', 'Wildflower', 'Driftwood', 'Summit', 'Northern']
const listingNouns = ['Retreat', 'Cabin', 'Parcel', 'Ranch', 'Townhome', 'Pickup', 'Marketplace Booth', 'Guide Service', 'Studio', 'Bungalow', 'SUV', 'Loft']
const reportReasons = ['Fraud concern', 'Spam messaging', 'Duplicate listing', 'Misleading photos', 'Harassment report', 'Pricing discrepancy']
const tiers: RevenueTier[] = ['Free', 'Featured', 'Premium', 'Enterprise']
const categoryBySite: Record<NetworkSiteKey, NetworkListingCategory[]> = {
  borough: ['classifieds', 'businesses'],
  realty: ['properties'],
  land: ['land'],
  rentals: ['rentals'],
  homes: ['homes'],
  auto: ['vehicles'],
}
const listingStatuses: NetworkListingStatus[] = ['active', 'active', 'active', 'pending review', 'flagged', 'expired', 'sold']

function makeTimestamp(daysAgo: number, hourOffset = 0) {
  const stamp = subDays(now, daysAgo)
  stamp.setUTCHours(12 + hourOffset)
  return stamp.toISOString()
}

export const networkUsers: NetworkUser[] = Array.from({ length: 156 }, (_, index) => {
  const site = networkSites[index % networkSites.length]
  const firstName = firstNames[index % firstNames.length]
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length]
  const primaryRoles = roleMatrix[site.site]
  const primaryRole = primaryRoles[index % primaryRoles.length]
  const siteRoles = [primaryRole]

  if (index % 13 === 0) siteRoles.unshift('admin', 'network_admin')
  if (index % 5 === 0) siteRoles.push('moderator')
  if (index % 9 === 0 && site.site !== 'borough') siteRoles.push('business_owner')

  return {
    id: `usr-${index + 1}`,
    fullName: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index + 1}@${site.domain}`,
    phone: `907-555-${String(1100 + index).slice(-4)}`,
    siteRoles: Array.from(new Set(siteRoles)),
    verified: index % 7 !== 0,
    suspended: index % 41 === 0,
    createdAt: makeTimestamp(150 - index % 120),
    lastActiveAt: makeTimestamp(index % 18, index % 6),
    lastActiveSite: networkSites[(index + 2) % networkSites.length].site,
    homeSite: site.site,
    inquiryCount: 4 + (index * 3) % 24,
    listingIds: [],
    avatarHue: (index * 31) % 360,
  }
})

export const networkListings: NetworkListing[] = Array.from({ length: 216 }, (_, index) => {
  const site = networkSites[index % networkSites.length]
  const categories = categoryBySite[site.site]
  const category = categories[index % categories.length]
  const owner = networkUsers[(index * 3) % networkUsers.length]
  const title = `${listingAdjectives[index % listingAdjectives.length]} ${towns[index % towns.length]} ${listingNouns[index % listingNouns.length]}`
  const listing: NetworkListing = {
    id: `lst-${index + 1}`,
    title,
    category,
    site: site.site,
    status: listingStatuses[index % listingStatuses.length],
    ownerId: owner.id,
    priceLabel:
      category === 'vehicles'
        ? currency.format(14500 + index * 640)
        : category === 'land'
          ? currency.format(59000 + index * 1800)
          : category === 'classifieds'
            ? currency.format(120 + index * 14)
            : category === 'businesses'
              ? currency.format(790 + index * 26)
              : currency.format(169000 + index * 3400),
    location: `${towns[(index + 1) % towns.length]}, Alaska`,
    createdAt: makeTimestamp(index % 45, index % 5),
    featured: index % 6 === 0,
    inquiries: 3 + (index * 2) % 19,
    views: 80 + (index * 31) % 900,
  }
  owner.listingIds.push(listing.id)
  return listing
})

export const networkReports: NetworkReport[] = Array.from({ length: 18 }, (_, index) => {
  const targetListing = networkListings[(index * 11) % networkListings.length]
  const reporter = networkUsers[(index * 9 + 7) % networkUsers.length]
  return {
    id: `rpt-${index + 1}`,
    site: targetListing.site,
    reporterId: reporter.id,
    targetType: index % 4 === 0 ? 'user' : index % 5 === 0 ? 'message' : 'listing',
    targetId: index % 4 === 0 ? targetListing.ownerId : targetListing.id,
    reason: reportReasons[index % reportReasons.length],
    details: `${reportReasons[index % reportReasons.length]} reported on ${targetListing.title} after review by ${reporter.fullName}.`,
    status: index < 10 ? 'pending' : index < 13 ? 'reviewed' : index < 16 ? 'resolved' : 'dismissed',
    createdAt: makeTimestamp(index % 9, index % 4),
    targetOwnerId: targetListing.ownerId,
  }
})

export const recentActivity: NetworkActivityEntry[] = [
  ...networkUsers.slice(0, 10).map((user, index) => ({
    id: `act-user-${user.id}`,
    site: user.homeSite,
    action: 'user_signup',
    actorId: user.id,
    actorName: user.fullName,
    targetType: 'user' as const,
    targetId: user.id,
    summary: `${user.fullName} joined ${networkSites.find((item) => item.site === user.homeSite)?.displayName}.`,
    createdAt: makeTimestamp(index % 6, 1),
    tone: 'success' as const,
  })),
  ...networkListings.slice(0, 10).map((listing, index) => ({
    id: `act-listing-${listing.id}`,
    site: listing.site,
    action: 'listing_created',
    actorId: listing.ownerId,
    actorName: networkUsers.find((user) => user.id === listing.ownerId)?.fullName ?? 'Unknown operator',
    targetType: 'listing' as const,
    targetId: listing.id,
    summary: `${listing.title} was published on ${networkSites.find((item) => item.site === listing.site)?.shortName}.`,
    createdAt: makeTimestamp(index % 7, 2),
    tone: listing.status === 'flagged' ? ('warning' as const) : ('info' as const),
  })),
  ...networkReports.slice(0, 8).map((report, index) => ({
    id: `act-report-${report.id}`,
    site: report.site,
    action: 'listing_flagged',
    actorId: report.reporterId,
    actorName: networkUsers.find((user) => user.id === report.reporterId)?.fullName ?? 'Reporter',
    targetType: 'report' as const,
    targetId: report.id,
    summary: `${report.reason} opened for ${report.targetType} ${report.targetId}.`,
    createdAt: makeTimestamp(index % 4, 3),
    tone: report.status === 'resolved' ? ('success' as const) : ('danger' as const),
  })),
].sort((left, right) => right.createdAt.localeCompare(left.createdAt))

export const networkAdvertisers: NetworkAdvertiser[] = Array.from({ length: 16 }, (_, index) => {
  const site = networkSites[index % networkSites.length]
  const tier = tiers[index % tiers.length]
  return {
    id: `adv-${index + 1}`,
    businessName: `${towns[index % towns.length]} ${['Marine', 'Cabins', 'Realty Group', 'Auto House', 'River Tours', 'Contracting'][index % 6]}`,
    tier,
    site: site.site,
    revenue: tier === 'Enterprise' ? 199 : tier === 'Premium' ? 99 : tier === 'Featured' ? 49 : 0,
    expiry: makeTimestamp(-(index * 6 + 10)).slice(0, 10),
    contact: `${['info', 'sales', 'hello'][index % 3]}@${site.domain}`,
    status: index % 6 === 0 ? 'expiring soon' : index % 5 === 0 ? 'trial' : 'active',
  }
})

export const networkUpgradeRequests: NetworkUpgradeRequest[] = Array.from({ length: 6 }, (_, index) => ({
  id: `upg-${index + 1}`,
  businessName: `${towns[index]} ${['Outfitters', 'Properties', 'Lodging', 'Motors', 'Marketplace', 'Escapes'][index]}`,
  site: networkSites[index].site,
  requestedTier: tiers[(index + 1) % tiers.length],
  currentTier: tiers[index % tiers.length],
  createdAt: makeTimestamp(index + 1),
  notes: 'Requested bundle-wide placement plus newsletter inclusion.',
}))

export const networkAnnouncements: NetworkAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Spring seller push',
    message: 'Promote featured inventory across all Kenai network sites through April 30.',
    sites: ['all'],
    type: 'info',
    active: true,
    startsAt: makeTimestamp(2),
  },
  {
    id: 'ann-2',
    title: 'Scheduled billing maintenance',
    message: 'Stripe webhooks will pause for 15 minutes during Sunday evening maintenance.',
    sites: ['borough', 'realty', 'rentals'],
    type: 'maintenance',
    active: true,
    startsAt: makeTimestamp(0),
  },
]

export const networkSiteConfig: NetworkSiteConfig[] = networkSites.map((site, index) => ({
  site: site.site,
  domain: site.domain,
  displayName: site.displayName,
  status: index === 4 ? 'maintenance' : 'active',
  maintenanceMode: index === 4,
  maintenanceMessage: index === 4 ? 'Minor MLS import tuning in progress for home sale pages.' : undefined,
}))

export const siteHealthCards: NetworkSiteHealthCard[] = networkSites.map((site, index) => ({
  ...site,
  status: index === 2 || index === 4 ? 'warning' : 'active',
  lastDeploy: format(subDays(now, index + 1), 'MMM d, yyyy'),
  listingCount: networkListings.filter((listing) => listing.site === site.site && listing.status === 'active').length,
  userCount: networkUsers.filter((user) => user.homeSite === site.site).length,
  uptime: index === 2 ? '99.2%' : '99.98%',
}))

export const overviewStats = {
  totalUsers: networkUsers.length,
  verifiedUsers: networkUsers.filter((user) => user.verified).length,
  totalListings: networkListings.filter((listing) => listing.status === 'active').length,
  weeklyInquiries: networkListings.reduce((sum, listing) => sum + listing.inquiries, 0),
  monthlyRevenue: networkAdvertisers.reduce((sum, advertiser) => sum + advertiser.revenue, 0) + 3400,
  roleBreakdown: [
    { role: 'Admins', count: networkUsers.filter((user) => user.siteRoles.includes('admin')).length },
    { role: 'Moderators', count: networkUsers.filter((user) => user.siteRoles.includes('moderator')).length },
    { role: 'Business owners', count: networkUsers.filter((user) => user.siteRoles.includes('business_owner')).length },
    { role: 'Site operators', count: networkUsers.filter((user) => user.siteRoles.some((role) => role.endsWith('_admin'))).length },
  ],
}

export const userGrowth = Array.from({ length: 8 }, (_, index) => ({
  label: format(subDays(now, 210 - index * 30), 'MMM'),
  users: 45 + index * 14,
  verified: 34 + index * 12,
}))

export const listingsBySite = networkSites.map((site) => ({
  name: site.shortName,
  active: networkListings.filter((listing) => listing.site === site.site && listing.status === 'active').length,
  pending: networkListings.filter((listing) => listing.site === site.site && listing.status === 'pending review').length,
}))

export const inquiriesTrend = Array.from({ length: 7 }, (_, index) => ({
  label: format(subDays(now, 6 - index), 'EEE'),
  inquiries: 48 + index * 6 + (index % 2) * 5,
  messages: 22 + index * 4,
}))

const metricScale: Record<'7d' | '30d' | '90d' | '1y', number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 12,
}

function makeMetrics(points: number, labelFormatter: (index: number) => string): NetworkMetricPoint[] {
  return Array.from({ length: points }, (_, index) => ({
    label: labelFormatter(index),
    pageviews: 2900 + index * 135 + (index % 4) * 190,
    signups: 12 + (index % 5) * 2 + Math.floor(index / 4),
    listings: 9 + (index % 4) * 3 + Math.floor(index / 5),
    inquiries: 21 + (index % 6) * 4,
    transactions: 4 + (index % 3),
    revenue: 1800 + index * 140 + (index % 3) * 120,
  }))
}

export const analyticsByRange: Record<'7d' | '30d' | '90d' | '1y', NetworkMetricPoint[]> = {
  '7d': makeMetrics(metricScale['7d'], (index) => format(subDays(now, 6 - index), 'EEE')),
  '30d': makeMetrics(metricScale['30d'], (index) => format(subDays(now, 29 - index), 'MMM d')),
  '90d': makeMetrics(metricScale['90d'], (index) => `W${index + 1}`),
  '1y': makeMetrics(metricScale['1y'], (index) => format(subDays(now, 330 - index * 30), 'MMM')),
}

export const usersBySite = networkSites.map((site) => ({
  name: site.shortName,
  value: networkUsers.filter((user) => user.homeSite === site.site).length,
  color: site.accent,
}))

export const listingsByCategory = [
  { category: 'Properties', realty: 34, homes: 18, rentals: 0, land: 0, auto: 0, borough: 0 },
  { category: 'Land', realty: 0, homes: 0, rentals: 0, land: 32, auto: 0, borough: 0 },
  { category: 'Rentals', realty: 0, homes: 0, rentals: 33, land: 0, auto: 0, borough: 0 },
  { category: 'Homes', realty: 0, homes: 36, rentals: 0, land: 0, auto: 0, borough: 0 },
  { category: 'Vehicles', realty: 0, homes: 0, rentals: 0, land: 0, auto: 36, borough: 0 },
  { category: 'Community', realty: 0, homes: 0, rentals: 0, land: 0, auto: 0, borough: 27 },
]

export const conversionFunnel = [
  { value: 28400, name: 'Visits', fill: '#38bdf8' },
  { value: 1260, name: 'Signups', fill: '#818cf8' },
  { value: 416, name: 'Listings', fill: '#34d399' },
  { value: 132, name: 'Transactions', fill: '#f59e0b' },
]

export const geoDistribution: NetworkGeoPoint[] = [
  { town: 'Kenai', x: 42, y: 46, users: 42, listings: 31 },
  { town: 'Soldotna', x: 48, y: 48, users: 39, listings: 28 },
  { town: 'Nikiski', x: 34, y: 28, users: 19, listings: 14 },
  { town: 'Sterling', x: 58, y: 44, users: 21, listings: 18 },
  { town: 'Homer', x: 20, y: 78, users: 16, listings: 13 },
  { town: 'Seward', x: 78, y: 34, users: 12, listings: 8 },
  { town: 'Cooper Landing', x: 72, y: 46, users: 9, listings: 7 },
]

export const revenueBySite = networkSites.map((site, index) => ({
  site: site.shortName,
  revenue: 4200 + index * 1150,
  featured: 900 + index * 180,
  premium: 1600 + index * 220,
}))

export const revenueByTier = tiers.map((tier) => ({
  tier,
  revenue:
    tier === 'Enterprise'
      ? 4200
      : tier === 'Premium'
        ? 2900
        : tier === 'Featured'
          ? 1600
          : 520,
}))

export function formatMoney(value: number) {
  return currency.format(value)
}

export function getSiteName(siteKey: NetworkSiteKey) {
  return networkSites.find((site) => site.site === siteKey)?.displayName ?? siteKey
}

export function getUserActivity(userId: string) {
  return recentActivity.filter((entry) => entry.actorId === userId).slice(0, 6)
}

export function getUserListings(userId: string) {
  return networkListings.filter((listing) => listing.ownerId === userId).slice(0, 8)
}
