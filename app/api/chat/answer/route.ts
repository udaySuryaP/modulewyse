import OpenAI from "openai";
import { NextResponse } from "next/server";

import { retrievePbcst304Chunks, type RetrievedRagChunk } from "@/lib/data/retrieval";
import { serverEnv } from "@/lib/env/server";
import { createClient } from "@/lib/supabase/server";
import type { Conversation, Message } from "@/types/database";
import type { RagAnswerResponse, RagAnswerType, RagSource } from "@/types/chat";

export const runtime = "nodejs";

const subjectSlug = "oop";
const subjectCode = "PBCST304";
const maxQuestionLength = 3000;
const topK = 8;
const insufficientAnswer =
  "I don't have enough reviewed ModuleWyse notes to answer this reliably yet.";

type ChatAnswerRequest = {
  answerType?: unknown;
  conversationId?: unknown;
  moduleHint?: unknown;
  question?: unknown;
  subjectHint?: unknown;
};

function jsonResponse(body: RagAnswerResponse, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function titleFromQuestion(question: string) {
  const normalized = question.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "New chat";
  }

  return normalized.length > 64 ? `${normalized.slice(0, 61)}...` : normalized;
}

function moduleLabel(moduleValue: string | null) {
  return moduleValue && moduleValue !== "all"
    ? `Module ${moduleValue}`
    : "All modules";
}

function normalizeAnswerType(value: unknown): RagAnswerType | null {
  if (typeof value !== "string") {
    return "medium";
  }

  const normalized = value.trim().toLowerCase();

  if (["short", "part a", "part_a"].includes(normalized)) {
    return "short";
  }

  if (["medium", "default", "part b", "part_b"].includes(normalized)) {
    return "medium";
  }

  if (["long"].includes(normalized)) {
    return "long";
  }

  if (["exam", "exam-ready", "exam ready", "part c", "part_c"].includes(normalized)) {
    return "exam";
  }

  return null;
}

function normalizeSubjectHint(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return { subjectHint: subjectSlug, unsupportedReason: null };
  }

  if (typeof value !== "string") {
    return { subjectHint: subjectSlug, unsupportedReason: "unsupported subject" };
  }

  return value.trim().toLowerCase() === subjectSlug
    ? { subjectHint: subjectSlug, unsupportedReason: null }
    : { subjectHint: subjectSlug, unsupportedReason: "unsupported subject" };
}

function normalizeModuleHint(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return { moduleHint: "all" as const, unsupportedReason: null };
  }

  if (typeof value !== "string") {
    return { moduleHint: "all" as const, unsupportedReason: "unsupported module" };
  }

  const normalized = value.trim().toLowerCase().replace(/^module\s+/, "");

  if (normalized === "all") {
    return { moduleHint: "all" as const, unsupportedReason: null };
  }

  if (["1", "2", "3"].includes(normalized)) {
    return {
      moduleHint: Number(normalized) as 1 | 2 | 3,
      unsupportedReason: null,
    };
  }

  if (normalized === "4" || normalized === "5") {
    return {
      moduleHint: "all" as const,
      unsupportedReason: `module ${normalized} is not available as a reviewed answer source`,
    };
  }

  return { moduleHint: "all" as const, unsupportedReason: "unsupported module" };
}

function sourceChip(source: RagSource) {
  return `Module ${source.moduleNumber} · ${source.topicTitle}`;
}

function publicSource(source: RetrievedRagChunk): RagSource {
  return {
    chunkId: source.chunkId,
    moduleNumber: source.moduleNumber,
    shortPreview: source.shortPreview,
    similarity: source.similarity,
    sourceId: source.sourceId,
    sourceNumber: source.sourceNumber,
    sourceTitle: source.sourceTitle,
    topicTitle: source.topicTitle,
  };
}

function isClearlyOutsideScope(question: string) {
  const normalized = question.toLowerCase();
  const outsidePatterns = [
    "operating system",
    "deadlock",
    "tcp",
    "udp",
    "normalization",
    "database",
    "dbms",
    "computer network",
    "process scheduling",
  ];

  return outsidePatterns.some((pattern) => normalized.includes(pattern));
}

