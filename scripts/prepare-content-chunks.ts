import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  approximateTokenCount,
  isAllowedContentStatus,
  isAllowedSourceType,
  pbcst304ReadyModules,
  validateChunkMetadata,
  validateSourceMetadata,
  wordCount,
} from "../lib/content/validation";
import type {
  ChunkPreview,
  ContentPreviewOutput,
  ContentSourceMetadata,
  ContentValidationIssue,
  ParsedContentTopic,
  SourcePreview,
} from "../types/content";

const rootDir = process.cwd();
const contentDir = path.join(rootDir, "content", "oop");
const generatedDir = path.join(rootDir, "content", "generated");
const outputPath = path.join(generatedDir, "oop-chunks.preview.json");
const expectedCourseCode = "PBCST304";
const readyModuleNumbers = new Set<number>(pbcst304ReadyModules);

function hashContent(content: string) {
  return createHash("sha256").update(content).digest("hex");
}

function parseScalar(value: string) {
  const trimmed = value.trim();

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  if (trimmed === "null") {
    return null;
  }

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  return trimmed;
}

function parseFrontmatter(raw: string, fileName: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!match) {
    return {
      body: raw,
      metadata: {} as Partial<ContentSourceMetadata>,
      warnings: [{ fileName, message: "frontmatter block is missing.", severity: "error" } satisfies ContentValidationIssue],
    };
  }

  const frontmatter = match[1];
  const metadata: Record<string, unknown> = {};
  const lines = frontmatter.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const keyMatch = line.match(/^([A-Za-z_]+):\s*(.*)$/);

    if (!keyMatch) {
      continue;
    }

    const [, key, value] = keyMatch;

    if (value) {
      metadata[key] = parseScalar(value);
      continue;
    }

    const list: string[] = [];
    let nextIndex = index + 1;
    while (nextIndex < lines.length && /^\s+-\s+/.test(lines[nextIndex])) {
      list.push(lines[nextIndex].replace(/^\s+-\s+/, "").trim());
      nextIndex += 1;
    }
    metadata[key] = list;
    index = nextIndex - 1;
  }

  const parsed = {
    module: typeof metadata.module === "number" ? metadata.module : Number(metadata.module),
    needs_review: Boolean(metadata.needs_review),
    source_type: String(metadata.source_type ?? ""),
    status: String(metadata.status ?? ""),
    subject: String(metadata.subject ?? ""),
    subject_code: String(metadata.subject_code ?? ""),
    subject_name: String(metadata.subject_name ?? ""),
    title: String(metadata.title ?? ""),
    topics: Array.isArray(metadata.topics) ? metadata.topics.map(String) : [],
  } as Partial<ContentSourceMetadata>;

  return {
    body: raw.slice(match[0].length),
    metadata: parsed,
    warnings: validateSourceMetadata(parsed, fileName),
  };
}

function parseTopics(body: string) {
  const topicPattern = /^##\s+Topic:\s+(.+)$/gim;
  const matches = [...body.matchAll(topicPattern)];
  const topics: ParsedContentTopic[] = [];

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const nextMatch = matches[index + 1];
    const start = (match.index ?? 0) + match[0].length;
    const end = nextMatch?.index ?? body.length;
    topics.push({
      content: body.slice(start, end).trim(),
      title: match[1].trim(),
    });
  }

  return topics;
}

function splitTopicIntoChunks(topic: ParsedContentTopic, maxWords = 700) {
  const words = topic.content.trim().split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return [topic.content.trim()].filter(Boolean);
  }

  const chunks: string[] = [];
  for (let index = 0; index < words.length; index += maxWords) {
    chunks.push(words.slice(index, index + maxWords).join(" "));
  }

  return chunks;
}

function imageLinksFromMarkdown(content: string) {
  return [...content.matchAll(/!\[[^\]]*]\(([^)]+)\)/g)].map((match) => match[1].trim());
}

async function imageLinkExists(fileName: string, link: string) {
  if (/^https?:\/\//i.test(link)) {
    return true;
  }

  const cleanLink = link.split("#")[0].split("?")[0];
  const absolutePath = path.resolve(contentDir, path.dirname(fileName), cleanLink);

  try {
    await readFile(absolutePath);
    return true;
  } catch {
    return false;
  }
}

