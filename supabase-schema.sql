-- ============================================================
-- DEAREST APP — Supabase SQL Schema (v2 - Production Ready)
-- Jalankan di: Supabase Dashboard → SQL Editor → New query
-- Aman untuk dijalankan ulang (idempotent)
-- ============================================================

-- 1. Tabel couples
CREATE TABLE IF NOT EXISTS couples (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_code TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel profiles (linked ke auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID REFERENCES auth.users PRIMARY KEY,
  display_name TEXT,
  couple_id    UUID REFERENCES couples(id),
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel dates
CREATE TABLE IF NOT EXISTS dates (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id  UUID REFERENCES couples(id) NOT NULL,
  title      TEXT NOT NULL,
  date       DATE NOT NULL,
  location   TEXT,
  mood       TEXT,
  rating     INT CHECK (rating BETWEEN 1 AND 5),
  notes      TEXT,
  photos     TEXT[],
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel milestones
CREATE TABLE IF NOT EXISTS milestones (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id  UUID REFERENCES couples(id) NOT NULL,
  title      TEXT NOT NULL,
  date       DATE NOT NULL,
  emoji      TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE couples    ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE dates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users insert own profile"  ON profiles;
DROP POLICY IF EXISTS "Users read own profile"    ON profiles;
DROP POLICY IF EXISTS "Users update own profile"  ON profiles;

CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- ── COUPLES ──────────────────────────────────────────────────
-- PENTING: SELECT harus USING(true) agar user bisa cari couple
-- berdasarkan invite_code saat JOIN (sebelum punya couple_id)
DROP POLICY IF EXISTS "Authenticated insert couple"          ON couples;
DROP POLICY IF EXISTS "Authenticated read couple"            ON couples;
DROP POLICY IF EXISTS "Couple members update couple"         ON couples;
DROP POLICY IF EXISTS "Anyone insert couple"                 ON couples;
DROP POLICY IF EXISTS "Couple members read couple"           ON couples;
DROP POLICY IF EXISTS "Users can create a couple"            ON couples;
DROP POLICY IF EXISTS "Users can read their couple"          ON couples;
DROP POLICY IF EXISTS "Users can find couple by invite code" ON couples;
DROP POLICY IF EXISTS "Users can update their couple"        ON couples;

CREATE POLICY "Authenticated insert couple"
  ON couples FOR INSERT TO authenticated
  WITH CHECK (true);

-- Semua user login bisa baca couples (perlu untuk lookup invite_code)
CREATE POLICY "Authenticated read couple"
  ON couples FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Couple members update couple"
  ON couples FOR UPDATE TO authenticated
  USING (
    id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

-- ── DATES ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Couple members read dates"   ON dates;
DROP POLICY IF EXISTS "Couple members insert dates" ON dates;
DROP POLICY IF EXISTS "Couple members update dates" ON dates;
DROP POLICY IF EXISTS "Couple members delete dates" ON dates;

CREATE POLICY "Couple members read dates"
  ON dates FOR SELECT TO authenticated
  USING (
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Couple members insert dates"
  ON dates FOR INSERT TO authenticated
  WITH CHECK (
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Couple members update dates"
  ON dates FOR UPDATE TO authenticated
  USING (
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Couple members delete dates"
  ON dates FOR DELETE TO authenticated
  USING (
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

-- ── MILESTONES ───────────────────────────────────────────────
DROP POLICY IF EXISTS "Couple members read milestones"   ON milestones;
DROP POLICY IF EXISTS "Couple members insert milestones" ON milestones;
DROP POLICY IF EXISTS "Couple members update milestones" ON milestones;
DROP POLICY IF EXISTS "Couple members delete milestones" ON milestones;

CREATE POLICY "Couple members read milestones"
  ON milestones FOR SELECT TO authenticated
  USING (
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Couple members insert milestones"
  ON milestones FOR INSERT TO authenticated
  WITH CHECK (
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Couple members update milestones"
  ON milestones FOR UPDATE TO authenticated
  USING (
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Couple members delete milestones"
  ON milestones FOR DELETE TO authenticated
  USING (
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

-- ============================================================
-- STORAGE BUCKET untuk foto (uncomment jika perlu upload foto)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('date-photos', 'date-photos', true)
-- ON CONFLICT (id) DO NOTHING;
