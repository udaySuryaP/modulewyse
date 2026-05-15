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
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { StudentSidebar } from "@/components/dashboard/student-sidebar";
import { clearPendingQuestion, readPendingQuestion } from "@/lib/landing-flow";
import {
  mockSubjects,
  subjectModules,
  subjectModuleLabel,
} from "@/lib/mock-subjects";
import { cn } from "@/lib/utils";

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
  { href: "/profile", icon: User, label: "Profile" },
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
};

type ChatWorkspaceProps = {
  initialQuestion: string;
  initialContext: ChatContext;
  isProfileIncomplete: boolean;
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

export function ChatWorkspace({
  initialQuestion,
  initialContext,
  isProfileIncomplete,
}: ChatWorkspaceProps) {
  const resolvedInitialQuestion = useMemo(
    () => initialQuestion.trim() || readPendingQuestion(),
    [initialQuestion],
  );
  const [draft, setDraft] = useState(resolvedInitialQuestion);
  const [messages, setMessages] = useState<Message[]>([]);
  const [answerType, setAnswerType] = useState("Default");
  const [context, setContext] = useState(() => contextFromProps(initialContext));
  const [toast, setToast] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches,
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resolvedInitialQuestion) {
      clearPendingQuestion();
    }
  }, [resolvedInitialQuestion]);

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
  ) {
    const forcedState = shouldTriggerState(question);

    setMessages((current) => [
      ...current.filter((message) => message.status !== "loading"),
      assistantMessage(
        question,
        forcedState ?? "complete",
        contextSnapshot,
        answerTypeSnapshot,
      ),
    ]);
    setIsGenerating(false);
    focusComposer();
  }

  function sendMessage(question: string) {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isGenerating) {
      return;
    }

    setDraft("");
    const contextSnapshot = context;
    const answerTypeSnapshot = answerType;
    const sourceChips = sourceChipsForContext(contextSnapshot);

    setMessages((current) => [
      ...current,
      {
        id: newId("user"),
        role: "user",
        content: trimmedQuestion,
        createdAt: new Date(),
      },
      {
        id: newId("assistant-loading"),
        role: "assistant",
        content: "Generating from selected notes...",
        createdAt: new Date(),
        answerType: answerTypeSnapshot,
        context: contextSnapshot,
        status: "loading",
        sources: sourceChips,
      },
    ]);
    setIsGenerating(true);

    const delay = 700 + Math.round(Math.random() * 500);
    window.setTimeout(
      () => finishMockAnswer(trimmedQuestion, contextSnapshot, answerTypeSnapshot),
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

  function handleFeedback(messageId: string, feedback: Feedback) {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId ? { ...message, feedback } : message,
      ),
    );
    setToast("Feedback submitted.");
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
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? assistantMessage(
                previousQuestion,
                "complete",
                contextSnapshot,
                answerTypeSnapshot,
              )
            : message,
        ),
      );
      setIsGenerating(false);
      setToast("Answer regenerated.");
    }, 850);
  }

  const canSend = draft.trim().length > 0 && !isGenerating;

  return (
    <div
      className={cn(
        "flex min-h-dvh text-white [--chat-sidebar-width:0px] md:[--chat-sidebar-width:72px]",
        sidebarExpanded && "lg:[--chat-sidebar-width:228px]",
      )}
    >
      <StudentSidebar
        className="hidden md:flex"
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((current) => !current)}
      />

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
              "min-h-[390px] rounded-[12px] border border-white/18 bg-white/10 p-3 text-white backdrop-blur-[24px] sm:min-h-[520px] sm:p-5",
              isProfileIncomplete ? "md:row-start-3" : "md:row-start-2",
            )}
          >
            {messages.length === 0 ? (
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
        <div className="fixed bottom-[106px] left-1/2 z-50 -translate-x-1/2 rounded-[12px] border border-white/18 bg-[#101111]/84 px-4 py-3 text-[14px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[24px] sm:bottom-[116px]">
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
    <header className="sticky top-0 z-40 border-b border-white/18 bg-white/12 px-3 py-3 text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)] backdrop-blur-[28px] md:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link
          className="text-[20px] font-normal leading-none tracking-[-0.03em] text-white"
          href="/chat"
        >
          modulewyse
        </Link>
        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse menu" : "Expand menu"}
          className="grid size-10 place-items-center rounded-[12px] border border-white/18 bg-white/12 text-white/78"
          onClick={onToggle}
          type="button"
        >
          {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {isOpen ? (
        <div className="mt-4 grid gap-4 pb-3">
          <div>
            <p className="text-[12px] font-normal uppercase leading-[1.4] tracking-[0.08em] text-white/55">
              Answer type
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {answerTypes.map((type) => (
                <button
                  className={cn(
                    "h-9 rounded-[12px] border border-white/18 bg-white/10 px-3 font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-white/72",
                    answerType === type && "bg-white text-black",
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
                  className="flex h-10 items-center gap-3 rounded-[12px] border border-white/14 bg-white/10 px-3 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-white/76"
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="grid gap-1.5 font-mono text-[11px] font-medium uppercase leading-[1.5] tracking-[0.08em] text-white/55">
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
        "rounded-[12px] border border-white/18 bg-white/12 px-4 py-4 text-white backdrop-blur-[28px] sm:px-5 sm:py-4",
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
        <p className="text-[12px] font-normal uppercase leading-[1.4] tracking-[0.08em] text-white/55">
          Answer type
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {answerTypes.map((type) => (
            <button
              className={cn(
                "h-9 rounded-[12px] border border-white/18 bg-white/10 px-4 font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-white/72 transition-colors hover:bg-white/16 hover:text-white",
                answerType === type && "bg-white text-black hover:bg-white hover:text-black",
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
      <span className="text-[12px] font-normal uppercase leading-[1.4] tracking-[0.08em] text-white/55">
        {label}
      </span>
      <span className="relative block">
        <select
          className="h-11 w-full min-w-0 appearance-none rounded-[12px] border border-white/18 bg-white/10 py-0 pl-4 pr-10 text-[14px] font-normal text-white outline-none backdrop-blur-[18px] focus-visible:ring-2 focus-visible:ring-white/24 [&>option]:bg-[#101111]"
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/72"
        />
      </span>
    </label>
  );
}

function SetupPrompt({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-white/18 bg-white/14 p-5 text-white backdrop-blur-[28px] sm:flex sm:items-center sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div>
        <h2 className="text-[24px] font-normal leading-[1.1] tracking-[-0.03em]">
          Complete your academic setup
        </h2>
        <p className="mt-3 max-w-[640px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
          Add your college, branch, semester, and focus subject to personalize
          ModuleWyse.
        </p>
      </div>
      <Link
        className="mt-5 inline-flex h-11 items-center justify-center rounded-[12px] bg-white px-5 font-mono text-[14px] font-medium uppercase tracking-[0.02em] text-black sm:mt-0"
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
      <div className="flex min-h-[52px] items-end gap-2 rounded-[12px] border border-white/24 bg-white/14 py-1.5 pl-2.5 pr-1.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[18px] sm:min-h-[58px] sm:gap-3 sm:py-2 sm:pl-3 sm:pr-2">
        <textarea
          className="max-h-[180px] min-h-[36px] min-w-0 flex-1 resize-none overflow-hidden bg-transparent py-2 text-[15px] font-normal leading-[1.45] tracking-[-0.02em] text-white outline-none placeholder:text-white/45 sm:min-h-[40px] sm:text-[16px]"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask from selected subject..."
          ref={inputRef}
          rows={1}
          value={draft}
        />
        <button
          className="grid h-9 shrink-0 place-items-center rounded-[12px] bg-white px-4 font-mono text-[12px] font-medium uppercase tracking-[0.02em] text-black transition-colors hover:bg-white/88 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-45 sm:h-10 sm:px-[18px]"
          disabled={!canSend}
          type="submit"
        >
          Ask
        </button>
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
        <h2 className="text-[26px] font-normal leading-[1.1] tracking-[-0.03em] text-white sm:text-[32px]">
          What do you want to prepare today?
        </h2>
        <p className="mt-3 text-[15px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72 sm:mt-4 sm:text-[18px]">
          Select a subject and ask from available curated notes.
        </p>
        <div className="mt-6 grid gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-3">
          {suggestedPrompts.map((prompt) => (
            <button
              className="rounded-[12px] border border-white/16 bg-white/8 p-3 text-left text-[13px] leading-[1.4] text-white/72 transition-colors hover:bg-white/14 sm:p-4 sm:text-[14px]"
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

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="ml-auto w-fit max-w-[min(860px,88%)] rounded-[12px] border border-white/18 bg-white/12 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-[20px]">
      <p className="whitespace-pre-wrap text-[16px] leading-[1.45] tracking-[-0.02em] text-white/86">
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
    <article className="rounded-[12px] border border-white/18 bg-white/12 p-5 text-white backdrop-blur-[28px]">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Based on available notes</Badge>
        <Badge>{message.answerType ?? "Default"}</Badge>
        <span className="text-[14px] leading-[1.4] text-white/55">
          {message.context?.subject ?? "Object Oriented Programming"} /{" "}
          {message.context?.module ?? "Module 3"}
        </span>
      </div>

      <div className="mt-5 whitespace-pre-wrap text-[15px] leading-[1.55] tracking-[-0.01em] text-white/78">
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
          active={message.feedback === "up"}
          onClick={() => onFeedback(message.id, "up")}
        >
          <ThumbsUp className="size-3.5" />
          Thumbs Up
        </ActionButton>
        <ActionButton
          active={message.feedback === "down"}
          onClick={() => onFeedback(message.id, "down")}
        >
          <ThumbsDown className="size-3.5" />
          Thumbs Down
        </ActionButton>
      </div>
    </article>
  );
}

function LoadingAnswer() {
  return (
    <div className="rounded-[12px] border border-white/18 bg-white/12 p-5 text-white backdrop-blur-[28px]">
      <p className="text-[14px] font-normal uppercase tracking-[0.02em] text-white/55">
        Generating from selected notes...
      </p>
      <div className="mt-5 grid gap-3">
        <div className="h-4 w-2/3 animate-pulse rounded-[12px] bg-white/14" />
        <div className="h-4 w-full animate-pulse rounded-[12px] bg-white/10" />
        <div className="h-4 w-5/6 animate-pulse rounded-[12px] bg-white/10" />
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
    <div className="rounded-[12px] border border-white/18 bg-white/12 p-5 text-white backdrop-blur-[28px]">
      <h3 className="text-[20px] font-normal leading-[1.2] tracking-[-0.02em]">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-[1.45] text-white/72">{body}</p>
      <button
        className="mt-5 inline-flex h-10 items-center justify-center rounded-[12px] bg-white px-4 font-mono text-[12px] font-medium uppercase tracking-[0.02em] text-black"
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
    <span className="rounded-[12px] border border-white/14 bg-white/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.02em] text-white/72">
      {children}
    </span>
  );
}

function ActionButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-[12px] border border-white/18 bg-white/10 px-3 font-mono text-[11px] font-medium uppercase tracking-[0.02em] text-white/72 transition-colors hover:bg-white/16 hover:text-white",
        active && "bg-white text-black hover:bg-white hover:text-black",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
