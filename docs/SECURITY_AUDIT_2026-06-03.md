# ModuleWyse Security, Infrastructure, Repo, And Production Risk Audit

Date: 2026-06-03  
Branch: `rag-quality`  
Audited commit: `a35cefa`  
Production URL: `https://modulewyse.vercel.app`  
Production deployment checked: `dpl_58VqJnuqzUuPaUNbrPwNho4HBECG`  
Production commit checked: `6d6fc53124869a26d181bcd0475df2c6316a573b`

## Executive Summary

ModuleWyse has no confirmed secret exposure, no repeated production route failure from logged-out probes, and live Supabase RLS is enabled on all public tables inspected. The RAG implementation remains server-side, rate-limited, source-restricted to ready PBCST304 note chunks, and guarded against Module 4 / Module 5 / out-of-scope retrieval.

The main release risks are not a broken core app flow, but hardening and data-cleanliness issues:

- Critical: live Supabase still contains Module 5 placeholder rows for non-OOP/TBD KTU subjects, even though Module 5 is not part of the KTU 2024 scheme. Current app code filters these from subject/library views, and RAG does not use them, but the live data contradicts the canonical rule and should be cleaned.
- Medium: production responses lack several standard security headers, including CSP, frame protection, content-type sniffing protection, referrer policy, and permissions policy.
- Medium: Supabase security advisor reports `vector` installed in `public` and leaked-password protection disabled.
- Medium: npm audit still reports the known moderate PostCSS advisory through Next.
- Medium/low: GitHub/Vercel release hygiene can improve: deployed commit metadata shows unverified commit status, and GitHub/Vercel CLI tools were unavailable locally for direct branch-protection/env verification.

## Remediation Update - 2026-06-03

The two action items from this audit were remediated on branch `rag-quality` after the initial read-only audit:

- Inspected live Module 5 placeholder rows for KTU 2024 subjects before deletion.
- Confirmed the four live Module 5 placeholder rows had zero dependent topics, content sources, content chunks, or previous-year questions.
- Applied Supabase migration `remove_ktu2024_module5_placeholders`.
- Removed the four KTU 2024 Module 5 placeholder rows for `cn`, `dbms`, `ds`, and `os`.
- Added a `subjects.scheme` column with default `2024`.
- Added a database trigger guard that rejects any KTU 2024 module row with `module_number >= 5`.
- Verified the guard rejects a test Module 5 insert with: `Module 5 is not part of the KTU 2024 scheme.`
- Verified live KTU 2024 Module 5+ row count is now `0`.
- Verified OOP/PBCST304 still has Modules 1-4 only.
- Verified ready embedded PBCST304 note chunk counts remain unchanged: Module 1 = 107, Module 2 = 42, Module 3 = 29.
- Added global Next.js security headers through `next.config.ts`: CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- Verified headers locally from the built app on `/`.
- Ran `npm install`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `npm audit --audit-level=high`.
- Ran `npm run content:preview`, `npm run questions:preview`, and `npm run embeddings:status`.
- `npm run retrieval:test` was attempted twice and failed before retrieval with an `UND_ERR_SOCKET` fetch failure, consistent with an external embedding/network call failure rather than a Module 5 cleanup regression.

No RAG retrieval scope, source restrictions, auth, rate limiting, OpenAI behavior, RLS policy, user data, or environment secrets were changed.

## Scope And Methodology

This audit was read-only except for creating this report and updating `progress.md`.

Checks performed:

- Local git branch, sync, ignored files, and repo cleanliness checks.
- Secret name and token-safety scans across tracked files.
- Local validation: install, TypeScript, lint, build, npm audit, npm outdated.
- Production route/API logged-out probes.
- Vercel project/deployment/build-log inspection via connector.
- Supabase project, migrations, RLS, policies, grants, functions, extensions, advisors, logs, storage buckets, and content metadata via connector.
- RAG code review for auth order, validation, rate limit placement, retrieval restrictions, and fallback behavior.
- Content and retrieval scripts:
  - `npm run content:preview`
  - `npm run questions:preview`
  - `npm run embeddings:status`
  - `npm run retrieval:test`

Not performed:

- No authenticated browser QA with a live user during this audit.
- No destructive Supabase writes or cleanup.
- No production deployment, branch merge, or release tag.
- No Upstash/OpenAI dashboard inspection because those dashboards were not available through local tools in this session.
- No GitHub branch protection / secret scanning dashboard verification because `gh` was not installed and connector access did not expose those settings.

## Baseline

Local branch state:

