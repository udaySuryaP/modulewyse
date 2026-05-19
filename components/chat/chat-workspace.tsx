"use client";

import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock,
  Clipboard,
  Library,
  Menu,
  MessageSquare,
  RefreshCcw,
  Settings,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { StudentSidebar } from "@/components/dashboard/student-sidebar";
import {
  createConversation,
  getConversationWithMessages,
  getUserConversations,
  insertMessage,
  saveMessageFeedback,
} from "@/lib/data/chat";
import { clearPendingQuestion, readPendingQuestion } from "@/lib/landing-flow";
import {
  mockSubjects,
  subjectModules,
  subjectModuleLabel,
  type SubjectModule,
} from "@/lib/mock-subjects";
import { cn } from "@/lib/utils";
import type {
  Conversation,
  Message as PersistedMessage,
  MessageFeedback,
} from "@/types/database";

const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
const subjects = mockSubjects.map((subject) => subject.name);
const moduleOptions = subjectModules.map(subjectModuleLabel);
const answerTypes = ["Default", "Short", "Medium", "Long", "Part A", "Part B", "Part C"];
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

type ChatWorkspaceProps = {
  initialConversationId: string;
  initialQuestion: string;
  initialContext: ChatContext;
  isProfileIncomplete: boolean;
  userId: string;
};

