'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3

  const strengthLabel = ['', 'Terlalu pendek', 'Cukup', 'Kuat']
  const strengthColor = ['', 'bg-red-300', 'bg-yellow-300', 'bg-green-400']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { setError('Password minimal 6 karakter'); return }
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, name)
    } catch (err: any) {
      const msg = err.message ?? ''
      if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError('Email sudah terdaftar. Coba login.')
      } else {
        setError(msg || 'Pendaftaran gagal. Coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen max-w-[390px] mx-auto flex flex-col items-center justify-center px-6 py-10">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-blush/40 blur-[80px] -top-24 -right-16 animate-[drift_14s_ease-in-out_infinite]" />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-lavender/35 blur-[80px] bottom-8 -left-16 animate-[drift_17s_ease-in-out_infinite_2s]" />
      </div>

      <div className="relative z-10 w-full animate-[fadeUp_0.5s_ease_both]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-deep/10 mb-4">
            <svg className="w-7 h-7 text-rose-deep" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/>
            </svg>
          </div>
          <h1 className="font-serif text-4xl font-light italic text-rose-deep mb-1.5">dearest</h1>
          <p className="font-serif text-sm italic text-muted">Mulai perjalanan cintamu bersama.</p>
        </div>

        <div className="glass rounded-3xl p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-light text-text-main mb-1">Buat akun</h2>
          <p className="text-[12px] text-muted mb-6">Gratis selamanya ✦</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nama */}
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Nama panggilan</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nama kamu"
                required
                autoComplete="name"
                className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-muted/40 focus:outline-none focus:border-rose-deep/50 focus:bg-white/80 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="kamu@email.com"
                required
                autoComplete="email"
                className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-muted/40 focus:outline-none focus:border-rose-deep/50 focus:bg-white/80 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 pr-12 text-sm text-text-main placeholder:text-muted/40 focus:outline-none focus:border-rose-deep/50 focus:bg-white/80 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-rose-deep transition-colors p-1"
                >
                  {showPw ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  )}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-rose/10'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted">{strengthLabel[strength]}</span>
                </div>
              )}
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
              disabled={loading}
              className="w-full bg-rose-deep text-white font-sans text-sm py-3.5 rounded-xl hover:bg-[#96505c] active:scale-[0.98] transition-all disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Membuat akun...
                </>
              ) : 'Buat akun ♡'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-muted mt-5">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="text-rose-deep font-medium hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  )
}
