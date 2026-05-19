import type {
  ContentSourceMetadata,
  ContentValidationIssue,
} from "@/types/content";
import type { ContentSourceType, ContentStatus } from "@/types/database";

export const allowedContentSourceTypes = [
  "notes",
  "syllabus",
  "answer_key",
  "previous_question",
  "manual",
  "other",
] as const satisfies readonly ContentSourceType[];

export const allowedContentStatuses = [
  "draft",
  "ready",
  "archived",
] as const satisfies readonly ContentStatus[];

export function isAllowedSourceType(value: string): value is ContentSourceType {
  return allowedContentSourceTypes.includes(value as ContentSourceType);
}

export function isAllowedContentStatus(value: string): value is ContentStatus {
  return allowedContentStatuses.includes(value as ContentStatus);
}

export function wordCount(content: string) {
  return content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function approximateTokenCount(content: string) {
  return Math.ceil(wordCount(content) * 1.35);
}

export function validateSourceMetadata(
  metadata: Partial<ContentSourceMetadata>,
  fileName: string,
) {
  const issues: ContentValidationIssue[] = [];

  if (!metadata.subject?.trim()) {
    issues.push({ fileName, message: "subject is required.", severity: "error" });
  }

  if (!Number.isInteger(metadata.module) || !metadata.module || metadata.module < 1 || metadata.module > 5) {
    issues.push({
      fileName,
      message: "module is required and must be between 1 and 5.",
      severity: "error",
    });
  }

  if (!metadata.title?.trim()) {
    issues.push({ fileName, message: "title is required.", severity: "error" });
  }

  if (!metadata.source_type || !isAllowedSourceType(metadata.source_type)) {
    issues.push({
      fileName,
      message: "source_type is required and must be an allowed value.",
      severity: "error",
    });
  }

  if (!metadata.status || !isAllowedContentStatus(metadata.status)) {
    issues.push({
      fileName,
      message: "status is required and must be draft, ready, or archived.",
      severity: "error",
    });
  }

  return issues;
}

export function validateChunkMetadata({
  content,
  fileName,
  moduleNumber,
  status,
  subjectSlug,
  title,
}: {
  content: string;
  fileName: string;
  moduleNumber: number;
  status: ContentStatus;
  subjectSlug: string;
  title: string;
}) {
  const issues: ContentValidationIssue[] = [];
  const words = wordCount(content);

  if (!subjectSlug) {
    issues.push({ fileName, message: "chunk subject metadata is missing.", severity: "error" });
  }

  if (!Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > 5) {
    issues.push({ fileName, message: "chunk module metadata is invalid.", severity: "error" });
  }

  if (!title.trim()) {
    issues.push({ fileName, message: "chunk topic title is missing.", severity: "warning" });
  }

  if (!content.trim()) {
    issues.push({ fileName, message: `topic "${title}" has no content.`, severity: "warning" });
    return issues;
  }

  if (/\bTODO\b/i.test(content) && status === "ready") {
    issues.push({
      fileName,
      message: `ready topic "${title}" still contains TODO markers.`,
      severity: "warning",
    });
  }

  if (words < 80) {
    issues.push({
      fileName,
      message: `topic "${title}" is short (${words} words).`,
      severity: "warning",
    });
  }

  if (words > 900) {
    issues.push({
      fileName,
      message: `topic "${title}" is long (${words} words) and may need splitting.`,
      severity: "warning",
    });
  }

  return issues;
}
