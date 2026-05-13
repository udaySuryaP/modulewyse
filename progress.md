# ModuleWyse Progress Log

This file is updated at the end of each working session.

## 2026-05-13

### Completed
- Audited the repository structure, docs, current app routes, shared config, and git state.
- Verified the current baseline with `npm run lint` and `npm run build`.
- Added `PROJECT_MEMORY.md` as durable repo memory for project direction and working rules.
- Added this `progress.md` session log workflow.
- Normalized docs/README naming from `KTU Prep AI` to `ModuleWyse`.
- Normalized docs/README framework references from `Next.js 15` to `Next.js 16`, matching the installed `next@16.2.6`.
- Rebuilt `/` as a premium ModuleWyse landing page with cinematic video background, glass navigation, hero ask box, feature cards, subject status panel, and footer meta.
- Added reusable landing components under `components/landing/`.
- Added `lib/landing-flow.ts` for temporary pending-question and destination preservation until real Supabase auth exists.
- Updated `/signup`, `/login`, `/forgot-password`, onboarding pages, `/chat`, and `/subjects` so they visually stay in the same warm glassmorphic world.
- Verified the landing flow in the in-app browser:
  - typed a question on `/`
  - submitted as logged out
  - reached `/signup`
  - continued through onboarding
  - reached `/chat?q=Explain%20inheritance%20in%20OOP`
  - saw the pending question restored
  - confirmed `VIEW SUBJECTS` routes logged-out users to `/signup`
- Re-ran `npm run lint` and `npm run build`; both pass.
- Moved user-provided `bgImage.png` into `public/images/bgImage.png` so Next.js can serve it.
- Updated the root layout and shared landing background component to use `/images/bgImage.png` as the app-wide background.
- Re-ran `npm run lint` and `npm run build`; both pass after the background change.
- Opened/refreshed the app in Chrome at `http://localhost:3000` to render the updated background.
- Updated the landing layout per feedback:
  - desktop page padding is now `56px` on the active app surfaces
  - changed visible `KTU AI EXAM PREP` copy to `KTU BASED EXAM PREP COMPANION`
  - reduced the hero input placeholder/input text by 4px
  - removed the `S4`, `OOP`, `Module 3`, and `0/3,000` row
  - stretched the three preview cards and subject panel to the available content width
  - made `VIEW SUBJECTS` open `/subjects` directly
  - expanded `/subjects` into a full-width page with the existing navbar and subject status list
- Re-ran `npm run lint` and `npm run build`; both pass after these layout changes.
- Verified in Chrome that `VIEW SUBJECTS` navigates to `/subjects`.
- Applied mobile-only hero ask box refinements:
  - reduced ask-box meta text by 2px on mobile
  - increased placeholder/input text by 2px on mobile
  - reduced mobile input vertical padding
  - reduced mobile arrow button/icon size
  - hid the `LOGIN` CTA on mobile while keeping `GET STARTED`
- Re-ran `npm run lint` and `npm run build`; both pass after the mobile refinements.

### Issues / Notes
- The app is still mostly placeholder screens before the landing page implementation.
- Supabase, OpenAI, RAG, auth guards, schema, RLS, and content pipeline are not implemented yet.
- Auth-aware landing flows are currently implemented as frontend placeholders until Supabase auth is added.
- The video background depends on the provided remote CloudFront URL staying available.
- The login/signup screens preserve visual continuity but are not real auth forms yet.
- The former `VideoBackground` component now renders the shared background image, despite the legacy component name.
- The subjects page still uses static placeholder subject data until the database layer exists.

### Next
- Implement Supabase auth, profiles, onboarding persistence, route guards, and real redirect decisions.
- Replace the temporary local/session storage auth flow with Supabase session checks.
- Build the real chat composer around the preserved pending question.
- Add database schema, RLS, and seed content for the OOP-first MVP.

## 2026-05-13 - Onboarding Branch

### Completed
- Created branch `onboarding`.
- Installed only the requested Supabase packages:
  - `@supabase/supabase-js`
  - `@supabase/ssr`
- Updated `.env.example` with the provided Supabase URL and required auth variables.
- Added Supabase browser, server, and proxy clients.
- Added `supabase/schema.sql` for the student `profiles` table, updated-at trigger, signup profile trigger, and RLS policies.
- Added auth/profile helpers for profile creation, profile lookup, and redirect decisions.
- Replaced placeholder signup, login, and forgot-password pages with real Supabase email/password forms while preserving the glass UI.
- Added `/auth/callback` route for exchanging Supabase auth codes and redirecting based on onboarding state.
- Replaced onboarding placeholders with real forms for academic profile, branch, semester, and final setup.
- Added onboarding draft preservation between steps and final persistence into `profiles`.
- Replaced fake localStorage auth checks in `lib/landing-flow.ts` with Supabase session/profile checks while preserving pending question behavior.
- Added Next.js 16 `proxy.ts` route guard for protected and onboarding routes.
- Added signout modal/action to `/settings` and `/profile`.
- Ran `npm run lint`; passed.
- Ran `npm run build`; passed.

### Issues / Notes
- Real Supabase auth could not be tested end-to-end locally because `NEXT_PUBLIC_SUPABASE_ANON_KEY` was not provided and the SQL schema has not been confirmed as applied in Supabase yet.
- `proxy.ts` is used instead of root `middleware.ts` because Next.js 16 local docs state Middleware is now called Proxy.
- `/subjects` is now covered by the protected-route guard as requested in the auth prompt. The landing CTA still opens `/subjects`; unauthenticated users will be redirected by the guard once Supabase env is configured.
- Password reset currently sends users through Supabase recovery to `/settings/account`; a dedicated password update UI is still minimal/future work.

### Next
- Add the Supabase anon key to `.env.local`.
- Run `supabase/schema.sql` in the Supabase SQL editor.
- Configure Supabase Auth redirect URLs for local and deployed app URLs.
- Manually test signup, login, onboarding, protected redirects, signout, and forgot password.
- Build real chat composer behavior around preserved pending question and mock conversation state, without AI/RAG yet.
- Reduced the hero ask input inner vertical padding.
- Added placeholders to signup and login form fields.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.
- Refreshed Chrome preview at `http://localhost:3000`.
- Added `.env.local` locally with the provided Supabase URL and anon key. This file remains ignored and must not be committed.
- Applied `supabase/schema.sql` to Supabase project `frcdrjfupoqnlgqiwffy` via the connected Supabase tool.
- Verified the Supabase schema:
  - `public.profiles` exists
  - RLS policies exist for own-profile select/insert/update
  - `profiles_set_updated_at` trigger exists
  - `on_auth_user_created` trigger exists
- Smoke-tested real Supabase signup with a generated test email:
  - signup API succeeded
  - email confirmation is enabled because no session was returned
  - signup trigger created a `profiles` row with `onboarding_completed = false`
  - generated test user was deleted afterward
- Browser smoke-tested:
  - `/signup` renders form placeholders
  - `/chat` redirects logged-out users to `/login?next=/chat`
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed with `.env.local`.
