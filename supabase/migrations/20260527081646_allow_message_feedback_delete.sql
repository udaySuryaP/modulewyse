drop policy if exists "Users can delete feedback for own conversation messages" on public.message_feedback;
create policy "Users can delete feedback for own conversation messages"
on public.message_feedback
for delete
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
);

grant delete
on public.message_feedback
to authenticated;
