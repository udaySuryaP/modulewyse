import { FeatureCard } from "@/components/landing/feature-card";
import { HeroAskBox } from "@/components/landing/hero-ask-box";
import { HeroBadge } from "@/components/landing/hero-badge";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { LandingNavigation } from "@/components/landing/landing-navigation";
import { PageOverlay } from "@/components/landing/page-overlay";
import { SubjectStatusPanel } from "@/components/landing/subject-status-panel";
import { VideoBackground } from "@/components/landing/video-background";
import { LiquidReveal } from "@/components/motion/liquid-motion";

export default function HomePage() {
  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="relative min-h-dvh overflow-hidden">
        <LandingNavigation />

        <section className="mw-section relative z-10 flex flex-col items-center pb-24 pt-14 sm:pt-20 lg:pt-24">
          <LiquidReveal className="relative flex w-full flex-col items-center text-center">
            <HeroBadge />

            <div className="mt-[34px]">
              <HeroHeadline />
            </div>

            <div className="mt-11 w-full">
              <HeroAskBox />
            </div>
          </LiquidReveal>

          <LiquidReveal className="mt-5 w-full" delay={0.14}>
            <SubjectStatusPanel />
          </LiquidReveal>

          <LiquidReveal className="mt-6 grid w-full gap-4 md:grid-cols-3" delay={0.2}>
            <FeatureCard
              label="Module-aware"
              title="Prepare inside the right syllabus context."
              description="Choose semester, subject, and module so answers stay close to the exam scope."
            />
            <FeatureCard
              label="Curated notes"
              title="Built around managed academic material."
              description="ModuleWyse is designed for structured notes and exam-ready content, not student uploads."
            />
            <FeatureCard
              label="Exam focused"
              title="Short, long, and part-wise answer styles."
              description="Use answer formats that match how KTU students revise and write exams."
            />
          </LiquidReveal>
        </section>

        <footer className="mw-section relative z-10 flex flex-col gap-2 pb-8 text-[13px] font-normal leading-[1.5] text-[var(--mw-muted)] lg:flex-row lg:justify-between">
          <p>
            CURATED NOTES / MODULE-AWARE ANSWERS / KTU BASED EXAM PREP COMPANION
          </p>
          <p>© 2026 MODULEWYSE / STUDENT BETA</p>
        </footer>
      </main>
    </>
  );
}
