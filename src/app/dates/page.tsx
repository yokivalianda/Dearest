'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'
import BottomNav from '@/components/ui/BottomNav'

const moodBg: Record<string, string> = {
  '🌹': 'from-blush to-[#e8b4ba]',
  '☕': 'from-warm to-[#d8c8b0]',
  '🎬': 'from-[#dde8f5] to-[#c8d8ee]',
  '🌊': 'from-[#d8eef5] to-[#b8d8ee]',
  '🌿': 'from-[#e0eed8] to-[#c4ddb0]',
}

export default function DatesPage() {
  const supabase = createClient()
  const { couple, dates, setDates } = useAppStore()

  useEffect(() => {
    if (!couple) return
    const coupleId = couple.id
    supabase
      .from('dates')
      .select('*')
      .eq('couple_id', coupleId)
      .order('date', { ascending: false })
      .then(({ data }) => data && setDates(data))
  }, [couple?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="relative min-h-screen max-w-[390px] mx-auto flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-80 h-80 rounded-full bg-blush/35 blur-[80px] -top-16 -right-10" />
        <div className="absolute w-64 h-64 rounded-full bg-lavender/30 blur-[80px] bottom-20 -left-10" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-14 pb-32">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="font-serif text-sm italic text-muted">semua kenangan</p>
            <h1 className="font-serif text-3xl font-light">Date Journal</h1>
          </div>
          <Link
            href="/dates/new"
            className="w-10 h-10 bg-rose-deep rounded-full flex items-center justify-center shadow-md shadow-rose-deep/30"
          >
            <svg className="w-4 h-4 stroke-white" fill="none" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </Link>
        </div>

        {dates.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <span className="text-5xl">🌸</span>
            <p className="font-serif text-xl italic text-muted">Belum ada kenangan tersimpan</p>
            <Link href="/dates/new" className="bg-rose-deep text-white text-sm px-6 py-2.5 rounded-full mt-2">
              Catat date pertama
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {dates.map((d) => (
              <Link
                key={d.id}
                href={`/dates/${d.id}`}
                className="glass rounded-2xl p-4 flex gap-4 hover:-translate-y-0.5 transition-transform duration-200"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${moodBg[d.mood ?? ''] ?? 'from-blush to-[#e8b4ba]'} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {d.mood ?? '✨'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-serif text-base text-text-main leading-snug">{d.title}</p>
                    {d.rating && (
                      <span className="text-[10px] text-rose flex-shrink-0">{'★'.repeat(d.rating)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {d.location && (
                      <span className="text-[10px] text-rose-deep bg-rose-deep/10 px-2 py-0.5 rounded-full">
                        {d.location}
                      </span>
                    )}
                    <span className="text-[11px] text-muted">
                      {format(new Date(d.date), 'd MMM yyyy', { locale: id })}
                    </span>
                  </div>
                  {d.notes && (
                    <p className="text-[11px] text-muted mt-1.5 line-clamp-1">{d.notes}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="dates" />
    </main>
  )
}
