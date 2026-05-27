"use client";

import {
  BookOpen,
  CalendarDays,
  Clock,
  Clipboard,
  Library,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Plus,
  RefreshCcw,
  Settings,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AnswerRenderer } from "@/components/chat/answer-renderer";
import { StudentSidebar } from "@/components/dashboard/student-sidebar";
import { MinimalLoader } from "@/components/ui/minimal-loader";
import {
  deleteConversation,
  getConversationWithMessages,
  getUserConversations,
  renameConversation,
  saveMessageFeedback,
  setConversationPinned,
} from "@/lib/data/chat";
import { clearPendingQuestion, readPendingQuestion } from "@/lib/landing-flow";
import {
  mockSubjects,
  subjectModules,
  subjectModuleLabel,
  type SubjectModule,
} from "@/lib/mock-subjects";
import {
  answerTypeOptions,
  readStudentPreferences,
  type StudentPreferences,
  useStudentPreferences,
} from "@/lib/preferences/student-preferences";
import { cn } from "@/lib/utils";
import type {
  Conversation,
  Message as PersistedMessage,
  MessageFeedback,
} from "@/types/database";
import type { RagAnswerResponse } from "@/types/chat";

const answerTypes = answerTypeOptions;
const supportedChatModules = new Set<SubjectModule>(["all", "1", "2", "3"]);
const defaultChatContext: ChatContext = {
  semester: "S4",
  subject: "Object Oriented Programming",
  module: "All modules",
};
const suggestedPrompts = [
  "Explain inheritance in OOP",
  "Give a Part C answer on normalization",
  "Compare TCP and UDP",
  "Explain process scheduling",
  "List key points for polymorphism",
];

const mobileNavItems = [
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/subjects", icon: BookOpen, label: "Subjects" },
  { href: "/library", icon: Library, label: "Library" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

type Role = "user" | "assistant";
type AssistantStatus = "complete" | "loading" | "failed" | "insufficient" | "rate-limited";
type Feedback = "up" | "down";

type ChatContext = {
  semester: string;
  subject: string;
  module: string;
};

type SourceChip = string;

type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
  answerType?: string;
  status?: AssistantStatus;
  sources?: SourceChip[];
  context?: ChatContext;
  feedback?: Feedback;
  persistedId?: string;
};

function answerTypeLabel(value: string | null | undefined) {
  if (!value) {
    return "Medium";
  }

  const normalized = value.trim().toLowerCase();

  if (["short", "part a", "part_a"].includes(normalized)) {
    return "Short";
  }

  if (["long"].includes(normalized)) {
    return "Long";
  }

  if (["exam", "exam-ready", "exam ready", "part c", "part_c"].includes(normalized)) {
    return "Exam-ready";
  }

  return "Medium";
}

type ChatWorkspaceProps = {
  initialConversationId: string;
  initialQuestion: string;
  initialContext: ChatContext;
  isProfileIncomplete: boolean;
  userId: string;
};

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function contextFromProps(initialContext: ChatContext) {
  const moduleValue = moduleValueForContext(initialContext);

  return {
    semester: initialContext.semester || defaultChatContext.semester,
    subject: defaultChatContext.subject,
    module: subjectModuleLabel(moduleValue),
  };
}

function sourceChipsForContext(context: ChatContext): SourceChip[] {
  const subject = mockSubjects.find(
    (item) => item.name.toLowerCase() === context.subject.toLowerCase(),
  );
  const subjectChip =
    subject?.shortName ??
    context.subject
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 6)
      .toUpperCase();
  const moduleChip =
    context.module.toLowerCase() === "all modules"
      ? "ALL MODULES"
      : context.module.toUpperCase();

  return [subjectChip, moduleChip, "NOTES"];
}

function subjectSlugForContext(context: ChatContext) {
  return (
    mockSubjects.find(
      (subject) => subject.name.toLowerCase() === context.subject.toLowerCase(),
    )?.slug ?? null
  );
}

function moduleValueForContext(context: ChatContext): SubjectModule {
  const normalized = context.module.toLowerCase().replace(/^module\s+/, "");

  if (
    subjectModules.includes(normalized as SubjectModule) &&
    supportedChatModules.has(normalized as SubjectModule)
  ) {
    return normalized as SubjectModule;
  }

  return "all";
}

function contextFromConversation(conversation: Conversation, fallback: ChatContext) {
  const subject = conversation.subject_slug
    ? mockSubjects.find((item) => item.slug === conversation.subject_slug)
    : undefined;
  const moduleValue = conversation.module_value ?? "all";

  return {
    semester: subject?.semester ?? fallback.semester,
    subject: subject?.name ?? fallback.subject,
    module: subjectModuleLabel(
      subjectModules.includes(moduleValue as SubjectModule)
        ? (moduleValue as SubjectModule)
        : "all",
    ),
  };
}

function stringFromMetadata(
  metadata: Record<string, unknown>,
  key: string,
  fallback: string,
) {
  const value = metadata[key];
  return typeof value === "string" ? value : fallback;
}

