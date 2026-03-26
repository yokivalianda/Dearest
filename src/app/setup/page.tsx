'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCouple } from '@/hooks/useCouple'
import { useAppStore } from '@/store/useAppStore'

type Mode = 'choose' | 'create' | 'join' | 'done'

export default function SetupPage() {
  const router  = useRouter()
  const { couple } = useAppStore()
  const { createCouple, joinCouple } = useCouple()

  const [mode, setMode]       = useState<Mode>('choose')
  const [code, setCode]       = useState('')
  const [myCode, setMyCode]   = useState('')
  const [copied, setCopied]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // Kalau sudah punya couple sejak awal (bukan baru dibuat), langsung ke home
  useEffect(() => {
    if (couple) router.replace('/')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreate() {
    setLoading(true)
    setError('')
    try {
      const data = await createCouple()
      setMyCode(data.invite_code)
      setMode('create')
    } catch (err: any) {
      setError(err.message || 'Gagal membuat kode')
    } finally {
      setLoading(false)
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (code.trim().length < 6) { setError('Masukkan kode 6 karakter'); return }
    setLoading(true)
    setError('')
    try {
      await joinCouple(code.trim())
      setMode('done')
      setTimeout(() => router.replace('/'), 1800)
    } catch (err: any) {
      setError(err.message || 'Kode tidak ditemukan')
    } finally {
      setLoading(false)
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(myCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <main className="relative min-h-screen max-w-[390px] mx-auto flex flex-col items-center justify-center px-6">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[420px] h-[420px] rounded-full bg-blush/40 blur-[90px] -top-24 -right-16 animate-[drift_14s_ease-in-out_infinite]" />
        <div className="absolute w-[360px] h-[360px] rounded-full bg-lavender/35 blur-[80px] -bottom-10 -left-20 animate-[drift_17s_ease-in-out_infinite_2s]" />
        <div className="absolute w-[220px] h-[220px] rounded-full bg-warm/30 blur-[60px] top-2/3 right-0 animate-[drift_11s_ease-in-out_infinite_1s]" />
      </div>

      <div className="relative z-10 w-full">

        {/* ── CHOOSE ── */}
        {mode === 'choose' && (
          <div className="animate-[fadeUp_0.45s_ease_both]">
            <div className="text-center mb-10">
              <h1 className="font-serif text-4xl font-light italic text-rose-deep mb-2">dearest</h1>
              <p className="font-serif text-sm italic text-muted">Sambungkan hatimu dengan pasangan ♡</p>
            </div>

            <div className="glass rounded-3xl p-6">
              <div className="text-center mb-7">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blush to-[#e8c0c5] mb-4">
                  <span className="text-3xl">💌</span>
                </div>
                <h2 className="font-serif text-2xl font-light text-text-main">Hubungkan Pasangan</h2>
                <p className="text-[12px] text-muted mt-1.5 leading-relaxed">
                  Buat kode undangan untuk pasanganmu,<br/>atau masukkan kode dari pasanganmu.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="w-full bg-rose-deep text-white text-sm py-4 rounded-2xl hover:bg-[#96505c] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                  )}
                  <span>{loading ? 'Membuat kode...' : 'Buat kode undangan'}</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-rose/15" />
                  <span className="text-[11px] text-muted">atau</span>
                  <div className="flex-1 h-px bg-rose/15" />
                </div>

                <button
                  onClick={() => setMode('join')}
                  className="w-full glass border border-rose/20 text-rose-deep text-sm py-4 rounded-2xl hover:bg-white/80 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"/>
                  </svg>
                  Masukkan kode pasangan
                </button>
              </div>

              {error && (
                <p className="text-[12px] text-red-400 bg-red-50 rounded-xl px-3 py-2 mt-3 text-center">{error}</p>
              )}
            </div>
          </div>
        )}

        {/* ── CREATE — tampilkan kode ── */}
        {mode === 'create' && (
          <div className="animate-[fadeUp_0.45s_ease_both]">
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl font-light italic text-rose-deep mb-2">dearest</h1>
            </div>

            <div className="glass rounded-3xl p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#daeee6] to-[#b8ddd0] mb-4">
                  <span className="text-3xl">🎉</span>
                </div>
                <h2 className="font-serif text-2xl font-light text-text-main">Kode Undanganmu</h2>
                <p className="text-[12px] text-muted mt-1.5">
                  Bagikan kode ini ke pasanganmu
                </p>
              </div>

              {/* Kode besar */}
              <div className="bg-gradient-to-br from-rose-deep/5 to-blush/30 border border-rose/20 rounded-2xl p-5 mb-5 text-center">
                <p className="font-serif text-[40px] font-light tracking-[0.2em] text-rose-deep leading-none mb-2">
                  {myCode}
                </p>
                <p className="text-[11px] text-muted">Berlaku selama pasanganmu belum bergabung</p>
              </div>

              <button
                onClick={copyCode}
                className="w-full flex items-center justify-center gap-2 bg-white/70 border border-rose/20 text-rose-deep text-sm py-3 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all mb-3"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className="text-green-600">Disalin!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                    Salin kode
                  </>
                )}
              </button>

              {/* Instruksi singkat */}
              <div className="bg-ivory/60 rounded-xl p-3.5 mb-4">
                <p className="text-[11px] text-muted leading-relaxed">
                  📱 Minta pasanganmu buka <span className="text-rose-deep">dearest</span>, daftar akun, lalu pilih <strong>"Masukkan kode pasangan"</strong> dan ketik kode di atas.
                </p>
              </div>

              <button
                onClick={() => router.replace('/')}
                className="w-full bg-rose-deep text-white text-sm py-3.5 rounded-xl hover:bg-[#96505c] active:scale-[0.98] transition-all"
              >
                Lanjut ke beranda →
              </button>
            </div>
          </div>
        )}

        {/* ── JOIN — masukkan kode ── */}
        {mode === 'join' && (
          <div className="animate-[fadeUp_0.45s_ease_both]">
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl font-light italic text-rose-deep mb-2">dearest</h1>
            </div>

            <div className="glass rounded-3xl p-6">
              <button
                onClick={() => { setMode('choose'); setError(''); setCode('') }}
                className="flex items-center gap-1.5 text-[12px] text-muted hover:text-rose-deep transition-colors mb-5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Kembali
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-lavender to-[#d0c0e0] mb-4">
                  <span className="text-3xl">🔑</span>
                </div>
                <h2 className="font-serif text-2xl font-light text-text-main">Masukkan Kode</h2>
                <p className="text-[12px] text-muted mt-1.5">
                  Ketik kode 6 karakter dari pasanganmu
                </p>
              </div>

              <form onSubmit={handleJoin} className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Kode undangan</label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    placeholder="Contoh: A1B2C3"
                    maxLength={6}
                    required
                    autoComplete="off"
                    className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-center text-xl font-serif tracking-[0.25em] text-rose-deep placeholder:text-muted/30 placeholder:tracking-normal placeholder:text-sm focus:outline-none focus:border-rose-deep/50 focus:bg-white/80 transition-all uppercase"
                  />
                  <p className="text-[10px] text-muted mt-1 text-center">{code.length}/6 karakter</p>
                </div>

                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                    <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p className="text-[12px] text-red-500">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || code.length < 6}
                  className="w-full bg-rose-deep text-white text-sm py-3.5 rounded-xl hover:bg-[#96505c] active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Menghubungkan...
                    </>
                  ) : 'Hubungkan ♡'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {mode === 'done' && (
          <div className="animate-[fadeUp_0.45s_ease_both] text-center">
            <div className="glass rounded-3xl p-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blush to-[#e8c0c5] mb-5">
                <span className="text-4xl">💑</span>
              </div>
              <h2 className="font-serif text-2xl font-light text-text-main mb-2">Berhasil Terhubung!</h2>
              <p className="text-sm text-muted font-serif italic">
                Selamat, kamu dan pasangan kini terhubung ♡<br/>Menuju beranda...
              </p>
              <div className="mt-5 flex justify-center gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-rose-deep/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
