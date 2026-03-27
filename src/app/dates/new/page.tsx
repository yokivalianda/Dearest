'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'

const moods = ['🌹', '☕', '🎬', '🌊', '🌿', '🎉', '🍜', '🏙️', '🌙', '✨']

export default function NewDatePage() {
  const router = useRouter()
  const { user, couple, addDate } = useAppStore()
  const supabase = createClient()

  const [title, setTitle]       = useState('')
  const [date, setDate]         = useState(new Date().toISOString().split('T')[0])
  const [location, setLocation] = useState('')
  const [mood, setMood]         = useState('')
  const [rating, setRating]     = useState(0)
  const [notes, setNotes]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!couple || !user) { setError('Kamu belum terhubung dengan pasangan'); return }
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await supabase
        .from('dates')
        .insert({
          couple_id: couple.id,
          created_by: user.id,
          title,
          date,
          location: location || null,
          mood: mood || null,
          rating: rating || null,
          notes: notes || null,
        })
        .select()
        .single()
      if (err) throw err
      if (data) addDate(data)
      router.push('/dates')
    } catch (err: any) {
      setError(err.message ?? 'Gagal menyimpan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen max-w-[390px] mx-auto flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-80 h-80 rounded-full bg-blush/40 blur-[80px] -top-16 -right-10" />
        <div className="absolute w-64 h-64 rounded-full bg-warm/30 blur-[80px] bottom-16 -left-10" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-14 pb-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="w-9 h-9 glass rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 stroke-text-main" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <p className="font-serif text-sm italic text-muted">ceritakan momennya</p>
            <h1 className="font-serif text-2xl font-light">Date baru</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Judul date *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Contoh: Makan malam di Plataran"
              required
              className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-muted/50 focus:outline-none focus:border-rose/50 transition-colors"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Tanggal *</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-rose/50 transition-colors"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Lokasi</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Nama tempat / kota"
              className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-muted/50 focus:outline-none focus:border-rose/50 transition-colors"
            />
          </div>

          {/* Mood */}
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider block mb-2">Suasana</label>
            <div className="flex flex-wrap gap-2">
              {moods.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m === mood ? '' : m)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    mood === m
                      ? 'bg-rose-deep/20 border-2 border-rose-deep scale-110'
                      : 'bg-white/60 border border-rose/20 hover:bg-white/80'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider block mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n === rating ? 0 : n)}
                  className={`text-2xl transition-transform hover:scale-110 ${n <= rating ? 'text-rose' : 'text-muted/30'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Catatan</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ceritakan momen ini... apa yang paling berkesan?"
              rows={4}
              className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-muted/50 focus:outline-none focus:border-rose/50 transition-colors resize-none font-serif"
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-400 bg-red-50 rounded-xl px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-deep text-white text-sm py-4 rounded-xl hover:bg-[#96505c] transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? 'Menyimpan...' : 'Simpan kenangan ♡'}
          </button>
        </form>
      </div>
    </main>
  )
}
