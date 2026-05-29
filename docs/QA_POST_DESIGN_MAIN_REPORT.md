# Post-Design Production QA Report

Date: 2026-05-29  
Branch: `main`  
Production URL: `https://modulewyse.vercel.app`  
Deployed commit tested: `e94df70e5b9ab88b36b946afe8e2592dffb8de45`  
QA account/session: no disposable production credentials were available in this run; Chrome and in-app browser both reached the logged-out state.

## Summary

This pass verified the post-design `main` deployment, local build health, Vercel production deployment, Vercel env presence, Supabase live schema/RLS/content scope, public/protected routes, logged-out API protection, public landing/legal/auth pages, mobile landing overflow, server-side source restrictions, and production logs.

No critical or high blockers were found. Full authenticated browser RAG, regenerate, feedback, and true 429 exhaustion were not re-executed in this pass because no authenticated disposable production session was available. Those flows previously passed before the design update and should be re-run with a confirmed QA account before wider tester expansion.

Final recommendation: ready for continued private beta, public launch still deferred.

## Local Validation

- `npm install`: passed; produced only package-lock metadata churn locally, restored before commit.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm audit --audit-level=high`: passed for high severity.
- Known advisory: npm still reports 2 moderate `postcss`/Next advisory entries; forced audit fix would downgrade/break Next and was not run.

## GitHub / Versioning

- Active branch verified as `main`.
- Local `main` synced to `origin/main`.
- Production commit matches latest intended `main` merge commit: `e94df70`.
- Recent history includes design update merge and prior rate-limiting/RAG beta work.
- Existing beta tag observed: `v0.1.0-beta.1`.
- No release/tag changes were made.

## Vercel Deployment / Env

- Production alias `https://modulewyse.vercel.app` resolves to deployment `dpl_3FQYa8ZnAJJVxLzq6fMJ8Q7ofyHE`.
- Deployment state: `READY`.
- Production deployment target: `main`.
- Build logs show successful Next.js 16.2.6 build and route generation.
- Required env names are present in Vercel Production/Preview by presence only:
  - `NEXT_PUBLIC_APP_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY`
  - `OPENAI_ANSWER_MODEL`
  - `OPENAI_EMBEDDING_MODEL`
  - `EMBEDDING_DIMENSIONS`
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- Optional `OPENAI_VERIFIER_MODEL` is also present.
- No secret values were printed.

## Supabase Infrastructure

Live project: `modulewyse` (`frcdrjfupoqnlgqiwffy`)  
Status: active/healthy from project list.

Tables verified present with RLS enabled:

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

Important migrations verified live:

- conversation pin/title actions
- app feedback
- message feedback delete support
- app feedback grant hardening
- owned assistant message update for regenerate

Policy checks confirmed:

- profiles are owner-scoped.
- conversations are owner-scoped for select/insert/update/delete.
- messages are scoped to owned conversations.
- assistant message updates are scoped to owned conversations and assistant messages.
- message feedback select/insert/update/delete is owner/conversation scoped.
- app feedback insert/select is owner-scoped.
- private user tables do not expose broad anon grants.
- authenticated content/PYQ tables are read-only through grants and RLS policies.

Advisors:

- Security warning: `vector` extension is installed in `public`.
- Security warning: leaked password protection is disabled.
- No critical Supabase advisor issue was surfaced in this pass.

## Content / Source Scope

Live PBCST304/OOP content state:

- Module 1: 107 ready embedded note chunks.
- Module 2: 42 ready embedded note chunks.
- Module 3: 29 ready embedded note chunks.
- Module 4: 0 ready embedded note chunks.
- Module 5: no rows for KTU 2024 subjects.

Live source check:

- Ready RAG chunks for PBCST304 are `notes` only.
- Ready RAG chunks exist only for Modules 1-3.
- No Module 4, Module 5, PYQ, draft, or non-note chunks appeared in the ready RAG scope.

`match_content_chunks`:

- Exists in `public`.
- `SECURITY DEFINER`: false.
- Filters ready chunks, ready sources, embedded vectors, visible subjects, optional subject/module filters, and caps match count to 24.

