import "server-only";

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

import { serverEnv } from "@/lib/env/server";
import { env } from "@/lib/env/public";
import type { RagSource } from "@/types/chat";

const subjectSlug = "oop";
const subjectCode = "PBCST304";
const sourceType = "notes";
const allowedModules = new Set([1, 2, 3]);
const defaultTopK = 8;

type RetrievedRow = {
  chunk_id: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
  source_id: string;
  title: string | null;
};

export type RetrievedRagChunk = RagSource & {
  content: string;
  chunkKind: string;
  retrievalEligible: boolean;
};

export type RetrievalResult = {
  chunks: RetrievedRagChunk[];
  matchedCount: number;
  topK: number;
};

function requireServerEnv(name: keyof typeof serverEnv) {
  const value = serverEnv[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function openaiClient() {
  return new OpenAI({
    apiKey: requireServerEnv("OPENAI_API_KEY"),
  });
}

function serviceClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required.");
  }

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    requireServerEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
      },
    },
  );
}

function embeddingDimensions() {
  const dimensions = Number(serverEnv.EMBEDDING_DIMENSIONS || "1536");

  if (!Number.isInteger(dimensions) || dimensions <= 0) {
    throw new Error("EMBEDDING_DIMENSIONS must be a positive integer.");
  }

  return dimensions;
}

function vectorLiteral(values: number[]) {
  return `[${values.join(",")}]`;
}

function textPreview(content: string) {
  return content.replace(/\s+/g, " ").trim().slice(0, 220);
}

