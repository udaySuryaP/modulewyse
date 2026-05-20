export type SubjectStatus = "available" | "beta" | "coming-soon" | "draft";
export type ModuleStatus = SubjectStatus;
export type TopicStatus = SubjectStatus;

export type Subject = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  code: string | null;
  semester: number | null;
  status: SubjectStatus;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Module = {
  id: string;
  subject_id: string;
  module_number: number;
  title: string;
  description: string | null;
  status: ModuleStatus;
  created_at: string;
  updated_at: string;
};

export type Topic = {
  id: string;
  subject_id: string;
  module_id: string;
  title: string;
  aliases: string[];
  priority: number;
  status: TopicStatus;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  title: string;
  subject_slug: string | null;
  module_value: string | null;
  access_count: number;
  last_accessed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MessageRole = "user" | "assistant";

export type Message = {
  id: string;
  conversation_id: string;
  user_id: string;
  role: MessageRole;
  content: string;
  answer_type: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type MessageFeedbackRating = "up" | "down";

export type MessageFeedback = {
  id: string;
  message_id: string;
  user_id: string;
  rating: MessageFeedbackRating;
  note: string | null;
  created_at: string;
};

export type ContentSourceType =
  | "notes"
  | "syllabus"
  | "answer_key"
  | "previous_question"
  | "manual"
  | "other";

export type ContentStatus = "draft" | "ready" | "archived";
export type ContentChunkStatus = ContentStatus;
export type EmbeddingStatus = "pending" | "embedded" | "failed" | "skipped";

export type ContentSource = {
  id: string;
  subject_id: string;
  module_id: string | null;
  topic_id: string | null;
  title: string;
  source_type: ContentSourceType;
  status: ContentStatus;
  origin: string | null;
  file_name: string | null;
  source_url: string | null;
  content_hash: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ContentChunk = {
  id: string;
  source_id: string;
  subject_id: string;
  module_id: string | null;
  topic_id: string | null;
  chunk_index: number;
  title: string | null;
  content: string;
  token_count: number | null;
  status: ContentChunkStatus;
  embedding: number[] | string | null;
  embedding_model: string | null;
  embedding_status: EmbeddingStatus;
  embedding_error: string | null;
  embedding_generated_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type PreviousQuestionType =
  | "short"
  | "medium"
  | "long"
  | "part_a"
  | "part_b"
  | "part_c"
  | "unknown";

export type QuestionConfidence = "high" | "medium" | "low";
export type PreviousQuestionStatus = ContentStatus;

export type PreviousQuestion = {
  id: string;
  subject_id: string;
  module_id: string | null;
  topic_id: string | null;
  question: string;
  question_type: PreviousQuestionType;
  marks: number | null;
  year: number | null;
  exam: string | null;
  source_file: string | null;
  source_page: number | null;
  answer_available: boolean;
  confidence: QuestionConfidence;
  status: PreviousQuestionStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type PreviousQuestionAppearance = {
  id: string;
  question_id: string;
  year: number | null;
  exam: string | null;
  source_file: string | null;
  source_page: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type SubjectWithModules = Subject & {
  modules: Module[];
};
