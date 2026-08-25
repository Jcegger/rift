-- riftbound.jayegger.com state table.
-- Run once in the Supabase SQL editor for the project whose URL and publishable
-- key are set at the top of the script in index.html.
--
-- Same single-row shape as the LSAT tracker: one row per user id, the whole app
-- state as JSON. The app upserts with Prefer: resolution=merge-duplicates, which
-- needs the primary key on id.

create table if not exists public.riftbound (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.riftbound enable row level security;

-- The publishable key is public, so these policies are what allow the static page
-- to read and write. Scoped to this table only. Nothing sensitive lives here, and
-- the Backup button in the header is the recovery path.
drop policy if exists "anon read"   on public.riftbound;
drop policy if exists "anon insert" on public.riftbound;
drop policy if exists "anon update" on public.riftbound;

create policy "anon read"   on public.riftbound for select using (true);
create policy "anon insert" on public.riftbound for insert with check (true);
create policy "anon update" on public.riftbound for update using (true) with check (true);

-- Keep updated_at honest so it is obvious when the last write landed.
create or replace function public.riftbound_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists riftbound_touch on public.riftbound;
create trigger riftbound_touch before update on public.riftbound
  for each row execute function public.riftbound_touch();
