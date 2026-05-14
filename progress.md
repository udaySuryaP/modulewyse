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

## 2026-05-14 - Real Chat Composer and Mock Flow

### Completed
- Replaced the placeholder `/chat` draft composer with `components/chat/chat-workspace.tsx`.
- Built a local mock chat composer with:
  - multiline textarea input
  - disabled empty send state
  - Enter-to-send and Shift+Enter newline behavior
  - focus restore after sending
  - mobile-friendly wrapping layout
- Preserved pending question behavior:
  - `/chat?q=...` initializes the composer
  - pending question storage initializes the composer when no query is present
  - URL query takes priority over stored pending question
  - restored pending question storage is cleared safely
  - restored questions are not auto-submitted
- Added static chat context controls:
  - semester selector
  - subject selector
  - module selector
  - answer type selector
- Added query-param context initialization for `/chat`:
  - `semester`
  - `subject`
  - `module`
- Added local mock conversation state:
  - user message append
  - assistant loading card
  - delayed mock answer generation
  - scroll-to-latest behavior
- Added future-shaped assistant answer cards with:
  - `BASED ON AVAILABLE NOTES` badge
  - answer type badge
  - subject/module label
  - structured mock academic answer
  - source chips
  - copy, regenerate, thumbs up, thumbs down actions
- Added local edge states:
  - empty conversation with suggested prompts
  - loading answer
  - answer failed via `/fail` developer trigger
  - insufficient content via `/insufficient` developer trigger
  - rate limit via `/rate` developer trigger
  - copy success toast
  - feedback submitted toast
  - regenerate flow
- Preserved the non-blocking profile setup prompt on `/chat`.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.
- Browser/smoke-tested:
  - logged-out `/chat` redirects to `/login?next=/chat`
  - logged-out `/chat?q=Explain%20inheritance` preserves query in `next`
  - mobile 390px login redirect page renders after protected `/chat` redirect
- Stopped the local dev server after verification.

### Issues / Notes
- Full interactive `/chat` QA requires a confirmed Supabase student account because `/chat` is protected.
- No OpenAI, RAG, vector search, content database, or persistence was added.
- Mock edge states are local developer triggers in the question text:
  - `/fail`
  - `/insufficient`
  - `/rate`

### Next
- Build the static subjects-to-chat flow: subject cards, subject detail route, Start Chat with subject/module query params, and chat context initialization.

## 2026-05-14 - Chat Dashboard Shell and Auth Flow Check

### Completed
- Made landing navigation auth-aware:
  - authenticated users route to `/chat`
  - unauthenticated users continue to `/login` or `/signup`
- Kept the existing protected-route policy:
  - logged-out `/chat` redirects to `/login?next=/chat`
  - logged-in `/login` or `/signup` redirects to `/chat`
- Removed the landing navigation from `/chat`, so `LOGIN` and `GET STARTED` no longer appear in the chat dashboard.
- Removed the first `/chat` intro card containing `Student dashboard` and `Ask from your KTU syllabus`.
- Reworked `/chat` into a dashboard-style layout:
  - collapsible left sidebar
  - `modulewyse` brand at the top of the sidebar
  - sidebar collapse/expand button
  - expanded sidebar shows icon plus nav label
  - collapsed sidebar shows icons only
  - main context controls
  - large conversation panel
  - right selected-context panel on larger screens
  - bottom composer area
- Preserved the non-blocking incomplete-profile setup prompt inside the dashboard flow.
- Preserved the local mock chat composer and answer behavior from the previous phase.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.
- Smoke-tested route workflow:
  - `/chat` logged out redirects to `/login?next=%2Fchat`
  - `/chat?q=...&subject=...&module=...` logged out preserves query params in `next`
  - `/login` renders
  - `/signup` renders
- Opened `/chat?q=...` in Chrome for visual handoff; it shows login first when no Chrome session is authenticated.
- Stopped the local dev server after verification.

