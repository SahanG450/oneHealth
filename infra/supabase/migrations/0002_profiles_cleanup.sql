-- 1. Dedupe profiles: keep the earliest row per id
delete from public.profiles p
using public.profiles d
where p.id = d.id
  and p.created_at > d.created_at;

-- 2. Ensure profiles.id has a primary key / unique constraint
--    (required so the trigger's ON CONFLICT works and .single() returns 1 row)
do $$
begin
  if not exists (
    select 1 from pg_constraint c
    where c.conrelid = 'public.profiles'::regclass
      and c.contype in ('p', 'u')
  ) then
    alter table public.profiles add primary key (id);
  end if;
end $$;

-- 3. Ensure columns used by the app exist (safe to run even if already present)
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists full_name text not null default '';
alter table public.profiles add column if not exists role text check (role in ('PATIENT','DOCTOR','STAFF','ADMIN'));

-- 4. Backfill profiles for auth users created before the trigger existed
insert into public.profiles (id, full_name, phone, role)
select
  au.id,
  coalesce(au.raw_user_meta_data->>'full_name', ''),
  nullif(au.raw_user_meta_data->>'phone', ''),
  coalesce(au.raw_user_meta_data->>'role', 'PATIENT')
from auth.users au
left join public.profiles p on p.id = au.id
where p.id is null
on conflict (id) do nothing;