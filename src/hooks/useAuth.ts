'use client'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'

/**
 * useAuth — hanya expose action (signIn, signUp, signOut).
 * State management & redirect dihandle oleh AuthProvider di layout.
 */
export function useAuth() {
  const { user } = useAppStore()

  async function signIn(email: string, password: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    // Redirect dihandle oleh AuthProvider via onAuthStateChange
  }

  async function signUp(email: string, password: string, displayName: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        display_name: displayName,
      })
    }
    // Redirect dihandle oleh AuthProvider via onAuthStateChange
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    // Redirect dihandle oleh AuthProvider via onAuthStateChange
  }

  return { user, signIn, signUp, signOut }
}
