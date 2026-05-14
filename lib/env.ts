/**
 * Environment variable access for ModuleWyse.
 *
 * Public variables are safe to import in client components.
 * Server-only variables must never be imported into client components.
 */

export const env = {
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    "https://frcdrjfupoqnlgqiwffy.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
} as const;

export function hasSupabasePublicEnv() {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