function sourceChipsFromMetadata(
  metadata: Record<string, unknown>,
  fallback: SourceChip[],
) {
  const value = metadata.sourceChips;

  if (Array.isArray(value) && value.every((chip) => typeof chip === "string")) {
    return value as SourceChip[];
  }

  return fallback;
}

function messageFromPersisted(
  message: PersistedMessage,
  conversationContext: ChatContext,
  feedback?: MessageFeedback,
): Message {
  const metadata = message.metadata ?? {};
  const contextSnapshot = {
    semester: conversationContext.semester,
    subject: stringFromMetadata(metadata, "subjectLabel", conversationContext.subject),
    module: stringFromMetadata(metadata, "moduleLabel", conversationContext.module),
  };
  const status = stringFromMetadata(metadata, "assistantStatus", "complete");
  const assistantStatus =
    status === "answered"
      ? "complete"
      : status === "insufficient_source"
        ? "insufficient"
        : status === "error"
          ? "failed"
          : status;

  return {
    answerType: message.answer_type ?? stringFromMetadata(metadata, "answerType", "Default"),
    content: message.content,
    context: contextSnapshot,
    createdAt: new Date(message.created_at),
    id: message.id,
    persistedId: message.id,
    role: message.role,
    feedback: feedback?.rating,
    sources: sourceChipsFromMetadata(metadata, sourceChipsForContext(contextSnapshot)),
    status:
      message.role === "assistant" &&
      ["complete", "failed", "insufficient", "rate-limited"].includes(assistantStatus)
        ? (assistantStatus as AssistantStatus)
        : undefined,
  };
}

