# ModuleWyse

ModuleWyse is a curated AI exam-prep platform for KTU students with module-aware, syllabus-grounded answers from structured academic notes.

## Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui and Base UI |
| Auth / DB / Vector | Supabase planned |
| AI Model | OpenAI model configured through env |
| Embeddings | `text-embedding-3-small` planned |
| Deployment | Vercel |

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```txt
app/                  Next.js App Router pages
components/           Reusable UI and landing components
lib/                  App constants, env access, and helpers
docs/                 Product and implementation documentation
PROJECT_MEMORY.md     Durable project direction and working rules
progress.md           End-of-session progress log
```

## Current Scope

The student-side MVP comes first: landing, auth/onboarding flow, subjects, chat, library, profile/settings, curated OOP content ingestion, RAG retrieval, answer verification, and eval gates. For KTU 2024 scheme PBCST304 / Object Oriented Programming, Modules 1-3 are ready, Module 4 is draft/review, and Module 5 does not exist in the KTU 2024 scheme for PBCST304.

Students do not upload notes. Admin UI is deferred.

## Workflow

Before coding against Next.js APIs, read the relevant installed docs in `node_modules/next/dist/docs/` because this project uses Next.js 16. At the end of each session, update `progress.md` with completed work, issues, and next steps.

## License

Private. Not open source.
