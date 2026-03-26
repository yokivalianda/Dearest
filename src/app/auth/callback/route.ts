import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirect ke halaman tujuan setelah auth berhasil
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Redirect ke halaman error jika ada masalah
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`)
}
