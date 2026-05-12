# 04 — Tech Stack

## Frontend
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- react-hook-form
- zod
- lucide-react
- react-markdown + remark-gfm

## Backend
- Next.js Route Handlers
- Supabase Auth
- Supabase PostgreSQL
- Supabase pgvector
- Supabase Storage
- Upstash Redis
- Vercel

## AI
- Generation: OpenAI `o4-mini`
- Verification: OpenAI `o4-mini`
- Embeddings: OpenAI `text-embedding-3-small`
- Vector dimension: `1536`

## Environment
```env
OPENAI_API_KEY=
OPENAI_ANSWER_MODEL=o4-mini
OPENAI_VERIFIER_MODEL=o4-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Rule
Do not hardcode model IDs. Keep provider/model swappable through config.
