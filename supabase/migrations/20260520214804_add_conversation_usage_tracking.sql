-- Track lightweight per-user conversation usage for sidebar sorting.
-- RLS remains responsible for ensuring users can update only their own rows.

alter table public.conversations
  add column if not exists access_count integer not null default 0,
  add column if not exists last_accessed_at timestamptz;

do $$
begin
  alter table public.conversations
    add constraint conversations_access_count_nonnegative
    check (access_count >= 0);
exception
  when duplicate_object then null;
end $$;

create index if not exists conversations_usage_sort_idx
on public.conversations (
  user_id,
  access_count desc,
  last_accessed_at desc nulls last,
  updated_at desc,
  created_at desc
);

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
