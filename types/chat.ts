export type RagAnswerStatus = "answered" | "insufficient_source" | "error";

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
  retrieval?: {
    matchedCount: number;
    topK: number;
  };
  sources: RagSource[];
  status: RagAnswerStatus;
  userMessageId: string | null;
};
