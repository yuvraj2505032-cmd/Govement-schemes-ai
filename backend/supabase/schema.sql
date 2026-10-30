create table if not exists public.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.app_admins enable row level security;

drop policy if exists "Users can check their own admin status" on public.app_admins;
create policy "Users can check their own admin status"
  on public.app_admins for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.app_admins from anon, authenticated;
grant select on public.app_admins to authenticated;

create or replace function public.is_app_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.app_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_app_admin() from public, anon;
grant execute on function public.is_app_admin() to authenticated;

create table if not exists public.citizen_app_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  saved_scheme_ids text[] not null default '{}',
  tracked_items jsonb not null default '[]'::jsonb
    check (jsonb_typeof(tracked_items) = 'array'),
  profile jsonb
    check (profile is null or jsonb_typeof(profile) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.citizen_app_data
  add column if not exists profile jsonb
    check (profile is null or jsonb_typeof(profile) = 'object');

alter table public.citizen_app_data enable row level security;

drop policy if exists "Users can read their own scheme data" on public.citizen_app_data;
create policy "Users can read their own scheme data"
  on public.citizen_app_data for select
  to authenticated
  using ((select auth.uid()) = user_id or public.is_app_admin());

drop policy if exists "Users can insert their own scheme data" on public.citizen_app_data;
create policy "Users can insert their own scheme data"
  on public.citizen_app_data for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own scheme data" on public.citizen_app_data;
create policy "Users can update their own scheme data"
  on public.citizen_app_data for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on public.citizen_app_data from anon, authenticated;
grant select, insert, update on public.citizen_app_data to authenticated;

create table if not exists public.managed_official_sites (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 120),
  url text not null check (url ~ '^https://([a-zA-Z0-9-]+\.)*(gov\.in|nic\.in)(/|$)'),
  description text not null default '' check (length(description) <= 1000),
  category text not null default 'Government scheme',
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.managed_official_sites enable row level security;

drop policy if exists "Anyone can view official websites" on public.managed_official_sites;
create policy "Anyone can view official websites"
  on public.managed_official_sites for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can add official websites" on public.managed_official_sites;
create policy "Admins can add official websites"
  on public.managed_official_sites for insert
  to authenticated
  with check (public.is_app_admin() and created_by = (select auth.uid()));

drop policy if exists "Admins can edit official websites" on public.managed_official_sites;
create policy "Admins can edit official websites"
  on public.managed_official_sites for update
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

drop policy if exists "Admins can remove official websites" on public.managed_official_sites;
create policy "Admins can remove official websites"
  on public.managed_official_sites for delete
  to authenticated
  using (public.is_app_admin());

revoke all on public.managed_official_sites from anon, authenticated;
grant select on public.managed_official_sites to anon, authenticated;
grant insert, update, delete on public.managed_official_sites to authenticated;
