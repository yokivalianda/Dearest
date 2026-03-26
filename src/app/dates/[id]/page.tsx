'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'
import type { Database } from '@/lib/supabase/types'

type DateRow = Database['public']['Tables']['dates']['Row']

export default function DateDetailPage() {
  const router   = useRouter()
  const params   = useParams()
  const supabase = createClient()
  const { dates, setDates } = useAppStore()

  const [date, setDate]       = useState<DateRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)

  useEffect(() => {
    const dateId = params.id as string

    // Coba dari store dulu (sudah ada di cache)
    const cached = dates.find(d => d.id === dateId)
    if (cached) {
      setDate(cached)
      setLoading(false)
      return
    }

    // Kalau tidak ada, fetch dari Supabase
    supabase
      .from('dates')
      .select('*')
      .eq('id', dateId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          router.replace('/dates')
          return
        }
        setDate(data)
        setLoading(false)
      })
  }, [params.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete() {
    if (!date) return
    setDeleting(true)
    const { error } = await supabase.from('dates').delete().eq('id', date.id)
    if (!error) {
      setDates(dates.filter(d => d.id !== date.id))
      router.replace('/dates')
    } else {
      setDeleting(false)
      setConfirmDel(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen max-w-[390px] mx-auto flex items-center justify-center">
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-rose-deep/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  if (!date) return null

  return (
    <main className="relative min-h-screen max-w-[390px] mx-auto flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-80 h-80 rounded-full bg-blush/40 blur-[80px] -top-16 -right-10" />
        <div className="absolute w-64 h-64 rounded-full bg-warm/30 blur-[80px] bottom-16 -left-10" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-14 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="w-9 h-9 glass rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 stroke-text-main" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            onClick={() => setConfirmDel(true)}
            className="w-9 h-9 glass rounded-full flex items-center justify-center text-muted hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>

        {/* Mood banner */}
        <div className="w-full h-44 rounded-3xl bg-gradient-to-br from-blush to-[#e8c0c5] flex items-center justify-center text-7xl mb-6">
          {date.mood ?? '✨'}
        </div>

        {/* Title & meta */}
        <h1 className="font-serif text-2xl font-light text-text-main mb-2">{date.title}</h1>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-[11px] text-muted bg-rose-deep/10 text-rose-deep px-3 py-1 rounded-full">
            📅 {format(new Date(date.date), 'd MMMM yyyy', { locale: id })}
          </span>
          {date.location && (
            <span className="text-[11px] text-muted bg-rose-deep/10 text-rose-deep px-3 py-1 rounded-full">
              📍 {date.location}
            </span>
          )}
          {date.rating && (
            <span className="text-[11px] text-rose px-3 py-1 rounded-full bg-rose/10">
              {'★'.repeat(date.rating)}{'☆'.repeat(5 - date.rating)}
            </span>
          )}
        </div>

        {/* Notes */}
        {date.notes && (
          <div className="glass rounded-2xl p-4 mb-5">
            <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Catatan</p>
            <p className="font-serif text-sm text-text-main leading-relaxed whitespace-pre-wrap">{date.notes}</p>
          </div>
        )}

        {/* Photos */}
        {date.photos && date.photos.length > 0 && (
          <div>
            <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Foto</p>
            <div className="grid grid-cols-2 gap-2">
              {date.photos.map((url, i) => (
                <div key={i} className="rounded-2xl overflow-hidden aspect-square">
                  <img src={url} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4" onClick={() => setConfirmDel(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="relative glass rounded-3xl p-6 w-full max-w-[390px]" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-light text-text-main mb-2">Hapus kenangan ini?</h3>
            <p className="text-sm text-muted mb-5">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDel(false)}
                className="flex-1 border border-rose/30 text-muted text-sm py-3 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-400 text-white text-sm py-3 rounded-xl disabled:opacity-50"
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
