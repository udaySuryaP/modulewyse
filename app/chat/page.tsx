import Link from "next/link";
import { redirect } from "next/navigation";

import { ChatDraftComposer } from "@/components/chat/chat-draft-composer";
import { LandingNavigation } from "@/components/landing/landing-navigation";
import { PageOverlay } from "@/components/landing/page-overlay";
import { VideoBackground } from "@/components/landing/video-background";
import { LiquidGroup, LiquidItem } from "@/components/motion/liquid-motion";
import { getUserProfile } from "@/lib/auth/get-user-profile";

type ChatPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
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
  const isProfileIncomplete = !profile?.onboarding_completed;

  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="min-h-dvh">
        <LandingNavigation />
        <LiquidGroup className="mx-auto grid w-full gap-5 px-5 py-16 sm:px-8 lg:px-14">
          <LiquidItem>
            <div className="rounded-[12px] border border-white/18 bg-white/12 p-6 backdrop-blur-[28px] sm:p-8">
              <p className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
                Student dashboard
              </p>
              <h1 className="mt-4 text-[36px] font-normal leading-[1.1] tracking-[-0.03em] text-white">
                Ask from your KTU syllabus.
              </h1>
              <p className="mt-4 max-w-[680px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
                Use the composer below to keep your question ready. The next
                phase will add mock conversations before AI/RAG is connected.
              </p>
            </div>
          </LiquidItem>

          {isProfileIncomplete ? (
            <LiquidItem>
              <div className="rounded-[12px] border border-white/18 bg-white/14 p-5 text-white backdrop-blur-[28px] sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <h2 className="text-[24px] font-normal leading-[1.1] tracking-[-0.03em]">
                    Complete your academic setup
                  </h2>
                  <p className="mt-3 max-w-[640px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
                    Add your college, branch, semester, and focus subject to
                    personalize ModuleWyse.
                  </p>
                </div>
                <Link
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-[12px] bg-white px-5 font-mono text-[14px] font-medium uppercase tracking-[0.02em] text-black sm:mt-0"
                  href="/onboarding/academic-profile"
                >
                  Continue Setup
                </Link>
              </div>
            </LiquidItem>
          ) : null}

          <LiquidItem>
            <ChatDraftComposer
              initialQuestion={pendingQuestion}
              key={pendingQuestion}
            />
          </LiquidItem>
        </LiquidGroup>
      </main>
    </>
  );
}
