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

## 2026-05-14 - Student Auth Flow Redirect Update

### Completed
- Updated the auth redirect policy so successful login, immediate-session signup, and auth callback default to `/chat`.
- Removed onboarding-completion checks from `proxy.ts`; the guard now only protects authenticated student routes and onboarding routes from logged-out users.
- Allowed authenticated users to visit onboarding routes without being forced there before `/chat`.
- Updated `/login` so it ensures the profile exists, preserves pending questions/destinations, honors safe `next` paths, and defaults to `/chat`.
- Updated `/signup` so immediate-session signups ensure the profile and land on `/chat`; email-confirmation signups show a check-email state with a back-to-login action.
- Updated `/auth/callback` to exchange the Supabase code, ensure the profile exists, and redirect to a safe `next` path or `/chat`.
- Added `components/chat/chat-draft-composer.tsx` for the current non-AI chat draft state.
- Updated `/chat` to:
  - require an authenticated user
  - show the normal dashboard even when onboarding is incomplete
  - show a `Complete your academic setup` prompt when profile setup is incomplete
  - prefill the draft composer from `?q=` or the stored pending question
- Updated signout modal copy and fixed signout error text.
- Added the missing forgot-password email placeholder.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.
- Smoke-tested locally:
  - `/login` renders placeholders
  - `/signup` returns 200
  - `/chat` logged out redirects to `/login?next=%2Fchat`
  - `/subjects` logged out redirects to `/login?next=%2Fsubjects`
  - `/onboarding/academic-profile` logged out redirects to `/login?next=%2Fonboarding%2Facademic-profile`
  - `/auth/callback` without a code redirects to `/login?error=callback`

### Issues / Notes
- Full successful login/signup browser QA still needs a confirmed test account because Supabase email confirmation is enabled.
- Pending question restoration after email-confirmation callback depends on browser session storage being available; login after confirmation preserves it reliably.
- `/subjects` still uses static placeholder subject data.
- Chat remains a draft/mock dashboard only; no AI/RAG calls are implemented.

### Next
- Test with a real confirmed Supabase student account through signup, login, onboarding, signout, and `/subjects`.
- Build the real chat composer and mock conversation flow using preserved pending question, without AI/RAG.

## 2026-05-14 - Mobile Landing Ask Box Fix

### Completed
- Fixed the hero ask-box mobile alignment for the 412x914 breakpoint and nearby mobile widths.
- Tightened mobile form padding, label spacing, input height, input text sizing, and arrow button sizing.
- Kept `Powered by o4-mini` on one line and aligned the ask-box meta labels cleanly on mobile.
- Verified the page at a 412x914 mobile viewport.
- Refreshed the local app in Chrome at `http://localhost:3000/`.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.

### Issues / Notes
- The left ask-box meta can still wrap intentionally on narrow mobile screens because the full `KTU BASED EXAM PREP COMPANION` label is long.

### Next
- Continue full real-auth browser QA with a confirmed Supabase student account.
- Build the real chat composer and mock conversation flow using preserved pending question, without AI/RAG.

## 2026-05-14 - Responsive Powered Label

### Completed
- Updated the landing ask-box powered label so it splits into `POWERED BY` and `O4-MINI` on small screens only.
- Kept the powered label as `POWERED BY O4-MINI` on `md` and larger screens.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.

### Issues / Notes
- No functional behavior changed.

### Next
- Continue full real-auth browser QA with a confirmed Supabase student account.
- Build the real chat composer and mock conversation flow using preserved pending question, without AI/RAG.

## 2026-05-14 - Landing Input Radius Update

### Completed
- Changed the landing ask input shell to `12px` border radius.
- Added a thin white border to the landing ask input shell.
- Changed the landing ask submit button from circular to square with `4px` border radius.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.

### Issues / Notes
- This update only affects the landing hero ask input.

### Next
- Continue full real-auth browser QA with a confirmed Supabase student account.
- Build the real chat composer and mock conversation flow using preserved pending question, without AI/RAG.

## 2026-05-14 - Landing Powered Label Wrap