function sufficiencyReason(input: {
  answerType: RagAnswerType;
  question: string;
  retrieval: { chunks: RetrievedRagChunk[] };
  unsupportedReason: string | null;
}) {
  if (input.unsupportedReason) {
    return input.unsupportedReason;
  }

  if (isClearlyOutsideScope(input.question)) {
    return "question appears outside reviewed PBCST304 OOP notes";
  }

  const chunks = input.retrieval.chunks;

  if (chunks.length === 0) {
    return "no reviewed source chunks";
  }

  // Retrieval quality report shows useful in-scope chunks normally score above
  // roughly 0.35 after cleanup. Below that, answers should fail closed.
  const topSimilarity = chunks[0]?.similarity ?? 0;

  if (topSimilarity < 0.34) {
    return "weak retrieval confidence";
  }

  const usefulChunks = chunks.filter((chunk) => chunk.similarity >= 0.34);

  if ((input.answerType === "long" || input.answerType === "exam") && usefulChunks.length < 2) {
    return "not enough reviewed chunks for a detailed answer";
  }

  return null;
}

function answerInstructions(answerType: RagAnswerType) {
  switch (answerType) {
    case "short":
      return "Write a concise definition or key-point answer. Use 1-2 short paragraphs or bullets.";
    case "medium":
      return "Write a balanced explanation with clear points and short examples only if supported.";
    case "long":
      return "Write a detailed explanation with sections and enough depth for exam preparation.";
    case "exam":
      return "Write an exam-ready answer with an introduction, points, explanation, supported example if available, and conclusion.";
  }
}

function sourcePrompt(chunks: RetrievedRagChunk[]) {
  return chunks
    .map(
      (chunk) => `[${chunk.sourceNumber}]
Module: ${chunk.moduleNumber}
Topic: ${chunk.topicTitle}
Source: ${chunk.sourceTitle}
Content:
${chunk.content}`,
    )
    .join("\n\n");
}

async function generateAnswer(input: {
  answerType: RagAnswerType;
  chunks: RetrievedRagChunk[];
  question: string;
}) {
  const client = new OpenAI({
    apiKey: serverEnv.OPENAI_API_KEY,
  });
  const model = serverEnv.OPENAI_ANSWER_MODEL;
  const prompt = `System:
You are ModuleWyse, a KTU exam-prep AI assistant.
Answer only using the provided reviewed source chunks.
Do not use outside knowledge.
Do not invent facts, examples, marks, years, diagrams, or equations.
If the sources are insufficient, return exactly: ${insufficientAnswer}
Preserve academic terminology.
Write clearly for students preparing for exams.
Cite sources using [1], [2], etc.
Do not cite sources that are not used.
The answer must be Markdown.
Avoid unsupported claims.
Do not mention internal retrieval implementation, embeddings, or vector search.

Answer format:
${answerInstructions(input.answerType)}

Reviewed source chunks:
${sourcePrompt(input.chunks)}

Student question:
${input.question}`;

  const response = await client.responses.create({
    input: prompt,
    max_output_tokens:
      input.answerType === "short" ? 450 : input.answerType === "medium" ? 800 : 1200,
    model,
  });

  return response.output_text.trim() || insufficientAnswer;
}

