import { redirect } from "next/navigation";

import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { PageOverlay } from "@/components/landing/page-overlay";
import { VideoBackground } from "@/components/landing/video-background";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import {
  getSubjectBySlug,
  normalizeSubjectModule,
  subjectModuleLabel,
} from "@/lib/mock-subjects";

type ChatPageProps = {
  searchParams: Promise<{
    module?: string | string[];
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

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const { user, profile } = await getUserProfile();

  if (!user) {
    redirect("/login?next=/chat");
  }

  const params = await searchParams;
  const pendingQuestion = firstParam(params.q);
  const subjectParam = firstParam(params.subject);
  const routedSubject = getSubjectBySlug(subjectParam);
  const routedModule = routedSubject
    ? subjectModuleLabel(normalizeSubjectModule(routedSubject, firstParam(params.module)))
    : firstParam(params.module);
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
          initialContext={initialContext}
          initialQuestion={pendingQuestion}
          isProfileIncomplete={isProfileIncomplete}
          key={pendingQuestion}
        />
      </main>
    </>
  );
}
