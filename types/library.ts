import type {
  PreviousQuestionStatus,
  PreviousQuestionType,
  QuestionConfidence,
} from "@/types/database";

export type LibraryQuestionViewModel = {
  answerAvailable: boolean;
  answerType: string;
  confidence: QuestionConfidence;
  id: string;
  module: "all" | "1" | "2" | "3" | "4" | "5";
  question: string;
  questionType: PreviousQuestionType;
  source: "supabase" | "fallback";
  status: string;
  subjectLabel: string;
  subjectSlug: string;
  subjectStatus: "available" | "beta" | "coming-soon";
  year: string;
};

export type PreviousQuestionAppearanceInput = {
  exam: string | null;
  metadata?: Record<string, unknown>;
  sourceFile: string | null;
  sourcePage: number | null;
  year: number | null;
};

export type PreviousQuestionInput = {
  answerAvailable: boolean;
  appearances: PreviousQuestionAppearanceInput[];
  confidence: QuestionConfidence;
  exam: string | null;
  marks: number | null;
  metadata: Record<string, unknown>;
  moduleNumber: number | null;
  question: string;
  questionHash: string;
  questionType: PreviousQuestionType;
  sourceFile: string | null;
  sourcePage: number | null;
  status: PreviousQuestionStatus;
  subjectCode: string;
  subjectSlug: string;
  topicTitle: string | null;
  year: number | null;
};

export type QuestionIngestionResult = {
  appearancesUpserted: number;
  moduleDistribution: Record<string, number>;
  questionsRead: number;
  questionsSkipped: number;
  questionsUpserted: number;
  skippedReasons: Record<string, number>;
  unknownMetadata: {
    exam: number;
    marks: number;
    module: number;
    topic: number;
    year: number;
  };
};