Application retrieval code additionally filters:

- subject slug `oop`
- subject code `PBCST304`
- source type `notes`
- status `ready`
- allowed modules `[1, 2, 3]`

## OpenAI / Upstash

OpenAI:

- Required Vercel env names are present.
- No direct OpenAI dashboard access was available in this environment.
- No excessive OpenAI calls were made in this QA pass.

Upstash:

- Required Vercel env names are present.
- Server helper remains server-only.
- Rate-limit key pattern remains `modulewyse:rag-answer:user:<userId>`.
- Policy remains 20 valid answer/regenerate attempts per authenticated user per hour.
- Code review confirms unauthenticated requests and invalid questions return before rate-limit counting, and rate-limit check occurs before conversation writes, retrieval, embeddings, or OpenAI calls.
- True Redis-backed 429 was not re-executed in this pass because no authenticated disposable session was available.

## Route QA

Logged-out public routes:

- `/`: 200
- `/login`: 200
- `/signup`: 200
- `/privacy`: 200
- `/terms`: 200

Logged-out protected routes:

- `/chat`: 307 to `/login?next=%2Fchat`
- `/subjects`: 307 to `/login?next=%2Fsubjects`
- `/library`: 307 to `/login?next=%2Flibrary`
- `/settings`: 307 to `/login?next=%2Fsettings`
- `/settings/account`: 307 to `/login?next=%2Fsettings%2Faccount`
- `/settings/academic`: 307 to `/login?next=%2Fsettings%2Facademic`
- `/settings/preferences`: 307 to `/login?next=%2Fsettings%2Fpreferences`

Logged-out API checks:

- `POST /api/chat/answer`: 401.
- `POST /api/feedback`: 401.

## Auth QA

Executed:

- Login page loads in browser.
- Invalid email/password attempt stays on login with no console errors; native email validation applies.
- Chrome production session was not logged in.
- Browser back/protected route leakage was indirectly checked by protected redirects.

Not re-executed:

- valid signup/login
- wrong password with known account
- already-used email
- forgot-password email submission
- refresh while authenticated
- logged-in redirects from `/`, `/login`, `/signup`

Reason: no disposable confirmed production credentials/session were available to this run.

## Landing / Public Design QA

Verified:

- Landing page renders with centered post-design hero.
- Hero headline is `Syllabus-grounded AI exam prep.`
- Public landing copy is product-oriented and does not market the app as only an OOP chatbot.
- Removed dashboard/chat mockup and subject coverage block are not visible in fetched/rendered landing content.
- CTAs and legal links are present.
- Public pages had no browser console errors in the in-app browser checks.
- Legal pages remain public and readable.
- Legal copy keeps practical draft placeholders and does not invent a finalized operator/contact/jurisdiction.

Mobile landing checks:

- 360px viewport: no horizontal overflow.
- 390x844 viewport: no horizontal overflow.
- 412x914 viewport: no horizontal overflow.
- CTAs remain present.

## Authenticated App QA

Not re-executed end-to-end in this pass due missing authenticated QA session:

- `/chat`
- `/subjects`
- `/subjects/oop`
- `/library`
- `/settings`
- settings subpages
- recent chats
- rename/delete/pin/unpin
- app feedback submit from Settings

Supplemental checks:

- Protected route redirects are correct when logged out.
- Supabase recent API logs show successful production authenticated profile/conversation/content/library requests without recent RLS errors in the sampled window.
- Existing RLS policies and grants remain aligned with owner-only behavior.

## Chat / RAG QA

Not re-executed with live OpenAI calls in this pass because no authenticated QA session was available and excessive OpenAI usage was explicitly avoided.

Verified by infrastructure and code inspection:

- Answer route authenticates before handling requests.
- Request validation runs before rate-limit counting.
- Rate-limit check runs before expensive retrieval/embedding/OpenAI work.
- Retrieval still targets PBCST304/OOP notes only.
- Modules 1-3 remain the only eligible RAG modules.
- Module 4 fallback logic remains present.
- Module 5 outside the KTU 2024 scheme fallback logic remains present.
- Previous-year questions remain excluded from retrieval.
- Regenerate resolves the original user question and answer type, updates the existing assistant message, and clears stale feedback non-fatally.

