# 10 — Security and RLS

## Rules
- Never trust client role checks.
- Do not store role in editable profile.
- Students can access only their own user data.
- Students can read only published chunks from beta/available subjects.
- Service role key must never reach browser.

## Role model
Use `user_roles`, not `profiles.role`.

## Chunk read policy logic
```sql
content_chunks.status = 'published'
and exists (
  select 1 from subjects s
  where s.id = content_chunks.subject_id
  and s.status in ('beta', 'available')
)
```

## Conversation RLS
Users can read/write their own conversations only. Assistant messages should be inserted server-side.

## Manual tests before beta
- student cannot read hidden subject chunks
- student cannot edit role
- student cannot access another user's conversations
- unauthenticated users redirect to login
- service role key is not in client bundle
