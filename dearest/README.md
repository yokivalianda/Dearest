# Dearest 💕

> Setiap momen berdua, abadi selamanya.

App PWA untuk pasangan — catat kenangan date, rencanakan date berikutnya, dan rayakan milestone bersama.

## Tech Stack

- **Next.js 14** (App Router)
- **Supabase** (Auth, Database, Storage)
- **Tailwind CSS**
- **Zustand** (state management)
- **next-pwa** (PWA support)
- **date-fns** (date formatting)

## Setup

### 1. Clone & install

```bash
npm install
```

### 2. Buat Supabase project

1. Buka [supabase.com](https://supabase.com) → buat project baru
2. Di **SQL Editor**, jalankan isi file `supabase-schema.sql`
3. Di **Authentication → Email**, matikan "Confirm email" untuk development

### 3. Environment variables

Salin `.env.local.example` menjadi `.env.local` dan isi nilainya:

```bash
cp .env.local.example .env.local
```

Nilai bisa ditemukan di: **Supabase Dashboard → Project Settings → API**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Ikon PWA

Tambahkan ikon ke `public/icons/`:
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

Bisa generate di [realfavicongenerator.net](https://realfavicongenerator.net)

### 5. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Deploy ke Vercel

```bash
npm install -g vercel
vercel
```

Tambahkan environment variables di Vercel Dashboard → Settings → Environment Variables.

## Fitur

- **Date Journal** — catat momen, mood, rating, dan catatan tiap date
- **Date Planner** — rencanakan date berikutnya dengan inspirasi ide
- **Milestones** — countdown anniversary dan hari-hari spesial
- **Memory Gallery** — galeri foto dari semua kenangan date
- **Real-time sync** — data tersinkron antara dua pasangan
- **PWA** — bisa di-install di HP seperti app native

## Struktur Folder

```
src/
├── app/
│   ├── page.tsx              ← Halaman utama
│   ├── auth/login/           ← Login
│   ├── auth/register/        ← Register
│   ├── dates/                ← Daftar & form date
│   ├── planner/              ← Date planner
│   ├── milestones/           ← Milestone tracker
│   └── gallery/              ← Galeri foto
├── lib/supabase/
│   ├── client.ts             ← Browser client
│   ├── server.ts             ← Server client
│   └── types.ts              ← TypeScript types
├── store/
│   └── useAppStore.ts        ← Zustand store
├── hooks/
│   ├── useAuth.ts            ← Auth hook
│   └── useCouple.ts          ← Couple hook
└── components/
    └── ui/BottomNav.tsx      ← Bottom navigation
```
