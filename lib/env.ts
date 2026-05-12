/**
 * Type-safe environment variable access.
 *
 * Public (client-safe) variables use NEXT_PUBLIC_ prefix.
 * Server-only variables must never be imported in client components.
 *
 * This file will be expanded when Supabase / OpenAI integrations are added.
 */

// ---------------------------------------------------------------------------
// Public (available in browser)
// ---------------------------------------------------------------------------
export const env = {
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
} as const;

// ---------------------------------------------------------------------------
// Server-only (never import this object in client components)
// ---------------------------------------------------------------------------
export const serverEnv = {
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  OPENAI_ANSWER_MODEL: process.env.OPENAI_ANSWER_MODEL ?? "o4-mini",
  OPENAI_VERIFIER_MODEL: process.env.OPENAI_VERIFIER_MODEL ?? "o4-mini",
  OPENAI_EMBEDDING_MODEL:
    process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
  EMBEDDING_DIMENSIONS: Number(process.env.EMBEDDING_DIMENSIONS ?? "1536"),
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? "",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
} as const;
