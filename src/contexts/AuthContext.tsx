import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Role, UserProfile } from '../types'

interface AuthContextValue {
  session: Session | null
  user: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (fullName: string, email: string, password: string, role?: Role) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const demoKey = 'kenai-demo-auth'

function readDemoUser(): UserProfile | null {
  const raw = localStorage.getItem(demoKey)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

function roleFromEmail(email: string): Role {
  if (email.includes('admin')) return 'admin'
  if (email.includes('owner') || email.includes('business')) return 'business_owner'
  return 'visitor'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<UserProfile | null>(readDemoUser())
  const [loading, setLoading] = useState(true)

  const hydrateProfile = useCallback(async (userId: string, email: string) => {
    if (!supabase) return
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .maybeSingle<{ id: string; email: string; full_name: string | null; role: Role }>()
    if (data) {
      setUser({
        id: data.id,
        email: data.email,
        fullName: data.full_name ?? email.split('@')[0],
        role: data.role,
      })
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      if (data.session?.user.email) {
        await hydrateProfile(data.session.user.id, data.session.user.email)
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)
      if (nextSession?.user.email) {
        await hydrateProfile(nextSession.user.id, nextSession.user.email)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [hydrateProfile])

  const signIn = useCallback(async (email: string, _password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      const demoUser: UserProfile = {
        id: email,
        email,
        fullName: email.split('@')[0].replace(/[-_.]/g, ' '),
        role: roleFromEmail(email),
      }
      localStorage.setItem(demoKey, JSON.stringify(demoUser))
      setUser(demoUser)
      setLoading(false)
      return {}
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password: _password })
    return error ? { error: error.message } : {}
  }, [])

  const signUp = useCallback(async (fullName: string, email: string, password: string, role: Role = 'visitor') => {
    if (!isSupabaseConfigured || !supabase) {
      const demoUser: UserProfile = { id: email, email, fullName, role }
      localStorage.setItem(demoKey, JSON.stringify(demoUser))
      setUser(demoUser)
      setLoading(false)
      return {}
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    })
    return error ? { error: error.message } : {}
  }, [])

  const signOut = useCallback(async () => {
    localStorage.removeItem(demoKey)
    setUser(null)
    if (supabase) {
      await supabase.auth.signOut()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [loading, session, signIn, signOut, signUp, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
