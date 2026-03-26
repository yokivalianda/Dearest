'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { differenceInDays, format } from 'date-fns'
import { id } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'
import { useAuth } from '@/hooks/useAuth'
import BottomNav from '@/components/ui/BottomNav'

function Countdown({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    function tick() {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0 })
        return
      }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex gap-4">
      {[['d', 'hari'], ['h', 'jam'], ['m', 'menit'], ['s', 'detik']].map(([key, label], i) => (
        <div key={key} className="flex items-center gap-4">
          {i > 0 && <span className="font-serif text-2xl text-white/30 -mt-3">·</span>}
          <div className="flex flex-col items-center gap-1">
            <span className="font-serif text-3xl font-light text-white leading-none min-w-[40px] text-center">
              {pad(time[key as keyof typeof time])}
            </span>
            <span className="text-[10px] text-white/50 uppercase tracking-widest">{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  const supabase = createClient()
  const { user, profile, couple, dates, milestones, setDates, setMilestones } = useAppStore()
  const { signOut } = useAuth()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 11) return 'Selamat pagi'
    if (h < 15) return 'Selamat siang'
    if (h < 18) return 'Selamat sore'
    return 'Selamat malam'
  }

  const nextAnniversary = () => {
    if (!couple) return new Date()
    const start = new Date(couple.created_at)
    const now = new Date()
    const next = new Date(start)
    next.setFullYear(now.getFullYear())
    if (next <= now) next.setFullYear(now.getFullYear() + 1)
    return next
  }

  const daysTogether = couple
    ? differenceInDays(new Date(), new Date(couple.created_at))
    : 0

  useEffect(() => {
    if (!couple) return
    const coupleId = couple.id
    supabase
      .from('dates')
      .select('*')
      .eq('couple_id', coupleId)
      .order('date', { ascending: false })
      .limit(10)
      .then(({ data }) => data && setDates(data))

    supabase
      .from('milestones')
      .select('*')
      .eq('couple_id', coupleId)
      .order('date', { ascending: true })
      .then(({ data }) => data && setMilestones(data))
  }, [couple?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const upcomingMilestone = milestones.find(m => new Date(m.date) > new Date())

  return (
    <main className="relative min-h-screen max-w-[390px] mx-auto flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-blush/40 blur-[80px] -top-32 -right-20 animate-[drift_12s_ease-in-out_infinite]" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-lavender/35 blur-[80px] bottom-10 -left-24 animate-[drift_15s_ease-in-out_infinite_2s]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-warm/30 blur-[80px] top-[45%] right-10 animate-[drift_10s_ease-in-out_infinite_4s]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Top bar */}
        <div className="flex justify-between items-center px-6 pt-12">
          <span className="font-serif text-2xl italic text-rose-deep">dearest</span>
          <div className="flex gap-3">
            <Link href="/milestones" className="w-9 h-9 rounded-full glass flex items-center justify-center">
              <svg className="w-4 h-4 stroke-rose-deep" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </Link>
            {/* Profile / Sign Out */}
            <button
              onClick={signOut}
              className="w-9 h-9 rounded-full glass flex items-center justify-center"
              title="Keluar"
            >
              <svg className="w-4 h-4 stroke-rose-deep" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Hero text */}
        <div className="px-6 pt-7 pb-0">
          <p className="font-serif text-sm italic text-muted mb-1 animate-fade-up-1">
            {greeting()}, {profile?.display_name ?? 'Sayang'} ✦
          </p>
          <h1 className="font-serif text-[34px] font-light leading-[1.15] animate-fade-up-2">
            Hari ini <em className="italic text-rose-deep">istimewa</em><br />karena kamu ada.
          </h1>
        </div>

        {/* Couple card */}
        <div className="px-6 pt-6 animate-fade-up-3">
          <div className="glass rounded-3xl p-4 flex items-center gap-4">
            <div className="flex items-center">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blush to-[#e8b4ba] border-2 border-white flex items-center justify-center font-serif text-base italic text-rose-deep">
                {profile?.display_name?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-lavender to-[#c8b8d8] border-2 border-white flex items-center justify-center font-serif text-base italic text-[#7a5a8a] -ml-3">
                ♡
              </div>
            </div>
            <div className="flex-1">
              <p className="font-serif text-base text-text-main">Kamu &amp; Pasangan</p>
              <p className="text-[11px] text-muted">
                {couple
                  ? `bersama sejak ${format(new Date(couple.created_at), 'd MMM yyyy', { locale: id })}`
                  : <Link href="/setup" className="text-rose-deep underline">Hubungkan dengan pasanganmu →</Link>
                }
              </p>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-serif text-[22px] font-light text-rose-deep leading-none">{daysTogether}</span>
              <span className="text-[10px] text-muted tracking-wide">hari bersama</span>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="px-6 pt-4 animate-fade-up-4">
          <div className="bg-rose-deep rounded-3xl p-5 relative overflow-hidden">
            <div className="absolute w-44 h-44 rounded-full bg-white/5 -top-14 -right-10" />
            <div className="absolute w-28 h-28 rounded-full bg-white/5 -bottom-8 left-5" />
            <p className="text-[11px] text-white/60 tracking-widest uppercase mb-2">✦ countdown berikutnya</p>
            <p className="font-serif text-xl font-light italic text-white mb-4">
              {upcomingMilestone?.title ?? 'Anniversary ♡'}
            </p>
            <Countdown targetDate={upcomingMilestone ? new Date(upcomingMilestone.date) : nextAnniversary()} />
          </div>
        </div>

        {/* Recent dates */}
        <div className="pt-7 animate-fade-up-5">
          <div className="flex justify-between items-baseline px-6 mb-3">
            <h2 className="font-serif text-xl font-light italic">Kenangan terbaru</h2>
            <Link href="/dates" className="text-[11px] text-rose tracking-wide">lihat semua →</Link>
          </div>
          <div className="flex gap-3 px-6 overflow-x-auto scrollbar-none pb-1">
            {dates.length === 0 ? (
              <Link href="/dates/new" className="min-w-[148px] glass rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/80 transition-colors">
                <span className="text-3xl">+</span>
                <span className="font-serif text-sm text-muted text-center">Catat date pertama</span>
              </Link>
            ) : dates.slice(0, 5).map((d) => (
              <Link key={d.id} href={`/dates/${d.id}`}
                className="min-w-[148px] glass rounded-2xl p-3.5 flex-shrink-0 hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
                <div className="w-full h-[88px] rounded-xl bg-gradient-to-br from-blush to-[#e8c0c5] mb-2.5 flex items-center justify-center text-3xl">
                  {d.mood ?? '✨'}
                </div>
                <span className="text-[10px] text-rose-deep bg-rose-deep/10 px-2 py-0.5 rounded-full">
                  {d.location ?? 'Date'}
                </span>
                <p className="font-serif text-sm text-text-main mt-1 mb-1 leading-snug">{d.title}</p>
                <p className="text-[10px] text-muted">{format(new Date(d.date), 'd MMM yyyy', { locale: id })}</p>
                {d.rating && (
                  <p className="text-[10px] text-rose mt-1">{'★'.repeat(d.rating)}{'☆'.repeat(5 - d.rating)}</p>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-6 pt-7 pb-32">
          <h2 className="font-serif text-xl font-light italic mb-3">Apa hari ini?</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { href: '/dates/new', icon: '📖', label: 'Catat date baru',   sub: 'Simpan momen hari ini',      bg: 'from-blush to-[#e8b8be]' },
              { href: '/planner',   icon: '🗓️', label: 'Rencanakan date',   sub: 'Ide & jadwal berikutnya',    bg: 'from-lavender to-[#d0c0e0]' },
              { href: '/milestones',icon: '🎂', label: 'Milestones',         sub: 'Hari-hari spesial',           bg: 'from-[#daeee6] to-[#b8ddd0]' },
              { href: '/gallery',   icon: '🖼️', label: 'Galeri kenangan',   sub: 'Foto & cerita berdua',        bg: 'from-warm to-[#ddd0c0]' },
            ].map((a) => (
              <Link key={a.href} href={a.href}
                className="glass rounded-2xl p-4 flex flex-col gap-2 hover:-translate-y-0.5 hover:bg-white/85 transition-all duration-200 cursor-pointer">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.bg} flex items-center justify-center text-lg`}>
                  {a.icon}
                </div>
                <div>
                  <p className="font-serif text-sm text-text-main">{a.label}</p>
                  <p className="text-[10px] text-muted mt-0.5">{a.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" />

      {/* FAB */}
      <Link href="/dates/new"
        className="fixed bottom-24 right-6 bg-rose-deep rounded-full flex items-center justify-center shadow-lg shadow-rose-deep/40 hover:scale-105 transition-transform z-20"
        style={{ width: 52, height: 52 }}>
        <svg className="w-5 h-5 stroke-white" fill="none" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </Link>
    </main>
  )
}