### Issues / Notes
- Full logged-in dashboard interaction QA still needs a confirmed Supabase student account in Chrome.
- The current dashboard uses static subject/module options and local mock chat state only.

### Next
- Build the static subjects-to-chat flow: subject cards, subject detail route, Start Chat with subject/module query params, and chat context initialization.

## 2026-05-14 - Ask Field Spacing Tweak

### Completed
- Increased the `ASK` CTA horizontal width slightly in the landing ask field and `/chat` draft composer.
- Reduced horizontal padding inside the landing ask field and `/chat` draft composer field by 4px where applicable.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.

### Issues / Notes
- No behavior or routing changed.

### Next
- Continue full real-auth browser QA with a confirmed Supabase student account.
- Build the real chat composer and mock conversation flow using preserved pending question, without AI/RAG.

## 2026-05-14 - Landing Glass Ask Input

### Completed
- Changed the landing hero ask input field to a glassmorphic surface with a thin white border.
- Kept the landing hero `ASK` CTA as a white button with black text.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.

### Issues / Notes
- This update only affects the landing hero ask input.

### Next
- Continue full real-auth browser QA with a confirmed Supabase student account.
- Build the real chat composer and mock conversation flow using preserved pending question, without AI/RAG.

## 2026-05-14 - Chat Input Glassmorphism Update

### Completed
- Changed the `/chat` draft composer input field to a glassmorphic surface with a thin white border.
- Kept the `/chat` `ASK` CTA as a white button with black text.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.

### Issues / Notes
- This update only affects the `/chat` draft composer input.

### Next
- Continue full real-auth browser QA with a confirmed Supabase student account.
- Build the real chat composer and mock conversation flow using preserved pending question, without AI/RAG.

## 2026-05-14 - Ask CTA Text Update

### Completed
- Changed the landing ask-box enter CTA from an arrow icon to `ASK`.
- Changed the `/chat` draft composer enter CTA from an arrow icon to `ASK`.
- Set both ask CTAs to `12px` border radius.
- Re-ran `npm run lint`; passed.
- Re-ran `npm run build`; passed.

### Issues / Notes
- No route or auth behavior changed.

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
## 2026-05-14 - Chat Dashboard Shell and Auth-Aware Landing Flow

### Completed
- Completed a responsive layout pass across landing/auth/protected app surfaces.
- Consolidated the protected app sidebar into a shared `StudentSidebar` component so `/chat`, `/subjects`, `/library`, `/profile`, and `/settings` use the same responsive navigation behavior.
- Set the dashboard sidebar to a compact icon rail on mobile/tablet and an expandable icon-plus-label sidebar on large screens.
- Tightened mobile chat spacing:
  - smaller dashboard gutters
  - smaller fixed composer offsets
  - reduced mobile composer padding
  - smaller empty-state heading and suggested prompt cards
