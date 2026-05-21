# ModuleWyse Project Memory

This file is the durable project memory for future sessions.

## Product
ModuleWyse is a KTU AI exam-prep web app for students. It focuses on syllabus-grounded, module-aware, exam-ready answers from curated academic content managed by the platform.

## Scope
- Student-side MVP first.
- CSE and important subjects first.
- Object Oriented Programming is the first subject to prove quality.
- For KTU 2024 scheme PBCST304 / Object Oriented Programming, Modules 1-3 are ready, Module 4 is draft/review, and Module 5 does not exist in the KTU 2024 scheme for PBCST304.
- Admin UI, student uploads, OCR, payments, faculty tools, and all-branch coverage are deferred.

## Technical Direction
- Next.js 16 App Router with TypeScript.
- Tailwind CSS v4 and shadcn/base-ui component patterns.
- Supabase Auth, PostgreSQL, RLS, and pgvector are planned.
- OpenAI models must stay configurable through env vars.
- Embeddings use `text-embedding-3-small` with `1536` dimensions.

## Quality Rules
- Do not rely on the model alone for correctness.
- Retrieve only visible, published content from beta/available subjects.
- Return an insufficient-source state instead of hallucinating.
- Do not expose service role keys or editable user roles to the browser.
- Do not publish a subject until eval quality gates pass.

## Session Workflow
- Read `AGENTS.md` and relevant local Next docs before touching Next APIs.
- Keep changes scoped to the active phase/ticket.
- Run lint and build after implementation work.
- Update `progress.md` at the end of each working session with completed work, issues, and next steps.
