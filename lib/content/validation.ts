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

export const pbcst304ReadyModules = [1, 2, 3] as const;
export const pbcst304DraftModules = [4] as const;
export const pbcst304ValidModules = [1, 2, 3, 4] as const;
export const pbcst304NonexistentModules = [5] as const;

export const pbcst304ModulePlan = {
  draftModules: pbcst304DraftModules,
  nonexistentModules: pbcst304NonexistentModules,
  readyModules: pbcst304ReadyModules,
  scheme: 2024,
  validModules: pbcst304ValidModules,
} as const;

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

  if (metadata.subject !== "oop") {
    issues.push({ fileName, message: "subject must be the slug oop.", severity: "error" });
  }

  if (metadata.subject_code && metadata.subject_code !== "PBCST304") {
    issues.push({ fileName, message: "subject_code must be PBCST304.", severity: "error" });
  }

  const isPbcst304 = metadata.subject_code === "PBCST304";
  const moduleNumber = metadata.module;

  if (!Number.isInteger(moduleNumber) || !moduleNumber || moduleNumber < 1) {
    issues.push({
      fileName,
      message: "module is required and must be a positive integer.",
      severity: "error",
    });
  }

  if (
    isPbcst304 &&
    Number.isInteger(moduleNumber) &&
    !pbcst304ModulePlan.validModules.includes(
      moduleNumber as (typeof pbcst304ModulePlan.validModules)[number],
    )
  ) {
    const isNonexistentModule = pbcst304ModulePlan.nonexistentModules.includes(
      moduleNumber as (typeof pbcst304ModulePlan.nonexistentModules)[number],
    );
    issues.push({
      fileName,
      message: isNonexistentModule
        ? "Module 5 does not exist in the KTU 2024 scheme for PBCST304."
        : "PBCST304 valid modules are 1, 2, 3, and 4 for the KTU 2024 scheme.",
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

  if (
    isPbcst304 &&
    metadata.status === "ready" &&
    !pbcst304ReadyModules.includes(metadata.module as 1 | 2 | 3)
  ) {
    issues.push({
      fileName,
      message: "Only PBCST304 Modules 1, 2, and 3 may be marked ready in this phase.",
      severity: "error",
    });
  }

  if (metadata.status === "ready" && metadata.needs_review) {
    issues.push({
      fileName,
      message: "ready content cannot have needs_review enabled.",
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
      severity: "error",
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
