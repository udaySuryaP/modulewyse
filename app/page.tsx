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

        <section className="mx-auto flex w-full flex-col items-center px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-14 lg:pt-[60px]">
          <LiquidReveal className="flex w-full -translate-y-4 flex-col items-center text-center sm:-translate-y-8 lg:-translate-y-12">
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
