import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type Profile  = Database['public']['Tables']['profiles']['Row']
type Couple   = Database['public']['Tables']['couples']['Row']
type DateRow  = Database['public']['Tables']['dates']['Row']
type Milestone = Database['public']['Tables']['milestones']['Row']

interface AppState {
  user:       User | null
  profile:    Profile | null
  couple:     Couple | null
  dates:      DateRow[]
  milestones: Milestone[]

  setUser:       (user: User | null) => void
  setProfile:    (profile: Profile | null) => void
  setCouple:     (couple: Couple | null) => void
  setDates:      (dates: DateRow[]) => void
  setMilestones: (milestones: Milestone[]) => void
  addDate:       (date: DateRow) => void
  reset:         () => void
}

export const useAppStore = create<AppState>((set) => ({
  user:       null,
  profile:    null,
  couple:     null,
  dates:      [],
  milestones: [],

  setUser:       (user)       => set({ user }),
  setProfile:    (profile)    => set({ profile }),
  setCouple:     (couple)     => set({ couple }),
  setDates:      (dates)      => set({ dates }),
  setMilestones: (milestones) => set({ milestones }),
  addDate:       (date)       => set((s) => ({ dates: [date, ...s.dates] })),
  reset:         ()           => set({ user: null, profile: null, couple: null, dates: [], milestones: [] }),
}))
