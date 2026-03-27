'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCouple } from '@/hooks/useCouple'
import { useAppStore } from '@/store/useAppStore'

type Step = 'welcome' | 'choose' | 'create' | 'join'

export default function OnboardingPage() {
  const { profile } = useAppStore()
  const { createCouple, joinCouple } = useCouple()
  const router = useRouter()

  const [step, setStep] = useState<Step>('welcome')
  const [inviteCode, setInviteCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreateCouple() {
    setLoading(true)
    setError('')
    try {
      const data = await createCouple()
      setGeneratedCode(data.invite_code)
      setStep('create')
    } catch (err: any) {
      setError(err.message ?? 'Gagal membuat ruang berdua')
    } finally {
      setLoading(false)
    }
  }

  async function handleJoinCouple() {
    if (!inviteCode.trim()) return
    setLoading(true)
    setError('')
    try {
      await joinCouple(inviteCode.trim())
      router.push('/')
    } catch (err: any) {
      setError(err.message ?? 'Kode tidak valid')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen max-w-[390px] mx-auto flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[480px] h-[480px] rounded-full bg-blush/40 blur-[80px] -top-32 -right-20 animate-[drift_12s_ease-in-out_infinite]" />
        <div className="absolute w-[380px] h-[380px] rounded-full bg-lavender/35 blur-[80px] bottom-10 -left-20 animate-[drift_15s_ease-in-out_infinite_2s]" />
        <div className="absolute w-[280px] h-[280px] rounded-full bg-warm/30 blur-[80px] top-[50%] right-0 animate-[drift_10s_ease-in-out_infinite_4s]" />
      </div>

      <div className="relative z-10 w-full">

        {/* ── STEP: Welcome ── */}
        {step === 'welcome' && (
          <div className="flex flex-col items-center text-center animate-fade-up">
            {/* Logo */}
            <h1 className="font-serif text-4xl font-light italic text-rose-deep mb-2">dearest</h1>
            <p className="font-serif text-sm italic text-muted mb-12">Setiap momen berdua, abadi selamanya.</p>

            {/* Illustration */}
            <div className="relative w-48 h-48 mb-10">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blush to-lavender opacity-50 blur-2xl" />
              <div className="relative flex items-center justify-center h-full">
                <span className="text-8xl select-none">💕</span>
              </div>
            </div>

            <h2 className="font-serif text-3xl font-light leading-snug mb-3">
              Halo, <em className="italic text-rose-deep">{profile?.display_name ?? 'Sayang'}</em> ✦
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-10 max-w-[280px]">
              Hubungkan dengan pasanganmu untuk mulai menyimpan momen-momen indah bersama.
            </p>

            <button
              onClick={() => setStep('choose')}
              className="w-full bg-rose-deep text-white font-sans text-sm py-4 rounded-2xl hover:bg-[#96505c] transition-colors shadow-lg shadow-rose-deep/20"
            >
              Mulai bersama ♡
            </button>
          </div>
        )}

        {/* ── STEP: Choose action ── */}
        {step === 'choose' && (
          <div className="animate-fade-up">
            <button
              onClick={() => setStep('welcome')}
              className="flex items-center gap-2 text-muted text-sm mb-8 hover:text-rose-deep transition-colors"
            >
              <svg className="w-4 h-4" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Kembali
            </button>

            <h2 className="font-serif text-3xl font-light mb-2">Ruang berdua</h2>
            <p className="text-sm text-muted mb-8 leading-relaxed">
              Buat ruang baru dan bagikan kodenya ke pasangan, atau masukkan kode dari pasanganmu.
            </p>

            <div className="flex flex-col gap-4">
              {/* Create option */}
              <button
                onClick={handleCreateCouple}
                disabled={loading}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:bg-white/85 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blush to-[#e8b8be] flex items-center justify-center text-2xl flex-shrink-0">
                  🌸
                </div>
                <div>
                  <p className="font-serif text-base text-text-main mb-0.5">Buat ruang baru</p>
                  <p className="text-[12px] text-muted">Kamu yang pertama daftar, bagikan kode ke pasangan</p>
                </div>
                <svg className="w-4 h-4 stroke-muted ml-auto flex-shrink-0" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>

              {/* Join option */}
              <button
                onClick={() => setStep('join')}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:bg-white/85 hover:-translate-y-0.5 transition-all duration-200 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lavender to-[#d0c0e0] flex items-center justify-center text-2xl flex-shrink-0">
                  🔑
                </div>
                <div>
                  <p className="font-serif text-base text-text-main mb-0.5">Gabung dengan kode</p>
                  <p className="text-[12px] text-muted">Masukkan kode undangan dari pasanganmu</p>
                </div>
                <svg className="w-4 h-4 stroke-muted ml-auto flex-shrink-0" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>

            {error && (
              <p className="text-[12px] text-red-400 bg-red-50 rounded-xl px-3 py-2 mt-4">{error}</p>
            )}
          </div>
        )}

        {/* ── STEP: Code created ── */}
        {step === 'create' && (
          <div className="flex flex-col items-center text-center animate-fade-up">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blush to-[#e8b8be] flex items-center justify-center text-4xl mb-6 shadow-lg shadow-blush/30">
              🎉
            </div>

            <h2 className="font-serif text-3xl font-light mb-2">Ruang berdua siap!</h2>
            <p className="text-sm text-muted mb-8 leading-relaxed max-w-[260px]">
              Bagikan kode ini ke pasanganmu. Mereka perlu daftar dulu, lalu masukkan kode ini.
            </p>

            {/* Code display */}
            <div className="glass rounded-2xl p-6 w-full mb-6">
              <p className="text-[11px] text-muted uppercase tracking-widest mb-3">Kode undanganmu</p>
              <p className="font-serif text-5xl font-light text-rose-deep tracking-[0.3em] mb-4">
                {generatedCode}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedCode)
                }}
                className="flex items-center gap-2 mx-auto text-[12px] text-rose-deep bg-rose-deep/10 px-4 py-2 rounded-xl hover:bg-rose-deep/20 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Salin kode
              </button>
            </div>

            {/* Share steps */}
            <div className="glass rounded-2xl p-4 w-full mb-8 text-left">
              <p className="text-[11px] text-muted uppercase tracking-widest mb-3">Cara menghubungkan</p>
              {[
                'Bagikan kode di atas ke pasanganmu',
                'Pasangan daftar akun baru di dearest',
                'Pilih "Gabung dengan kode" saat onboarding',
                'Masukkan kode, dan kalian terhubung! 💕',
              ].map((txt, i) => (
                <div key={i} className="flex items-start gap-3 mb-2.5 last:mb-0">
                  <span className="w-5 h-5 rounded-full bg-rose-deep/15 text-rose-deep text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-sans font-medium">
                    {i + 1}
                  </span>
                  <p className="text-[12px] text-text-main leading-relaxed">{txt}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-rose-deep text-white font-sans text-sm py-4 rounded-2xl hover:bg-[#96505c] transition-colors"
            >
              Lanjut ke beranda →
            </button>
          </div>
        )}

        {/* ── STEP: Join with code ── */}
        {step === 'join' && (
          <div className="animate-fade-up">
            <button
              onClick={() => { setStep('choose'); setError(''); setInviteCode('') }}
              className="flex items-center gap-2 text-muted text-sm mb-8 hover:text-rose-deep transition-colors"
            >
              <svg className="w-4 h-4" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Kembali
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lavender to-[#d0c0e0] flex items-center justify-center text-3xl mb-4">
                🔑
              </div>
              <h2 className="font-serif text-3xl font-light mb-2">Masukkan kode</h2>
              <p className="text-sm text-muted leading-relaxed max-w-[260px]">
                Minta kode undangan dari pasanganmu, lalu masukkan di bawah ini.
              </p>
            </div>

            <div className="glass rounded-3xl p-6">
              <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">
                Kode undangan (6 karakter)
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-2xl text-center font-serif text-rose-deep tracking-[0.4em] placeholder:text-muted/30 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:border-rose/50 transition-colors"
              />

              {error && (
                <p className="text-[12px] text-red-400 bg-red-50 rounded-xl px-3 py-2 mt-3">{error}</p>
              )}

              <button
                onClick={handleJoinCouple}
                disabled={loading || inviteCode.length < 6}
                className="w-full bg-rose-deep text-white font-sans text-sm py-3.5 rounded-xl hover:bg-[#96505c] transition-colors disabled:opacity-50 mt-4"
              >
                {loading ? 'Menghubungkan...' : 'Gabung sekarang ♡'}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