- Active branch: `rag-quality`
- Tracking: `origin/rag-quality`
- Latest branch commit: `a35cefa Add dataset preparation and QA guides`
- Working tree before report: clean
- `.env.local` is ignored and not tracked
- Ignored local-only files include `.env.local`, `.next/`, `.vercel/`, `node_modules/`, local dev logs, Supabase temp state, and TypeScript build info

Remote/deployment state:

- `origin/main` latest observed: `6d6fc53 Fix recent chats sidebar height`
- Production deployment is from `main` commit `6d6fc53124869a26d181bcd0475df2c6316a573b`
- Latest Vercel deployment overall was a preview deployment from `rag-quality` commit `a35cefa`
- Production alias points to `https://modulewyse.vercel.app`
- Vercel project framework: Next.js
- Vercel project Node version: `24.x`
- Production build log completed successfully

## Validation Results

- `npm install`: passed; package-lock churn was restored because it was local install normalization, not an intentional change.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build`: passed with Next.js `16.2.6` and Turbopack.
- `npm audit --audit-level=high`: passed for high severity; reports 2 moderate vulnerabilities.
- `npm audit`: failed only because of the known moderate PostCSS advisory through Next.
- `npm outdated`: several packages have newer wanted/latest versions, including Next `16.2.7`, Supabase JS `2.107.0`, OpenAI `6.41.0`, React `19.2.7`, and UI/dev packages.

## Production Route And API Probe Results

Logged-out route probes:

- `/`: 200
- `/login`: 200
- `/signup`: 200
- `/privacy`: 200
- `/terms`: 200
- `/chat`: 307 redirect to `/login?next=%2Fchat`
- `/subjects`: 307 redirect to `/login?next=%2Fsubjects`
- `/library`: 307 redirect to `/login?next=%2Flibrary`
- `/settings`: 307 redirect to `/login?next=%2Fsettings`

Logged-out API probes:

- `POST /api/chat/answer` with `{}` returned 401 `Authentication required.`
- `POST /api/feedback` with `{}` returned 401 `Authentication required.`

Security headers observed:

- Present: `Strict-Transport-Security`
- Missing on probed responses: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- Public page responses included `Access-Control-Allow-Origin: *`

## Supabase Findings

Project:

- Project: `modulewyse`
- Project ref: `frcdrjfupoqnlgqiwffy`
- Region: `ap-northeast-2`
- Status: `ACTIVE_HEALTHY`
- PostgreSQL: `17.6.1.121`

Migrations applied:

- Student auth/profile foundation and hardening
- Content foundation, sources, chunks, embeddings
- Previous-year questions
- Conversation usage/pin/title actions
- App feedback
- Message feedback delete support
- App feedback grant hardening
- Owned assistant message update support

RLS and grants:

- RLS is enabled on every public table inspected:
  - `profiles`
  - `conversations`
  - `messages`
  - `message_feedback`
  - `app_feedback`
  - `subjects`
  - `modules`
  - `topics`
  - `content_sources`
  - `content_chunks`
  - `previous_questions`
  - `previous_question_appearances`
- No `anon` table grants were found for public tables.
- Authenticated grants are present only where expected and are constrained by RLS policies.
- User-owned tables use owner policies with `auth.uid()`.
- `message_feedback` delete/update/insert policies check both feedback ownership and conversation ownership.
- `app_feedback` insert/select policies are owner-scoped.

Functions:

- `handle_new_user` is `SECURITY DEFINER` with `search_path=public`.
- `mark_conversation_used` checks `user_id = auth.uid()` before updating.
- `match_content_chunks` filters ready chunks, ready sources, embedded vectors, available/beta subjects, optional subject slug, optional module number, and caps result count.
- `match_content_chunks` was not granted to `anon` or `authenticated` in routine privilege checks; app retrieval calls it through the server-side service client.

Storage:

- No Supabase storage buckets were present.

Security advisors:

- `extension_in_public`: `vector` is installed in `public`.
- `auth_leaked_password_protection`: leaked-password protection is disabled.

Performance advisors:

- Unindexed foreign keys:
  - `message_feedback.user_id`
  - `messages.conversation_id`
  - `messages.user_id`
  - `topics.subject_id`
- Unused indexes were reported for several conversation, feedback, content, and previous-question indexes. These are informational and should be reviewed after real beta usage volume exists.

Logs:

- Recent auth logs showed normal request/login activity.
- Recent Postgres logs showed connection/checkpoint activity and no obvious repeated application error pattern in the sampled output.
- Logs can contain user identifiers/email addresses through Supabase Auth; avoid copying raw log lines into public artifacts.

## RAG, Content, And Academic Scope Checks

Code-level RAG controls:

- `/api/chat/answer` authenticates before request processing.
- Invalid JSON, empty question, long question, and invalid answer type are rejected before retrieval/OpenAI.
- Rate limiting runs before conversation writes, retrieval, embeddings, and OpenAI answer generation.
- Production missing Upstash configuration fails closed with a safe generic 500.
- Development missing Upstash configuration fails open and logs a server-side warning.
- Retrieval is server-only and uses service role only from server-side code.
- Retrieval hard-filters to:
  - subject slug `oop`
  - subject code `PBCST304`
  - source type `notes`
  - status `ready`
  - retrieval eligible chunks
  - Modules 1, 2, and 3 only
- Previous-year questions are not in the RAG source path.
- Module 4 questions return the review-state fallback.
- Module 5 questions return the KTU 2024 outside-scheme fallback and do not call retrieval/OpenAI.
- Markdown rendering uses `react-markdown` with GFM/math/KaTeX plugins and does not enable raw HTML rendering.

Live content state:

- Ready embedded PBCST304 note chunks:
  - Module 1: 107
  - Module 2: 42
  - Module 3: 29
  - Total: 178
- No ready embedded Module 4, Module 5, PYQ, draft, or non-note chunks were found in the ready RAG source count query.
- Previous-year questions:
  - Module 1: 88
  - Module 2: 11
  - Module 4: 26
  - Module 5: 0

Content scripts:

- `npm run content:preview`: passed, generated 178 chunks from 4 sources and 310 warnings. Module 4 remains preview metadata only and no chunks were generated from it.
- `npm run questions:preview`: passed, 136 questions read, 125 ready, 11 skipped, module distribution 1/2/4 only.
- `npm run embeddings:status`: passed, 178/178 ready PBCST304 chunks embedded with `text-embedding-3-small`, dimensions 1536.
- `npm run retrieval:test`: passed; returned source chunks only from allowed PBCST304 Modules 1-3.

## Critical Findings

### C1 - Live database still contains Module 5 placeholder rows for KTU 2024 TBD subjects

Severity: Critical for academic/product correctness, mitigated for current RAG by code filters.

Evidence:

- Live `modules` query returned Module 5 rows for `cn`, `dbms`, `ds`, and `os` placeholder/TBD subjects.
- One `dbms` Module 5 row is marked `beta` with zero topics.
- Current docs and canonical rule say KTU 2024 subjects use Modules 1-4 only and Module 5 is not part of the KTU 2024 scheme.
- `progress.md` and QA docs contain statements that live KTU 2024 subjects have no Module 5 rows, which is now false for the live database.

Mitigations already present:

- `lib/data/subjects.ts` filters subject modules to `module_number <= 4`.
- `lib/data/library.ts` filters library modules to `<= 4`.
- RAG retrieval only uses PBCST304 ready note chunks from Modules 1-3.
- No Module 5 content sources/chunks/PYQs were found in the ready RAG source counts.

Recommended fix:

- Apply a controlled Supabase migration to remove or archive all Module 5 rows for KTU 2024 placeholder subjects.
- Add a database-level guard or seed rule to prevent future KTU 2024 Module 5 records.
- Update any stale QA doc statements after the live data is cleaned.

## High Findings

No unmitigated high-severity application security issue was confirmed during this audit.

## Medium Findings

### M1 - Missing production security headers

Severity: Medium.

Production responses include HSTS, but do not include:

- `Content-Security-Policy`
- `X-Frame-Options` or CSP `frame-ancestors`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`

