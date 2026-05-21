-- ModuleWyse student auth/profile foundation.
-- Run this SQL in the Supabase SQL editor for the project.

create extension if not exists vector;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  college_name text,
  graduation_year integer,
  branch text,
  semester integer,
  focus_subject text,
  referral_source text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_semester_check
    check (semester is null or semester between 1 and 8)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Users can select their own profile" on public.profiles;
create policy "Users can select their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.set_updated_at() from public;
revoke all on function public.set_updated_at() from anon;
revoke all on function public.set_updated_at() from authenticated;

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Student content and conversation foundation.
-- ---------------------------------------------------------------------------

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_name text not null,
  code text,
  semester integer,
  status text not null default 'draft',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subjects_status_check
    check (status in ('available', 'beta', 'coming-soon', 'draft')),
  constraint subjects_semester_check
    check (semester is null or semester between 1 and 8)
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_number integer not null,
  title text not null,
  description text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint modules_number_check
    check (module_number between 1 and 5),
  constraint modules_status_check
    check (status in ('available', 'beta', 'coming-soon', 'draft')),
  constraint modules_subject_number_key
    unique (subject_id, module_number)
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  aliases text[] not null default '{}',
  priority integer not null default 0,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint topics_status_check
    check (status in ('available', 'beta', 'coming-soon', 'draft')),
  constraint topics_module_title_key
    unique (module_id, title)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  subject_slug text,
  module_value text,
  access_count integer not null default 0,
  last_accessed_at timestamptz,
  is_pinned boolean not null default false,
  pinned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_access_count_nonnegative
    check (access_count >= 0)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  content text not null,
  answer_type text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint messages_role_check
    check (role in ('user', 'assistant'))
);

create table if not exists public.message_feedback (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating text not null,
  note text,
  created_at timestamptz not null default now(),
  constraint message_feedback_rating_check
    check (rating in ('up', 'down')),
  constraint message_feedback_message_user_key
    unique (message_id, user_id)
);

create index if not exists conversations_usage_sort_idx
on public.conversations (
  user_id,
  access_count desc,
  last_accessed_at desc nulls last,
  updated_at desc,
  created_at desc
);

create index if not exists conversations_pinned_recent_idx
on public.conversations (
  user_id,
  is_pinned desc,
  updated_at desc,
  created_at desc
);

create index if not exists conversations_pinned_at_idx
on public.conversations (
  user_id,
  pinned_at desc
)
where is_pinned = true;

drop trigger if exists subjects_set_updated_at on public.subjects;
create trigger subjects_set_updated_at
before update on public.subjects
for each row
execute function public.set_updated_at();

drop trigger if exists modules_set_updated_at on public.modules;
create trigger modules_set_updated_at
before update on public.modules
for each row
execute function public.set_updated_at();

drop trigger if exists topics_set_updated_at on public.topics;
create trigger topics_set_updated_at
before update on public.topics
for each row
execute function public.set_updated_at();

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
before update on public.conversations
for each row
execute function public.set_updated_at();

create or replace function public.mark_conversation_used(
  p_conversation_id uuid
)
returns public.conversations
language plpgsql
security invoker
set search_path = public
as $$
declare
  updated_conversation public.conversations;
begin
  update public.conversations
  set
    access_count = public.conversations.access_count + 1,
    last_accessed_at = now()
  where id = p_conversation_id
    and user_id = (select auth.uid())
  returning * into updated_conversation;

  return updated_conversation;
end;
$$;

revoke all on function public.mark_conversation_used(uuid) from public;
revoke all on function public.mark_conversation_used(uuid) from anon;
grant execute on function public.mark_conversation_used(uuid) to authenticated;

alter table public.subjects enable row level security;
alter table public.modules enable row level security;
alter table public.topics enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.message_feedback enable row level security;

drop policy if exists "Authenticated users can read visible subjects" on public.subjects;
create policy "Authenticated users can read visible subjects"
on public.subjects
for select
to authenticated
using (status in ('available', 'beta', 'coming-soon'));

drop policy if exists "Authenticated users can read visible modules" on public.modules;
create policy "Authenticated users can read visible modules"
on public.modules
for select
to authenticated
using (
  exists (
    select 1
    from public.subjects
    where subjects.id = modules.subject_id
      and subjects.status in ('available', 'beta', 'coming-soon')
  )
);

drop policy if exists "Authenticated users can read visible topics" on public.topics;
create policy "Authenticated users can read visible topics"
on public.topics
for select
to authenticated
using (
  exists (
    select 1
    from public.subjects
    where subjects.id = topics.subject_id
      and subjects.status in ('available', 'beta')
  )
);

drop policy if exists "Users can select their own conversations" on public.conversations;
create policy "Users can select their own conversations"
on public.conversations
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own conversations" on public.conversations;
create policy "Users can insert their own conversations"
on public.conversations
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own conversations" on public.conversations;
create policy "Users can update their own conversations"
on public.conversations
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own conversations" on public.conversations;
create policy "Users can delete their own conversations"
on public.conversations
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can select messages in own conversations" on public.messages;
create policy "Users can select messages in own conversations"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.user_id = (select auth.uid())
  )
);

drop policy if exists "Users can insert messages in own conversations" on public.messages;
create policy "Users can insert messages in own conversations"
on public.messages
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.user_id = (select auth.uid())
  )
);

