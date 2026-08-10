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
