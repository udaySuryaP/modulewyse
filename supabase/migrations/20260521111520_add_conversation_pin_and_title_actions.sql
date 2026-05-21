alter table public.conversations
  add column if not exists is_pinned boolean not null default false,
  add column if not exists pinned_at timestamptz;

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
