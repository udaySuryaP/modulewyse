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

export type SubjectWithModules = Subject & {
  modules: Module[];
};
