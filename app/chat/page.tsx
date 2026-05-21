import { redirect } from "next/navigation";

import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { PageOverlay } from "@/components/landing/page-overlay";
import { VideoBackground } from "@/components/landing/video-background";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import {
  getSubjectWithModulesAndFallback,
  normalizeSubjectModuleValue,
} from "@/lib/data/subjects";

type ChatPageProps = {
  searchParams: Promise<{
    module?: string | string[];
    conversation?: string | string[];
    q?: string | string[];
    semester?: string | string[];
    subject?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function chatNextPath(params: Awaited<ChatPageProps["searchParams"]>) {
  const nextParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => nextParams.append(key, item));
      return;
    }

    if (value) {
      nextParams.set(key, value);
    }
  });

  const queryString = nextParams.toString();
  return queryString ? `/chat?${queryString}` : "/chat";
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const params = await searchParams;
  const { user, profile } = await getUserProfile();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(chatNextPath(params))}`);
  }

  const conversationId = firstParam(params.conversation);
  const pendingQuestion = firstParam(params.q);
  const subjectParam = firstParam(params.subject);
  const { subject: routedSubject } = subjectParam
    ? await getSubjectWithModulesAndFallback(subjectParam)
    : { subject: null };
  const normalizedModule = routedSubject
    ? normalizeSubjectModuleValue(firstParam(params.module), routedSubject.modules)
    : "all";
  const routedModule = routedSubject?.modules.find(
    (module) => module.value === normalizedModule,
  )?.label;
  const initialContext = {
    semester: firstParam(params.semester) || routedSubject?.semester || "S4",
    subject: routedSubject?.name || subjectParam || "Object Oriented Programming",
    module: routedModule || "All modules",
  };
  const isProfileIncomplete = !profile?.onboarding_completed;

  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="min-h-dvh">
        <ChatWorkspace
          initialConversationId={conversationId}
          initialContext={initialContext}
          initialQuestion={pendingQuestion}
          isProfileIncomplete={isProfileIncomplete}
          key={`${conversationId}:${pendingQuestion}`}
          userId={user.id}
        />
      </main>
    </>
  );
}
