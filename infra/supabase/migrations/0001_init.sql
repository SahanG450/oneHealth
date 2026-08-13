-- Initial schema: actors, dispensaries, queues, bookings, EMR, payments
create table if not exists users (
  id uuid primary key references auth.users(id),
  role text not null check (role in ('PATIENT','DOCTOR','STAFF','ADMIN')),
  full_name text not null,
  subscription_tier text not null default 'FREE',
  created_at timestamptz not null default now()
);

create table if not exists dispensaries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists queue_entries (
  id uuid primary key default gen_random_uuid(),
  dispensary_id uuid references dispensaries(id),
  patient_id uuid references users(id),
  status text not null default 'WAITING',
  position int,
  created_at timestamptz not null default now()
);

alter table users enable row level security;
alter table dispensaries enable row level security;
alter table queue_entries enable row level security;

-- Profiles table (the app reads/writes this). id always mirrors auth.users.id
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role text check (role in ('PATIENT','DOCTOR','STAFF','ADMIN')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are viewable by owner"
  on profiles for select
  using (auth.uid() = id);

create policy "users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create profile on auth signup so profiles.id = auth.users.id.
-- security definer bypasses RLS (the user has no session yet during email signup).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(coalesce(new.raw_user_meta_data->>'role', ''), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
