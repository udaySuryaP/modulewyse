import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { approximateTokenCount } from "../lib/content/validation";
import type { ContentPreviewOutput, ContentValidationIssue } from "../types/content";

const rootDir = process.cwd();
const previewPath = path.join(rootDir, "content", "generated", "oop-chunks.preview.json");
const readyModules = new Set([1, 2, 3]);
const expectedCourseCode = "PBCST304";

async function loadLocalEnv() {
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

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for content ingestion.`);
  }

  return value;
}

async function main() {
  await loadLocalEnv();

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const preview = JSON.parse(
    await readFile(previewPath, "utf8"),
  ) as ContentPreviewOutput;
  const warnings: ContentValidationIssue[] = [];
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  let sourcesUpserted = 0;
  let chunksUpserted = 0;
  let skippedSources = 0;

  for (const source of preview.sources) {
    const blockingIssues = source.warnings.filter((issue) => issue.severity === "error");

    if (
      source.status !== "ready" ||
      source.sourceType !== "notes" ||
      source.subject !== "oop" ||
      source.subjectCode !== expectedCourseCode ||
      !readyModules.has(source.module)
    ) {
      warnings.push({
        fileName: source.fileName,
        message: "Skipped: only ready OOP PBCST304 Module 1-3 notes are ingested.",
        severity: "warning",
      });
      skippedSources += 1;
      continue;
    }

    if (blockingIssues.length > 0) {
      warnings.push(...blockingIssues);
      skippedSources += 1;
      continue;
    }

    const { data: subject, error: subjectError } = await supabase
      .from("subjects")
      .select("id, slug")
      .eq("slug", source.subject)
      .single();

    if (subjectError || !subject) {
      warnings.push({
        fileName: source.fileName,
        message: `Subject "${source.subject}" was not found.`,
        severity: "error",
      });
      skippedSources += 1;
      continue;
    }

    const { data: moduleRow, error: moduleError } = await supabase
      .from("modules")
      .select("id, module_number")
      .eq("subject_id", subject.id)
      .eq("module_number", source.module)
      .maybeSingle();

    if (moduleError) {
      throw moduleError;
    }

    const { data: sourceRow, error: sourceError } = await supabase
      .from("content_sources")
      .upsert(
        {
          content_hash: source.contentHash,
          file_name: source.fileName,
          metadata: {
            moduleNumber: source.module,
            needsReview: source.needsReview,
            subjectCode: source.subjectCode,
            subjectName: source.subjectName,
            subjectSlug: source.subject,
            topics: source.topics,
          },
          module_id: moduleRow?.id ?? null,
          origin: "content/oop",
          source_type: source.sourceType,
          status: source.status,
          subject_id: subject.id,
          title: source.title,
        },
        { onConflict: "subject_id,file_name" },
      )
      .select("id")
      .single();

    if (sourceError || !sourceRow) {
      throw sourceError;
    }

    sourcesUpserted += 1;

    const { error: deleteChunksError } = await supabase
      .from("content_chunks")
      .delete()
      .eq("source_id", sourceRow.id);

    if (deleteChunksError) {
      throw deleteChunksError;
    }

    for (const chunk of source.chunks) {
      const { data: topic } = moduleRow
        ? await supabase
            .from("topics")
            .select("id")
            .eq("module_id", moduleRow.id)
            .eq("title", chunk.title)
            .maybeSingle()
        : { data: null };

      const { error: chunkError } = await supabase
        .from("content_chunks")
        .upsert(
          {
            chunk_index: chunk.chunkIndex,
            content: chunk.content,
            metadata: {
              ...chunk.metadata,
              subjectCode: source.subjectCode,
              sourceType: source.sourceType,
            },
            module_id: moduleRow?.id ?? null,
            source_id: sourceRow.id,
            status: source.status,
            subject_id: subject.id,
            title: chunk.title,
            token_count: approximateTokenCount(chunk.content),
            topic_id: topic?.id ?? null,
          },
          { onConflict: "source_id,chunk_index" },
        );

      if (chunkError) {
        throw chunkError;
      }

      chunksUpserted += 1;
    }
  }

  console.log("Content ingestion complete.");
  console.log(`Sources upserted: ${sourcesUpserted}`);
  console.log(`Chunks upserted: ${chunksUpserted}`);
  console.log(`Sources skipped: ${skippedSources}`);

  if (warnings.length > 0) {
    console.log(`Warnings: ${warnings.length}`);
    for (const warning of warnings) {
      console.log(`- [${warning.severity}] ${warning.fileName ?? "global"}: ${warning.message}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
