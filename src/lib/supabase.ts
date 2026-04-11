import { createClient } from '@supabase/supabase-js'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'visitor' | 'business_owner' | 'admin'
        }
      }
      businesses: {
        Row: {
          id: string
          owner_id: string
          name: string
          category_id: string | null
          slug: string
          town: string
          description: string
          approved: boolean
        }
      }
    }
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null
