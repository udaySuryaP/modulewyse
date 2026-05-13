import { FeatureCard } from "@/components/landing/feature-card";
import { HeroAskBox } from "@/components/landing/hero-ask-box";
import { HeroBadge } from "@/components/landing/hero-badge";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { LandingNavigation } from "@/components/landing/landing-navigation";
import { PageOverlay } from "@/components/landing/page-overlay";
import { SubjectStatusPanel } from "@/components/landing/subject-status-panel";
import { VideoBackground } from "@/components/landing/video-background";

export default function HomePage() {
  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="relative min-h-dvh overflow-hidden">
        <LandingNavigation />

        <section className="mx-auto flex w-full flex-col items-center px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-14 lg:pt-[60px]">
          <div className="flex w-full -translate-y-4 flex-col items-center text-center sm:-translate-y-8 lg:-translate-y-12">
            <HeroBadge />

            <div className="mt-[34px]">
              <HeroHeadline />
            </div>

            <div className="mt-11 w-full">
              <HeroAskBox />
            </div>
          </div>

          <div className="mt-2 grid w-full gap-4 md:grid-cols-3">
            <FeatureCard
              description="Choose semester, subject, and module before asking."
              label="MODULE-AWARE"
              title="Answers stay inside your subject context."
            />
            <FeatureCard
              description="Use answer styles that match your preparation needs."
              label="EXAM-READY"
              title="Short, medium, and long answer formats."
            />
            <FeatureCard
              description="Content is prepared and structured by the platform."
              label="CURATED CONTENT"
              title="Cleaner answers from managed academic material."
            />
          </div>

          <div className="mt-5 w-full">
            <SubjectStatusPanel />
          </div>
        </section>

        <footer className="relative z-10 flex flex-col gap-2 px-5 pb-6 text-[14px] font-normal leading-[1.4] tracking-[-0.01em] text-white/55 sm:px-8 lg:flex-row lg:justify-between lg:px-14">
          <p>
            CURATED NOTES / MODULE-AWARE ANSWERS / KTU BASED EXAM PREP COMPANION
          </p>
          <p>© 2026 MODULEWYSE / STUDENT BETA</p>
        </footer>
      </main>
    </>
  );
}
