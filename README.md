# ModuleWyse

ModuleWyse is a student-facing AI exam preparation workspace for KTU students. It turns reviewed academic notes into structured, source-backed explanations, supports different answer lengths, and keeps the study flow organized around subjects, modules, chat history, library references, and feedback.

The product is not an official KTU service. AI answers can be imperfect and should be verified against official materials.

## Current Scope

ModuleWyse currently starts with selected reviewed KTU 2024 content, with PBCST304 / Object Oriented Programming as the first supported subject.

- PBCST304 Modules 1-3 are reviewed and answer-ready.
- PBCST304 Module 4 is draft/review and excluded from RAG answers.
- KTU 2024 scheme subjects use Modules 1-4. Module 5 is not part of the KTU 2024 scheme.
- Previous-year questions are available in the Library but are not used as answer sources yet.

Public product copy should stay scalable and avoid presenting ModuleWyse as only an OOP chatbot. Authenticated academic views can show the exact subject, module, and source details where they are relevant.

## Features

- Email authentication and protected student workspace
- Syllabus-aware chat for reviewed ModuleWyse notes
- Short, medium, long, and exam-ready answer modes
- Markdown, LaTeX, code block, table, and safe Mermaid rendering
- Source chips and citations for generated answers
- Regenerate, copy, and thumbs up/down answer feedback
- Recent chat rename, delete, pin, and unpin
- Per-user RAG answer rate limiting with Upstash Redis
- Subjects and module readiness views
- Previous-year question Library
- Settings, preferences, and app feedback form
- Public Privacy Policy and Terms pages

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, shadcn/Base UI primitives |
| Auth and database | Supabase |
| AI answers and embeddings | OpenAI |
| Rate limiting | Upstash Redis |
| Rendering | react-markdown, remark-gfm, remark-math, rehype-katex |
| Hosting | Vercel |

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Fill in the required values in `.env.local`. Never commit real secrets.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

The app expects the following environment variables. See `.env.example` for placeholders.

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_ANSWER_MODEL`
- `EMBEDDING_MODEL`
- `EMBEDDING_DIMENSIONS`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Service-role, OpenAI, and Upstash secrets must stay server-only.

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Content and retrieval scripts:

```bash
npm run content:preview
npm run content:ingest
npm run questions:preview
npm run questions:ingest
npm run embeddings:generate
npm run embeddings:status
npm run retrieval:test
```

## Validation

Before pushing meaningful changes, run:

```bash
npx tsc --noEmit
npm run lint
npm run build
npm audit --audit-level=high
```

Do not run forced audit fixes without reviewing the dependency impact.

## Project Structure

```txt
app/                 Next.js App Router pages and API routes
components/          UI, landing, dashboard, chat, subject, settings components
content/             Curated academic content and generated previews
docs/                Planning, QA, content, and design documentation
lib/                 Data access, retrieval, env, preferences, helpers
scripts/             Content ingestion, embeddings, retrieval test scripts
supabase/            Schema and migrations
types/               Shared TypeScript types
PROJECT_MEMORY.md    Durable project context
progress.md          Working progress log
```

## Development Notes

- Read the relevant installed Next.js docs in `node_modules/next/dist/docs/` before changing Next.js APIs or routing behavior.
- Preserve RAG source restrictions unless the task explicitly changes them.
- Do not use Module 4, Module 5, or previous-year questions as RAG answer sources.
- KTU 2024 scheme subjects use Modules 1-4. Module 5 is not part of the KTU 2024 scheme.
- Do not touch `.env.local` or commit secrets.
- Keep UI changes separate from backend, retrieval, and database changes where possible.
- Update `progress.md` for substantial project work.

## License

Private. Not open source.
