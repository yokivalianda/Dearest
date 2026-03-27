'use client'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function useCouple() {
  const { user, profile, couple, setProfile, setCouple } = useAppStore()
  const supabase = createClient()

  async function createCouple() {
    if (!user) throw new Error('Not authenticated')
    const invite_code = generateCode()
    const { data, error } = await supabase
      .from('couples')
      .insert({ invite_code })
      .select()
      .single()
    if (error) throw error
    await supabase.from('profiles').update({ couple_id: data.id }).eq('id', user.id)
    setCouple(data)
    setProfile({ ...profile!, couple_id: data.id })
    return data
  }

  async function joinCouple(code: string) {
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase
      .from('couples')
      .select('*')
      .eq('invite_code', code.toUpperCase())
      .single()
    if (error || !data) throw new Error('Kode tidak ditemukan')
    await supabase.from('profiles').update({ couple_id: data.id }).eq('id', user.id)
    setCouple(data)
    setProfile({ ...profile!, couple_id: data.id })
    return data
  }

  return { couple, createCouple, joinCouple }
}