Public pages also showed `Access-Control-Allow-Origin: *`.

Recommended fix:

- Add a conservative `headers()` configuration in `next.config.ts`.
- Prefer CSP `frame-ancestors 'none'` over only `X-Frame-Options`.
- Add `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive `Permissions-Policy`.
- Review whether global `Access-Control-Allow-Origin: *` is needed.

### M2 - Supabase security advisor warnings remain

Severity: Medium.

Warnings:

- `vector` extension installed in `public`.
- Supabase Auth leaked-password protection is disabled.

Recommended fix:

- Plan a migration/test window to move `vector` to a non-public schema if feasible with current pgvector columns/functions.
- Enable leaked-password protection in Supabase Auth after confirming UX and email/auth settings.

### M3 - Known moderate PostCSS advisory remains through Next

Severity: Medium.

`npm audit --audit-level=high` passes, but plain `npm audit` reports:

- `postcss <8.5.10`
- advisory: GHSA-qx2v-qp2m-jg93
- path: Next's transitive dependency

Recommended fix:

- Do not run `npm audit fix --force`; it proposes a breaking downgrade path.
- Track a safe Next patch release and upgrade Next/ESLint config together after testing.

### M4 - Supabase performance advisor items should be reviewed before growth

Severity: Medium.

Unindexed FK advisors appeared for `message_feedback`, `messages`, and `topics`. This is not a launch blocker for small beta, but it can affect deletes/updates and list queries as beta data grows.

Recommended fix:

- Add covering indexes for FK columns used in owner-scoped queries and cascades, especially `messages.conversation_id`, `messages.user_id`, and `message_feedback.user_id`.
- Re-check advisor output after migration.

### M5 - GitHub/Vercel release hygiene is incomplete

Severity: Medium.

Evidence:

- Vercel production deployment metadata reports the deployed GitHub commit as `unverified`.
- GitHub CLI is not installed locally, so branch protection, required checks, Dependabot state, secret scanning, and PR status could not be verified from this workspace.
- Vercel CLI is not installed locally, so env var presence could not be independently listed from CLI.

Recommended fix:

- Enable/require signed or verified commits before public launch if practical.
- Verify branch protection, required checks, Dependabot alerts, secret scanning, and code scanning in GitHub UI or install/configure `gh`.
- Verify Vercel env var names in dashboard/CLI before each production promotion.

## Low Findings

### L1 - Content preview still has many extraction warnings

Severity: Low for security, medium for answer-quality hygiene.

`npm run content:preview` completed but reported 310 warnings from parsed academic material. This is already mitigated by reviewed ready chunks and source restrictions, but future subject work should reduce warnings before ingestion.

### L2 - `.env.example` uses the older embedding env alias

Severity: Low.

`.env.example` contains `EMBEDDING_MODEL=`, while server code supports `EMBEDDING_MODEL` and `OPENAI_EMBEDDING_MODEL`. Production prompts and docs often refer to `OPENAI_EMBEDDING_MODEL`.

Recommended fix:

- Add `OPENAI_EMBEDDING_MODEL=` to `.env.example` or document the alias clearly.

### L3 - Stale/legacy branches remain

Severity: Low.

Remote/local branch names include older workflow branches such as `designupdate`, `contentingestion`, `embedding-foundation`, `onboarding`, `rag-answer-generation`, and `rate-limiting`. They are not an immediate code risk, but they add repo clutter.

Recommended fix:

- After confirming no open PRs depend on them, prune merged/stale branches.

## Secret And Client Bundle Safety

Tracked-file grep found secret names only in:

- `.env.example` placeholders
- server-only env access
- server/API code
- scripts
- docs/progress entries

No real secret values were found in tracked files during grep checks.

Client bundle scan:

- No exact server secret env names were found in `.next/static`.
- `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and Upstash REST token references remain server-side.

