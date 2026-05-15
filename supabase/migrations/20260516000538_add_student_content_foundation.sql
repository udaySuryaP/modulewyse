-- ModuleWyse student content and conversation foundation.

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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
