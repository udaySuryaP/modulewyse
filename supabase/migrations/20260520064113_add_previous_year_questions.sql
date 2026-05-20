-- Previous-year question library foundation.
-- Text/metadata only. No answers, embeddings, vectors, or AI output.

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

revoke all on public.previous_questions from anon;
revoke all on public.previous_question_appearances from anon;
revoke all on public.previous_questions from authenticated;
revoke all on public.previous_question_appearances from authenticated;

grant select
on public.previous_questions,
   public.previous_question_appearances
to authenticated;