async function resolveConversation(input: {
  conversationId: string | null;
  moduleValue: string;
  question: string;
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
}) {
  if (input.conversationId) {
    const { data, error } = await input.supabase
      .from("conversations")
      .select("*")
      .eq("id", input.conversationId)
      .eq("user_id", input.userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Conversation | null) ?? null;
  }

  const { data, error } = await input.supabase
    .from("conversations")
    .insert({
      module_value: input.moduleValue,
      subject_slug: subjectSlug,
      title: titleFromQuestion(input.question),
      user_id: input.userId,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Conversation;
}

async function insertMessage(input: {
  answerType?: string | null;
  content: string;
  conversationId: string;
  metadata: Record<string, unknown>;
  role: "user" | "assistant";
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
}) {
  const { data, error } = await input.supabase
    .from("messages")
    .insert({
      answer_type: input.answerType ?? null,
      content: input.content,
      conversation_id: input.conversationId,
      metadata: input.metadata,
      role: input.role,
      user_id: input.userId,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Message;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return errorResponse("Authentication required.", 401);
  }

  let payload: ChatAnswerRequest;

  try {
    payload = (await request.json()) as ChatAnswerRequest;
  } catch {
    return errorResponse("Invalid JSON request.", 400);
  }

  const question = typeof payload.question === "string" ? payload.question.trim() : "";

  if (!question) {
    return errorResponse("Question is required.", 400);
  }

  if (question.length > maxQuestionLength) {
    return errorResponse("Question is too long.", 400);
  }

  const answerType = normalizeAnswerType(payload.answerType);

  if (!answerType) {
    return errorResponse("Invalid answer type.", 400);
  }

  const conversationId =
    typeof payload.conversationId === "string" && payload.conversationId
      ? payload.conversationId
      : null;
  const { unsupportedReason: subjectUnsupportedReason } = normalizeSubjectHint(
    payload.subjectHint,
  );
  const { moduleHint, unsupportedReason: moduleUnsupportedReason } =
    normalizeModuleHint(payload.moduleHint);
  const unsupportedReason = subjectUnsupportedReason ?? moduleUnsupportedReason;
  const moduleValue = typeof moduleHint === "number" ? String(moduleHint) : "all";

  let conversation: Conversation | null = null;

  try {
    conversation = await resolveConversation({
      conversationId,
      moduleValue,
      question,
      supabase,
      userId: user.id,
    });

    if (!conversation) {
      return errorResponse("Conversation not found.", 404);
    }

    const userMessage = await insertMessage({
      answerType: null,
      content: question,
      conversationId: conversation.id,
      metadata: {
        answerType,
        createdFrom: "chat",
        moduleHint: moduleValue,
        moduleLabel: moduleLabel(moduleValue),
        subjectCode,
        subjectHint: subjectSlug,
        subjectLabel: "Object Oriented Programming",
        subjectSlug,
      },
      role: "user",
      supabase,
      userId: user.id,
    });

    let retrieval = { chunks: [] as RetrievedRagChunk[], matchedCount: 0, topK };
    let reason = unsupportedReason;

    if (!reason) {
      retrieval = await retrievePbcst304Chunks({
        moduleHint,
        question,
        topK,
      });
      reason = sufficiencyReason({ answerType, question, retrieval, unsupportedReason: null });
    }

    let status: "answered" | "insufficient_source" = reason
      ? "insufficient_source"
      : "answered";
    const answer =
      status === "answered"
        ? await generateAnswer({ answerType, chunks: retrieval.chunks, question })
        : insufficientAnswer;
    if (status === "answered" && answer.trim() === insufficientAnswer) {
      status = "insufficient_source";
      reason = "model reported insufficient source support";
    }
    const sources =
      status === "answered" ? retrieval.chunks.map(publicSource) : [];
    const sourceChips = sources.map(sourceChip);
    const assistantMessage = await insertMessage({
      answerType,
      content: answer,
      conversationId: conversation.id,
      metadata: {
        answerType,
        assistantStatus: status,
        model: status === "answered" ? serverEnv.OPENAI_ANSWER_MODEL : null,
        moduleScope: moduleValue,
        retrieval: {
          matchedCount: retrieval.matchedCount,
          topK: retrieval.topK,
        },
        sourceChips,
        sources,
        status,
        subjectCode,
        subjectLabel: "Object Oriented Programming",
        subjectSlug,
      },
      role: "assistant",
      supabase,
      userId: user.id,
    });

    await supabase.rpc("mark_conversation_used", {
      p_conversation_id: conversation.id,
    });

    return jsonResponse({
      answer,
      assistantMessageId: assistantMessage.id,
      conversationId: conversation.id,
      reason: reason ?? undefined,
      retrieval: {
        matchedCount: retrieval.matchedCount,
        topK: retrieval.topK,
      },
      sources,
      status,
      userMessageId: userMessage.id,
    });
  } catch (error) {
    const conversationIdForError = conversation?.id ?? null;
    const safeAnswer = "The answer could not be generated right now.";

    if (conversationIdForError) {
      try {
        const assistantMessage = await insertMessage({
          answerType,
          content: safeAnswer,
          conversationId: conversationIdForError,
          metadata: {
            answerType,
            assistantStatus: "error",
            status: "error",
            subjectCode,
            subjectSlug,
          },
          role: "assistant",
          supabase,
          userId: user.id,
        });

        return jsonResponse(
          {
            answer: safeAnswer,
            assistantMessageId: assistantMessage.id,
            conversationId: conversationIdForError,
            reason: "answer generation failed",
            sources: [],
            status: "error",
            userMessageId: null,
          },
          { status: 500 },
        );
      } catch {
        // Fall through to safe generic response.
      }
    }

    console.error(error instanceof Error ? error.message : "Chat answer route failed.");
    return errorResponse("Answer generation failed.", 500);
  }
}