- Aligned the `/chat` selected-context card to the same top row as the semester, subject, and module controls on desktop.
- Updated the fixed `/chat` composer to use the lighter glassmorphic surface treatment instead of the darker charcoal glass.
- Updated the shared student sidebar to use a lighter glassmorphic surface.
- Replaced the sidebar bottom meta copy with a live day/date and time display.
- Set the shared sidebar back to the lighter glassmorphic theme across all screen sizes.
- Reformatted the sidebar timestamp in IBM Plex Mono with time on the first line and day/date on the second line.
- Added clock and calendar icons to the sidebar timestamp lines.
- Expanded the `/chat` dashboard grid from medium screens upward so the context-controls card and conversation card occupy the maximum available width beside the selected-context panel.
- Adjusted the desktop `/chat` grid so the semester/subject/module card and question-answer card share a wide left column while the selected-context card is fixed to the far-right column.
- Reworked the `/chat` dashboard into explicit card grid placement: context controls in the top-left card, question/answer card directly beneath it at the same width, and selected-context card in the top-right column from medium screens upward.
- Trimmed the bottom padding of the `/chat` context-controls card so its bottom spacing matches the top spacing more closely.
- Expanded the `/chat` question/answer card to span the full dashboard width from medium screens upward so the lower row no longer leaves unused right-side space.
- Prevented the `/chat` context-controls card from stretching to match the selected-context card height on medium and larger screens, removing the excess bottom space below answer type.
- Expanded the fixed `/chat` composer to match the full dashboard width of the question/answer card.
- Removed the `/chat` selected-context card and reclaimed that space so the context-controls card, question/answer card, and composer occupy the full available width after the sidebar.
- Improved protected subject list rows so long subject names truncate instead of forcing horizontal overflow.
- Refined the `/chat` dashboard toward the provided reference layout with only the core context controls, conversation panel, selected context panel, sidebar, and fixed composer.
- Removed extra chat header copy and notification chrome from the chat dashboard.
- Changed sent user-question bubbles to the same glassmorphic visual language instead of a white card.
- Added `All modules` as the default module context and module dropdown option.
- Tightened dropdown padding with equal left/right spacing and a custom chevron treatment.
- Added a reusable authenticated `StudentPageShell` with the modulewyse sidebar for protected student pages.
- Replaced landing navigation on protected student pages so `LOGIN` and `GET STARTED` no longer appear in `/subjects`, `/library`, `/profile`, `/settings`, or nested settings/subject pages.
- Ignored local dev-server log files so Chrome/server verification does not pollute git status.
- Fixed the `/chat` composer to the bottom of the viewport so it remains available while the conversation content scrolls.
- Added bottom spacing to the chat main area so messages and empty states do not sit behind the fixed composer.
- Adjusted toast placement so copy and feedback messages appear above the fixed composer.
- Added auth-aware landing navigation actions so `LOGIN` and `GET STARTED` first check the current Supabase session and send already-authenticated users to `/chat`.
- Kept unauthenticated landing users on the normal `/login` and `/signup` flow.
- Removed the old `/chat` landing navigation and the first student-dashboard intro card.
- Reworked `/chat` into a dashboard-style shell with a collapsible left sidebar.
- Added sidebar behavior for expanded and compressed states:
  - Expanded state shows icon plus nav label.
  - Compressed state shows icon only.
  - Sidebar header shows `modulewyse` with a collapse/expand control beside it.
- Removed `LOGIN` and `GET STARTED` buttons from the chat dashboard.
- Preserved the non-blocking academic setup prompt inside `/chat`.
- Preserved the local mock chat composer, pending question restore, answer type controls, context selectors, mock assistant response, copy, feedback, and regenerate behavior.
- Added a selected-context side panel for branch, semester, subject, and module availability.
- Verified protected route behavior:
  - Logged-out `/chat` redirects to `/login?next=/chat`.
  - Logged-out `/chat` with query params preserves the full next URL.
  - `/login` and `/signup` remain reachable for unauthenticated users.
- Verified route smoke checks for `/`, `/login`, `/signup`, `/forgot-password`, `/chat`, `/subjects`, `/library`, `/profile`, and `/settings`.
- Ran `npm run lint` successfully.
- Ran `npm run build` successfully.
- Opened the local `/chat` route in Chrome for route verification.
- Stopped the local dev server after verification.

### Issues / Notes
- Full logged-in visual QA for the new chat dashboard still needs a confirmed Supabase test account.
- The chat answer flow remains intentionally local/mock only. No AI, RAG, database chat persistence, or curated-content retrieval has been added.
- `/subjects` still uses static placeholder subject data.

### Next
- Create or confirm a test student account and run full signup, login, dashboard, signout, and onboarding QA in the browser.
- Build the static subjects-to-chat flow with subject detail routes and chat context initialization.

## 2026-05-14 - Project Review

