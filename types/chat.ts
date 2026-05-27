export type RagAnswerStatus =
  | "answered"
  | "insufficient_source"
  | "error"
  | "rate_limited";

export type RagAnswerType = "short" | "medium" | "long" | "exam";

export type RagSource = {
  chunkId: string;
  moduleNumber: number;
  shortPreview: string;
  similarity: number;
  sourceId: string;
  sourceNumber: number;
  sourceTitle: string;
  topicTitle: string;
};

export type RagAnswerResponse = {
  answer: string;
  assistantMessageId: string | null;
  conversationId: string | null;
  reason?: string;
  retryAfter?: number;
  retrieval?: {
    matchedCount: number;
    topK: number;
  };
  sources: RagSource[];
  status: RagAnswerStatus;
  userMessageId: string | null;
};
