import type { SupabaseClient } from "@supabase/supabase-js";
import type { EmbeddingStatus } from "@/types/database";

type SupabaseLike = Pick<SupabaseClient, "from">;

export type EmbeddingStats = {
  embedded: number;
  failed: number;
  pending: number;
  skipped: number;
  total: number;
};

export async function getReadyChunksMissingEmbeddings(
  supabase: SupabaseLike,
  limit = 100,
) {
  const { data, error } = await supabase
    .from("content_chunks")
    .select(
      "id, title, content, metadata, embedding_status, content_sources!inner(status, source_type), subjects!inner(slug), modules(module_number)",
    )
    .eq("status", "ready")
    .eq("content_sources.status", "ready")
    .eq("subjects.slug", "oop")
    .eq("metadata->>subjectCode", "PBCST304")
    .is("embedding", null)
    .in("embedding_status", ["pending", "failed"])
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getReadyChunksWithEmbeddings(
  supabase: SupabaseLike,
  limit = 100,
) {
  const { data, error } = await supabase
    .from("content_chunks")
    .select(
      "id, title, content, metadata, embedding_model, embedding_status, embedding_generated_at, content_sources!inner(status), subjects!inner(slug), modules(module_number)",
    )
    .eq("status", "ready")
    .eq("content_sources.status", "ready")
    .eq("subjects.slug", "oop")
    .eq("metadata->>subjectCode", "PBCST304")
    .not("embedding", "is", null)
    .eq("embedding_status", "embedded")
    .order("embedding_generated_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function updateChunkEmbedding(input: {
  chunkId: string;
  embedding: number[] | string;
  model: string;
  supabase: SupabaseLike;
}) {
  const { error } = await input.supabase
    .from("content_chunks")
    .update({
      embedding: Array.isArray(input.embedding)
        ? `[${input.embedding.join(",")}]`
        : input.embedding,
      embedding_error: null,
      embedding_generated_at: new Date().toISOString(),
      embedding_model: input.model,
      embedding_status: "embedded" satisfies EmbeddingStatus,
    })
    .eq("id", input.chunkId);

  if (error) {
    throw error;
  }
}

export async function markChunkEmbeddingFailed(input: {
  chunkId: string;
  errorMessage: string;
  supabase: SupabaseLike;
}) {
  const { error } = await input.supabase
    .from("content_chunks")
    .update({
      embedding_error: input.errorMessage.slice(0, 1000),
      embedding_status: "failed" satisfies EmbeddingStatus,
    })
    .eq("id", input.chunkId);

  if (error) {
    throw error;
  }
}

export async function getEmbeddingStats(supabase: SupabaseLike) {
  const { data, error } = await supabase
    .from("content_chunks")
    .select("embedding_status, content_sources!inner(status), subjects!inner(slug)")
    .eq("status", "ready")
    .eq("content_sources.status", "ready")
    .eq("subjects.slug", "oop")
    .eq("metadata->>subjectCode", "PBCST304");

  if (error) {
    throw error;
  }

  const stats: EmbeddingStats = {
    embedded: 0,
    failed: 0,
    pending: 0,
    skipped: 0,
    total: data?.length ?? 0,
  };

  for (const row of data ?? []) {
    const status = row.embedding_status as EmbeddingStatus | null;
    if (status && status in stats) {
      stats[status] += 1;
    }
  }

  return stats;
}
