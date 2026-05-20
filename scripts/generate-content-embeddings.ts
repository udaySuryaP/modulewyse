import {
  createEmbeddings,
  createServiceClient,
  getEmbeddingConfig,
  isMissingEmbeddingSchemaError,
  loadLocalEnv,
  requireEnv,
  toVectorLiteral,
  withRetries,
} from "./embedding-utils";

type ChunkRow = {
  content: string;
  id: string;
  metadata: Record<string, unknown>;
  title: string | null;
};

const batchSize = 24;
const minimumWords = 20;

function wordCount(content: string) {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

async function markSkipped(supabase: ReturnType<typeof createServiceClient>, id: string) {
  const { error } = await supabase
    .from("content_chunks")
    .update({
      embedding_error: "Skipped because content is too short for embedding.",
      embedding_status: "skipped",
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

async function markFailed(
  supabase: ReturnType<typeof createServiceClient>,
  id: string,
  message: string,
) {
  const { error } = await supabase
    .from("content_chunks")
    .update({
      embedding_error: message.slice(0, 1000),
      embedding_status: "failed",
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

async function main() {
  await loadLocalEnv();
  requireEnv("OPENAI_API_KEY");

  const { dimensions, model } = getEmbeddingConfig();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("content_chunks")
    .select(
      "id, title, content, metadata, embedding_status, content_sources!inner(status, source_type), subjects!inner(slug), modules!inner(module_number)",
    )
    .eq("status", "ready")
    .eq("content_sources.status", "ready")
    .eq("content_sources.source_type", "notes")
    .eq("subjects.slug", "oop")
    .eq("metadata->>subjectCode", "PBCST304")
    .in("modules.module_number", [1, 2, 3])
    .or("embedding_status.eq.pending,embedding_status.eq.failed")
    .order("created_at", { ascending: true });

  if (error) {
    if (isMissingEmbeddingSchemaError(error)) {
      console.error(
        "Embedding columns are not available yet. Apply the pgvector embedding migration first.",
      );
      process.exitCode = 1;
      return;
    }

    throw error;
  }

  const rows = (data ?? []) as unknown as ChunkRow[];
  const eligible = rows.filter((row) => wordCount(row.content) >= minimumWords);
  const skipped = rows.filter((row) => wordCount(row.content) < minimumWords);
  let embedded = 0;
  let failed = 0;

  for (const row of skipped) {
    await markSkipped(supabase, row.id);
  }

  for (let index = 0; index < eligible.length; index += batchSize) {
    const batch = eligible.slice(index, index + batchSize);

    try {
      const embeddings = await withRetries(() =>
        createEmbeddings(batch.map((row) => row.content)),
      );

      for (let itemIndex = 0; itemIndex < batch.length; itemIndex += 1) {
        const row = batch[itemIndex];
        const embedding = embeddings[itemIndex];

        if (!embedding || embedding.length !== dimensions) {
          failed += 1;
          await markFailed(
            supabase,
            row.id,
            `Embedding dimension mismatch. Expected ${dimensions}.`,
          );
          continue;
        }

        const { error: updateError } = await supabase
          .from("content_chunks")
          .update({
            embedding: toVectorLiteral(embedding),
            embedding_error: null,
            embedding_generated_at: new Date().toISOString(),
            embedding_model: model,
            embedding_status: "embedded",
          })
          .eq("id", row.id);

        if (updateError) {
          failed += 1;
          await markFailed(supabase, row.id, updateError.message);
          continue;
        }

        embedded += 1;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failed += batch.length;

      for (const row of batch) {
        await markFailed(supabase, row.id, message);
      }
    }
  }

  console.log("Embedding generation complete.");
  console.log(`Model used: ${model}`);
  console.log(`Dimensions used: ${dimensions}`);
  console.log(`Chunks scanned: ${rows.length}`);
  console.log(`Chunks eligible: ${eligible.length}`);
  console.log(`Chunks embedded: ${embedded}`);
  console.log(`Chunks skipped: ${skipped.length}`);
  console.log(`Chunks failed: ${failed}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
