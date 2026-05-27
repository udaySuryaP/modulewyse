drop policy if exists "Users can update assistant messages in own conversations" on public.messages;
create policy "Users can update assistant messages in own conversations"
on public.messages
for update
to authenticated
using (
  user_id = (select auth.uid())
  and role = 'assistant'
  and exists (
    select 1
    from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.user_id = (select auth.uid())
  )
)
with check (
  user_id = (select auth.uid())
  and role = 'assistant'
  and exists (
    select 1
    from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.user_id = (select auth.uid())
  )
);

grant update
on public.messages
to authenticated;
