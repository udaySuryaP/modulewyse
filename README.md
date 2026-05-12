# ModuleWyse

**ModuleWyse** — A curated AI exam-prep platform for KTU students with module-aware, syllabus-grounded answers from structured academic notes.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Auth / DB / Vector | Supabase (coming) |
| AI Model | OpenAI o4-mini (coming) |
| Embeddings | text-embedding-3-small (coming) |
| Deployment | Vercel |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env.local

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                  # Next.js App Router pages
  ├── page.tsx        # Landing page
  ├── login/          # Auth
  ├── signup/
  ├── forgot-password/
  ├── onboarding/     # 4-step onboarding flow
  ├── chat/           # AI chat interface
  ├── subjects/       # Subject browsing
  ├── library/        # Question history
  ├── profile/        # User profile
  └── settings/       # Account / academic / preferences
components/
  └── ui/             # shadcn/ui components
lib/
  ├── utils.ts        # cn() utility
  ├── env.ts          # Type-safe env access
  └── constants.ts    # App constants + routes + design tokens
docs/                 # Product & design documentation
```

## Docs

See [`docs/README.md`](docs/README.md) for the full documentation index.

## License

Private — not open-source.
