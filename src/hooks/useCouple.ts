'use client'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'

function generateCode(): string {
  // 6 karakter: huruf besar + angka, mudah dibaca (tanpa O, 0, I, 1)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function useCouple() {
  const { user, profile, couple, setProfile, setCouple } = useAppStore()
  const supabase = createClient()

  async function createCouple() {
    if (!user) throw new Error('Kamu belum login')

    // Cek apakah sudah punya couple
    if (couple) return couple

    const invite_code = generateCode()
    const { data, error } = await supabase
      .from('couples')
      .insert({ invite_code })
      .select()
      .single()
    if (error) throw error

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ couple_id: data.id })
      .eq('id', user.id)
    if (profileError) throw profileError

    setCouple(data)
    setProfile({ ...profile!, couple_id: data.id })
    return data
  }

  async function joinCouple(code: string) {
    if (!user) throw new Error('Kamu belum login')

    const { data, error } = await supabase
      .from('couples')
      .select('*')
      .eq('invite_code', code.toUpperCase())
      .single()

    if (error || !data) throw new Error('Kode tidak ditemukan. Periksa kembali.')

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ couple_id: data.id })
      .eq('id', user.id)
    if (profileError) throw profileError

    setCouple(data)
    setProfile({ ...profile!, couple_id: data.id })
    return data
  }

  return { couple, createCouple, joinCouple }
}
