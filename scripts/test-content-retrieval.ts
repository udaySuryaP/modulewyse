import {
  createEmbeddings,
  createServiceClient,
  getEmbeddingConfig,
  isMissingEmbeddingSchemaError,
  loadLocalEnv,
  requireEnv,
  toVectorLiteral,
} from "./embedding-utils";

type RetrievedRow = {
  chunk_id: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
  source_id: string;
  title: string | null;
};

const defaultQueries = [
  "Explain classes and objects",
  "What is inheritance?",
  "Explain constructors in OOP",
  "Difference between class and object",
  "Explain method overloading",
  "What is polymorphism?",
  "Explain access specifiers",
  "What is dynamic binding?",
  "Explain default constructor",
  "Explain runtime polymorphism",
  "Explain dynamic method dispatch",
  "Explain constructor overloading",
];

function preview(content: string) {
  return content.replace(/\s+/g, " ").trim().slice(0, 220);
}

function expandQuery(query: string) {
  const normalized = query.toLowerCase();
  const expansions: string[] = [];

  if (normalized.includes("constructor overloading")) {
    expansions.push(
      "multiple constructors same class different parameter list Box() Box(double) Box(double w double h double d)",
    );
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

  if (normalized.includes("access specifier")) {
    expansions.push("access modifier public private protected default package-private");
  }

  return [query, ...expansions].join(" ");
}

async function main() {
  await loadLocalEnv();
  requireEnv("OPENAI_API_KEY");

  const { dimensions, model } = getEmbeddingConfig();
  const supabase = createServiceClient();
  const query = process.argv.slice(2).join(" ").trim();
  const queries = query ? [query] : defaultQueries;

  console.log(`Retrieval test model: ${model}`);
  console.log(`Retrieval test dimensions: ${dimensions}`);

  for (const currentQuery of queries) {
    const expandedQuery = expandQuery(currentQuery);
    const [embedding] = await createEmbeddings(expandedQuery);

    if (!embedding || embedding.length !== dimensions) {
      throw new Error(`Query embedding dimension mismatch for "${currentQuery}".`);
    }

    const { data, error } = await supabase.rpc("match_content_chunks", {
      filter_module_number: null,
      filter_subject_slug: "oop",
      match_count: 5,
      query_embedding: toVectorLiteral(embedding),
    });

    if (error) {
      if (isMissingEmbeddingSchemaError(error)) {
        console.error(
          "Retrieval function or embedding columns are not available yet. Apply the pgvector embedding migration first.",
        );
        process.exitCode = 1;
        return;
      }

      throw error;
    }

    const rows = (data ?? []) as RetrievedRow[];
    console.log(`\nQuery: ${currentQuery}`);

    if (rows.length === 0) {
      console.log("No embedded chunks returned. Run npm run embeddings:generate first.");
      continue;
    }

    for (const row of rows) {
      const moduleNumber = row.metadata.moduleNumber ?? "unknown";
      const topicTitle = row.metadata.topicTitle ?? row.title ?? "Untitled";
      const sourceTitle = row.metadata.sourceTitle ?? "Unknown source";

      console.log(
        `- similarity=${row.similarity.toFixed(4)} module=${moduleNumber} topic="${topicTitle}" source="${sourceTitle}"`,
      );
      console.log(`  ${preview(row.content)}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
