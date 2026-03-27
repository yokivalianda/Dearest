'use client'
import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useAuth } from '@/hooks/useAuth'
import { useCouple } from '@/hooks/useCouple'
import BottomNav from '@/components/ui/BottomNav'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function ProfilePage() {
  const { profile, couple } = useAppStore()
  const { signOut } = useAuth()
  const { couple: coupleData } = useCouple()
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleSignOut() {
    setLoggingOut(true)
    await signOut()
  }

  function copyCode() {
    if (couple?.invite_code) {
      navigator.clipboard.writeText(couple.invite_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const initial = profile?.display_name?.[0]?.toUpperCase() ?? '?'

  return (
    <main className="relative min-h-screen max-w-[390px] mx-auto flex flex-col">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-96 h-96 rounded-full bg-blush/40 blur-[80px] -top-24 -right-16 animate-[drift_12s_ease-in-out_infinite]" />
        <div className="absolute w-80 h-80 rounded-full bg-lavender/35 blur-[80px] bottom-10 -left-16 animate-[drift_15s_ease-in-out_infinite_2s]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 pb-32">
        {/* Header */}
        <div className="px-6 pt-14 pb-6">
          <h1 className="font-serif text-3xl font-light italic text-rose-deep">Profil</h1>
        </div>

        {/* Avatar + name */}
        <div className="flex flex-col items-center px-6 mb-8 animate-fade-up-1">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blush to-[#e8b4ba] border-4 border-white shadow-lg flex items-center justify-center font-serif text-3xl italic text-rose-deep mb-3">
            {initial}
          </div>
          <h2 className="font-serif text-2xl font-light text-text-main">{profile?.display_name ?? '—'}</h2>
          {couple && (
            <p className="text-[12px] text-muted mt-1">
              Bersama sejak {format(new Date(couple.created_at), 'd MMM yyyy', { locale: id })}
            </p>
          )}
        </div>

        {/* Couple section */}
        {couple && (
          <div className="px-6 mb-4 animate-fade-up-2">
            <div className="glass rounded-2xl p-4">
              <p className="text-[11px] text-muted uppercase tracking-widest mb-3">Ruang berdua</p>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blush to-[#e8b4ba] border-2 border-white flex items-center justify-center font-serif text-sm italic text-rose-deep">
                    {initial}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender to-[#c8b8d8] border-2 border-white -ml-2.5 flex items-center justify-center">
                    <span className="text-[#7a5a8a] font-serif text-sm italic">♡</span>
                  </div>
                </div>
                <div>
                  <p className="font-serif text-sm text-text-main">Kamu &amp; Pasangan</p>
                  <p className="text-[11px] text-muted">Terhubung ✦</p>
                </div>
              </div>

              {/* Invite code */}
              <button
                onClick={() => setShowCode(!showCode)}
                className="w-full flex items-center justify-between text-[12px] text-rose-deep bg-rose-deep/8 px-3 py-2.5 rounded-xl hover:bg-rose-deep/15 transition-colors"
              >
                <span>{showCode ? 'Sembunyikan kode undangan' : 'Lihat kode undangan'}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${showCode ? 'rotate-180' : ''}`}
                  fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {showCode && (
                <div className="mt-3 p-3 bg-white/50 rounded-xl text-center">
                  <p className="font-serif text-3xl tracking-[0.4em] text-rose-deep mb-2">{couple.invite_code}</p>
                  <button
                    onClick={copyCode}
                    className="text-[11px] text-muted hover:text-rose-deep transition-colors"
                  >
                    {copied ? '✓ Tersalin!' : 'Salin kode'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No couple yet */}
        {!couple && (
          <div className="px-6 mb-4 animate-fade-up-2">
            <div className="glass rounded-2xl p-5 flex flex-col items-center text-center gap-3">
              <span className="text-3xl">💌</span>
              <p className="font-serif text-base text-text-main">Belum terhubung dengan pasangan</p>
              <p className="text-[12px] text-muted">Hubungkan akunmu untuk mulai berbagi momen</p>
              <a href="/onboarding" className="text-[12px] text-rose-deep bg-rose-deep/10 px-4 py-2 rounded-xl hover:bg-rose-deep/20 transition-colors">
                Hubungkan sekarang →
              </a>
            </div>
          </div>
        )}

        {/* Sign out */}
        <div className="px-6 mt-4 animate-fade-up-3">
          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            className="w-full glass rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-white/85 transition-colors disabled:opacity-50"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 stroke-red-400" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-red-400 font-sans">{loggingOut ? 'Keluar...' : 'Keluar'}</p>
              <p className="text-[11px] text-muted">Logout dari akun ini</p>
            </div>
          </button>
        </div>
      </div>

      <BottomNav active="profile" />
    </main>
  )
}
