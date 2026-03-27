'use client'
import { useEffect, useState } from 'react'
import { format, differenceInDays, isPast } from 'date-fns'
import { id } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'
import BottomNav from '@/components/ui/BottomNav'

export default function MilestonesPage() {
  const { couple, user, milestones, setMilestones } = useAppStore()
  const supabase = createClient()
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [emoji, setEmoji] = useState('🎂')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!couple) return
    supabase
      .from('milestones')
      .select('*')
      .eq('couple_id', couple.id)
      .order('date', { ascending: true })
      .then(({ data }) => data && setMilestones(data))
  }, [couple])

  async function addMilestone(e: React.FormEvent) {
    e.preventDefault()
    if (!couple || !user) return
    setLoading(true)
    const { data } = await supabase
      .from('milestones')
      .insert({ couple_id: couple.id, title, date, emoji })
      .select()
      .single()
    if (data) setMilestones([...milestones, data].sort((a, b) => a.date.localeCompare(b.date)))
    setAdding(false)
    setTitle('')
    setDate('')
    setLoading(false)
  }

  const upcoming = milestones.filter(m => !isPast(new Date(m.date)))
  const past = milestones.filter(m => isPast(new Date(m.date)))

  return (
    <main className="relative min-h-screen max-w-[390px] mx-auto flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-80 h-80 rounded-full bg-lavender/40 blur-[80px] -top-10 -right-10" />
        <div className="absolute w-64 h-64 rounded-full bg-blush/30 blur-[80px] bottom-20 left-0" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-14 pb-32">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="font-serif text-sm italic text-muted">tanggal spesial</p>
            <h1 className="font-serif text-3xl font-light">Milestones</h1>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="w-10 h-10 bg-rose-deep rounded-full flex items-center justify-center shadow-md shadow-rose-deep/30"
          >
            <svg className="w-4 h-4 stroke-white" fill="none" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Add form */}
        {adding && (
          <form onSubmit={addMilestone} className="glass rounded-2xl p-4 mb-6 flex flex-col gap-3">
            <p className="font-serif text-base font-light">Tambah milestone baru</p>
            <div className="flex gap-2 items-center">
              {['🎂','💍','✈️','🏠','🐾','🎓','💐','🌟'].map(e => (
                <button key={e} type="button" onClick={() => setEmoji(e)}
                  className={`text-xl w-9 h-9 rounded-lg flex items-center justify-center ${emoji === e ? 'bg-rose-deep/20 border-2 border-rose-deep' : 'bg-white/50 border border-rose/20'}`}>
                  {e}
                </button>
              ))}
            </div>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nama milestone" required
              className="w-full bg-white/60 border border-rose/20 rounded-xl px-3 py-2.5 text-sm text-text-main placeholder:text-muted/50 focus:outline-none focus:border-rose/50" />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required
              className="w-full bg-white/60 border border-rose/20 rounded-xl px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-rose/50" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setAdding(false)}
                className="flex-1 border border-rose/30 text-muted text-sm py-2.5 rounded-xl">Batal</button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-rose-deep text-white text-sm py-2.5 rounded-xl disabled:opacity-50">
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className="mb-6">
            <p className="font-serif text-sm italic text-muted mb-3">akan datang</p>
            <div className="flex flex-col gap-2.5">
              {upcoming.map(m => {
                const daysLeft = differenceInDays(new Date(m.date), new Date())
                return (
                  <div key={m.id} className="glass rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lavender to-[#d0c0e0] flex items-center justify-center text-2xl flex-shrink-0">
                      {m.emoji ?? '🎂'}
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-base text-text-main">{m.title}</p>
                      <p className="text-[11px] text-muted">{format(new Date(m.date), 'd MMMM yyyy', { locale: id })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-xl font-light text-rose-deep">{daysLeft}</p>
                      <p className="text-[10px] text-muted">hari lagi</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div>
            <p className="font-serif text-sm italic text-muted mb-3">sudah terlewati</p>
            <div className="flex flex-col gap-2.5">
              {[...past].reverse().map(m => (
                <div key={m.id} className="glass rounded-2xl p-4 flex items-center gap-4 opacity-60">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warm to-[#d8c8b0] flex items-center justify-center text-2xl flex-shrink-0">
                    {m.emoji ?? '🎂'}
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-base text-text-main">{m.title}</p>
                    <p className="text-[11px] text-muted">{format(new Date(m.date), 'd MMMM yyyy', { locale: id })}</p>
                  </div>
                  <span className="text-[10px] text-muted">✓</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {milestones.length === 0 && !adding && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <span className="text-5xl">🎂</span>
            <p className="font-serif text-xl italic text-muted">Belum ada milestone</p>
            <button onClick={() => setAdding(true)} className="bg-rose-deep text-white text-sm px-6 py-2.5 rounded-full">
              Tambah milestone pertama
            </button>
          </div>
        )}
      </div>

      <BottomNav active="milestones" />
    </main>
  )
}