export function ChatWorkspace({
  initialConversationId,
  initialQuestion,
  initialContext,
  isProfileIncomplete,
  userId,
}: ChatWorkspaceProps) {
  const resolvedInitialQuestion = useMemo(
    () => initialQuestion.trim() || readPendingQuestion(),
    [initialQuestion],
  );
  const [draft, setDraft] = useState(resolvedInitialQuestion);
  const [activeConversationId, setActiveConversationId] = useState(
    initialConversationId,
  );
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [conversationLoadState, setConversationLoadState] = useState<
    "idle" | "loading" | "missing"
  >(initialConversationId ? "loading" : "idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [answerType, setAnswerType] = useState(
    () => readStudentPreferences().defaultAnswerType,
  );
  const [context, setContext] = useState(() => contextFromProps(initialContext));
  const [preferences] = useStudentPreferences();
  const [toast, setToast] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const refreshRecentConversations = useCallback(async () => {
    try {
      setRecentConversations(await getUserConversations());
    } catch {
      setRecentConversations([]);
    }
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const syncSidebarState = () => setSidebarExpanded(desktopQuery.matches);
    const animationFrame = window.requestAnimationFrame(syncSidebarState);

    desktopQuery.addEventListener("change", syncSidebarState);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      desktopQuery.removeEventListener("change", syncSidebarState);
    };
  }, []);

  useEffect(() => {
    if (resolvedInitialQuestion) {
      clearPendingQuestion();
    }
  }, [resolvedInitialQuestion]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void refreshRecentConversations();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [refreshRecentConversations]);

  useEffect(() => {
    if (!initialConversationId) {
      return;
    }

    let cancelled = false;

    async function loadConversation() {
      setConversationLoadState("loading");

      try {
        const result = await getConversationWithMessages(initialConversationId);

        if (cancelled) {
          return;
        }

        if (!result) {
          setMessages([]);
          setConversationLoadState("missing");
          return;
        }

        const nextContext = contextFromConversation(result.conversation, initialContext);
        setContext(contextFromProps(nextContext));
        const feedbackByMessageId = new Map(
          result.feedback.map((feedback) => [feedback.message_id, feedback]),
        );
        setMessages(
          result.messages.map((message) =>
            messageFromPersisted(
              message,
              nextContext,
              feedbackByMessageId.get(message.id),
            ),
          ),
        );
        setActiveConversationId(result.conversation.id);
        setConversationLoadState("idle");

      } catch {
        if (!cancelled) {
          setMessages([]);
          setConversationLoadState("missing");
          setToast("Conversation could not be loaded.");
        }
      }
    }

    loadConversation();

    return () => {
      cancelled = true;
    };
  }, [initialConversationId, initialContext]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isGenerating]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function focusComposer() {
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function requestAnswer(input: {
    answerType: string;
    contextSnapshot: ChatContext;
    question?: string;
    regenerateAssistantMessageId?: string;
  }) {
    const response = await fetch("/api/chat/answer", {
      body: JSON.stringify({
        answerType: input.answerType,
        conversationId: activeConversationId || null,
        moduleHint: moduleValueForContext(input.contextSnapshot),
        question: input.question,
        regenerateAssistantMessageId: input.regenerateAssistantMessageId,
        subjectHint: subjectSlugForContext(input.contextSnapshot),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const payload = (await response.json()) as
      | RagAnswerResponse
      | { error?: string };

    if (!response.ok && !("status" in payload)) {
      throw new Error(payload.error ?? "Answer generation failed.");
    }

    return payload as RagAnswerResponse;
  }

  function sourcesFromResponse(
    response: RagAnswerResponse,
    fallback: SourceChip[],
  ) {
    return response.sources.length > 0
      ? response.sources.map(
          (source) => `Module ${source.moduleNumber} · ${source.topicTitle}`,
        )
      : fallback;
  }

  function statusFromResponse(response: RagAnswerResponse): AssistantStatus {
    return response.status === "answered"
      ? "complete"
      : response.status === "insufficient_source"
        ? "insufficient"
        : "failed";
  }

  async function sendMessage(question: string) {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isGenerating) {
      return;
    }

    setDraft("");
    const contextSnapshot = context;
    const answerTypeSnapshot = answerType;
    const sourceChips = sourceChipsForContext(contextSnapshot);

    const localUserMessage: Message = {
      id: newId("user"),
      role: "user",
      content: trimmedQuestion,
      createdAt: new Date(),
    };
    const loadingMessage: Message = {
      id: newId("assistant-loading"),
      role: "assistant",
      content: "Searching reviewed notes...",
      createdAt: new Date(),
      answerType: answerTypeSnapshot,
      context: contextSnapshot,
      status: "loading",
      sources: sourceChips,
    };

    setMessages((current) => [
      ...current,
      localUserMessage,
      loadingMessage,
    ]);
    setIsGenerating(true);

    try {
      const response = await requestAnswer({
        answerType: answerTypeSnapshot,
        contextSnapshot,
        question: trimmedQuestion,
      });
      const nextSources =
        response.sources.length > 0
          ? response.sources.map(
              (source) => `Module ${source.moduleNumber} · ${source.topicTitle}`,
            )
          : sourceChips;
      const assistantStatus: AssistantStatus =
        response.status === "answered"
          ? "complete"
          : response.status === "insufficient_source"
            ? "insufficient"
            : "failed";

      setMessages((current) =>
        current.map((message) =>
          message.id === localUserMessage.id
            ? {
                ...message,
                id: response.userMessageId ?? message.id,
                persistedId: response.userMessageId ?? undefined,
              }
            : message.id === loadingMessage.id
              ? {
                  ...message,
                  answerType: answerTypeSnapshot,
                  content: response.answer,
                  id: response.assistantMessageId ?? message.id,
                  persistedId: response.assistantMessageId ?? undefined,
                  sources: nextSources,
                  status: assistantStatus,
                }
            : message,
        ),
      );

      if (response.conversationId) {
        setActiveConversationId(response.conversationId);
        window.history.replaceState(
          null,
          "",
          `/chat?conversation=${response.conversationId}`,
        );
      }
      void refreshRecentConversations();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Answer generation failed.";

      setMessages((current) =>
        current.map((item) =>
          item.id === loadingMessage.id
            ? {
                ...item,
                content: "The answer could not be generated right now.",
                status: "failed",
              }
            : item,
        ),
      );
      setToast(message);
    } finally {
      setIsGenerating(false);
      focusComposer();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(draft);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(draft);
    }
  }

  async function handleCopy(message: Message) {
    try {
      await navigator.clipboard.writeText(message.content);
      setToast("Answer copied.");
    } catch {
      setToast("Unable to copy.");
    }
  }

  async function handleFeedback(messageId: string, feedback: Feedback) {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId ? { ...message, feedback } : message,
      ),
    );

    const targetMessage = messages.find((message) => message.id === messageId);
    const persistedId = targetMessage?.persistedId;

    if (!persistedId || targetMessage?.status === "loading") {
      setToast("Feedback saved locally for this session.");
      return;
    }

    try {
      await saveMessageFeedback({
        messageId: persistedId,
        rating: feedback,
        userId,
      });
      setToast("Feedback submitted.");
    } catch {
      setToast("Feedback saved locally for this session.");
    }
  }

  async function regenerate(messageId: string) {
    if (isGenerating) {
      return;
    }

    const targetIndex = messages.findIndex((message) => message.id === messageId);
    const targetMessage = messages[targetIndex];
    const persistedId = targetMessage?.persistedId;
    const originalQuestion = [...messages.slice(0, targetIndex)]
      .reverse()
      .find((message) => message.role === "user");

    if (!targetMessage || targetMessage.role !== "assistant" || !persistedId) {
      setToast("This answer cannot be regenerated yet.");
      return;
    }

    if (!originalQuestion) {
      setToast("Original question could not be found.");
      return;
    }

    const contextSnapshot = targetMessage.context ?? context;
    const answerTypeSnapshot = targetMessage.answerType ?? answerType;
    const fallbackSources =
      targetMessage.sources?.length
        ? targetMessage.sources
        : sourceChipsForContext(contextSnapshot);

    setMessages((current) =>
      current.map((message) =>
        message.id === messageId
          ? {
              ...message,
              content: "Searching reviewed notes...",
              feedback: undefined,
              status: "loading",
            }
          : message,
      ),
    );
    setIsGenerating(true);

    try {
      const response = await requestAnswer({
        answerType: answerTypeSnapshot,
        contextSnapshot,
        regenerateAssistantMessageId: persistedId,
      });
      const nextSources = sourcesFromResponse(response, fallbackSources);
      const assistantStatus = statusFromResponse(response);

      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? {
                ...message,
                answerType: answerTypeSnapshot,
                content: response.answer,
                id: response.assistantMessageId ?? message.id,
                persistedId: response.assistantMessageId ?? persistedId,
                sources: nextSources,
                status: assistantStatus,
              }
            : message,
        ),
      );
      void refreshRecentConversations();
      setToast("Answer regenerated.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Answer regeneration failed.";

      setMessages((current) =>
        current.map((item) =>
          item.id === messageId
            ? {
                ...item,
                content: "The answer could not be generated right now.",
                status: "failed",
              }
            : item,
        ),
      );
      setToast(message);
    } finally {
      setIsGenerating(false);
      focusComposer();
    }
  }

  const canSend = draft.trim().length > 0 && !isGenerating;

  return (
    <div
      className={cn(
        "flex min-h-dvh text-[var(--mw-ink)] [--chat-sidebar-width:0px] md:[--chat-sidebar-width:72px]",
        sidebarExpanded && "lg:[--chat-sidebar-width:228px]",
      )}
    >
      <StudentSidebar
        className="hidden md:flex"
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((current) => !current)}
      >
        <SidebarRecentConversations
          activeConversationId={activeConversationId}
          conversations={recentConversations}
          onActiveConversationDeleted={() => {
            setActiveConversationId("");
            setMessages([]);
            setConversationLoadState("idle");
            window.history.replaceState(null, "", "/chat");
          }}
          onRefresh={refreshRecentConversations}
        />
      </StudentSidebar>

      <div className="min-w-0 flex-1">
        <MobileChatTopbar
          activeConversationId={activeConversationId}
          answerType={answerType}
          conversations={recentConversations}
          isOpen={mobileMenuOpen}
          onAnswerTypeChange={setAnswerType}
          onActiveConversationDeleted={() => {
            setActiveConversationId("");
            setMessages([]);
            setConversationLoadState("idle");
            window.history.replaceState(null, "", "/chat");
          }}
          onNavigate={() => setMobileMenuOpen(false)}
          onRefresh={refreshRecentConversations}
          onToggle={() => setMobileMenuOpen((current) => !current)}
        />

        <header className="hidden min-h-4 px-3 py-3 sm:px-6 sm:py-4 md:block lg:min-h-8 lg:px-8" />

        <main className="grid gap-4 px-3 pb-[124px] pt-4 sm:gap-5 sm:px-6 sm:pb-[140px] md:pt-0 lg:px-8">
          <ContextControls
            answerType={answerType}
            className="hidden md:block md:row-start-1 md:self-start"
            onAnswerTypeChange={setAnswerType}
          />

          {isProfileIncomplete ? (
            <SetupPrompt className="md:row-start-2" />
          ) : null}

          <div
            className={cn(
              "mw-card min-w-0 max-w-full min-h-[390px] p-3 sm:min-h-[520px] sm:p-5",
              isProfileIncomplete ? "md:row-start-3" : "md:row-start-2",
            )}
          >
            {conversationLoadState === "loading" ? (
              <LoadingAnswer />
            ) : conversationLoadState === "missing" ? (
              <ConversationNotFound />
            ) : messages.length === 0 ? (
              <EmptyConversation
                onPickPrompt={setDraft}
                showSuggestedPrompts={preferences.showSuggestedPrompts}
              />
            ) : (
              <div className="grid min-w-0 max-w-full gap-4">
                {messages.map((message) =>
                  message.role === "user" ? (
                    <UserMessage key={message.id} message={message} />
                  ) : (
                    <AssistantMessage
                      key={message.id}
                      message={message}
                      preferences={preferences}
                      onCopy={handleCopy}
                      onFeedback={handleFeedback}
                      onRegenerate={regenerate}
                    />
                  ),
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <Composer
            canSend={canSend}
            draft={draft}
            inputRef={inputRef}
            onChange={setDraft}
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmit}
          />
        </main>
      </div>

      {toast ? (
        <div className="fixed bottom-[106px] left-1/2 z-50 -translate-x-1/2 mw-radius-pill border border-[var(--mw-hairline)] bg-white px-4 py-3 text-[14px] text-[var(--mw-ink)] shadow-[0_12px_40px_rgba(12,10,9,0.12)] sm:bottom-[116px]">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function MobileChatTopbar({
  activeConversationId,
  answerType,
  conversations,
  isOpen,
  onAnswerTypeChange,
  onActiveConversationDeleted,
  onNavigate,
  onRefresh,
  onToggle,
}: {
  activeConversationId: string;
  answerType: string;
  conversations: Conversation[];
  isOpen: boolean;
  onAnswerTypeChange: (value: string) => void;
  onActiveConversationDeleted: () => void;
  onNavigate: () => void;
  onRefresh: () => Promise<void> | void;
  onToggle: () => void;
}) {
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  useEffect(() => {
    function updateDateTime() {
      const now = new Date();
      const date = new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(now);
      const time = new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);

      setDateTime({ date, time });
    }

    updateDateTime();
    const interval = window.setInterval(updateDateTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)]/95 px-3 py-3 text-[var(--mw-ink)] shadow-sm md:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link
          className="text-[20px] font-medium leading-none tracking-[-0.03em] text-[var(--mw-ink)]"
          href="/chat"
        >
          modulewyse
        </Link>
        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse menu" : "Expand menu"}
          className="grid size-10 place-items-center mw-radius-pill border border-[var(--mw-hairline-strong)] bg-white text-[var(--mw-ink)]"
          onClick={onToggle}
          type="button"
        >
          {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {isOpen ? (
        <div className="mt-4 grid gap-4 pb-3">
          <div>
            <p className="mw-label">
              Answer type
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {answerTypes.map((type) => (
                <button
                  className={cn(
                    "h-9 mw-radius-pill border border-[var(--mw-hairline)] bg-white px-3 text-[12px] font-medium text-[var(--mw-body)]",
                    answerType === type && "bg-[var(--mw-primary)] text-white",
                  )}
                  key={type}
                  onClick={() => onAnswerTypeChange(type)}
                  type="button"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <nav className="grid gap-2" aria-label="Student dashboard mobile">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  className="flex h-10 items-center gap-3 mw-radius-pill border border-[var(--mw-hairline)] bg-white px-3 text-[13px] font-medium text-[var(--mw-body)]"
                  href={item.href}
                  key={item.href}
                  onClick={onNavigate}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <SidebarRecentConversations
            activeConversationId={activeConversationId}
            className="border-t border-[var(--mw-hairline)] pt-4"
            conversations={conversations}
            listClassName="max-h-[220px]"
            onActiveConversationDeleted={() => {
              onActiveConversationDeleted();
              onNavigate();
            }}
            onNavigate={onNavigate}
            onRefresh={onRefresh}
          />

          <div className="grid gap-1.5 text-[11px] font-medium uppercase leading-[1.5] tracking-[0.08em] text-[var(--mw-muted)]">
            <span className="flex items-center gap-2">
              <Clock className="size-3.5 shrink-0" />
              <span>{dateTime.time}</span>
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="size-3.5 shrink-0" />
              <span>{dateTime.date}</span>
            </span>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function ContextControls({
  answerType,
  className,
  onAnswerTypeChange,
}: {
  answerType: string;
  className?: string;
  onAnswerTypeChange: (value: string) => void;
}) {
  return (
    <div
      className={cn(
        "mw-card px-4 py-4 sm:px-5 sm:py-4",
        className,
      )}
    >
      <div>
        <p className="mw-label">
          Answer type
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {answerTypes.map((type) => (
            <button
              className={cn(
                "h-9 mw-radius-pill border border-[var(--mw-hairline)] bg-white px-4 text-[12px] font-medium text-[var(--mw-body)] transition-colors hover:bg-[var(--mw-surface-strong)] hover:text-[var(--mw-ink)]",
                answerType === type && "bg-[var(--mw-primary)] text-white hover:bg-[var(--mw-ink)] hover:text-white",
              )}
              key={type}
              onClick={() => onAnswerTypeChange(type)}
              type="button"
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SidebarRecentConversations({
  activeConversationId,
  className,
  conversations,
  listClassName,
  onActiveConversationDeleted,
  onNavigate,
  onRefresh,
}: {
  activeConversationId: string;
  className?: string;
  conversations: Conversation[];
  listClassName?: string;
  onActiveConversationDeleted?: () => void;
  onNavigate?: () => void;
  onRefresh: () => Promise<void> | void;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);
  const [actionError, setActionError] = useState("");
  const [isSavingAction, setIsSavingAction] = useState(false);

  function startRename(conversation: Conversation) {
    setActionError("");
    setOpenMenuId(null);
    setDeleteTarget(null);
    setRenamingId(conversation.id);
    setRenameDraft(conversation.title);
  }

  function cancelRename() {
    setRenamingId(null);
    setRenameDraft("");
    setActionError("");
  }

  async function saveRename(conversation: Conversation) {
    const nextTitle = renameDraft.replace(/\s+/g, " ").trim();

    if (!nextTitle) {
      setActionError("Chat title cannot be empty.");
      return;
    }

    setIsSavingAction(true);
    setActionError("");

    try {
      await renameConversation(conversation.id, nextTitle);
      cancelRename();
      await onRefresh();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Chat could not be renamed.",
      );
    } finally {
      setIsSavingAction(false);
    }
  }

  async function togglePinned(conversation: Conversation) {
    setIsSavingAction(true);
    setActionError("");
    setOpenMenuId(null);

    try {
      await setConversationPinned(conversation.id, !conversation.is_pinned);
      await onRefresh();
    } catch {
      setActionError("Pin status could not be updated.");
    } finally {
      setIsSavingAction(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    const deletedConversationId = deleteTarget.id;
    setIsSavingAction(true);
    setActionError("");

    try {
      await deleteConversation(deletedConversationId);
      setDeleteTarget(null);
      await onRefresh();

      if (deletedConversationId === activeConversationId) {
        onActiveConversationDeleted?.();
      }

      onNavigate?.();
    } catch {
      setActionError("Chat could not be deleted.");
    } finally {
      setIsSavingAction(false);
    }
  }

  return (
    <section className={cn("grid min-w-0 gap-3", className)}>
      <div className="px-2">
        <p className="mw-label text-[11px]">Recent chats</p>
      </div>

      <div
        className={cn(
          "grid max-h-[calc(100dvh-390px)] gap-1.5 overflow-y-auto pr-1",
          listClassName,
        )}
      >
        <Link
          className={cn(
            "flex min-w-0 items-center gap-2 mw-radius-card border border-[var(--mw-hairline-strong)] bg-[var(--mw-surface-strong)] px-3 py-2.5 text-[12px] font-medium text-[var(--mw-ink)] transition-colors hover:bg-white",
            !activeConversationId && "border-[var(--mw-primary)] bg-white",
          )}
          href="/chat"
          onClick={onNavigate}
        >
          <Plus className="size-3.5 shrink-0" />
          <span className="truncate">New chat</span>
        </Link>

        {conversations.slice(0, 8).map((conversation) => {
          const isActive = conversation.id === activeConversationId;
          const subject = conversation.subject_slug?.toUpperCase() ?? "CHAT";
          const moduleLabel =
            conversation.module_value && conversation.module_value !== "all"
              ? `Module ${conversation.module_value}`
              : "All modules";
          const updatedAt = new Intl.DateTimeFormat(undefined, {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(conversation.updated_at));

          return (
            <div
              className={cn(
                "group relative min-w-0 mw-radius-card border border-[var(--mw-hairline)] bg-white transition-colors hover:bg-[var(--mw-surface-strong)]",
                isActive && "border-[var(--mw-hairline-strong)] bg-[var(--mw-surface-strong)]",
              )}
              key={conversation.id}
            >
              {renamingId === conversation.id ? (
                <div className="grid gap-2 px-3 py-2.5">
                  <input
                    aria-label="Rename chat"
                    autoFocus
                    className="h-9 min-w-0 mw-radius-card border border-[var(--mw-hairline-strong)] bg-white px-2.5 text-[12px] font-medium text-[var(--mw-ink)] outline-none focus:border-[var(--mw-primary)]"
                    disabled={isSavingAction}
                    maxLength={80}
                    onChange={(event) => setRenameDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void saveRename(conversation);
                      }

                      if (event.key === "Escape") {
                        cancelRename();
                      }
                    }}
                    value={renameDraft}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      className="h-7 mw-radius-pill bg-[var(--mw-primary)] px-3 text-[11px] font-medium text-white disabled:opacity-60"
                      disabled={isSavingAction}
                      onClick={() => void saveRename(conversation)}
                      type="button"
                    >
                      Save
                    </button>
                    <button
                      className="h-7 mw-radius-pill border border-[var(--mw-hairline)] bg-white px-3 text-[11px] font-medium text-[var(--mw-body)]"
                      disabled={isSavingAction}
                      onClick={cancelRename}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  className="block min-w-0 px-3 py-2.5 pr-10"
                  href={`/chat?conversation=${conversation.id}`}
                  onClick={onNavigate}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    {conversation.is_pinned ? (
                      <Pin className="size-3 shrink-0 text-[var(--mw-muted)]" />
                    ) : null}
                    <span className="truncate text-[12px] font-medium leading-[1.35] text-[var(--mw-ink)]">
                      {conversation.title}
                    </span>
                  </span>
                  <span className="mt-1.5 block truncate text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--mw-muted)]">
                    {subject} / {moduleLabel}
                  </span>
                  <span className="mt-1 block text-[11px] text-[var(--mw-muted)]">
                    {updatedAt}
                  </span>
                </Link>
              )}

              {renamingId !== conversation.id ? (
                <button
                  aria-expanded={openMenuId === conversation.id}
                  aria-label="Chat options"
                  className="absolute right-2 top-2 grid size-7 place-items-center mw-radius-pill text-[var(--mw-muted)] opacity-100 transition hover:bg-white hover:text-[var(--mw-ink)] focus:bg-white focus:text-[var(--mw-ink)] focus:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setActionError("");
                    setOpenMenuId((current) =>
                      current === conversation.id ? null : conversation.id,
                    );
                  }}
                  type="button"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              ) : null}

              {openMenuId === conversation.id ? (
                <div className="absolute right-2 top-10 z-20 w-40 overflow-hidden mw-radius-card border border-[var(--mw-hairline)] bg-white py-1 shadow-[0_18px_42px_rgba(12,10,9,0.14)]">
                  <button
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-[var(--mw-body)] hover:bg-[var(--mw-surface-strong)]"
                    onClick={() => startRename(conversation)}
                    type="button"
                  >
                    <Pencil className="size-3.5" />
                    Rename
                  </button>
                  <button
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-[var(--mw-body)] hover:bg-[var(--mw-surface-strong)]"
                    disabled={isSavingAction}
                    onClick={() => void togglePinned(conversation)}
                    type="button"
                  >
                    {conversation.is_pinned ? (
                      <PinOff className="size-3.5" />
                    ) : (
                      <Pin className="size-3.5" />
                    )}
                    {conversation.is_pinned ? "Unpin chat" : "Pin chat"}
                  </button>
                  <button
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setOpenMenuId(null);
                      setRenamingId(null);
                      setActionError("");
                      setDeleteTarget(conversation);
                    }}
                    type="button"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {actionError ? (
        <p className="px-2 text-[11px] leading-[1.4] text-red-700">{actionError}</p>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/20 px-4">
          <div className="w-full max-w-sm mw-radius-card border border-[var(--mw-hairline)] bg-white p-5 shadow-[0_24px_70px_rgba(12,10,9,0.18)]">
            <h3 className="text-[18px] font-medium text-[var(--mw-ink)]">
              Delete chat?
            </h3>
            <p className="mt-2 text-[13px] leading-[1.55] text-[var(--mw-body)]">
              This will remove the conversation and its messages. This action
              cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="h-9 mw-radius-pill border border-[var(--mw-hairline)] bg-white px-4 text-[12px] font-medium text-[var(--mw-body)]"
                disabled={isSavingAction}
                onClick={() => setDeleteTarget(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="h-9 mw-radius-pill bg-red-700 px-4 text-[12px] font-medium text-white disabled:opacity-60"
                disabled={isSavingAction}
                onClick={() => void confirmDelete()}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function SetupPrompt({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mw-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div>
        <h2 className="mw-display text-[30px] leading-[1.05]">
          Complete your academic setup
        </h2>
        <p className="mt-3 max-w-[640px] text-[16px] font-normal leading-[1.55] text-[var(--mw-body)]">
          Add your college, branch, and semester to personalize ModuleWyse.
        </p>
      </div>
      <Link
        className="mw-pill-primary mt-5 sm:mt-0"
        href="/onboarding/academic-profile"
      >
        Continue Setup
      </Link>
    </div>
  );
}

function placeholderForWidth(width: number) {
  if (width < 380) {
    return "Ask...";
  }

  if (width < 640) {
    return "Ask a question...";
  }

  if (width < 1024) {
    return "Ask from your notes...";
  }

  return "Ask anything from your available notes...";
}

function useResponsiveChatPlaceholder() {
  const [placeholder, setPlaceholder] = useState(
    "Ask anything from your available notes...",
  );

  useEffect(() => {
    function updatePlaceholder() {
      const nextPlaceholder = placeholderForWidth(window.innerWidth);
      setPlaceholder((current) =>
        current === nextPlaceholder ? current : nextPlaceholder,
      );
    }

    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);

    return () => window.removeEventListener("resize", updatePlaceholder);
  }, []);

  return placeholder;
}

function Composer({
  canSend,
  draft,
  inputRef,
  onChange,
  onKeyDown,
  onSubmit,
}: {
  canSend: boolean;
  draft: string;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const placeholder = useResponsiveChatPlaceholder();

  return (
    <form
      className="fixed bottom-5 left-[calc(var(--chat-sidebar-width)+0.75rem)] right-3 z-30 sm:bottom-6 sm:left-[calc(var(--chat-sidebar-width)+1.5rem)] sm:right-6 lg:left-[calc(var(--chat-sidebar-width)+2rem)] lg:right-8"
      onSubmit={onSubmit}
    >
      <div className="mw-radius-card border border-[var(--mw-hairline-strong)] bg-[var(--mw-canvas-soft)] p-1.5 shadow-[0_16px_60px_rgba(12,10,9,0.08)] sm:p-2">
        <div className="flex min-h-[52px] items-end gap-2 mw-radius-input border border-[var(--mw-hairline)] bg-white py-1.5 pl-2.5 pr-1.5 sm:min-h-[58px] sm:gap-3 sm:py-2 sm:pl-3 sm:pr-2">
          <textarea
            className="mw-input max-h-[180px] min-h-[36px] min-w-0 flex-1 resize-none overflow-hidden px-4 py-2 text-[15px] font-normal leading-[1.45] sm:min-h-[40px] sm:text-[16px]"
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            ref={inputRef}
            rows={1}
            value={draft}
          />
          <button
            className="grid h-10 shrink-0 place-items-center mw-radius-pill bg-[var(--mw-primary)] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[var(--mw-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mw-ink)]/20 disabled:pointer-events-none disabled:opacity-45 sm:px-6"
            disabled={!canSend}
            type="submit"
          >
            Ask
          </button>
        </div>
      </div>
    </form>
  );
}

function EmptyConversation({
  onPickPrompt,
  showSuggestedPrompts,
}: {
  onPickPrompt: (prompt: string) => void;
  showSuggestedPrompts: boolean;
}) {
  return (
    <div className="grid min-h-[330px] place-items-center sm:min-h-[360px]">
      <div className="w-full text-center">
        <h2 className="mw-display text-[34px] leading-[1.05] text-[var(--mw-ink)] sm:text-[44px]">
          What do you want to prepare today?
        </h2>
        <p className="mt-3 text-[15px] font-normal leading-[1.55] text-[var(--mw-body)] sm:mt-4 sm:text-[18px]">
          Ask naturally. ModuleWyse will search the available reviewed notes and answer with sources.
        </p>
        {showSuggestedPrompts ? (
          <div className="mt-6 grid gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-3">
            {suggestedPrompts.map((prompt) => (
              <button
                className="mw-radius-card border border-[var(--mw-hairline)] bg-white p-3 text-left text-[13px] leading-[1.45] text-[var(--mw-body)] transition-colors hover:border-[var(--mw-hairline-strong)] hover:bg-[var(--mw-surface-strong)] sm:p-4 sm:text-[14px]"
                key={prompt}
                onClick={() => onPickPrompt(prompt)}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ConversationNotFound() {
  return (
    <div className="grid min-h-[330px] place-items-center text-center sm:min-h-[360px]">
      <div>
        <h2 className="mw-display text-[34px] leading-[1.05] text-[var(--mw-ink)] sm:text-[44px]">
          Conversation not found.
        </h2>
        <p className="mt-3 max-w-[520px] text-[15px] leading-[1.55] text-[var(--mw-body)]">
          This chat may have been deleted, or it may not belong to your account.
        </p>
        <Link className="mw-pill-primary mt-6" href="/chat">
          Start New Chat
        </Link>
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="ml-auto w-fit max-w-[min(860px,88%)] min-w-0 mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-surface-strong)] p-4 text-[var(--mw-ink)]">
      <p className="whitespace-pre-wrap text-[16px] leading-[1.5] text-[var(--mw-ink)]">
        {message.content}
      </p>
    </div>
  );
}

function AssistantMessage({
  message,
  onCopy,
  onFeedback,
  onRegenerate,
  preferences,
}: {
  message: Message;
  onCopy: (message: Message) => void;
  onFeedback: (messageId: string, feedback: Feedback) => void;
  onRegenerate: (messageId: string) => void;
  preferences: StudentPreferences;
}) {
  if (message.status === "loading") {
    return <LoadingAnswer />;
  }

  if (message.status === "failed") {
    return (
      <EdgeCard
        body={message.content || "The answer could not be generated right now."}
        onAction={() => onRegenerate(message.id)}
        title="Answer failed"
      />
    );
  }

  if (message.status === "insufficient") {
    return (
      <EdgeCard
        body={message.content}
        onAction={() => undefined}
        title="Not enough verified content"
      />
    );
  }

  if (message.status === "rate-limited") {
    return (
      <EdgeCard
        action="Try Again"
        body="Answer generation is rate limited. Try again in a moment."
        onAction={() => onRegenerate(message.id)}
        title="Rate limited"
      />
    );
  }

  return (
    <article
      className={cn(
        "mw-card min-w-0 max-w-full overflow-hidden",
        preferences.compactAnswerCards ? "p-4" : "p-5",
      )}
    >
      <div className="flex flex-wrap gap-2">
        <span className="mw-radius-pill border border-[var(--mw-hairline)] bg-[var(--mw-surface-strong)] px-3 py-1.5 text-[11px] font-medium text-[var(--mw-muted)]">
          {message.context?.subject ?? "Object Oriented Programming"}
        </span>
        <span className="mw-radius-pill border border-[var(--mw-hairline)] bg-[var(--mw-surface-strong)] px-3 py-1.5 text-[11px] font-medium text-[var(--mw-muted)]">
          {answerTypeLabel(message.answerType)}
        </span>
      </div>

      <AnswerRenderer
        className="mt-5"
        compact={preferences.compactAnswerCards}
        content={message.content}
      />

      <div className={cn("flex flex-wrap gap-2", preferences.compactAnswerCards ? "mt-4" : "mt-5")}>
        <ActionButton onClick={() => onCopy(message)}>
          <Clipboard className="size-3.5" />
          Copy
        </ActionButton>
        <ActionButton onClick={() => onRegenerate(message.id)}>
          <RefreshCcw className="size-3.5" />
          Regenerate
        </ActionButton>
        <ActionButton
          ariaLabel="Thumbs up"
          active={message.feedback === "up"}
          onClick={() => onFeedback(message.id, "up")}
        >
          <ThumbsUp className="size-3.5" />
        </ActionButton>
        <ActionButton
          ariaLabel="Thumbs down"
          active={message.feedback === "down"}
          onClick={() => onFeedback(message.id, "down")}
        >
          <ThumbsDown className="size-3.5" />
        </ActionButton>
      </div>
    </article>
  );
}

function LoadingAnswer() {
  return (
    <div className="mw-card min-w-0 max-w-full p-5">
      <MinimalLoader label="Searching reviewed notes" variant="inline" />
    </div>
  );
}

function EdgeCard({
  title,
  body,
  action,
  onAction,
}: {
  title: string;
  body: string;
  action?: string;
  onAction: () => void;
}) {
  return (
    <div className="mw-card min-w-0 max-w-full p-5">
      <h3 className="text-[20px] font-medium leading-[1.2]">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-[1.5] text-[var(--mw-body)]">{body}</p>
      {action ? (
        <button
          className="mw-pill-primary mt-5"
          onClick={onAction}
          type="button"
        >
          {action}
        </button>
      ) : null}
    </div>
  );
}

function ActionButton({
  children,
  ariaLabel,
  active,
  onClick,
}: {
  children: React.ReactNode;
  ariaLabel?: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-9 items-center gap-2 mw-radius-pill border border-[var(--mw-hairline)] bg-white px-3 text-[12px] font-medium text-[var(--mw-body)] transition-colors hover:bg-[var(--mw-surface-strong)] hover:text-[var(--mw-ink)]",
        active && "bg-[var(--mw-primary)] text-white hover:bg-[var(--mw-ink)] hover:text-white",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