### Completed
- Updated the landing ask-box powered label so `POWERED BY` is right-aligned and `O4-MINI` appears on the next line.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.

### Issues / Notes
- No functional behavior changed.

### Next
- Continue full real-auth browser QA with a confirmed Supabase student account.
- Build the real chat composer and mock conversation flow using preserved pending question, without AI/RAG.

## 2026-05-14 - Auth Mobile Fit and Chat Input Reset

### Completed
- Restored the landing hero ask input to the previous white-field, black-enter-button style.
- Set the landing hero ask input shell radius to `48px`.
- Restored the `/chat` draft composer to a white single-line input with a black circular enter button.
- Set the `/chat` draft composer input shell radius to `48px`.
- Added a top-left secondary `HOME` CTA to auth pages.
- Compacted the mobile auth shell spacing so signup fits in a single 412x914 viewport.
- Shortened the signup page body copy.
- Removed client-side signup email format validation and changed the signup email field from native `email` to `text` with email input mode.
- Removed the signup success-state `BACK TO LOGIN` secondary CTA.
- Shortened mobile auth input and submit heights.
- Browser-verified `/signup` at 412x914:
  - `HOME` CTA renders
  - `CREATE ACCOUNT` renders
  - signup form fits in the viewport
  - removed `BACK TO LOGIN` success CTA from initial render
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.

### Issues / Notes
- Supabase will still validate email format server-side during signup; only the app-side/browser email validation was removed.

### Next
- Continue full real-auth browser QA with a confirmed Supabase student account.
- Build the real chat composer and mock conversation flow using preserved pending question, without AI/RAG.

## 2026-05-14 - Landing Simplification Tweaks

### Completed
- Removed the three landing feature cards: `MODULE-AWARE`, `EXAM-READY`, and `CURATED CONTENT`.
- Changed the hero ask-box powered label to `POWERED BY O4-MINI`.
- Changed the hero ask-box submit button to white with a black arrow.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.

### Issues / Notes
- The landing page now flows directly from hero ask box to the subject status panel.

### Next
- Continue full real-auth browser QA with a confirmed Supabase student account.
- Build the real chat composer and mock conversation flow using preserved pending question, without AI/RAG.

## 2026-05-14 - UI Polish, Glass Inputs, Motion

### Completed
- Added `framer-motion` and reusable liquid reveal/stagger wrappers.
- Applied smooth motion to the landing, auth, and chat dashboard surfaces with reduced-motion handling.
- Made display text non-selectable across headings, body copy, labels, and metadata while keeping inputs and textareas selectable/editable.
- Stabilized the shared background image layer with a fixed large-viewport-height background to reduce vertical drift during scroll.
- Converted auth, onboarding, landing, and chat inputs from white fields to glassmorphic fields with thin white borders.
- Added password visibility eye toggles to password fields through the shared `TextInput` component.
- Added missing onboarding placeholders for college name, graduation year, and referral source.
- Converted the landing ask arrow button and chat mock ask button to glassmorphic controls.
- Browser smoke-tested:
  - `/login` password placeholder renders
  - password eye toggle button renders
  - `/` hero input renders
  - `/` subject panel renders
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.

### Issues / Notes
- `npm install framer-motion` reported two moderate audit findings in the dependency tree; no forced audit fix was applied because it may introduce breaking changes.

### Next
- Continue full real-auth browser QA with a confirmed Supabase student account.
- Build the real chat composer and mock conversation flow using preserved pending question, without AI/RAG.

## 2026-05-14 - Subject Preview Mobile Trim

### Completed
- Updated the landing subject status panel so subject names are trimmed after 22 characters.
- Forced subject labels to stay on a single line with ellipsis behavior instead of wrapping.
- Prevented status badges from shrinking when subject names are long.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.

### Issues / Notes
- Full subject names remain available in the row title attribute for desktop hover.

### Next
- Continue full real-auth browser QA with a confirmed Supabase student account.
- Build the real chat composer and mock conversation flow using preserved pending question, without AI/RAG.
