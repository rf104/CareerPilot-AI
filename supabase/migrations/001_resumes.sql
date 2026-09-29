-- CareerPilot AI: per-user resume storage with pgvector.
-- Run in the Supabase SQL editor (or `supabase db push`).
--
-- Space-saving design:
--   * The PDF itself is NOT stored — only the extracted text, skills and vectors.
--   * Embeddings use halfvec(384) (16-bit floats, ~half the size of vector(384)).
--   * Chunks store character offsets into resumes.raw_text instead of a copy of the text.
--   * Identical resumes (same content hash) are stored once per user.

create extension if not exists vector with schema extensions;

-- ---------------------------------------------------------------- resumes
create table if not exists public.resumes (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  filename        text not null,
  file_size_bytes integer not null,
  content_hash    text not null,
  summary         text,
  skills          text[] not null default '{}',
  sections        jsonb not null default '{}'::jsonb,
  raw_text        text not null,
  created_at      timestamptz not null default now(),
  unique (user_id, content_hash)
);

create index if not exists resumes_user_created_idx on public.resumes (user_id, created_at desc);

-- ---------------------------------------------------------- resume_chunks
create table if not exists public.resume_chunks (
  id          bigint generated always as identity primary key,
  resume_id   uuid not null references public.resumes (id) on delete cascade,
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  chunk_index integer not null,
  char_start  integer not null,
  char_end    integer not null,
  embedding   extensions.halfvec(384) not null,
  unique (resume_id, chunk_index)
);

create index if not exists resume_chunks_user_idx on public.resume_chunks (user_id);
create index if not exists resume_chunks_embedding_idx
  on public.resume_chunks using hnsw (embedding extensions.halfvec_cosine_ops);

-- -------------------------------------------------------------------- RLS
alter table public.resumes       enable row level security;
alter table public.resume_chunks enable row level security;

create policy "resumes: owner select" on public.resumes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "resumes: owner insert" on public.resumes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "resumes: owner update" on public.resumes
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "resumes: owner delete" on public.resumes
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "chunks: owner select" on public.resume_chunks
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "chunks: owner insert" on public.resume_chunks
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = (select auth.uid()))
  );
create policy "chunks: owner delete" on public.resume_chunks
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------------------------------------------- semantic search (RLS-aware)
-- security invoker => callers only ever see their own chunks.
create or replace function public.match_resume_chunks(
  query_embedding extensions.halfvec(384),
  match_count     int  default 5,
  filter_resume   uuid default null
)
returns table (resume_id uuid, chunk_index int, content text, similarity float)
language sql stable
security invoker
set search_path = public, extensions
as $$
  select c.resume_id,
         c.chunk_index,
         substr(r.raw_text, c.char_start + 1, c.char_end - c.char_start) as content,
         1 - (c.embedding <=> query_embedding) as similarity
  from public.resume_chunks c
  join public.resumes r on r.id = c.resume_id
  where filter_resume is null or c.resume_id = filter_resume
  order by c.embedding <=> query_embedding
  limit least(match_count, 50);
$$;
