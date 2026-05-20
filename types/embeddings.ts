import type { EmbeddingStatus } from "@/types/database";

export type { EmbeddingStatus };

export type EmbeddingJobChunk = {
  content: string;
  id: string;
  metadata: Record<string, unknown>;
  moduleNumber: number | null;
  sourceType: string | null;
  title: string | null;
};

export type EmbeddingGenerationResult = {
  chunksEligible: number;
  chunksEmbedded: number;
  chunksFailed: number;
  chunksScanned: number;
  chunksSkipped: number;
  dimensions: number;
  model: string;
};

export type RetrievedChunk = {
  chunkId: string;
  content: string;
  metadata: Record<string, unknown>;
  moduleNumber: number | null;
  similarity: number;
  sourceId: string;
  title: string | null;
  topicTitle: string | null;
};

export type RetrievalTestResult = {
  query: string;
  results: RetrievedChunk[];
};