Known local ignored files:

- `.env.local`
- `.vercel/`
- `.next/`
- `node_modules/`
- local dev logs
- Supabase temp state
- TypeScript build info

## Infrastructure Summary

Vercel:

- Production deployment ready.
- Production URL alias active.
- Build logs succeeded.
- Analytics and Speed Insights are integrated in `app/layout.tsx`.
- Direct env presence could not be listed because Vercel CLI was unavailable and connector did not expose env variables.

Supabase:

- Project active/healthy.
- RLS enabled on all public tables.
- No public storage buckets.
- No Edge Functions deployed.
- Live security advisors have two warnings.

Upstash:

- Code uses server-only Upstash REST URL/token.
- Production missing config fails closed before generation.
- Dashboard/usage was not directly inspected in this audit.

OpenAI:

- API key access is server-only.
- Retrieval test successfully called embeddings using configured local env.
- Dashboard/cost was not directly inspected in this audit.

## Final Recommendation

Verdict after remediation: ready for continued trusted private beta, with broader public launch still deferred for remaining medium operational hardening.

Completed before broader tester expansion:

1. Cleaned live Module 5 placeholder rows for KTU 2024 subjects and prevented recurrence.
2. Added production security headers in app configuration.

Remaining before broader/public launch:

1. Enable Supabase leaked-password protection or document why it is deferred.
2. Track the moderate PostCSS/Next advisory and patch through a safe Next upgrade.
3. Verify GitHub branch protection/secret scanning and Vercel env names through dashboard or CLI.
4. Deploy the latest `rag-quality` branch or merge through the approved release path, then verify headers on production.

Recommended next prompt:

`Deploy rag-quality and verify production security headers.`
