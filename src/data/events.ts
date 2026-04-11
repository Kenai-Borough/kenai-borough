import { addDays, format, startOfToday } from 'date-fns'
import type { AnalyticsPoint, EventItem, Inquiry } from '../types'

const images = [
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
]

const today = startOfToday()

export const events: EventItem[] = [
  { id: 'e1', title: 'Kenai River Summer Kickoff Market', category: 'Markets', town: 'Soldotna', venue: 'Soldotna Creek Park', summary: 'Food trucks, makers, live music, and opening-weekend river specials.', description: 'Shop local makers, meet guides, and kick off salmon season with live music by the river.', startDate: format(addDays(today, 3), "yyyy-MM-dd'T'10:00:00"), endDate: format(addDays(today, 3), "yyyy-MM-dd'T'16:00:00"), priceLabel: 'Free', image: images[0], featured: true },
  { id: 'e2', title: 'Homer Harbor Arts Walk', category: 'Arts', town: 'Homer', venue: 'Homer Spit & Downtown', summary: 'Gallery openings, waterfront performances, and artist demos.', description: 'An all-evening arts crawl from downtown studios to harbor pop-up performances.', startDate: format(addDays(today, 6), "yyyy-MM-dd'T'17:00:00"), endDate: format(addDays(today, 6), "yyyy-MM-dd'T'21:00:00"), priceLabel: 'Free', image: images[1], featured: false },
  { id: 'e3', title: 'Seward Glacier Bluegrass Weekend', category: 'Festivals', town: 'Seward', venue: 'Waterfront Park', summary: 'A beloved weekend of music, food vendors, and glacier-town energy.', description: 'Spend the weekend enjoying bluegrass sets, family programming, and waterfront food stalls.', startDate: format(addDays(today, 12), "yyyy-MM-dd'T'12:00:00"), endDate: format(addDays(today, 14), "yyyy-MM-dd'T'21:00:00"), priceLabel: '$45 weekend pass', image: images[2], featured: true },
  { id: 'e4', title: 'Cooper Landing River Cleanup & BBQ', category: 'Community', town: 'Cooper Landing', venue: 'Community Hall', summary: 'A stewardship day followed by salmon burgers and live acoustic music.', description: 'Volunteer river cleanup, youth activities, and a late afternoon BBQ overlooking the river.', startDate: format(addDays(today, 8), "yyyy-MM-dd'T'09:00:00"), endDate: format(addDays(today, 8), "yyyy-MM-dd'T'15:00:00"), priceLabel: 'Free', image: images[0], featured: false },
  { id: 'e5', title: 'Kenai Peninsula Marathon', category: 'Sports', town: 'Kenai', venue: 'Kenai Recreation Center', summary: 'Marathon, relay, and 10K routes with broad inlet views.', description: 'A scenic endurance weekend with local vendors, kids races, and community cheering zones.', startDate: format(addDays(today, 18), "yyyy-MM-dd'T'07:00:00"), endDate: format(addDays(today, 18), "yyyy-MM-dd'T'13:00:00"), priceLabel: '$95 entry', image: images[1], featured: true },
  { id: 'e6', title: 'Ninilchik Salmon Derby', category: 'Sports', town: 'Ninilchik', venue: 'Ninilchik Harbor', summary: 'Friendly competition with youth division and dockside celebration.', description: 'Register a catch, enjoy food vendors, and celebrate a classic peninsula fishing weekend.', startDate: format(addDays(today, 26), "yyyy-MM-dd'T'05:00:00"), endDate: format(addDays(today, 27), "yyyy-MM-dd'T'18:00:00"), priceLabel: '$35 registration', image: images[2], featured: false },
  { id: 'e7', title: 'Sterling Midnight Sun Makers Fair', category: 'Markets', town: 'Sterling', venue: 'Sterling Community Center', summary: 'Late-night shopping, local food, and handcrafted gifts.', description: 'A community maker fair with food trucks, youth art, and local artisan booths.', startDate: format(addDays(today, 10), "yyyy-MM-dd'T'15:00:00"), endDate: format(addDays(today, 10), "yyyy-MM-dd'T'22:00:00"), priceLabel: 'Free', image: images[0], featured: false },
  { id: 'e8', title: 'Bear Creek Trail Run', category: 'Sports', town: 'Seward', venue: 'Bear Creek Trailhead', summary: 'Short and long courses through alpine scenery.', description: 'Trail racing meets community picnic energy with an awards ceremony by the creek.', startDate: format(addDays(today, 15), "yyyy-MM-dd'T'08:30:00"), endDate: format(addDays(today, 15), "yyyy-MM-dd'T'13:00:00"), priceLabel: '$30 registration', image: images[1], featured: false },
  { id: 'e9', title: 'Kenai Community Bonfire Night', category: 'Community', town: 'Kenai', venue: 'Kenai Beach', summary: 'Beach bonfires, food pop-ups, and aurora watching if skies cooperate.', description: 'Bring blankets, enjoy live acoustic sets, and connect with residents and travelers on the beach.', startDate: format(addDays(today, 4), "yyyy-MM-dd'T'19:00:00"), endDate: format(addDays(today, 4), "yyyy-MM-dd'T'23:00:00"), priceLabel: 'Free', image: images[2], featured: false },
  { id: 'e10', title: 'Homer Harvest Festival', category: 'Festivals', town: 'Homer', venue: 'Homer Farmers Market', summary: 'Produce, chef demos, and family-focused peninsula flavors.', description: 'Celebrate the shoulder season with local produce, chef demos, and community music.', startDate: format(addDays(today, 34), "yyyy-MM-dd'T'11:00:00"), endDate: format(addDays(today, 34), "yyyy-MM-dd'T'18:00:00"), priceLabel: '$10 admission', image: images[0], featured: false },
]

export const analyticsSeries: AnalyticsPoint[] = [
  { label: 'Jan', views: 2100, clicks: 620, inquiries: 48 },
  { label: 'Feb', views: 2350, clicks: 710, inquiries: 56 },
  { label: 'Mar', views: 3100, clicks: 940, inquiries: 74 },
  { label: 'Apr', views: 4200, clicks: 1320, inquiries: 102 },
  { label: 'May', views: 5600, clicks: 1700, inquiries: 144 },
  { label: 'Jun', views: 7200, clicks: 2240, inquiries: 182 },
]

export const sampleInquiries: Inquiry[] = [
  { id: 'i1', businessName: 'Kenai River Drift Company', guestName: 'Amelia Brooks', email: 'amelia@example.com', message: 'We are visiting in July and want a family-friendly sockeye trip plus lodging recommendations.', travelDates: 'July 12 - July 16', status: 'new', receivedAt: '2 hours ago' },
  { id: 'i2', businessName: 'Seward Glacier Lodge', guestName: 'Marcus Hill', email: 'marcus@example.com', message: 'Can you help coordinate a two-night stay with an Exit Glacier tour and shuttle?', travelDates: 'August 3 - August 5', status: 'replied', receivedAt: 'Yesterday' },
  { id: 'i3', businessName: 'Kachemak Air Journeys', guestName: 'Priya Shah', email: 'priya@example.com', message: 'Interested in bear viewing for 4 adults and need transfer guidance from Homer.', travelDates: 'September 10 - September 12', status: 'new', receivedAt: 'Today' },
]
