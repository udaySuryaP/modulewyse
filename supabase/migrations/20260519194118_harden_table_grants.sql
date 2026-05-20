-- Harden Data API table privileges.
-- RLS remains the primary row-level control, but table grants should still
-- follow least privilege so anon/authenticated roles cannot even attempt
-- operations the app does not need.

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
   public.content_chunks
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
