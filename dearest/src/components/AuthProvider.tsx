'use client'
import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

const PUBLIC_ROUTES = ['/auth/login', '/auth/register']

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setCouple, reset } = useAppStore()
  const router = useRouter()
  const pathname = usePathname()
  const initialized = useRef(false)

  async function loadProfile(userId: string): Promise<Profile | null> {
    const supabase = createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profile) {
      setProfile(profile)
      if (profile.couple_id) {
        const { data: couple } = await supabase
          .from('couples')
          .select('*')
          .eq('id', profile.couple_id)
          .single()
        if (couple) setCouple(couple)
      }
    }
    return profile
  }

  function redirectAfterAuth(profile: Profile | null) {
    if (!profile?.couple_id) {
      router.push('/onboarding')
    } else {
      router.push('/')
    }
  }

  useEffect(() => {
    const supabase = createClient()

    // Initial session check (runs once)
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const profile = await loadProfile(user.id)
        // Redirect from public routes if already logged in
        if (PUBLIC_ROUTES.includes(pathname)) {
          redirectAfterAuth(profile)
        }
        // Redirect to onboarding if no couple yet (and not already there)
        else if (!profile?.couple_id && pathname !== '/onboarding') {
          router.push('/onboarding')
        }
      } else {
        // Not authenticated — redirect to login unless already on a public route
        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.push('/auth/login')
        }
      }
      initialized.current = true
    }

    initAuth()

    // Listen for auth changes (sign-in / sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!initialized.current) return // Wait for initAuth to complete first

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          const profile = await loadProfile(session.user.id)
          redirectAfterAuth(profile)
        } else if (event === 'SIGNED_OUT') {
          reset()
          router.push('/auth/login')
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{children}</>
}