async function buildPreview() {
  const fileNames = (await readdir(contentDir))
    .filter((fileName) => /^module[- ][1-5]\.md$/.test(fileName))
    .sort();
  const sources: SourcePreview[] = [];
  const globalWarnings: ContentValidationIssue[] = [];

  for (const fileName of fileNames) {
    const raw = await readFile(path.join(contentDir, fileName), "utf8");
    const { body, metadata, warnings } = parseFrontmatter(raw, fileName);
    const sourceWarnings = [...warnings];
    const topics = parseTopics(body);
    const chunks: ChunkPreview[] = [];
    const sourceType = metadata.source_type && isAllowedSourceType(metadata.source_type)
      ? metadata.source_type
      : "notes";
    const status = metadata.status && isAllowedContentStatus(metadata.status)
      ? metadata.status
      : "draft";
    const subjectCode = metadata.subject_code ?? "";
    const shouldGenerateChunks =
      status === "ready" &&
      sourceType === "notes" &&
      metadata.subject === "oop" &&
      subjectCode === expectedCourseCode &&
      readyModuleNumbers.has(metadata.module ?? 0);

    if (topics.length === 0) {
      sourceWarnings.push({
        fileName,
        message: "No topic headings found. Use ## Topic: Topic title.",
        severity: "warning",
      });
    }

    if (metadata.module === 5 && subjectCode === expectedCourseCode) {
      sourceWarnings.push({
        fileName,
        message: "Module 5 not expected for PBCST304; file skipped.",
        severity: "error",
      });
    }

    if (status !== "ready") {
      sourceWarnings.push({
        fileName,
        message: "Draft/review source included in preview metadata only; chunks were not generated.",
        severity: "warning",
      });
    }

    for (const link of imageLinksFromMarkdown(body)) {
      if (!(await imageLinkExists(fileName, link))) {
        sourceWarnings.push({
          fileName,
          message: `Image link does not resolve: ${link}`,
          severity: status === "ready" ? "error" : "warning",
        });
      }
    }

    let chunkIndex = 0;
    for (const topic of shouldGenerateChunks ? topics : []) {
      const chunkTexts = splitTopicIntoChunks(topic);

      if (chunkTexts.length === 0) {
        sourceWarnings.push(
          ...validateChunkMetadata({
            content: "",
            fileName,
            moduleNumber: metadata.module ?? 0,
            status,
            subjectSlug: metadata.subject ?? "",
            title: topic.title,
          }),
        );
        continue;
      }

      for (const content of chunkTexts) {
        sourceWarnings.push(
          ...validateChunkMetadata({
            content,
            fileName,
            moduleNumber: metadata.module ?? 0,
            status,
            subjectSlug: metadata.subject ?? "",
            title: topic.title,
          }),
        );

        chunks.push({
          chunkIndex,
          content,
          metadata: {
            moduleNumber: metadata.module ?? 0,
            sourceType,
            status,
            subjectCode,
            sourceFile: fileName,
            sourceTitle: metadata.title ?? "",
            subjectSlug: metadata.subject ?? "",
            topicTitle: topic.title,
          },
          title: topic.title,
          wordCount: wordCount(content),
        });
        chunkIndex += 1;
      }
    }

    sources.push({
      chunks,
      contentHash: hashContent(raw),
      fileName,
      module: metadata.module ?? 0,
      needsReview: Boolean(metadata.needs_review),
      sourceType,
      status,
      subject: metadata.subject ?? "",
      subjectCode,
      subjectName: metadata.subject_name ?? "",
      title: metadata.title ?? fileName,
      topics: metadata.topics ?? [],
      warnings: sourceWarnings,
    });
  }

  const output: ContentPreviewOutput = {
    chunkCount: sources.reduce((total, source) => total + source.chunks.length, 0),
    generatedAt: new Date().toISOString(),
    sourceCount: sources.length,
    sources,
    subject: "oop",
    warnings: globalWarnings,
  };

  await mkdir(generatedDir, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`Content preview written to ${path.relative(rootDir, outputPath)}`);
  console.log(`Sources: ${output.sourceCount}`);
  console.log(`Chunks: ${output.chunkCount}`);

  const warnings = [
    ...output.warnings,
    ...output.sources.flatMap((source) => source.warnings),
  ];

  if (warnings.length > 0) {
    console.log(`Warnings: ${warnings.length}`);
    for (const warning of warnings) {
      console.log(`- [${warning.severity}] ${warning.fileName ?? "global"}: ${warning.message}`);
    }
  }

  console.log(`Approximate token total: ${
    output.sources
      .flatMap((source) => source.chunks)
      .reduce((total, chunk) => total + approximateTokenCount(chunk.content), 0)
  }`);
}

buildPreview().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