function numberFromMetadata(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function expandQuery(query: string) {
  const normalized = query.toLowerCase();
  const expansions: string[] = [];

  if (normalized.includes("constructor overloading")) {
    expansions.push(
      "multiple constructors same class different parameter list Box() Box(double) Box(double w double h double d)",
    );
  } else if (normalized.includes("copy constructor")) {
    expansions.push("copy constructor copies data from one object to another");
  } else if (normalized.includes("parameterized constructor")) {
    expansions.push("parameterized constructor accepts arguments initialize object values");
  } else if (normalized.includes("default constructor")) {
    expansions.push(
      "default constructor compiler provided no constructor defined initializes object default values",
    );
  } else if (normalized.includes("constructor")) {
    expansions.push(
      "default constructor parameterized constructor copy constructor constructor chaining this() superclass constructor super()",
    );
  }

  if (
    normalized.includes("dynamic binding") ||
    normalized.includes("dynamic method dispatch")
  ) {
    expansions.push(
      "late binding dynamic method dispatch runtime polymorphism method overriding superclass reference subclass object overridden method",
    );
  }

  if (normalized.includes("access specifier") || normalized.includes("access modifier")) {
    expansions.push("access modifier public private protected default package-private");
  }

  return [query, ...expansions].join(" ");
}

function exactTopicBoost(query: string, title: string) {
  const normalizedQuery = query.toLowerCase();
  const normalizedTitle = title.toLowerCase();

  if (normalizedQuery.includes("constructor overloading")) {
    if (normalizedTitle.includes("constructor overloading")) {
      return 0.26;
    }

    if (
      normalizedTitle.includes("parameterized constructor") ||
      normalizedTitle.includes("default constructor") ||
      normalizedTitle.includes("copy constructor")
    ) {
      return 0.06;
    }
  }

  const topicGroups = [
    {
      query: ["constructor"],
      titles: [
        "constructor definition",
        "default constructor",
        "parameterized constructor",
        "copy constructor",
        "constructor chaining",
        "calling order of constructors",
      ],
    },
    {
      query: ["access specifier", "access modifier", "private public protected"],
      titles: [
        "access modifiers in java",
        "access modifier types",
        "access modifier comparison table",
      ],
    },
    {
      query: ["dynamic binding", "dynamic method dispatch"],
      titles: ["dynamic method dispatch", "runtime polymorphism", "late binding"],
    },
    {
      query: ["method overloading"],
      titles: ["method overloading", "compile time polymorphism"],
    },
  ];

  for (const group of topicGroups) {
    if (
      group.query.some((term) => normalizedQuery.includes(term)) &&
      group.titles.some((term) => normalizedTitle.includes(term))
    ) {
      return 0.12;
    }
  }

  return 0;
}

function adjustedScore(query: string, row: RetrievedRow) {
  const title = String(row.metadata.topicTitle ?? row.title ?? "");
  const chunkKind = String(row.metadata.chunkKind ?? "");
  const normalizedQuery = query.toLowerCase();
  const normalizedTitle = title.toLowerCase();
  let score = row.similarity + exactTopicBoost(query, title);

  if (chunkKind === "concept") {
    score += 0.03;
  }

  if (
    chunkKind === "example" &&
    !normalizedQuery.includes("example") &&
    !normalizedQuery.includes("constructor overloading")
  ) {
    score -= 0.02;
  }

  if (
    normalizedQuery.includes("method overloading") &&
    (normalizedTitle.includes("overriding") ||
      normalizedTitle.includes("dynamic method dispatch"))
  ) {
    score -= 0.1;
  }

  if (normalizedQuery.includes("access") && normalizedTitle.includes("compile")) {
    score -= 0.12;
  }

  return score;
}

function isPbcst304ReadyNote(row: RetrievedRow) {
  const metadata = row.metadata ?? {};
  const moduleNumber = numberFromMetadata(metadata.moduleNumber);

  return (
    metadata.subjectSlug === subjectSlug &&
    metadata.subjectCode === subjectCode &&
    metadata.sourceType === sourceType &&
    metadata.status === "ready" &&
    metadata.retrievalEligible !== false &&
    moduleNumber !== null &&
    allowedModules.has(moduleNumber)
  );
}

function toRagChunk(row: RetrievedRow, index: number): RetrievedRagChunk | null {
  const metadata = row.metadata ?? {};
  const moduleNumber = numberFromMetadata(metadata.moduleNumber);

  if (!moduleNumber) {
    return null;
  }

  const topicTitle = String(metadata.topicTitle ?? row.title ?? "Untitled");
  const sourceTitle = String(metadata.sourceTitle ?? `Module ${moduleNumber}`);

  return {
    chunkId: row.chunk_id,
    chunkKind: String(metadata.chunkKind ?? "concept"),
    content: row.content,
    moduleNumber,
    retrievalEligible: metadata.retrievalEligible !== false,
    shortPreview: textPreview(row.content),
    similarity: row.similarity,
    sourceId: row.source_id,
    sourceNumber: index + 1,
    sourceTitle,
    topicTitle,
  };
}

async function queryEmbedding(query: string) {
  const dimensions = embeddingDimensions();
  const response = await openaiClient().embeddings.create({
    dimensions,
    encoding_format: "float",
    input: expandQuery(query),
    model: serverEnv.EMBEDDING_MODEL,
  });
  const embedding = response.data[0]?.embedding;

  if (!embedding || embedding.length !== dimensions) {
    throw new Error("Query embedding dimension mismatch.");
  }

  return embedding;
}

export async function retrievePbcst304Chunks(input: {
  moduleHint?: 1 | 2 | 3 | "all" | null;
  question: string;
  topK?: number;
}): Promise<RetrievalResult> {
  const topK = input.topK ?? defaultTopK;
  const embedding = await queryEmbedding(input.question);
  const supabase = serviceClient();
  const moduleFilter =
    typeof input.moduleHint === "number" ? input.moduleHint : null;

  const { data, error } = await supabase.rpc("match_content_chunks", {
    filter_module_number: moduleFilter,
    filter_subject_slug: subjectSlug,
    match_count: Math.max(topK, 12),
    query_embedding: vectorLiteral(embedding),
  });

  if (error) {
    throw error;
  }

  let rows = ((data ?? []) as RetrievedRow[])
    .filter(isPbcst304ReadyNote)
    .sort((a, b) => adjustedScore(input.question, b) - adjustedScore(input.question, a));

  if (moduleFilter && rows.length < 2) {
    const { data: retryData, error: retryError } = await supabase.rpc(
      "match_content_chunks",
      {
        filter_module_number: null,
        filter_subject_slug: subjectSlug,
        match_count: Math.max(topK, 12),
        query_embedding: vectorLiteral(embedding),
      },
    );

    if (retryError) {
      throw retryError;
    }

    rows = ((retryData ?? []) as RetrievedRow[])
      .filter(isPbcst304ReadyNote)
      .sort(
        (a, b) =>
          adjustedScore(input.question, b) - adjustedScore(input.question, a),
      );
  }

  const chunks = rows
    .slice(0, topK)
    .map(toRagChunk)
    .filter((chunk): chunk is RetrievedRagChunk => Boolean(chunk))
    .map((chunk, index) => ({ ...chunk, sourceNumber: index + 1 }));

  return {
    chunks,
    matchedCount: chunks.length,
    topK,
  };
}
