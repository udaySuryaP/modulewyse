create table if not exists public.app_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  feedback text not null,
  reply_email text not null,
  status text not null default 'open',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_feedback_subject_length_check
    check (char_length(trim(subject)) between 3 and 120),
  constraint app_feedback_feedback_length_check
    check (char_length(trim(feedback)) between 10 and 4000),
  constraint app_feedback_reply_email_length_check
    check (char_length(trim(reply_email)) between 3 and 254),
  constraint app_feedback_reply_email_format_check
    check (reply_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint app_feedback_status_check
    check (status in ('open', 'reviewed', 'closed'))
);

create index if not exists app_feedback_user_created_at_idx
on public.app_feedback (user_id, created_at desc);

create index if not exists app_feedback_status_created_at_idx
on public.app_feedback (status, created_at desc);

drop trigger if exists app_feedback_set_updated_at on public.app_feedback;
create trigger app_feedback_set_updated_at
before update on public.app_feedback
for each row
execute function public.set_updated_at();

alter table public.app_feedback enable row level security;

drop policy if exists "Users can insert their own app feedback" on public.app_feedback;
create policy "Users can insert their own app feedback"
on public.app_feedback
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can select their own app feedback" on public.app_feedback;
create policy "Users can select their own app feedback"
on public.app_feedback
for select
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert
on public.app_feedback
to authenticated;
