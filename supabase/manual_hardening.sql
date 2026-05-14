-- ModuleWyse manual Supabase hardening checks.
--
-- Run these manually in the Supabase SQL editor when reviewing database
-- security posture. The app schema does not define public.rls_auto_enable().

-- 1. Inspect whether public.rls_auto_enable() exists and review its definition.
SELECT
  n.nspname,
  p.proname,
  pg_get_functiondef(p.oid)
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname = 'rls_auto_enable';

-- 2. If the function exists with the no-argument signature, revoke direct RPC
-- execution from public roles. If Supabase reports a different signature, run
-- the inspect query first and adjust the function signature below.
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM public;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;

-- 3. If public.rls_auto_enable() is attached to an event trigger, inspect it.
SELECT
  evtname,
  evtevent,
  evtenabled,
  evtfoid::regprocedure::text AS function_name
FROM pg_event_trigger
WHERE evtfoid = 'public.rls_auto_enable()'::regprocedure;
