create table if not exists public.citizen_app_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  saved_scheme_ids text[] not null default '{}',
  tracked_items jsonb not null default '[]'::jsonb
    check (jsonb_typeof(tracked_items) = 'array'),
  updated_at timestamptz not null default now()
);

alter table public.citizen_app_data enable row level security;

drop policy if exists "Users can read their own scheme data" on public.citizen_app_data;
create policy "Users can read their own scheme data"
  on public.citizen_app_data for select
  to authenticated
  using ((select auth.uid()) = user_id);

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

grant select, insert, update on public.citizen_app_data to authenticated;
