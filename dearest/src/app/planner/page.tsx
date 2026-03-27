'use client'
import { useState } from 'react'
import BottomNav from '@/components/ui/BottomNav'

const ideas = [
  { emoji: '🌹', title: 'Dinner romantis', sub: 'Restaurant dengan suasana cozy', tag: 'Dinner' },
  { emoji: '🎬', title: 'Movie marathon', sub: 'Nonton film favorit di rumah', tag: 'Santai' },
  { emoji: '☕', title: 'Cafe hopping', sub: 'Jelajahi cafe baru di kota', tag: 'Cafe' },
  { emoji: '🌊', title: 'Piknik tepi pantai', sub: 'Bawa bekal dan nikmati sunset', tag: 'Outdoor' },
  { emoji: '🎨', title: 'Workshop bareng', sub: 'Pottery, melukis, atau memasak', tag: 'Aktivitas' },
  { emoji: '🌿', title: 'Jalan pagi', sub: 'Sarapan di luar sambil jalan santai', tag: 'Sehat' },
]

export default function PlannerPage() {
  const [title, setTitle]     = useState('')
  const [date, setDate]       = useState('')
  const [notes, setNotes]     = useState('')
  const [saved, setSaved]     = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <main className="relative min-h-screen max-w-[390px] mx-auto flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-80 h-80 rounded-full bg-lavender/40 blur-[80px] -top-10 -right-10" />
        <div className="absolute w-64 h-64 rounded-full bg-warm/30 blur-[80px] bottom-10 left-0" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-14 pb-32">
        <div className="mb-8">
          <p className="font-serif text-sm italic text-muted">rencanakan bersama</p>
          <h1 className="font-serif text-3xl font-light">Date Planner</h1>
        </div>

        {/* Plan form */}
        <form onSubmit={handleSave} className="glass rounded-3xl p-5 mb-7 flex flex-col gap-4">
          <p className="font-serif text-lg font-light">Rencana date berikutnya</p>
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Ide date</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Contoh: Nonton bioskop + dinner"
              className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-muted/50 focus:outline-none focus:border-rose/50 transition-colors" />
          </div>
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Tanggal rencana</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-rose/50 transition-colors" />
          </div>
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Catatan</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Detail tempat, waktu, atau hal yang perlu disiapkan..."
              rows={3}
              className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-muted/50 focus:outline-none focus:border-rose/50 resize-none font-serif" />
          </div>
          <button type="submit"
            className={`w-full text-sm py-3.5 rounded-xl transition-all ${saved ? 'bg-green-400 text-white' : 'bg-rose-deep text-white hover:bg-[#96505c]'}`}>
            {saved ? '✓ Tersimpan!' : 'Simpan rencana'}
          </button>
        </form>

        {/* Idea suggestions */}
        <div>
          <p className="font-serif text-sm italic text-muted mb-3">butuh inspirasi?</p>
          <div className="flex flex-col gap-2.5">
            {ideas.map((idea) => (
              <button key={idea.title} type="button"
                onClick={() => setTitle(idea.title)}
                className="glass rounded-2xl p-4 flex items-center gap-4 text-left hover:-translate-y-0.5 transition-transform duration-200 w-full">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blush to-[#e8b4ba] flex items-center justify-center text-2xl flex-shrink-0">
                  {idea.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-serif text-sm text-text-main">{idea.title}</p>
                  <p className="text-[11px] text-muted">{idea.sub}</p>
                </div>
                <span className="text-[10px] text-rose-deep bg-rose-deep/10 px-2 py-0.5 rounded-full flex-shrink-0">
                  {idea.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="dates" />
    </main>
  )
}