Previously passed before design update:

- supported RAG answers
- fallback/out-of-scope prompts
- regenerate
- source chips/citations
- true Redis-backed 429
- answer feedback and Settings feedback

These should be smoke-tested again with a confirmed QA account before expanding beyond trusted testers.

## Subjects / Library / Settings / Legal

Subjects:

- Live database confirms KTU 2024 scheme subjects use Modules 1-4; Module 5 is not part of the KTU 2024 scheme.
- Module 4 has no ready embedded chunks.
- Subject UI itself was not authenticated-browser re-tested in this pass.

Library:

- PYQ tables exist, RLS enabled.
- PYQ read grants are authenticated only.
- PYQs remain separate from RAG-ready note chunks.
- Filter UI was not authenticated-browser re-tested in this pass.

Settings:

- App feedback table, grants, and owner policies are live.
- Logged-out feedback API returns 401.
- Settings UI submit was not authenticated-browser re-tested in this pass.

Legal:

- `/privacy` and `/terms` return 200 logged out.
- Pages disclose independent/non-official KTU status, AI limitations, service providers, and placeholders for legal contact/operator details.

## Logs / Observability

Vercel:

- Build logs for production deployment are clean.
- Runtime log sample shows expected 200/304/307 responses for public and protected routes.
- No repeated production 500s were observed in the sampled Vercel logs.

Supabase:

- API/auth sampled logs show successful authenticated REST/Auth requests.
- Postgres sampled logs show normal connection/checkpoint events and no RLS/auth error pattern in the sampled window.

Limitations:

- Direct Upstash dashboard and OpenAI dashboard views were not available from this environment.
- Vercel Analytics presence was inferred from project integration/output, not dashboard visuals.

## Security / Privacy

Verified:

- `.env.local` is ignored/untracked.
- No committed `NEXT_PUBLIC_OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`, or `NEXT_PUBLIC_UPSTASH` names found.
- Secret name greps only found placeholders or server-side references.
- Service role, OpenAI, and Upstash env usage remains server-side.
- Protected pages redirect logged out.
- Private user-data RLS policies remain owner-scoped.
- Logged-out answer and feedback API calls return 401.
- No raw stack traces surfaced in tested logged-out browser/API paths.

## Issues Found

### Critical

- None found.

### High

- None found.

### Medium

- Full authenticated production RAG/regenerate/rate-limit/browser QA was not re-executed because no disposable confirmed production session/credentials were available.
- Supabase advisor warning: `vector` extension is in `public`.
- Supabase advisor warning: leaked password protection is disabled.
- Known moderate npm advisory remains via Next/PostCSS; no high-severity audit failure.

### Low

- Legal metadata titles currently render as `Privacy Policy | ModuleWyse | ModuleWyse` and `Terms of Service | ModuleWyse | ModuleWyse`.
- Browser check briefly saw streaming/loading text on public pages before final content hydration; no console errors or final route failure observed.

## Bugs Fixed

- No code bugs were fixed in this pass.
- `package-lock.json` metadata churn caused by `npm install` was restored before committing docs.

## Bugs Deferred

- Re-run authenticated production smoke QA with a disposable confirmed QA account.
- Consider moving the `vector` extension out of `public` in a future maintenance migration.
- Enable Supabase leaked password protection if compatible with the auth UX.
- Clean duplicate legal metadata suffix in a later small UI/metadata pass.

## Final Recommendation

Ready for continued private beta, public launch still deferred.

Before expanding testers, run a short authenticated smoke pass with a disposable account:

1. Login.
2. Ask one supported RAG question.
3. Test one fallback question.
4. Regenerate one answer.
5. Submit Settings feedback.
6. Confirm source chips remain Modules 1-3 only.
7. Confirm Vercel logs stay free of `/api/chat/answer` 500s.
