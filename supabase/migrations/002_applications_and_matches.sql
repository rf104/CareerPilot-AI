-- CareerPilot AI: per-user job applications and AI match results.
-- Run in the Supabase SQL editor after 001_resumes.sql.

-- ----------------------------------------------------------- applications
create table if not exists public.applications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  company      text not null check (char_length(company) between 1 and 200),
  position     text not null check (char_length(position) between 1 and 200),
  description  text not null default '' check (char_length(description) <= 20000),
  location     text not null default '' check (char_length(location) <= 200),
  url          text not null default '' check (char_length(url) <= 1000),
  date_applied date not null default current_date,
  status       text not null default 'Wishlist'
               check (status in ('Wishlist','Applied','Assessment','Interview','Offer','Rejected')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists applications_user_idx on public.applications (user_id, created_at desc);

-- ---------------------------------------------------------- match_results
-- One row per (resume, job) analysis; job_hash lets us reuse a result instead of
-- paying for the same LLM call twice.
create table if not exists public.match_results (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  resume_id      uuid not null references public.resumes (id) on delete cascade,
  application_id uuid references public.applications (id) on delete set null,
  job_title      text not null default '',
  company        text not null default '',
  job_hash       text not null,
  overall_score  integer not null check (overall_score between 0 and 100),
  result         jsonb not null,
  created_at     timestamptz not null default now(),
  unique (user_id, resume_id, job_hash)
);

create index if not exists match_results_user_idx on public.match_results (user_id, created_at desc);

-- -------------------------------------------------------------------- RLS
alter table public.applications  enable row level security;
alter table public.match_results enable row level security;

create policy "applications: owner all" on public.applications
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "match_results: owner select" on public.match_results
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "match_results: owner insert" on public.match_results
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = (select auth.uid()))
  );
create policy "match_results: owner delete" on public.match_results
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Keep updated_at fresh on edits.
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists applications_touch on public.applications;
create trigger applications_touch before update on public.applications
  for each row execute function public.touch_updated_at();
