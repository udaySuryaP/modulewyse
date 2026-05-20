import {
  createServiceClient,
  getEmbeddingConfig,
  isMissingEmbeddingSchemaError,
  loadLocalEnv,
} from "./embedding-utils";

type StatusRow = {
  embedding_model: string | null;
  embedding_status: "pending" | "embedded" | "failed" | "skipped";
  metadata: Record<string, unknown>;
};

async function main() {
  await loadLocalEnv();

  const { dimensions, model } = getEmbeddingConfig();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("content_chunks")
    .select(
      "id, embedding_status, embedding_model, metadata, content_sources!inner(status, source_type), subjects!inner(slug), modules(module_number)",
    )
    .eq("status", "ready")
    .eq("content_sources.status", "ready")
    .eq("content_sources.source_type", "notes")
    .eq("subjects.slug", "oop")
    .eq("metadata->>subjectCode", "PBCST304");

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

  const rows = (data ?? []) as unknown as StatusRow[];
  const moduleStats = new Map<
    number,
    Record<StatusRow["embedding_status"], number>
  >();
  const modelCounts = new Map<string, number>();
  const totals: Record<StatusRow["embedding_status"], number> = {
    embedded: 0,
    failed: 0,
    pending: 0,
    skipped: 0,
  };

  for (const row of rows) {
    totals[row.embedding_status] += 1;

    if (row.embedding_model) {
      modelCounts.set(
        row.embedding_model,
        (modelCounts.get(row.embedding_model) ?? 0) + 1,
      );
    }

    const moduleNumber = Number(row.metadata.moduleNumber);

    if (Number.isInteger(moduleNumber)) {
      const current =
        moduleStats.get(moduleNumber) ??
        ({
          embedded: 0,
          failed: 0,
          pending: 0,
          skipped: 0,
        } satisfies Record<StatusRow["embedding_status"], number>);
      current[row.embedding_status] += 1;
      moduleStats.set(moduleNumber, current);
    }
  }

  console.log("Embedding status");
  console.log(`Configured model: ${model}`);
  console.log(`Configured dimensions: ${dimensions}`);
  console.log(`Total ready PBCST304 chunks: ${rows.length}`);
  console.log(`Embedded: ${totals.embedded}`);
  console.log(`Pending: ${totals.pending}`);
  console.log(`Failed: ${totals.failed}`);
  console.log(`Skipped: ${totals.skipped}`);

  for (const [moduleNumber, stats] of [...moduleStats.entries()].sort(
    ([a], [b]) => a - b,
  )) {
    console.log(
      `Module ${moduleNumber}: ${stats.embedded} embedded, ${stats.pending} pending, ${stats.failed} failed, ${stats.skipped} skipped`,
    );
  }

  if (modelCounts.size > 0) {
    console.log("Embedding model distribution:");
    for (const [embeddingModel, count] of modelCounts.entries()) {
      console.log(`- ${embeddingModel}: ${count}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
