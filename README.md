# ModuleWyse

A syllabus-aware AI study workspace for KTU students, built around reviewed academic material and source-backed answers.

> ModuleWyse is an independent educational project and is not affiliated with or endorsed by APJ Abdul Kalam Technological University. AI-generated answers can be imperfect; verify important information against official course material.

## Product Status

ModuleWyse is under active private development. The current content rollout begins with the KTU 2024 scheme and PBCST304 — Object Oriented Programming.

| Content | Status |
| --- | --- |
| PBCST304 Modules 1–3 | Reviewed and available for answers |
| PBCST304 Module 4 | Draft/review; excluded from retrieval |
| Previous-year questions | Available in the Library; not used as answer sources |
| Additional subjects | Planned |

KTU 2024 scheme subjects use Modules 1–4; Module 5 is not part of that scheme.

## Features

- Email authentication and a protected student workspace
- Syllabus-aware chat grounded in reviewed ModuleWyse notes
- Short, medium, long and exam-ready answer modes
- Source chips and citations
- Markdown, LaTeX, code blocks, tables and safe Mermaid rendering
- Chat history with rename, delete, pin and unpin actions
- Regenerate, copy and answer-feedback controls
- Per-user AI-answer rate limiting with Upstash Redis
- Subject and module-readiness views
- Previous-year-question library
- Settings, preferences, feedback, privacy and terms pages

## Architecture

```text
Browser
  │
  ▼
Next.js App Router
  ├── Supabase Auth and PostgreSQL
  ├── reviewed academic-content retrieval
  ├── OpenAI answer generation and embeddings
  └── Upstash Redis rate limiting
```

The browser uses only the Supabase public URL and anonymous key. The Supabase service-role key, OpenAI key and Upstash token are server-only and must never be exposed through `NEXT_PUBLIC_*` variables.

## Technology

| Area | Technology |
| --- | --- |
| Application | Next.js 16, React 19, TypeScript |
| Styling and UI | Tailwind CSS 4, Base UI/shadcn primitives, Framer Motion |
| Authentication and data | Supabase |
| AI and embeddings | OpenAI |
| Rate limiting | Upstash Redis |
| Content rendering | react-markdown, GFM, KaTeX |
| Hosting and monitoring | Vercel, Analytics, Speed Insights |

## Repository Structure

```text
app/                 Routes, pages and server endpoints
components/          Shared UI and feature components
content/             Curated academic sources and generated previews
docs/                Product, content, design and QA documentation
lib/                 Data access, retrieval, configuration and helpers
scripts/             Content ingestion, embedding and retrieval utilities
supabase/            Database schema and migrations
types/               Shared TypeScript types
PROJECT_MEMORY.md    Durable project context
progress.md          Working progress log
```

## Local Development

### Requirements

- Node.js 20 or newer
- npm
- Supabase project
- OpenAI API key
- Upstash Redis database

### Setup

```bash
git clone https://github.com/udaySuryaP/modulewyse.git
cd modulewyse
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Windows PowerShell equivalent:

```powershell
Copy-Item .env.example .env.local
```

Fill in `.env.local` with development credentials. Never commit that file or paste real credentials into issues, logs or documentation.

## Environment Variables

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public | Canonical application URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous client key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Privileged database operations |
| `OPENAI_API_KEY` | Server only | Answer and embedding requests |
| `OPENAI_ANSWER_MODEL` | Server only | Configured answer model |
| `EMBEDDING_MODEL` | Server only | Embedding model |
| `EMBEDDING_DIMENSIONS` | Server only | Vector dimensions |
| `UPSTASH_REDIS_REST_URL` | Server only | Rate-limit datastore |
| `UPSTASH_REDIS_REST_TOKEN` | Server only | Rate-limit credential |

Use separate Supabase, OpenAI and Upstash credentials for development and production. Row Level Security must remain enabled for user-owned data.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Content and retrieval utilities:

```bash
npm run content:preview
npm run content:ingest
npm run questions:preview
npm run questions:ingest
npm run embeddings:generate
npm run embeddings:status
npm run retrieval:test
```

Some ingestion commands can modify remote data. Confirm the selected environment before running them.

## Verification

Before merging meaningful changes:

```bash
npx tsc --noEmit
npm run lint
npm run build
npm audit --audit-level=high
```

Review dependency changes manually; do not apply forced audit fixes without evaluating their impact.

## Development Guardrails

- Keep unreviewed modules and previous-year questions out of answer retrieval.
- Preserve source attribution and user-level authorization.
- Never expose service-role credentials to client components.
- Keep database migrations versioned under `supabase/`.
- Separate UI-only work from retrieval, database and authentication changes.
- Update project documentation when content readiness or architectural behavior changes.

## Deployment

The production application is hosted on Vercel. Configure secrets in the Vercel project rather than committing environment files. Use preview deployments for verification before promoting changes to production.

## License

Private and proprietary. Not open source.
