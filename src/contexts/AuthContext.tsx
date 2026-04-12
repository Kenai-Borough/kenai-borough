import { useMemo, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Role, UserProfile } from '../types'
import { KenaiAuthProvider, useKenaiAuth } from './KenaiAuthContext'

interface AuthContextValue {
  session: Session | null
  user: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (fullName: string, email: string, password: string, role?: Role) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

export function AuthProvider(props: { children: ReactNode }) {
  return <KenaiAuthProvider>{props.children}</KenaiAuthProvider>
}

export function useAuth(): AuthContextValue {
  const auth = useKenaiAuth()
  return useMemo(function () {
    return {
      session: auth.session,
      user: auth.user
        ? {
            id: auth.user.id,
            email: auth.user.email,
            fullName: auth.user.fullName,
            role: (auth.user.isAdmin ? 'admin' : auth.user.currentSiteRole) as Role,
          }
        : null,
      loading: auth.loading,
      signIn: async function (email: string, password: string) {
        try {
          await auth.signIn(email, password)
          return {}
        } catch (caught) {
          return { error: caught instanceof Error ? caught.message : 'Unable to sign in.' }
        }
      },
      signUp: async function (fullName: string, email: string, password: string, role: Role = 'visitor') {
        try {
          await auth.signUp(email, password, fullName, role)
          return {}
        } catch (caught) {
          return { error: caught instanceof Error ? caught.message : 'Unable to create an account.' }
        }
      },
      signOut: auth.signOut,
    }
  }, [auth])
}
