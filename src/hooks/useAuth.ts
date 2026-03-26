'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'

export function useAuth() {
  const { user, setUser, setProfile, setCouple, reset } = useAppStore()
  const router  = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Ambil sesi awal
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) loadProfile(user.id)
    })

    // Dengarkan perubahan auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          reset()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadProfile(userId: string) {
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
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    // Cek apakah sudah punya couple
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('couple_id')
        .eq('id', data.user.id)
        .single()

      if (profile?.couple_id) {
        router.push('/')
      } else {
        router.push('/setup')
      }
    }
  }

  async function signUp(email: string, password: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    if (data.user) {
      // Buat profil
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        display_name: displayName,
      })
      if (profileError) throw profileError
    }

    // Setelah register, selalu ke /setup karena belum punya couple
    router.push('/setup')
  }

  async function signOut() {
    await supabase.auth.signOut()
    reset()
    router.push('/auth/login')
  }

  return { user, signIn, signUp, signOut }
}
