export type NetworkSiteKey = 'borough' | 'realty' | 'land' | 'rentals' | 'homes' | 'auto'
export type NetworkHealthStatus = 'active' | 'warning' | 'down'
export type NetworkListingCategory = 'properties' | 'land' | 'rentals' | 'homes' | 'vehicles' | 'classifieds' | 'businesses'
export type NetworkListingStatus = 'active' | 'pending review' | 'flagged' | 'expired' | 'sold'
export type NetworkReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed'
export type RevenueTier = 'Free' | 'Featured' | 'Premium' | 'Enterprise'

export interface NetworkSite {
  site: NetworkSiteKey
  displayName: string
  domain: string
  accent: string
  shortName: string
  focus: string
  categoryLabels: NetworkListingCategory[]
}

export interface NetworkUser {
  id: string
  fullName: string
  email: string
  phone: string
  siteRoles: string[]
  verified: boolean
  suspended: boolean
  createdAt: string
  lastActiveAt: string
  lastActiveSite: NetworkSiteKey
  homeSite: NetworkSiteKey
  inquiryCount: number
  listingIds: string[]
  avatarHue: number
}

export interface NetworkListing {
  id: string
  title: string
  category: NetworkListingCategory
  site: NetworkSiteKey
  status: NetworkListingStatus
  ownerId: string
  priceLabel: string
  location: string
  createdAt: string
  featured: boolean
  inquiries: number
  views: number
}

export interface NetworkActivityEntry {
  id: string
  site: NetworkSiteKey
  action: string
  actorId: string
  actorName: string
  targetType: 'user' | 'listing' | 'report' | 'advertising'
  targetId: string
  summary: string
  createdAt: string
  tone: 'info' | 'success' | 'warning' | 'danger'
}

export interface NetworkReport {
  id: string
  site: NetworkSiteKey
  reporterId: string
  targetType: 'listing' | 'user' | 'review' | 'message'
  targetId: string
  reason: string
  details: string
  status: NetworkReportStatus
  createdAt: string
  targetOwnerId?: string
}

export interface NetworkAdvertiser {
  id: string
  businessName: string
  tier: RevenueTier
  site: NetworkSiteKey
  revenue: number
  expiry: string
  contact: string
  status: 'active' | 'expiring soon' | 'trial'
}

export interface NetworkUpgradeRequest {
  id: string
  businessName: string
  site: NetworkSiteKey
  requestedTier: RevenueTier
  currentTier: RevenueTier
  createdAt: string
  notes: string
}

export interface NetworkAnnouncement {
  id: string
  title: string
  message: string
  sites: Array<NetworkSiteKey | 'all'>
  type: 'info' | 'warning' | 'maintenance'
  active: boolean
  startsAt: string
  endsAt?: string
}

export interface NetworkSiteConfig {
  site: NetworkSiteKey
  domain: string
  displayName: string
  status: 'active' | 'maintenance' | 'disabled'
  maintenanceMode: boolean
  maintenanceMessage?: string
}

export interface NetworkSiteHealthCard extends NetworkSite {
  status: NetworkHealthStatus
  lastDeploy: string
  listingCount: number
  userCount: number
  uptime: string
}

export interface NetworkMetricPoint {
  label: string
  pageviews: number
  signups: number
  listings: number
  inquiries: number
  transactions: number
  revenue: number
}

export interface NetworkGeoPoint {
  town: string
  x: number
  y: number
  users: number
  listings: number
}
