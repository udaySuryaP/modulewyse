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
const module5NotInSchemeAnswer =
  "PBCST304 under the KTU 2024 scheme does not include Module 5. I can answer from reviewed Modules 1-3, while Module 4 is still under review.";
const module4UnderReviewAnswer =
  "Module 4 for PBCST304 is still under review in ModuleWyse. I can answer from reviewed Modules 1-3 for now.";

type ChatAnswerRequest = {
  answerType?: unknown;
  conversationId?: unknown;
  moduleHint?: unknown;
  question?: unknown;
  regenerateAssistantMessageId?: unknown;
  subjectHint?: unknown;
};

type FeedbackSignal = {
  note: string | null;
  rating: "up" | "down";
};

type FeedbackSummary = {
  down: number;
  total: number;
  up: number;
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

  if (normalized === "4") {
    return {
      moduleHint: "all" as const,
      unsupportedReason: "module 4 is still under review",
    };
  }

  if (normalized === "5") {
    return {
      moduleHint: "all" as const,
      unsupportedReason: "module 5 does not exist in the KTU 2024 scheme for PBCST304",
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

function unsupportedModuleReasonFromQuestion(question: string) {
  const normalized = question.toLowerCase();

  if (/\bmodule\s*(4|iv)\b/.test(normalized)) {
    return "module 4 is still under review";
  }

  if (/\bmodule\s*(5|v)\b/.test(normalized)) {
    return "module 5 does not exist in the KTU 2024 scheme for PBCST304";
  }

  return null;
}

function isConstructorQuestion(question: string) {
  return question.toLowerCase().includes("constructor");
}

function answerForInsufficientReason(reason: string | null) {
  const normalized = reason?.toLowerCase() ?? "";

  if (normalized.includes("module 5")) {
    return module5NotInSchemeAnswer;
  }

  if (normalized.includes("module 4")) {
    return module4UnderReviewAnswer;
  }

  return insufficientAnswer;
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

  const unsupportedModuleReason = unsupportedModuleReasonFromQuestion(input.question);

  if (unsupportedModuleReason) {
    return unsupportedModuleReason;
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
      return [
        "Answer length: SHORT.",
        "Write a compact answer only.",
        "Use 2-4 bullet points or one short paragraph.",
        "Stay under 120 words unless a code snippet is strictly needed.",
        "Include only the direct definition, key idea, or most important points.",
        "Do not add long examples, long introductions, or exam-style sections.",
      ].join(" ");
    case "medium":
      return [
        "Answer length: MEDIUM.",
        "Write a balanced explanation in about 150-300 words.",
        "Use a short heading or paragraph followed by clear points.",
        "Include a brief source-supported example only if it helps the answer.",
        "Avoid excessive detail.",
      ].join(" ");
    case "long":
      return [
        "Answer length: LONG.",
        "Write a detailed and elaborated answer in about 450-750 words when the sources support it.",
        "Use clear Markdown sections, explanatory paragraphs, and bullet points where useful.",
        "Explain definitions, working/principle, important characteristics, advantages or limitations if supported, and source-supported examples.",
        "Develop the answer for exam preparation rather than giving only a summary.",
        "If the retrieved sources support only part of the topic, elaborate only those supported parts and say what is not covered.",
      ].join(" ");
    case "exam":
      return [
        "Answer length: EXAM-READY.",
        "Write a structured exam answer in about 350-650 words when the sources support it.",
        "Use an introduction, key points, explanation, supported example if available, and a short conclusion.",
        "Keep the answer directly usable for university exam preparation.",
      ].join(" ");
  }
}

function maxOutputTokensForAnswerType(answerType: RagAnswerType) {
  switch (answerType) {
    case "short":
      return 280;
    case "medium":
      return 700;
    case "long":
      return 1500;
    case "exam":
      return 1300;
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

function topicSpecificPrompt(question: string) {
  const normalized = question.toLowerCase();

  if (normalized.includes("constructor")) {
    return [
      "Constructor-question guidance:",
      "The reviewed chunks may cover constructor definition, default constructor,",
      "parameterized constructor, copy constructor, constructor chaining with this(),",
      "superclass constructor calls, or calling order of constructors.",
      "Use only those source-supported points and examples. Do not refuse only",
      "because the chunks cover different constructor subtopics.",
    ].join(" ");
  }

  return "";
}

function sanitizeFeedbackNote(note: string | null) {
  if (!note) {
    return null;
  }

  const normalized = note.replace(/\s+/g, " ").trim();

  return normalized ? normalized.slice(0, 240) : null;
}

async function getMessageFeedbackSignal(input: {
  messageId: string;
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
}): Promise<FeedbackSignal | null> {
  const { data, error } = await input.supabase
    .from("message_feedback")
    .select("rating,note")
    .eq("message_id", input.messageId)
    .eq("user_id", input.userId)
    .maybeSingle();

  if (error) {
    console.warn("Could not read message feedback for regeneration.");
    return null;
  }

  if (!data || (data.rating !== "up" && data.rating !== "down")) {
    return null;
  }

  return {
    note: sanitizeFeedbackNote(data.note),
    rating: data.rating,
  };
}

async function getRecentFeedbackSummary(input: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
}): Promise<FeedbackSummary | null> {
  const { data, error } = await input.supabase
    .from("message_feedback")
    .select("rating")
    .eq("user_id", input.userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.warn("Could not read recent answer feedback.");
    return null;
  }

  const ratings = (data ?? []).map((item) => item.rating);
  const up = ratings.filter((rating) => rating === "up").length;
  const down = ratings.filter((rating) => rating === "down").length;

  return {
    down,
    total: ratings.length,
    up,
  };
}

function feedbackGuidancePrompt(input: {
  currentFeedback: FeedbackSignal | null;
  recentSummary: FeedbackSummary | null;
}) {
  const guidance: string[] = [];

  if (input.currentFeedback?.rating === "down") {
    guidance.push(
      "Regeneration feedback: the previous answer was marked not helpful. Improve clarity, directness, structure, citation placement, and source-grounding while staying within the selected answer length. Do not invent unsupported content.",
    );
  }

  if (input.currentFeedback?.rating === "up") {
    guidance.push(
      "Regeneration feedback: the previous answer was marked helpful. Preserve the useful structure and source-grounded style while refreshing the answer.",
    );
  }

  if (input.currentFeedback?.note) {
    guidance.push(
      `Student feedback note for this answer: ${input.currentFeedback.note}`,
    );
  }

  const summary = input.recentSummary;

  if (!input.currentFeedback && summary && summary.total >= 5) {
    if (summary.down > summary.up) {
      guidance.push(
        "Recent answer feedback has more downvotes than upvotes. Be extra direct, avoid filler, and make the source-supported reasoning easier to scan.",
      );
    } else if (summary.up >= summary.down * 2) {
      guidance.push(
        "Recent answer feedback has been mostly positive. Keep the answer clear, source-cited, and easy to revise from.",
      );
    }
  }

  if (guidance.length === 0) {
    return "";
  }

  return `Student feedback guidance:
${guidance.join("\n")}`;
}

function firstSourceForTopic(chunks: RetrievedRagChunk[], terms: string[]) {
  return chunks.find((chunk) => {
    const title = chunk.topicTitle.toLowerCase();
    const preview = chunk.shortPreview.toLowerCase();

    return terms.some((term) => title.includes(term) || preview.includes(term));
  });
}

function constructorSourceBackedAnswer(chunks: RetrievedRagChunk[]) {
  if (chunks.length === 0) {
    return null;
  }

  const defaultConstructor = firstSourceForTopic(chunks, ["default constructor"]);
  const parameterizedConstructor = firstSourceForTopic(chunks, [
    "parameterized constructor",
  ]);
  const copyConstructor = firstSourceForTopic(chunks, ["copy constructor"]);
  const chaining = firstSourceForTopic(chunks, ["constructor chaining", "this()"]);
  const superCall = firstSourceForTopic(chunks, [
    "superclass constructor",
    "calling order of constructors",
    "super(",
  ]);
  const general = firstSourceForTopic(chunks, ["constructor"]) ?? chunks[0];

  const points = [
    general
      ? `- A constructor is covered in the reviewed notes as the object-creation and initialization part of a class. Use the constructor topic together with its examples when explaining object setup [${general.sourceNumber}].`
      : null,
    defaultConstructor
      ? `- A default constructor is used when no explicit constructor is defined, and it initializes the object with default values [${defaultConstructor.sourceNumber}].`
      : null,
    parameterizedConstructor
      ? `- A parameterized constructor accepts arguments so object fields can be initialized with supplied values [${parameterizedConstructor.sourceNumber}].`
      : null,
    copyConstructor
      ? `- A copy constructor initializes a new object from an existing object by copying that object's data [${copyConstructor.sourceNumber}].`
      : null,
    chaining
      ? `- Constructor chaining uses \`this()\` to call another constructor in the same class, which helps reuse initialization logic [${chaining.sourceNumber}].`
      : null,
    superCall
      ? `- In inheritance, superclass constructor calls and constructor calling order matter because parent-class constructors run as part of subclass object creation [${superCall.sourceNumber}].`
      : null,
  ].filter(Boolean);

  if (points.length < 2) {
    return null;
  }

  return `## Constructors in OOP

Constructors are the class members used during object creation to set up object state from the reviewed notes' constructor examples and subtopics [${general.sourceNumber}].

${points.join("\n")}

In an exam answer, explain constructors as the initialization mechanism for objects, then mention the reviewed types: default constructor, parameterized constructor, copy constructor, constructor chaining with \`this()\`, and superclass constructor calls where the source chunks support them.`;
}

function ensureCitationMarkers(answer: string, chunks: RetrievedRagChunk[]) {
  if (/\[\d+\]/.test(answer) || chunks.length === 0) {
    return answer;
  }

  const citations = chunks
    .slice(0, 3)
    .map((chunk) => `[${chunk.sourceNumber}]`)
    .join(", ");

  return `${answer.trim()}\n\n_Source references: ${citations}_`;
}

function isInsufficientAnswerText(answer: string) {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/\s+/g, " ")
      .trim();

  return normalize(answer).startsWith(normalize(insufficientAnswer));
}

async function generateAnswer(input: {
  answerType: RagAnswerType;
  chunks: RetrievedRagChunk[];
  feedbackGuidance: string;
  question: string;
}) {
  const client = new OpenAI({
    apiKey: serverEnv.OPENAI_API_KEY,
  });
  const model = serverEnv.OPENAI_ANSWER_MODEL;
const systemPrompt = `You are ModuleWyse, a KTU exam-prep AI assistant.
Answer only using the provided reviewed source chunks.
Do not use outside knowledge.
Do not invent facts, examples, marks, years, diagrams, or equations.
The route has already applied an insufficient-source gate before this request.
When the chunks contain supported definitions, examples, or topic details for
the question, answer from those chunks instead of refusing.
Partial source coverage is acceptable: answer the parts directly supported by the
chunks and avoid unsupported parts instead of refusing the entire question.
Preserve academic terminology.
Write clearly for students preparing for exams.
Cite sources using [1], [2], etc.
Do not cite sources that are not used.
The answer must be Markdown.
Do not wrap the entire answer in a fenced markdown code block.
Avoid unsupported claims.
Do not mention internal retrieval implementation, embeddings, or vector search.`;

const userPrompt = `Answer format:
${answerInstructions(input.answerType)}
${topicSpecificPrompt(input.question)}
${input.feedbackGuidance}

Reviewed source chunks:
${sourcePrompt(input.chunks)}

Student question:
${input.question}`;

  const response = await client.responses.create({
    input: [
      {
        content: [{ text: systemPrompt, type: "input_text" }],
        role: "system",
      },
      {
        content: [{ text: userPrompt, type: "input_text" }],
        role: "user",
      },
    ],
    max_output_tokens: maxOutputTokensForAnswerType(input.answerType),
    model,
  });

  const answer = response.output_text.trim() || insufficientAnswer;

  if (isInsufficientAnswerText(answer)) {
    return insufficientAnswer;
  }

  return ensureCitationMarkers(answer, input.chunks);
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

async function updateAssistantMessage(input: {
  answerType: string;
  content: string;
  messageId: string;
  metadata: Record<string, unknown>;
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
}) {
  const { data, error } = await input.supabase
    .from("messages")
    .update({
      answer_type: input.answerType,
      content: input.content,
      metadata: input.metadata,
    })
    .eq("id", input.messageId)
    .eq("user_id", input.userId)
    .eq("role", "assistant")
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Message;
}

async function clearMessageFeedback(input: {
  messageId: string;
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
}) {
  const { error } = await input.supabase
    .from("message_feedback")
    .delete()
    .eq("message_id", input.messageId)
    .eq("user_id", input.userId);

  if (error) {
    // Regeneration should not fail only because the old feedback row could
    // not be cleared. The delete policy/grant is covered by a migration, but
    // keeping this cleanup non-fatal protects deployments before it is applied.
    console.warn("Could not clear feedback for regenerated assistant answer.");
    return false;
  }

  return true;
}

function messageMetadataString(message: Message, key: string) {
  const value = message.metadata?.[key];
  return typeof value === "string" ? value : null;
}

async function resolveRegenerateContext(input: {
  assistantMessageId: string;
  conversationId: string | null;
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
}) {
  const { data: assistantMessage, error: assistantError } = await input.supabase
    .from("messages")
    .select("*")
    .eq("id", input.assistantMessageId)
    .eq("user_id", input.userId)
    .eq("role", "assistant")
    .maybeSingle();

  if (assistantError) {
    throw assistantError;
  }

  if (!assistantMessage) {
    return null;
  }

  const assistant = assistantMessage as Message;

  if (input.conversationId && assistant.conversation_id !== input.conversationId) {
    return null;
  }

  const { data: conversation, error: conversationError } = await input.supabase
    .from("conversations")
    .select("*")
    .eq("id", assistant.conversation_id)
    .eq("user_id", input.userId)
    .maybeSingle();

  if (conversationError) {
    throw conversationError;
  }

  if (!conversation) {
    return null;
  }

  const { data: messages, error: messagesError } = await input.supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", assistant.conversation_id)
    .eq("user_id", input.userId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    throw messagesError;
  }

  const orderedMessages = (messages ?? []) as Message[];
  const assistantIndex = orderedMessages.findIndex(
    (message) => message.id === assistant.id,
  );
  const userMessage =
    assistantIndex > 0
      ? [...orderedMessages.slice(0, assistantIndex)]
          .reverse()
          .find((message) => message.role === "user")
      : null;

  if (!userMessage) {
    throw new Error("Original user question was not found.");
  }

  const answerType = normalizeAnswerType(
    assistant.answer_type ?? messageMetadataString(assistant, "answerType"),
  );

  if (!answerType) {
    throw new Error("Original answer type is invalid.");
  }

  return {
    answerType,
    assistant,
    conversation: conversation as Conversation,
    question: userMessage.content,
    userMessage,
  };
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

  let question = typeof payload.question === "string" ? payload.question.trim() : "";
  const requestedConversationId =
    typeof payload.conversationId === "string" && payload.conversationId
      ? payload.conversationId
      : null;
  const regenerateAssistantMessageId =
    typeof payload.regenerateAssistantMessageId === "string" &&
    payload.regenerateAssistantMessageId
      ? payload.regenerateAssistantMessageId
      : null;
  let regenerateContext: Awaited<
    ReturnType<typeof resolveRegenerateContext>
  > = null;
  let answerType: RagAnswerType = "medium";

  if (regenerateAssistantMessageId) {
    try {
      regenerateContext = await resolveRegenerateContext({
        assistantMessageId: regenerateAssistantMessageId,
        conversationId: requestedConversationId,
        supabase,
        userId: user.id,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Original answer could not be regenerated.";
      return errorResponse(message, 400);
    }

    if (!regenerateContext) {
      return errorResponse("Answer message not found.", 404);
    }

    question = regenerateContext.question.trim();
    answerType = regenerateContext.answerType;
  }

  if (!question) {
    return errorResponse("Question is required.", 400);
  }

  if (question.length > maxQuestionLength) {
    return errorResponse("Question is too long.", 400);
  }

  if (!regenerateContext) {
    const normalizedAnswerType = normalizeAnswerType(payload.answerType);

    if (!normalizedAnswerType) {
      return errorResponse("Invalid answer type.", 400);
    }

    answerType = normalizedAnswerType;
  }

  const conversationId = regenerateContext
    ? regenerateContext.conversation.id
    : requestedConversationId;
  const { unsupportedReason: subjectUnsupportedReason } = normalizeSubjectHint(
    payload.subjectHint,
  );
  const { moduleHint, unsupportedReason: moduleUnsupportedReason } =
    normalizeModuleHint(payload.moduleHint);
  const unsupportedReason = subjectUnsupportedReason ?? moduleUnsupportedReason;
  const moduleValue = typeof moduleHint === "number" ? String(moduleHint) : "all";

  let conversation: Conversation | null = null;

  try {
    conversation =
      regenerateContext?.conversation ??
      (await resolveConversation({
        conversationId,
        moduleValue,
        question,
        supabase,
        userId: user.id,
      }));

    if (!conversation) {
      return errorResponse("Conversation not found.", 404);
    }

    const userMessage =
      regenerateContext?.userMessage ??
      (await insertMessage({
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
      }));

    const currentFeedback = regenerateContext
      ? await getMessageFeedbackSignal({
          messageId: regenerateContext.assistant.id,
          supabase,
          userId: user.id,
        })
      : null;
    const recentFeedbackSummary = await getRecentFeedbackSummary({
      supabase,
      userId: user.id,
    });
    const feedbackGuidance = feedbackGuidancePrompt({
      currentFeedback,
      recentSummary: recentFeedbackSummary,
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
    let answer =
      status === "answered"
        ? await generateAnswer({
            answerType,
            chunks: retrieval.chunks,
            feedbackGuidance,
            question,
          })
        : answerForInsufficientReason(reason);
    if (status === "answered" && answer.trim() === insufficientAnswer) {
      const constructorAnswer = isConstructorQuestion(question)
        ? constructorSourceBackedAnswer(retrieval.chunks)
        : null;

      if (constructorAnswer) {
        answer = constructorAnswer;
      } else {
        status = "insufficient_source";
        reason = "model reported insufficient source support";
      }
    }
    const sources =
      status === "answered" ? retrieval.chunks.map(publicSource) : [];
    const sourceChips = sources.map(sourceChip);
    const assistantMetadata = {
      answerType,
      assistantStatus: status,
      model: status === "answered" ? serverEnv.OPENAI_ANSWER_MODEL : null,
      moduleScope: moduleValue,
      ...(regenerateContext ? { regeneratedAt: new Date().toISOString() } : {}),
      feedbackGuidance: {
        previousRating: currentFeedback?.rating ?? null,
        recentDown: recentFeedbackSummary?.down ?? 0,
        recentTotal: recentFeedbackSummary?.total ?? 0,
        recentUp: recentFeedbackSummary?.up ?? 0,
        used: feedbackGuidance.length > 0,
      },
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
    };
    const assistantMessage = regenerateContext
      ? await updateAssistantMessage({
          answerType,
          content: answer,
          messageId: regenerateContext.assistant.id,
          metadata: assistantMetadata,
          supabase,
          userId: user.id,
        })
      : await insertMessage({
          answerType,
          content: answer,
          conversationId: conversation.id,
          metadata: assistantMetadata,
          role: "assistant",
          supabase,
          userId: user.id,
        });

    if (regenerateContext) {
      await clearMessageFeedback({
        messageId: assistantMessage.id,
        supabase,
        userId: user.id,
      });
    }

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
        const errorMetadata = {
          answerType,
          assistantStatus: "error",
          ...(regenerateContext ? { regeneratedAt: new Date().toISOString() } : {}),
          status: "error",
          subjectCode,
          subjectSlug,
        };
        const assistantMessage = regenerateContext
          ? await updateAssistantMessage({
              answerType,
              content: safeAnswer,
              messageId: regenerateContext.assistant.id,
              metadata: errorMetadata,
              supabase,
              userId: user.id,
            })
          : await insertMessage({
              answerType,
              content: safeAnswer,
              conversationId: conversationIdForError,
              metadata: errorMetadata,
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