### Completed
- Reviewed the current project state across `progress.md`, app routes, components, Supabase schema, docs, package dependencies, and git status.
- Confirmed the repository is on branch `onboarding` and synced with GitHub before this review update.
- Summarized phase completion:
  - fully completed foundation, landing, visual system, route guard foundation, Supabase foundation implementation, and progress workflow
  - partially completed real-auth QA, onboarding QA, chat dashboard, protected student shell, subjects, profile, settings, and responsive visual QA
  - not started OpenAI, RAG, vector search, content ingestion, embeddings, verified generation, persistent chat history, evals, and admin/content tooling
- Identified the next practical phases:
  - full Supabase auth QA with a confirmed student account
  - static subjects-to-chat flow
  - real profile/settings editing
  - subject/module/content database schema
  - OOP content ingestion and RAG pipeline

### Issues / Notes
- `/chat` remains local/mock only.
- `/subjects` remains static placeholder data.
- Full logged-in browser QA still needs a confirmed Supabase test account.
- Some docs still need cleanup for older wording and encoding artifacts.

### Next
- Build the static subjects-to-chat flow: subject cards, subject detail route, Start Chat with subject/module query params, and chat context initialization.

## 2026-05-14 - Mobile Chat Top Bar

### Completed
- Added a mobile-only `/chat` top bar with `modulewyse` on the left and an expand/collapse button on the right.
- Changed the mobile `/chat` navigation behavior so the menu expands vertically instead of widening sideways.
- Added the requested expanded mobile top-bar order:
  - brand/header row
  - answer type controls
  - semester dropdown
  - subject dropdown
  - module dropdown
  - Chat, Subjects, Library, Profile, Settings links
  - time and date rows with icons
- Hid the `/chat` side rail on mobile only.
- Kept the existing sidebar/dashboard behavior for `md` and `lg` views.
- Ran `npm run lint`; passed.
- Ran `npm run build`; first attempt failed because Next could not fetch Google Fonts, then the retry passed.

### Issues / Notes
- This change is scoped to the `/chat` mobile layout. Other protected pages still use the shared student shell behavior.

### Next
- Browser-check `/chat` on a logged-in mobile viewport and confirm the expanded top-bar ordering visually.

## 2026-05-14 - Mobile Navigation Refinement

### Completed
- Added spacing between the mobile `/chat` top bar and the first content card.
- Scoped the mobile `/chat` expanded top bar to chat controls only:
  - answer type
  - semester
  - subject
  - module
- Added the same mobile top-bar pattern to the other protected student pages through `StudentPageShell`.
- Kept other protected-page mobile top bars focused on navigation links and date/time.
- Hid the shared sidebar on small screens for protected pages and kept it from `md` upward.
- Removed the extra outer glass box around the fixed `/chat` composer, leaving only the input field surface and `ASK` CTA.
- Increased bottom spacing below the fixed `/chat` input field.
- Hid the scrollbar inside the `/chat` input textarea.
- Added Chat, Subjects, Library, Profile, and Settings navigation links below the chat controls in the mobile `/chat` expanded navbar.
- Added time/date rows below the mobile `/chat` navbar links.
- Added extra bottom padding inside the expanded mobile `/chat` navbar card.
- Reduced the right padding inside the fixed `/chat` question input field.
- Updated sent user-question bubbles to fill the available conversation row width so left and right margins are balanced.
- Re-aligned sent user-question bubbles toward the right side with a tighter right edge and constrained max width.
- Ran `npm run lint`; passed.
- Ran `npm run build`; passed.

### Issues / Notes
- `md` and `lg` dashboard/sidebar behavior was left unchanged.

### Next
- Browser-check `/chat`, `/subjects`, `/library`, `/profile`, and `/settings` at mobile widths while logged in.

## 2026-05-14 - Authenticated Landing Redirect

### Completed
- Updated `proxy.ts` so authenticated users visiting `/` are redirected to `/chat`.
- Updated dashboard brand links in the chat mobile top bar, protected-page mobile top bar, and shared sidebar to point to `/chat` instead of the landing page.
- Ran `npm run lint`; passed.
- Ran `npm run build`; passed.

### Issues / Notes
- Logged-out users can still access the landing page normally.

