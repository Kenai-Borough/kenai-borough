export type Role = 'visitor' | 'business_owner' | 'admin'
export type Season = 'spring' | 'summer' | 'fall' | 'winter'
export type DirectoryCategory =
  | 'Fishing Guides'
  | 'Lodging'
  | 'Restaurants'
  | 'Tours'
  | 'Shopping'
  | 'Services'
  | 'Real Estate'
  | 'Transportation'

export interface Business {
  id: string
  name: string
  slug: string
  category: DirectoryCategory
  town: string
  latitude: number
  longitude: number
  address: string
  phone: string
  email: string
  website: string
  description: string
  shortDescription: string
  rating: number
  reviewCount: number
  image: string
  gallery: string[]
  services: string[]
  tags: string[]
  hours: string
  featured: boolean
}

export interface Activity {
  id: string
  businessId: string
  title: string
  category: string
  town: string
  seasons: Season[]
  description: string
  duration: string
  price: string
  difficulty: 'Easy' | 'Moderate' | 'Challenging'
  groupSize: string
  image: string
  highlights: string[]
}

export interface EventItem {
  id: string
  title: string
  category: 'Arts' | 'Sports' | 'Markets' | 'Festivals' | 'Community'
  town: string
  venue: string
  summary: string
  description: string
  startDate: string
  endDate: string
  priceLabel: string
  image: string
  featured: boolean
}

export interface Inquiry {
  id: string
  businessName: string
  guestName: string
  email: string
  message: string
  travelDates: string
  status: 'new' | 'replied' | 'archived'
  receivedAt: string
}

export interface AnalyticsPoint {
  label: string
  views: number
  clicks: number
  inquiries: number
}

export interface UserProfile {
  id: string
  email: string
  fullName: string
  role: Role
}

export interface ToastState {
  title: string
  description: string
  variant?: 'success' | 'info' | 'error'
}