function normalizeOption(value: string, options: string[], fallback: string) {
  const match = options.find(
    (option) => option.toLowerCase() === value.trim().toLowerCase(),
  );

  return match ?? fallback;
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mockAnswer(question: string, answerType: string) {
  return [
    "Mock exam-ready answer",
    "",
    "This is a placeholder answer showing how ModuleWyse will structure responses from curated academic content.",
    "",
    "Definition / introduction",
    `${question} can be answered by first defining the core concept, then connecting it to the selected module context.`,
    "",
    "Key points",
    "- Identify the main term used in the question.",
    "- Explain the idea using syllabus-aligned language.",
    "- Add two or three exam-relevant points with clear sequencing.",
    "- Connect the answer to the selected subject and module.",
    "",
    "Short example",
    "For OOP questions, relate the concept to a class, object, method, or real-world model where possible.",
    "",
    "Exam writing tip",
    `For ${answerType} answers, keep the structure direct: definition, points, example, and conclusion.`,
    "",
    "Conclusion",
    "This local mock answer previews the response format. Real answers will later come from verified ModuleWyse academic content.",
  ].join("\n");
}

function shouldTriggerState(question: string): AssistantStatus | null {
  const normalized = question.toLowerCase();

  if (normalized.includes("/fail")) {
    return "failed";
  }

  if (normalized.includes("/insufficient")) {
    return "insufficient";
  }

  if (normalized.includes("/rate")) {
    return "rate-limited";
  }

  return null;
}

function contextFromProps(initialContext: ChatContext) {
  return {
    semester: normalizeOption(initialContext.semester, semesters, "S4"),
    subject: normalizeOption(initialContext.subject, subjects, "Object Oriented Programming"),
    module: normalizeOption(initialContext.module, moduleOptions, "All modules"),
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

  if (subjectModules.includes(normalized as SubjectModule)) {
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

function titleFromQuestion(question: string) {
  const normalized = question.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "New chat";
  }

  return normalized.length > 64 ? `${normalized.slice(0, 61)}...` : normalized;
}

function metadataForMessage(
  status: AssistantStatus,
  contextSnapshot: ChatContext,
  answerTypeSnapshot: string,
) {
  return {
    answerType: answerTypeSnapshot,
    assistantStatus: status,
    isMock: true,
    moduleLabel: contextSnapshot.module,
    moduleValue: moduleValueForContext(contextSnapshot),
    sourceChips: sourceChipsForContext(contextSnapshot),
    status: "BASED_ON_AVAILABLE_NOTES",
    subjectLabel: contextSnapshot.subject,
    subjectSlug: subjectSlugForContext(contextSnapshot),
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
      ["complete", "failed", "insufficient", "rate-limited"].includes(status)
        ? (status as AssistantStatus)
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
  const [answerType, setAnswerType] = useState("Default");
  const [context, setContext] = useState(() => contextFromProps(initialContext));
  const [toast, setToast] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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
    refreshRecentConversations();
  }, []);

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

  async function refreshRecentConversations() {
    try {
      setRecentConversations(await getUserConversations());
    } catch {
      setRecentConversations([]);
    }
  }

  function assistantMessage(
    question: string,
    status: AssistantStatus = "complete",
    contextSnapshot: ChatContext = context,
    answerTypeSnapshot: string = answerType,
  ): Message {
    return {
      id: newId("assistant"),
      role: "assistant",
      content:
        status === "complete"
          ? mockAnswer(question, answerTypeSnapshot)
          : status === "insufficient"
            ? "I do not have enough verified material for this answer yet."
            : status === "rate-limited"
              ? "Local mock rate limit reached. Try again in a moment."
              : "The local mock answer failed to generate.",
      createdAt: new Date(),
      answerType: answerTypeSnapshot,
      context: contextSnapshot,
      sources: sourceChipsForContext(contextSnapshot),
      status,
    };
  }

  function finishMockAnswer(
    question: string,
    contextSnapshot: ChatContext,
    answerTypeSnapshot: string,
    conversationId: string | null,
  ) {
    const forcedState = shouldTriggerState(question);
    const nextAssistantMessage = assistantMessage(
      question,
      forcedState ?? "complete",
      contextSnapshot,
      answerTypeSnapshot,
    );

    setMessages((current) => [
      ...current.filter((message) => message.status !== "loading"),
      nextAssistantMessage,
    ]);

    if (conversationId) {
      persistAssistantMessage(
        conversationId,
        nextAssistantMessage,
        forcedState ?? "complete",
        contextSnapshot,
        answerTypeSnapshot,
      );
    }

    setIsGenerating(false);
    focusComposer();
  }

  async function ensureConversation(
    question: string,
    contextSnapshot: ChatContext,
  ) {
    if (activeConversationId) {
      return activeConversationId;
    }

    const conversation = await createConversation({
      moduleValue: moduleValueForContext(contextSnapshot),
      subjectSlug: subjectSlugForContext(contextSnapshot),
      title: titleFromQuestion(question),
      userId,
    });

    setActiveConversationId(conversation.id);
    window.history.replaceState(null, "", `/chat?conversation=${conversation.id}`);
    refreshRecentConversations();
    return conversation.id;
  }

  async function persistAssistantMessage(
    conversationId: string,
    message: Message,
    status: AssistantStatus,
    contextSnapshot: ChatContext,
    answerTypeSnapshot: string,
  ) {
    try {
      const persisted = await insertMessage({
        answerType: answerTypeSnapshot,
        content: message.content,
        conversationId,
        metadata: metadataForMessage(status, contextSnapshot, answerTypeSnapshot),
        role: "assistant",
        userId,
      });

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? { ...item, id: persisted.id, persistedId: persisted.id }
            : item,
        ),
      );
      refreshRecentConversations();
    } catch {
      setToast("Answer kept locally. Persistence failed.");
    }
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
      content: "Generating from selected notes...",
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

    let conversationId: string | null = activeConversationId || null;

    try {
      conversationId = await ensureConversation(trimmedQuestion, contextSnapshot);
      const persistedUserMessage = await insertMessage({
        answerType: null,
        content: trimmedQuestion,
        conversationId,
        metadata: {
          moduleLabel: contextSnapshot.module,
          moduleValue: moduleValueForContext(contextSnapshot),
          subjectLabel: contextSnapshot.subject,
          subjectSlug: subjectSlugForContext(contextSnapshot),
        },
        role: "user",
        userId,
      });

      setMessages((current) =>
        current.map((message) =>
          message.id === localUserMessage.id
            ? {
                ...message,
                id: persistedUserMessage.id,
                persistedId: persistedUserMessage.id,
              }
            : message,
        ),
      );
    } catch {
      conversationId = null;
      setToast("Chat is continuing locally. Persistence failed.");
    }

    const delay = 700 + Math.round(Math.random() * 500);
    window.setTimeout(
      () =>
        finishMockAnswer(
          trimmedQuestion,
          contextSnapshot,
          answerTypeSnapshot,
          conversationId,
        ),
      delay,
    );
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

  function regenerate(messageId: string) {
    const index = messages.findIndex((message) => message.id === messageId);
    const previousQuestion = [...messages]
      .slice(0, index)
      .reverse()
      .find((message) => message.role === "user")?.content;

    if (!previousQuestion || isGenerating) {
      return;
    }

    const targetMessage = messages[index];
    const contextSnapshot = targetMessage?.context ?? context;
    const answerTypeSnapshot = targetMessage?.answerType ?? answerType;

    setMessages((current) =>
      current.map((message) =>
        message.id === messageId
          ? {
              ...message,
              content: "Generating from selected notes...",
              status: "loading",
              createdAt: new Date(),
            }
          : message,
      ),
    );
    setIsGenerating(true);

    window.setTimeout(() => {
      const regeneratedMessage = assistantMessage(
        previousQuestion,
        "complete",
        contextSnapshot,
        answerTypeSnapshot,
      );

      setMessages((current) =>
        current.map((message) =>
          message.id === messageId ? regeneratedMessage : message,
        ),
      );

      if (activeConversationId) {
        persistAssistantMessage(
          activeConversationId,
          regeneratedMessage,
          "complete",
          contextSnapshot,
          answerTypeSnapshot,
        );
      }

      setIsGenerating(false);
      setToast("Answer regenerated.");
    }, 850);
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
        />
      </StudentSidebar>

      <div className="min-w-0 flex-1">
        <MobileChatTopbar
          answerType={answerType}
          context={context}
          isOpen={mobileMenuOpen}
          onAnswerTypeChange={setAnswerType}
          onContextChange={setContext}
          onToggle={() => setMobileMenuOpen((current) => !current)}
        />

        <header className="hidden min-h-4 px-3 py-3 sm:px-6 sm:py-4 md:block lg:min-h-8 lg:px-8" />

        <main className="grid gap-4 px-3 pb-[124px] pt-4 sm:gap-5 sm:px-6 sm:pb-[140px] md:pt-0 lg:px-8">
          <ContextControls
            answerType={answerType}
            className="hidden md:block md:row-start-1 md:self-start"
            context={context}
            onAnswerTypeChange={setAnswerType}
            onContextChange={setContext}
          />

          {isProfileIncomplete ? (
            <SetupPrompt className="md:row-start-2" />
          ) : null}

          <div
            className={cn(
              "mw-card min-h-[390px] p-3 sm:min-h-[520px] sm:p-5",
              isProfileIncomplete ? "md:row-start-3" : "md:row-start-2",
            )}
          >
            {conversationLoadState === "loading" ? (
              <LoadingAnswer />
            ) : conversationLoadState === "missing" ? (
              <ConversationNotFound />
            ) : messages.length === 0 ? (
              <EmptyConversation onPickPrompt={setDraft} />
            ) : (
              <div className="grid gap-4">
                {messages.map((message) =>
                  message.role === "user" ? (
                    <UserMessage key={message.id} message={message} />
                  ) : (
                    <AssistantMessage
                      key={message.id}
                      message={message}
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
  answerType,
  context,
  isOpen,
  onAnswerTypeChange,
  onContextChange,
  onToggle,
}: {
  answerType: string;
  context: ChatContext;
  isOpen: boolean;
  onAnswerTypeChange: (value: string) => void;
  onContextChange: React.Dispatch<React.SetStateAction<ChatContext>>;
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

          <div className="grid gap-3">
            <ContextSelect
              label="Semester"
              onChange={(value) =>
                onContextChange((current) => ({ ...current, semester: value }))
              }
              options={semesters}
              value={context.semester}
            />
            <ContextSelect
              label="Subject"
              onChange={(value) =>
                onContextChange((current) => ({ ...current, subject: value }))
              }
              options={subjects}
              value={context.subject}
            />
            <ContextSelect
              label="Module"
              onChange={(value) =>
                onContextChange((current) => ({ ...current, module: value }))
              }
              options={moduleOptions}
              value={context.module}
            />
          </div>

          <nav className="grid gap-2" aria-label="Student dashboard mobile">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  className="flex h-10 items-center gap-3 mw-radius-pill border border-[var(--mw-hairline)] bg-white px-3 text-[13px] font-medium text-[var(--mw-body)]"
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

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
  context,
  onAnswerTypeChange,
  onContextChange,
}: {
  answerType: string;
  className?: string;
  context: ChatContext;
  onAnswerTypeChange: (value: string) => void;
  onContextChange: React.Dispatch<React.SetStateAction<ChatContext>>;
}) {
  return (
    <div
      className={cn(
        "mw-card px-4 py-4 sm:px-5 sm:py-4",
        className,
      )}
    >
      <div className="grid gap-3 md:grid-cols-[120px_minmax(0,1fr)_140px]">
        <ContextSelect
          label="Semester"
          onChange={(value) =>
            onContextChange((current) => ({ ...current, semester: value }))
          }
          options={semesters}
          value={context.semester}
        />
        <ContextSelect
          label="Subject"
          onChange={(value) =>
            onContextChange((current) => ({ ...current, subject: value }))
          }
          options={subjects}
          value={context.subject}
        />
        <ContextSelect
          label="Module"
          onChange={(value) =>
            onContextChange((current) => ({ ...current, module: value }))
          }
          options={moduleOptions}
          value={context.module}
        />
      </div>

      <div className="mt-4">
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
  conversations,
}: {
  activeConversationId: string;
  conversations: Conversation[];
}) {
  if (conversations.length === 0) {
    return null;
  }

  return (
    <section className="grid min-w-0 gap-3">
      <div className="flex items-center justify-between gap-2 px-2">
        <p className="mw-label text-[11px]">Recent chats</p>
        <Link
          className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--mw-muted)] transition-colors hover:text-[var(--mw-ink)]"
          href="/chat"
        >
          New
        </Link>
      </div>

      <div className="grid max-h-[calc(100dvh-390px)] gap-1.5 overflow-y-auto pr-1">
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
            <Link
              className={cn(
                "min-w-0 mw-radius-card border border-[var(--mw-hairline)] bg-white px-3 py-2.5 transition-colors hover:bg-[var(--mw-surface-strong)]",
                isActive && "border-[var(--mw-hairline-strong)] bg-[var(--mw-surface-strong)]",
              )}
              href={`/chat?conversation=${conversation.id}`}
              key={conversation.id}
            >
              <p className="truncate text-[12px] font-medium leading-[1.35] text-[var(--mw-ink)]">
                {conversation.title}
              </p>
              <p className="mt-1.5 truncate text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--mw-muted)]">
                {subject} / {moduleLabel}
              </p>
              <p className="mt-1 text-[11px] text-[var(--mw-muted)]">{updatedAt}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ContextSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="mw-label">
        {label}
      </span>
      <span className="relative block">
        <select
          className="mw-input h-11 w-full min-w-0 appearance-none py-0 pl-4 pr-10 text-[14px] font-normal [&>option]:bg-white"
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[var(--mw-muted)]"
        />
      </span>
    </label>
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
          placeholder="Ask from selected subject..."
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
}: {
  onPickPrompt: (prompt: string) => void;
}) {
  return (
    <div className="grid min-h-[330px] place-items-center sm:min-h-[360px]">
      <div className="w-full text-center">
        <h2 className="mw-display text-[34px] leading-[1.05] text-[var(--mw-ink)] sm:text-[44px]">
          What do you want to prepare today?
        </h2>
        <p className="mt-3 text-[15px] font-normal leading-[1.55] text-[var(--mw-body)] sm:mt-4 sm:text-[18px]">
          Select a subject and ask from available curated notes.
        </p>
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
    <div className="ml-auto w-fit max-w-[min(860px,88%)] mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-surface-strong)] p-4 text-[var(--mw-ink)]">
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
}: {
  message: Message;
  onCopy: (message: Message) => void;
  onFeedback: (messageId: string, feedback: Feedback) => void;
  onRegenerate: (messageId: string) => void;
}) {
  if (message.status === "loading") {
    return <LoadingAnswer />;
  }

  if (message.status === "failed") {
    return (
      <EdgeCard
        action="Try Again"
        body="The local mock answer failed to generate."
        onAction={() => onRegenerate(message.id)}
        title="Answer failed"
      />
    );
  }

  if (message.status === "insufficient") {
    return (
      <EdgeCard
        action="Try Another Question"
        body="I do not have enough verified material for this answer yet."
        onAction={() => undefined}
        title="Not enough verified content"
      />
    );
  }

  if (message.status === "rate-limited") {
    return (
      <EdgeCard
        action="Try Again"
        body="Local mock rate limit reached. Try again in a moment."
        onAction={() => onRegenerate(message.id)}
        title="Rate limited"
      />
    );
  }

  return (
    <article className="mw-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Based on available notes</Badge>
        <Badge>{message.answerType ?? "Default"}</Badge>
        <span className="text-[14px] leading-[1.4] text-[var(--mw-muted)]">
          {message.context?.subject ?? "Object Oriented Programming"} /{" "}
          {message.context?.module ?? "Module 3"}
        </span>
      </div>

      <div className="mt-5 whitespace-pre-wrap text-[15px] leading-[1.6] text-[var(--mw-body)]">
        {message.content}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(message.sources ?? sourceChipsForContext(message.context ?? {
          semester: "S4",
          subject: "Object Oriented Programming",
          module: "All modules",
        })).map((source) => (
          <Badge key={source}>{source}</Badge>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
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
    <div className="mw-card p-5">
      <p className="mw-label">
        Generating from selected notes...
      </p>
      <div className="mt-5 grid gap-3">
        <div className="h-4 w-2/3 animate-pulse mw-radius-pill bg-[var(--mw-surface-strong)]" />
        <div className="h-4 w-full animate-pulse mw-radius-pill bg-[var(--mw-surface-strong)]" />
        <div className="h-4 w-5/6 animate-pulse mw-radius-pill bg-[var(--mw-surface-strong)]" />
      </div>
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
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="mw-card p-5">
      <h3 className="text-[20px] font-medium leading-[1.2]">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-[1.5] text-[var(--mw-body)]">{body}</p>
      <button
        className="mw-pill-primary mt-5"
        onClick={onAction}
        type="button"
      >
        {action}
      </button>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="mw-badge">
      {children}
    </span>
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