### Next
- Browser-check the authenticated `/` redirect with a confirmed Supabase session.

## 2026-05-14 - Current Phase Summary

### Fully Completed
- Project foundation and documentation workflow.
- Durable project memory in `PROJECT_MEMORY.md`.
- Session progress workflow in `progress.md`.
- Landing page design and behavior.
- Shared app background image system.
- Auth page visual continuity.
- Supabase auth foundation:
  - browser client
  - server client
  - proxy helper
  - environment validation
  - auth/profile helpers
  - `profiles` schema, RLS, and triggers
- Signup, login, forgot-password, auth callback, and signout UI wiring.
- Protected route guard through Next.js 16 `proxy.ts`.
- Authenticated `/` redirect to `/chat`.
- Dashboard shell and shared sidebar.
- Mobile dashboard top navigation.
- Local mock `/chat` composer and mock conversation flow.
- Pending question preservation into `/chat`.
- Non-blocking onboarding flow.
- Responsive UI polish across landing, auth, chat, and protected dashboard shell.
- Latest dashboard/mobile/auth-flow changes pushed to GitHub on branch `onboarding`.

### Partially Completed
- Real authentication QA:
  - implemented, but full testing with a confirmed Supabase user is still pending
- Onboarding persistence:
  - implemented, but full end-to-end QA is still pending
- Chat dashboard:
  - UI and mock flow are implemented
  - real AI/RAG is not implemented
- Subjects:
  - static placeholder list exists
  - subject detail route is placeholder only
- Library:
  - protected placeholder page exists
- Profile/settings:
  - protected shell and signout exist
  - editable profile/account/academic/preference forms are not built
- Forgot password:
  - reset email flow exists
  - password update UI remains minimal
- Responsive QA:
  - multiple layout passes completed
  - still needs logged-in real-device/browser QA

### Not Started
- Real OpenAI answer generation.
- RAG pipeline.
- Vector search.
- Subject/module/topic/content database.
- OOP content ingestion.
- Chunking and embeddings.
- Verified-answer checker.
- Persistent chat history.
- Feedback persistence.
- Eval test set.
- Admin/content management tooling.

### Next
- Create or confirm a Supabase test user.
- QA full auth flow:
  - signup
  - login
  - logout
  - forgot password
  - onboarding
  - protected redirects
- Build the static subjects-to-chat flow:
  - subject cards
  - subject detail route
  - module list
  - Start Chat CTA
  - subject/module query params into `/chat`
- Build editable profile/settings pages.
- Add database schema for subjects, modules, content, chunks, conversations, and feedback.
- Seed Object Oriented Programming content.
- Build RAG and OpenAI answer generation.
- Add verifier and eval tests.

## 2026-05-14 - Security, Supabase, GitHub, Vercel Review

### Completed
- Reviewed the current local codebase, Supabase project advisor output, Vercel project/deployment state, GitHub access limits, dependency audit output, and current git state.
- Confirmed local checks:
  - `npm run lint` passed
  - `npm run build` passed
- Confirmed no obvious committed secrets in tracked files:
  - `.env.local` is not tracked
  - `.env.example` only contains placeholders
- Confirmed Supabase performance advisor returned no active findings.
- Confirmed latest Vercel production deployment for `modulewyse` is `READY` and build logs show a successful Next.js 16.2.6 production build.
- Confirmed Vercel project metadata:
  - project: `modulewyse`
  - framework: Next.js
  - Node version: `24.x`
  - GitHub repo visibility: private
- Confirmed local GitHub workflow files are not present in the repo.

### Issues / Notes
- Supabase security advisor reported hardening issues:
  - `public.set_updated_at()` has mutable `search_path`
  - `public.handle_new_user()` is a `SECURITY DEFINER` function exposed for anon/authenticated RPC execution
  - `public.rls_auto_enable()` exists in the database and is also exposed for anon/authenticated RPC execution, but is not defined in the repo schema
  - leaked-password protection is disabled in Supabase Auth
