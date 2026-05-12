# 05 — Architecture

## High-level flow
```txt
Student browser
→ Next.js UI
→ Next.js route handlers
→ Supabase Auth/RLS
→ Supabase Postgres + pgvector
→ OpenAI o4-mini / text-embedding-3-small
```

## Chat flow
```txt
Validate session
→ validate subject/module visibility
→ rate limit
→ save user message
→ check verified answer
→ embed question
→ filtered vector search
→ build prompt
→ generate with o4-mini
→ verify with o4-mini
→ save assistant message
→ return answer + sources
```

## Retrieval filters
Always filter by subject. Filter by module when selected. Only retrieve chunks where chunk is published and parent subject is beta/available.

## Route structure
```txt
app/
├── page.tsx
├── login/
├── signup/
├── forgot-password/
├── onboarding/
├── chat/
├── subjects/
├── library/
├── profile/
├── settings/
└── api/
```

## Content operations
Admin UI is later. For now use scripts, seed files, Supabase dashboard, and protected internal routes.
