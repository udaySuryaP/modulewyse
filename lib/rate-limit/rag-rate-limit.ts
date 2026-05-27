import "server-only";

import { serverEnv } from "@/lib/env/server";

const windowSeconds = 60 * 60;
const defaultLimit = 20;

export type RagRateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
  resetAt?: number;
};

type UpstashPipelineResult = Array<{
  error?: string;
  result?: unknown;
}>;

function rateLimitConfig() {
  const configuredLimit = Number(process.env.MODULEWYSE_RAG_RATE_LIMIT_PER_HOUR);
  const limit =
    Number.isFinite(configuredLimit) && configuredLimit > 0
      ? Math.floor(configuredLimit)
      : defaultLimit;

  return {
    limit,
    token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
    url: serverEnv.UPSTASH_REDIS_REST_URL.replace(/\/$/, ""),
  };
}

function missingUpstashResult() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("RAG rate limiting is not configured.");
  }

  console.warn("RAG rate limiting is disabled because Upstash env vars are missing.");

  return {
    allowed: true,
    remaining: defaultLimit,
  } satisfies RagRateLimitResult;
}

export async function checkRagAnswerRateLimit(
  userId: string,
): Promise<RagRateLimitResult> {
  const { limit, token, url } = rateLimitConfig();

  if (!url || !token) {
    return missingUpstashResult();
  }

  const key = `modulewyse:rag-answer:user:${userId}`;
  const response = await fetch(`${url}/pipeline`, {
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, windowSeconds, "NX"],
      ["TTL", key],
    ]),
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("RAG rate limit check failed.");
  }

  const results = (await response.json()) as UpstashPipelineResult;
  const error = results.find((result) => result.error)?.error;

  if (error) {
    throw new Error("RAG rate limit check failed.");
  }

  const count = Number(results[0]?.result ?? 0);
  const ttl = Number(results[2]?.result ?? windowSeconds);
  const retryAfter =
    Number.isFinite(ttl) && ttl > 0 ? Math.ceil(ttl) : windowSeconds;
  const resetAt = Math.floor(Date.now() / 1000) + retryAfter;

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfter,
    resetAt,
  };
}