drop policy if exists "Users can select their own feedback" on public.message_feedback;
create policy "Users can select their own feedback"
on public.message_feedback
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Users can insert feedback for own conversation messages" on public.message_feedback;
create policy "Users can insert feedback for own conversation messages"
on public.message_feedback
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.messages
    join public.conversations
      on conversations.id = messages.conversation_id
    where messages.id = message_feedback.message_id
      and conversations.user_id = (select auth.uid())
  )
);

drop policy if exists "Users can update feedback for own conversation messages" on public.message_feedback;
create policy "Users can update feedback for own conversation messages"
on public.message_feedback
for update
to authenticated
using (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.messages
    join public.conversations
      on conversations.id = messages.conversation_id
    where messages.id = message_feedback.message_id
      and conversations.user_id = (select auth.uid())
  )
)
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.messages
    join public.conversations
      on conversations.id = messages.conversation_id
    where messages.id = message_feedback.message_id
      and conversations.user_id = (select auth.uid())
  )
);

-- ---------------------------------------------------------------------------
-- Curated academic content foundation.
-- ---------------------------------------------------------------------------

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
  embedding vector(1536),
  embedding_model text,
  embedding_status text not null default 'pending',
  embedding_error text,
  embedding_generated_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_chunks_index_check
    check (chunk_index >= 0),
  constraint content_chunks_status_check
    check (status in ('draft', 'ready', 'archived')),
  constraint content_chunks_embedding_status_check
    check (embedding_status in ('pending', 'embedded', 'failed', 'skipped')),
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

create index if not exists content_chunks_embedding_status_idx
on public.content_chunks (embedding_status);

create index if not exists content_chunks_embedding_model_idx
on public.content_chunks (embedding_model);

create index if not exists content_chunks_embedding_hnsw_idx
on public.content_chunks
using hnsw (embedding vector_cosine_ops)
where embedding is not null
  and embedding_status = 'embedded';

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

-- ---------------------------------------------------------------------------
-- Previous-year question library.
-- ---------------------------------------------------------------------------

create table if not exists public.previous_questions (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  question text not null,
  question_type text not null default 'unknown',
  marks integer,
  year integer,
  exam text,
  source_file text,
  source_page integer,
  answer_available boolean not null default false,
  confidence text not null default 'medium',
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint previous_questions_question_type_check
    check (question_type in ('short', 'medium', 'long', 'part_a', 'part_b', 'part_c', 'unknown')),
  constraint previous_questions_confidence_check
    check (confidence in ('high', 'medium', 'low')),
  constraint previous_questions_status_check
    check (status in ('draft', 'ready', 'archived'))
);

create table if not exists public.previous_question_appearances (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.previous_questions(id) on delete cascade,
  year integer,
  exam text,
  source_file text,
  source_page integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists previous_questions_subject_id_idx
on public.previous_questions (subject_id);

create index if not exists previous_questions_module_id_idx
on public.previous_questions (module_id);

create index if not exists previous_questions_topic_id_idx
on public.previous_questions (topic_id);

create index if not exists previous_questions_status_idx
on public.previous_questions (status);

create index if not exists previous_questions_question_type_idx
on public.previous_questions (question_type);

create index if not exists previous_questions_year_idx
on public.previous_questions (year);

create unique index if not exists previous_questions_subject_question_hash_key
on public.previous_questions (subject_id, ((metadata ->> 'questionHash')))
where metadata ? 'questionHash';

create index if not exists previous_question_appearances_question_id_idx
on public.previous_question_appearances (question_id);

create unique index if not exists previous_question_appearances_source_key
on public.previous_question_appearances (
  question_id,
  coalesce(year, 0),
  coalesce(exam, ''),
  coalesce(source_file, ''),
  coalesce(source_page, 0)
);

drop trigger if exists previous_questions_set_updated_at on public.previous_questions;
create trigger previous_questions_set_updated_at
before update on public.previous_questions
for each row
execute function public.set_updated_at();

alter table public.previous_questions enable row level security;
alter table public.previous_question_appearances enable row level security;

drop policy if exists "Authenticated users can read ready previous questions" on public.previous_questions;
create policy "Authenticated users can read ready previous questions"
on public.previous_questions
for select
to authenticated
using (
  status = 'ready'
  and exists (
    select 1
    from public.subjects
    where subjects.id = previous_questions.subject_id
      and subjects.status in ('available', 'beta')
  )
);

drop policy if exists "Authenticated users can read ready previous question appearances" on public.previous_question_appearances;
create policy "Authenticated users can read ready previous question appearances"
on public.previous_question_appearances
for select
to authenticated
using (
  exists (
    select 1
    from public.previous_questions
    join public.subjects
      on subjects.id = previous_questions.subject_id
    where previous_questions.id = previous_question_appearances.question_id
      and previous_questions.status = 'ready'
      and subjects.status in ('available', 'beta')
  )
);

-- ---------------------------------------------------------------------------
-- Vector retrieval function for server-side retrieval testing.
-- ---------------------------------------------------------------------------

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

-- ---------------------------------------------------------------------------
-- Least-privilege Data API grants.
-- ---------------------------------------------------------------------------

revoke all on all tables in schema public from anon;
revoke all on all tables in schema public from authenticated;

grant select, insert, update
on public.profiles
to authenticated;

grant select
on public.subjects,
   public.modules,
   public.topics,
   public.content_sources,
   public.content_chunks,
   public.previous_questions,
   public.previous_question_appearances
to authenticated;

grant select, insert, update, delete
on public.conversations
to authenticated;

grant select, insert
on public.messages
to authenticated;

grant select, insert, update
on public.message_feedback
to authenticated;
