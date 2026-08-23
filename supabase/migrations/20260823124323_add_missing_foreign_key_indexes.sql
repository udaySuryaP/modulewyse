-- Supporting indexes for foreign keys reported by the Supabase performance advisor.
-- These indexes improve joins, cascades, and user-scoped lookups as data grows.

create index if not exists message_feedback_user_id_idx
  on public.message_feedback (user_id);

create index if not exists messages_conversation_id_idx
  on public.messages (conversation_id);

create index if not exists messages_user_id_idx
  on public.messages (user_id);

create index if not exists topics_subject_id_idx
  on public.topics (subject_id);
