'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (err: any) {
      setError(err.message ?? 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen max-w-[390px] mx-auto flex flex-col items-center justify-center px-6">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-96 h-96 rounded-full bg-blush/40 blur-[80px] -top-24 -right-16" />
        <div className="absolute w-80 h-80 rounded-full bg-lavender/35 blur-[80px] bottom-10 -left-16" />
      </div>

      <div className="relative z-10 w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-light italic text-rose-deep mb-2">dearest</h1>
          <p className="font-serif text-sm italic text-muted">Setiap momen berdua, abadi selamanya.</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-6">
          <h2 className="font-serif text-2xl font-light text-text-main mb-6">Masuk</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="kamu@email.com"
                required
                className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-muted/50 focus:outline-none focus:border-rose/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/60 border border-rose/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-muted/50 focus:outline-none focus:border-rose/50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-[12px] text-red-400 bg-red-50 rounded-xl px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-deep text-white font-sans text-sm py-3.5 rounded-xl hover:bg-[#96505c] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-muted mt-5">
          Belum punya akun?{' '}
          <Link href="/auth/register" className="text-rose-deep">Daftar sekarang</Link>
        </p>
      </div>
    </main>
  )
}