- `supabase/schema.sql` should be hardened with fixed `search_path` and explicit `REVOKE EXECUTE` statements for trigger-only functions.
- `lib/env.ts` currently defines server-only secrets in the same module that client components import for public env checks. No secret value was found committed, but this should be split before service-role/OpenAI usage grows.
- `npm audit` reports two moderate findings from Next.js' bundled `postcss`; no forced audit fix was applied because the suggested fix is not suitable for this Next.js 16 app.
- GitHub Actions, branch protection, Dependabot/security-alert configuration, and repository security settings could not be fully verified because no local workflow files exist and the GitHub CLI is not installed in this environment.
- Vercel environment variable values could not be inspected with the currently exposed tools.
- `.vercel/project.json` is not present locally, so local Vercel CLI deploys are not linked in the repo checkout.

### Next
- Harden Supabase SQL:
  - add fixed `search_path` to `public.set_updated_at()`
  - revoke direct function execution for `public.handle_new_user()` from public/anon/authenticated
  - inspect and either remove or revoke direct execution for `public.rls_auto_enable()`
- Enable Supabase Auth leaked-password protection.
- Split server-only environment variables into a server-only module.
- Add GitHub CI for lint, build, and audit checks.
- Configure Dependabot or equivalent dependency monitoring.
- Verify Vercel production environment variables manually in the Vercel dashboard.

## 2026-05-14 - Supabase Student Account QA

### Completed
- Created and confirmed one disposable Supabase QA student account:
  - email: `modulewyse.qa.1778765450@gmail.com`
  - profile row exists in `public.profiles`
- Confirmed the account can authenticate through Supabase Auth API after email confirmation.
- Verified authenticated route behavior using a Supabase SSR-compatible session cookie:
  - `/` redirects to `/chat`
  - `/chat` returns 200
  - `/subjects` returns 200
  - `/login` redirects to `/chat` when authenticated
  - onboarding pages remain accessible while authenticated
- Verified logged-out `/chat` redirects to `/login?next=%2Fchat`.
- Verified incomplete profile setup prompt appears in `/chat` before onboarding completion.
- Verified onboarding/profile persistence through authenticated `profiles` update:
  - college name
  - graduation year
  - branch
  - semester
  - focus subject
  - referral source
  - `onboarding_completed = true`
- Verified the setup prompt no longer appears in `/chat` after profile completion.
- Verified Supabase signout API succeeds for the QA session.

### Issues / Notes
- Browser signup is currently blocked by Supabase Auth email send rate limit:
  - Supabase returned `over_email_send_rate_limit`
  - the app currently displays the generic `Unable to connect. Please try again.`
- Real email confirmation link QA could not be completed because confirmation emails are rate-limited.
- Forgot-password reset email is currently blocked by the same Supabase email send rate limit.
- Chrome is installed and the Codex extension is configured, but Chrome was not running, so logged-in browser QA was done with API/authenticated HTTP checks instead of a live Chrome session.
- The `.env.local` file has no usable `SUPABASE_SERVICE_ROLE_KEY`, so the QA account was confirmed through SQL-level Supabase access.

### Next
- Wait for Supabase email rate limit to clear, then retest:
  - signup email delivery
  - real email confirmation link
  - forgot-password email delivery
- Improve auth error mapping so Supabase `over_email_send_rate_limit` shows a clear message instead of `Unable to connect. Please try again.`
- Run the same checklist in Chrome after launching Chrome or signing in there.

## 2026-05-14 - Security Hardening Pass

### Completed
- Hardened Supabase SQL functions in the live Supabase project with migration `harden_profile_auth_functions`.
- Updated `supabase/schema.sql` and added a matching local migration file:
  - `supabase/migrations/20260514143000_harden_profile_auth_functions.sql`
- Added fixed `search_path = public` to `public.set_updated_at()`.
- Revoked direct execution from trigger-only functions:
  - `public.set_updated_at()`
  - `public.handle_new_user()`
