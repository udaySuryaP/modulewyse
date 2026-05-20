import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();

export const embeddingDefaults = {
  dimensions: 1536,
  model: "text-embedding-3-small",
} as const;

export async function loadLocalEnv() {
  for (const fileName of [".env.local", ".env"]) {
    try {
      const raw = await readFile(path.join(rootDir, fileName), "utf8");

      for (const line of raw.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

        if (!match) {
          continue;
        }

        const [, key, rawValue] = match;

        if (process.env[key]) {
          continue;
        }

        process.env[key] = rawValue
          .trim()
          .replace(/^['"]|['"]$/g, "");
      }
    } catch {
      // Optional local env file.
    }
  }
}

export function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

export function getEmbeddingConfig() {
  const model =
    process.env.EMBEDDING_MODEL ??
    process.env.OPENAI_EMBEDDING_MODEL ??
    embeddingDefaults.model;
  const dimensions = Number(
    process.env.EMBEDDING_DIMENSIONS ?? embeddingDefaults.dimensions,
  );

  if (!Number.isInteger(dimensions) || dimensions <= 0) {
    throw new Error("EMBEDDING_DIMENSIONS must be a positive integer.");
  }

  return { dimensions, model };
}

export function createServiceClient() {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

export function toVectorLiteral(embedding: number[]) {
  return `[${embedding.join(",")}]`;
}

export function isMissingEmbeddingSchemaError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String((error as { message?: unknown }).message)
        : String(error);

  return (
    message.includes("embedding_status") ||
    message.includes("embedding_model") ||
    message.includes("embedding") ||
    message.includes("match_content_chunks")
  );
}

export async function createEmbeddings(input: string | string[]) {
  const apiKey = requireEnv("OPENAI_API_KEY");
  const { dimensions, model } = getEmbeddingConfig();
  const body: Record<string, unknown> = {
    encoding_format: "float",
    input,
    model,
  };

  if (model.startsWith("text-embedding-3")) {
    body.dimensions = dimensions;
  }

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const json = (await response.json()) as {
    data?: { embedding: number[]; index: number }[];
    error?: { message?: string };
  };

  if (!response.ok || !json.data) {
    throw new Error(json.error?.message ?? "OpenAI embedding request failed.");
  }

  return json.data
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}

export async function withRetries<T>(
  operation: () => Promise<T>,
  retries = 2,
  delayMs = 1500,
) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, delayMs * (attempt + 1)),
        );
      }
    }
  }

  throw lastError;
}
