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

### Issues / Notes
- The app is still mostly placeholder screens before the landing page implementation.
- Supabase, OpenAI, RAG, auth guards, schema, RLS, and content pipeline are not implemented yet.
- Auth-aware landing flows are currently implemented as frontend placeholders until Supabase auth is added.
- The video background depends on the provided remote CloudFront URL staying available.
- The login/signup screens preserve visual continuity but are not real auth forms yet.
- The former `VideoBackground` component now renders the shared background image, despite the legacy component name.

### Next
- Implement Supabase auth, profiles, onboarding persistence, route guards, and real redirect decisions.
- Replace the temporary local/session storage auth flow with Supabase session checks.
- Build the real chat composer around the preserved pending question.
- Add database schema, RLS, and seed content for the OOP-first MVP.