- Investigated `public.rls_auto_enable()`:
  - found it attached to event trigger `ensure_rls`
  - removed the `ensure_rls` event trigger
  - dropped `public.rls_auto_enable()`
- Re-ran Supabase security advisors:
  - function exposure warnings are resolved
  - mutable `search_path` warning is resolved
  - only leaked-password protection remains
- Split server-only environment variables into `lib/env.server.ts` with `import "server-only"`.
- Kept `lib/env.ts` limited to public/client-safe variables.
- Added GitHub Actions CI at `.github/workflows/ci.yml` for:
  - `npm ci`
  - `npm run lint`
  - `npm run build`
- Ran `npm run lint`; passed.
- Ran `npm run build`; passed.
- Committed and pushed the security hardening changes to GitHub:
  - branch: `onboarding`
  - commit: `4f06756 Harden auth functions and add CI`
- Confirmed the local git worktree is clean after push.

### Issues / Notes
- Supabase Auth leaked-password protection still needs to be enabled manually in the Supabase dashboard. The current Supabase MCP tools expose advisors and SQL, but not Auth security setting mutation.
- Vercel environment variable values could not be read through the available Vercel tools. This still needs manual dashboard verification.
- GitHub CI references these optional repository secrets for build parity:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- CI will still install, lint, and build with the app defaults if those secrets are not configured, but production parity is better after adding them.

### Next
- In Supabase dashboard, enable leaked-password protection under Auth password/security settings.
- In Vercel dashboard, verify production/preview/development env vars:
  - `NEXT_PUBLIC_APP_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - future server-only vars only when needed
- In GitHub repository settings, add the CI secrets if desired:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2026-05-14 - Env Split and Manual Security Checklist

### Completed
- Re-inspected the security hardening files requested in the follow-up prompt:
  - `supabase/schema.sql`
  - `lib/env.ts`
  - `lib/env.server.ts`
  - Supabase client/server/middleware helpers
  - `proxy.ts`
  - `package.json`
  - `.env.example`
  - `progress.md`
- Reworked environment handling into the requested module structure:
  - `lib/env/public.ts` for client-safe public variables
  - `lib/env/server.ts` for server-only secrets with `import "server-only"`
- Updated all app imports so client-side and shared code import only from `lib/env/public.ts`.
- Removed the older root-level `lib/env.ts` and `lib/env.server.ts` files.
- Updated `.env.example` so it contains placeholders only:
  - `NEXT_PUBLIC_SUPABASE_URL=`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
  - `NEXT_PUBLIC_APP_URL=http://localhost:3000`
  - `SUPABASE_SERVICE_ROLE_KEY=`
  - `OPENAI_API_KEY=`
  - `UPSTASH_REDIS_REST_URL=`
  - `UPSTASH_REDIS_REST_TOKEN=`
- Kept `supabase/schema.sql` focused on the app-owned profile schema and trigger functions.
- Added `supabase/manual_hardening.sql` with inspection and revoke guidance for `public.rls_auto_enable()`.
- Added `docs/SECURITY_CHECKLIST.md` covering manual Supabase, Vercel, and GitHub security actions.
- Updated GitHub CI to run `npm audit --audit-level=high` after lint/build.
- Ran `npm run lint`; passed.
- Ran `npm run build`; passed.
- Ran `npm audit --audit-level=high`; passed with no high/critical findings. The existing moderate Next/PostCSS advisory remains documented and was not force-fixed.

### Issues / Notes
- Supabase leaked-password protection still requires manual dashboard enablement.
- Vercel environment variable values still require manual dashboard verification.
- `npm audit` still reports moderate PostCSS findings through Next.js, but the requested high-severity audit threshold passes.

### Next
- Manually enable Supabase leaked-password protection.
- Manually verify Vercel env vars and production domain.
- Add GitHub repository secrets for CI build parity if needed:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Run full real-auth QA with a confirmed Supabase test account, then build the static subjects-to-chat flow.
