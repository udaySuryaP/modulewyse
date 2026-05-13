import { Suspense } from "react";

import { LandingNavigation } from "@/components/landing/landing-navigation";
import { PageOverlay } from "@/components/landing/page-overlay";
import { PendingQuestionHandler } from "@/components/landing/pending-question-handler";
import { VideoBackground } from "@/components/landing/video-background";

export default function ChatPage() {
  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="min-h-dvh">
        <LandingNavigation />
        <section className="mx-auto grid w-full gap-5 px-5 py-16 sm:px-8 lg:px-14">
          <div className="rounded-[12px] border border-white/18 bg-white/12 p-6 backdrop-blur-[28px] sm:p-8">
            <p className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
              Student dashboard
            </p>
            <h1 className="mt-4 text-[36px] font-normal leading-[1.1] tracking-[-0.03em] text-white">
              Chat is ready for backend integration.
            </h1>
            <p className="mt-4 max-w-[620px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
              The landing flow can preserve a question and surface it here.
              Supabase auth, onboarding guards, and RAG chat will replace this
              placeholder in the next implementation phase.
            </p>
          </div>

          <Suspense fallback={null}>
            <PendingQuestionHandler />
          </Suspense>
        </section>
      </main>
    </>
  );
}
