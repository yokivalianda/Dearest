-- ============================================================
-- DEAREST APP — Supabase SQL Schema
-- Jalankan di: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Tabel couples
create table if not exists couples (
  id          uuid default gen_random_uuid() primary key,
  invite_code text unique not null,
  created_at  timestamptz default now()
);

-- 2. Tabel profiles (linked ke auth.users)
create table if not exists profiles (
  id           uuid references auth.users primary key,
  display_name text,
  couple_id    uuid references couples(id),
  avatar_url   text,
  created_at   timestamptz default now()
);

-- 3. Tabel dates
create table if not exists dates (
  id         uuid default gen_random_uuid() primary key,
  couple_id  uuid references couples(id) not null,
  title      text not null,
  date       date not null,
  location   text,
  mood       text,
  rating     int check (rating between 1 and 5),
  notes      text,
  photos     text[],
  created_by uuid references auth.users,
  created_at timestamptz default now()
);

-- 4. Tabel milestones
create table if not exists milestones (
  id        uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  title     text not null,
  date      date not null,
  emoji     text,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table couples    enable row level security;
alter table profiles   enable row level security;
alter table dates      enable row level security;
alter table milestones enable row level security;

-- Profiles: baca & update profil sendiri
-- FIX: tambah policy agar pasangan bisa dibaca (untuk nampilin initial partner)
drop policy if exists "Users read own profile" on profiles;
create policy "Users read own profile"
  on profiles for select
  using (
    auth.uid() = id
    or couple_id in (select couple_id from profiles where id = auth.uid())
  );

drop policy if exists "Users update own profile" on profiles;
create policy "Users update own profile"
  on profiles for update using (auth.uid() = id);

drop policy if exists "Users insert own profile" on profiles;
create policy "Users insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Couples: baca couple sendiri
drop policy if exists "Couple members read couple" on couples;
create policy "Couple members read couple"
  on couples for select
  using (id in (select couple_id from profiles where id = auth.uid()));

drop policy if exists "Anyone insert couple" on couples;
create policy "Anyone insert couple"
  on couples for insert with check (true);

-- FIX: couples perlu bisa di-update (saat partner bergabung)
drop policy if exists "Couple members update couple" on couples;
create policy "Couple members update couple"
  on couples for update
  using (id in (select couple_id from profiles where id = auth.uid()));

-- Dates: akses hanya untuk pasangan yang sama
drop policy if exists "Couple members read dates" on dates;
create policy "Couple members read dates"
  on dates for select
  using (couple_id in (select couple_id from profiles where id = auth.uid()));

drop policy if exists "Couple members insert dates" on dates;
create policy "Couple members insert dates"
  on dates for insert
  with check (couple_id in (select couple_id from profiles where id = auth.uid()));

drop policy if exists "Couple members update dates" on dates;
create policy "Couple members update dates"
  on dates for update
  using (couple_id in (select couple_id from profiles where id = auth.uid()));

drop policy if exists "Couple members delete dates" on dates;
create policy "Couple members delete dates"
  on dates for delete
  using (couple_id in (select couple_id from profiles where id = auth.uid()));

-- Milestones: akses hanya untuk pasangan yang sama
drop policy if exists "Couple members read milestones" on milestones;
create policy "Couple members read milestones"
  on milestones for select
  using (couple_id in (select couple_id from profiles where id = auth.uid()));

drop policy if exists "Couple members insert milestones" on milestones;
create policy "Couple members insert milestones"
  on milestones for insert
  with check (couple_id in (select couple_id from profiles where id = auth.uid()));

drop policy if exists "Couple members delete milestones" on milestones;
create policy "Couple members delete milestones"
  on milestones for delete
  using (couple_id in (select couple_id from profiles where id = auth.uid()));

-- ============================================================
-- FIX: Auto-create profile saat user register via Supabase Auth
-- (Fallback jika signUp di kode gagal insert manual)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORAGE BUCKET untuk foto (jalankan terpisah jika perlu)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('date-photos', 'date-photos', true);
