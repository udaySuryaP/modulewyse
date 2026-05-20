-- ModuleWyse embedding foundation for ready content chunks.
-- This migration prepares pgvector-backed retrieval, but does not generate
-- embeddings and does not wire retrieval into student chat.

create extension if not exists vector;

alter table public.content_chunks
  add column if not exists embedding vector(1536),
  add column if not exists embedding_model text,
  add column if not exists embedding_status text not null default 'pending',
  add column if not exists embedding_error text,
  add column if not exists embedding_generated_at timestamptz;

do $$
begin
  alter table public.content_chunks
    add constraint content_chunks_embedding_status_check
    check (embedding_status in ('pending', 'embedded', 'failed', 'skipped'));
exception
  when duplicate_object then null;
end $$;

create index if not exists content_chunks_embedding_status_idx
on public.content_chunks (embedding_status);

create index if not exists content_chunks_embedding_model_idx
on public.content_chunks (embedding_model);

create index if not exists content_chunks_embedding_hnsw_idx
on public.content_chunks
using hnsw (embedding vector_cosine_ops)
where embedding is not null
  and embedding_status = 'embedded';

create or replace function public.match_content_chunks(
  query_embedding vector(1536),
  match_count integer default 8,
  filter_subject_slug text default null,
  filter_module_number integer default null
)
returns table (
  chunk_id uuid,
  source_id uuid,
  subject_id uuid,
  module_id uuid,
  topic_id uuid,
  title text,
  content text,
  similarity double precision,
  metadata jsonb
)
language sql
stable
set search_path = public
as $$
  select
    content_chunks.id as chunk_id,
    content_chunks.source_id,
    content_chunks.subject_id,
    content_chunks.module_id,
    content_chunks.topic_id,
    content_chunks.title,
    content_chunks.content,
    1 - (content_chunks.embedding <=> query_embedding) as similarity,
    content_chunks.metadata
  from public.content_chunks
  join public.content_sources
    on content_sources.id = content_chunks.source_id
  join public.subjects
    on subjects.id = content_chunks.subject_id
  left join public.modules
    on modules.id = content_chunks.module_id
  where content_chunks.status = 'ready'
    and content_sources.status = 'ready'
    and content_chunks.embedding_status = 'embedded'
    and content_chunks.embedding is not null
    and subjects.status in ('available', 'beta')
    and (filter_subject_slug is null or subjects.slug = filter_subject_slug)
    and (filter_module_number is null or modules.module_number = filter_module_number)
  order by content_chunks.embedding <=> query_embedding
  limit least(greatest(match_count, 1), 24);
$$;

revoke all on function public.match_content_chunks(vector, integer, text, integer) from public;
revoke all on function public.match_content_chunks(vector, integer, text, integer) from anon;
revoke all on function public.match_content_chunks(vector, integer, text, integer) from authenticated;
grant execute on function public.match_content_chunks(vector, integer, text, integer) to service_role;
