import type {
  ContentChunkStatus,
  ContentSourceType,
  ContentStatus,
} from "@/types/database";

export type ContentValidationSeverity = "warning" | "error";

export type ContentValidationIssue = {
  fileName?: string;
  message: string;
  severity: ContentValidationSeverity;
};

export type ParsedContentTopic = {
  content: string;
  title: string;
};

export type ParsedContentModule = {
  body: string;
  fileName: string;
  frontmatter: ContentSourceMetadata;
  topics: ParsedContentTopic[];
  warnings: ContentValidationIssue[];
};

export type ContentSourceMetadata = {
  module: number;
  needs_review?: boolean;
  source_type: ContentSourceType;
  status: ContentStatus;
  subject: string;
  subject_code?: string;
  subject_name?: string;
  title: string;
  topics: string[];
};

export type ContentSourceInput = {
  contentHash: string;
  description?: string | null;
  fileName: string;
  metadata: Record<string, unknown>;
  moduleNumber: number;
  origin?: string | null;
  sourceType: ContentSourceType;
  status: ContentStatus;
  subjectSlug: string;
  title: string;
};

export type ContentChunkInput = {
  chunkIndex: number;
  content: string;
  metadata: Record<string, unknown>;
  status: ContentChunkStatus;
  title: string;
  tokenCount: number;
};

export type ChunkPreview = {
  chunkIndex: number;
  content: string;
  metadata: {
    chunkKind: "concept" | "example";
    moduleNumber: number;
    retrievalEligible: boolean;
    sourceFile: string;
    sourceTitle: string;
    sourceType: ContentSourceType;
    status: ContentStatus;
    subjectCode: string;
    subjectSlug: string;
    topicTitle: string;
  };
  title: string;
  wordCount: number;
};

export type SourcePreview = {
  chunks: ChunkPreview[];
  contentHash: string;
  fileName: string;
  module: number;
  needsReview: boolean;
  sourceType: ContentSourceType;
  status: ContentStatus;
  subject: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  topics: string[];
  warnings: ContentValidationIssue[];
};

export type ContentPreviewOutput = {
  chunkCount: number;
  generatedAt: string;
  sourceCount: number;
  sources: SourcePreview[];
  subject: string;
  warnings: ContentValidationIssue[];
};

export type ContentIngestionResult = {
  chunksUpserted: number;
  skippedSources: number;
  sourcesUpserted: number;
  warnings: ContentValidationIssue[];
};
