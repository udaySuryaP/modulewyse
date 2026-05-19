-- ModuleWyse curated academic content foundation.
-- Text-only content tables for future retrieval. No embeddings/vector columns.

create table if not exists public.content_sources (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  title text not null,
  source_type text not null,
  status text not null default 'draft',
  origin text,
  file_name text,
  source_url text,
  content_hash text,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_sources_source_type_check
    check (source_type in ('notes', 'syllabus', 'answer_key', 'previous_question', 'manual', 'other')),
  constraint content_sources_status_check
    check (status in ('draft', 'ready', 'archived')),
  constraint content_sources_subject_file_name_key
    unique (subject_id, file_name)
);

create table if not exists public.content_chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.content_sources(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  chunk_index integer not null,
  title text,
  content text not null,
  token_count integer,
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_chunks_index_check
    check (chunk_index >= 0),
  constraint content_chunks_status_check
    check (status in ('draft', 'ready', 'archived')),
  constraint content_chunks_source_index_key
    unique (source_id, chunk_index)
);

create index if not exists content_sources_subject_id_idx
on public.content_sources (subject_id);

create index if not exists content_sources_module_id_idx
on public.content_sources (module_id);

create index if not exists content_sources_topic_id_idx
on public.content_sources (topic_id);

create index if not exists content_sources_status_idx
on public.content_sources (status);

create index if not exists content_sources_source_type_idx
on public.content_sources (source_type);

create index if not exists content_chunks_source_id_idx
on public.content_chunks (source_id);

create index if not exists content_chunks_subject_id_idx
on public.content_chunks (subject_id);

create index if not exists content_chunks_module_id_idx
on public.content_chunks (module_id);

create index if not exists content_chunks_topic_id_idx
on public.content_chunks (topic_id);

create index if not exists content_chunks_status_idx
on public.content_chunks (status);

drop trigger if exists content_sources_set_updated_at on public.content_sources;
create trigger content_sources_set_updated_at
before update on public.content_sources
for each row
execute function public.set_updated_at();

drop trigger if exists content_chunks_set_updated_at on public.content_chunks;
create trigger content_chunks_set_updated_at
before update on public.content_chunks
for each row
execute function public.set_updated_at();

alter table public.content_sources enable row level security;
alter table public.content_chunks enable row level security;

drop policy if exists "Authenticated users can read ready content sources" on public.content_sources;
create policy "Authenticated users can read ready content sources"
on public.content_sources
for select
to authenticated
using (
  status = 'ready'
  and exists (
    select 1
    from public.subjects
    where subjects.id = content_sources.subject_id
      and subjects.status in ('available', 'beta')
  )
);

drop policy if exists "Authenticated users can read ready content chunks" on public.content_chunks;
create policy "Authenticated users can read ready content chunks"
on public.content_chunks
for select
to authenticated
using (
  status = 'ready'
  and exists (
    select 1
    from public.content_sources
    join public.subjects
      on subjects.id = content_sources.subject_id
    where content_sources.id = content_chunks.source_id
      and content_sources.status = 'ready'
      and subjects.status in ('available', 'beta')
  )
);
