# ModuleWyse Security Checklist

Use this checklist before adding new product surfaces such as AI/RAG, content
ingestion, or admin tooling.

## Supabase Dashboard Actions

- Enable leaked-password protection in Auth password/security settings.
- Confirm redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `<production-domain>/auth/callback`
- Confirm RLS is enabled on `public.profiles`.
- Confirm no table in the public schema is publicly readable unless explicitly intended.
- Confirm trigger-only functions are not executable by `anon` or `authenticated`:
  - `public.set_updated_at()`
  - `public.handle_new_user()`
- If `public.rls_auto_enable()` exists, run `supabase/manual_hardening.sql` and revoke direct execution from public roles.

## Vercel Dashboard Actions

- Verify all production, preview, and development environment variables manually.
- Confirm no service role key is exposed with a `NEXT_PUBLIC_` prefix.
- Confirm the production domain is correct.
- Confirm `NEXT_PUBLIC_APP_URL` matches the deployed production URL.
- Confirm Supabase redirect URLs include the deployed production callback URL.

## GitHub Actions

- Confirm CI runs on pull requests and pushes to `main` and `onboarding`.
- Add repository secrets if needed for CI build parity:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Enable Dependabot/security alerts if available.
- Add branch protection later once the workflow is stable.
