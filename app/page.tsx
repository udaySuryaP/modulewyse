import Link from "next/link";

import { FeatureTile } from "@/components/landing/feature-tile";
import { LandingAuthActions } from "@/components/landing/landing-auth-actions";
import { LandingNavigation } from "@/components/landing/landing-navigation";
import { PageOverlay } from "@/components/landing/page-overlay";
import { SectionHeader } from "@/components/landing/section-header";
import { VideoBackground } from "@/components/landing/video-background";
import { LiquidReveal } from "@/components/motion/liquid-motion";

const trustMarkers = [
  "Selected KTU content",
  "Syllabus-grounded",
  "Module-aware",
  "Exam-ready answers",
  "Source-based responses",
];

const problemCards = [
  {
    label: "01",
    title: "Scattered notes",
    description:
      "Important definitions, examples, and exam points live across disconnected material.",
  },
  {
    label: "02",
    title: "Generic AI answers",
    description:
      "Broad chatbots can answer confidently without matching the current syllabus scope.",
  },
  {
    label: "03",
    title: "Weak exam structure",
    description:
      "Students still need to reshape explanations into short, long, and exam-ready formats.",
  },
  {
    label: "04",
    title: "Unclear coverage",
    description:
      "It is hard to know which modules are ready, under review, or outside the scheme.",
  },
];

const solutionCards = [
  {
    label: "Ask",
    title: "Natural questions",
    description:
      "Ask in plain language without selecting semester, subject, or module dropdowns.",
  },
  {
    label: "Ground",
    title: "Reviewed sources",
    description:
      "Answers are generated from available reviewed academic notes, not open-ended web context.",
  },
  {
    label: "Scope",
    title: "Module awareness",
    description:
      "ModuleWyse keeps answers inside the reviewed content that is available for the student.",
  },
  {
    label: "Format",
    title: "Answer length modes",
    description:
      "Switch between Short, Medium, Long, and Exam-ready responses for revision needs.",
  },
  {
    label: "Cite",
    title: "Source chips",
    description:
      "Answers carry inline citations and source chips so students can see where context came from.",
  },
  {
    label: "Library",
    title: "Question archive",
    description:
      "Previous-year questions are available for browsing while staying out of RAG answers for now.",
  },
];

const flowSteps = [
  {
    step: "01",
    title: "Open the workspace",
    description:
      "Start from the study workspace and keep the academic context organized.",
  },
  {
    step: "02",
    title: "Ask from reviewed notes",
    description:
      "Write the doubt the way you would ask a classmate before an exam.",
  },
  {
    step: "03",
    title: "Study with sources",
    description:
      "Review the structured answer, citations, and source chips before writing notes.",
  },
];

const answerModes = [
  {
    mode: "Short",
    text: "A direct definition or compact point list for quick recall.",
  },
  {
    mode: "Medium",
    text: "A balanced explanation with the core idea and supporting details.",
  },
  {
    mode: "Long",
    text: "A fuller breakdown with sections, connected points, and context.",
  },
  {
    mode: "Exam-ready",
    text: "Intro, points, explanation, supported examples, and conclusion.",
  },
];

function DiagramBars() {
  return (
    <div className="grid h-24 grid-cols-4 gap-[var(--mw-space-xs)]">
      {[45, 72, 55, 88].map((height) => (
        <div
          className="flex items-end overflow-hidden mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)]"
          key={height}
        >
          <div
            className="w-full bg-[var(--mw-accent-blue)]"
            style={{ height: `${height}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function DiagramLines() {
  return (
    <div className="space-y-[var(--mw-space-sm)]">
      <div className="h-px w-full bg-[var(--mw-hairline-strong)]" />
      <div className="h-px w-10/12 bg-[var(--mw-hairline)]" />
      <div className="h-px w-7/12 bg-[var(--mw-hairline)]" />
      <div className="flex gap-[var(--mw-space-xs)] pt-[var(--mw-space-sm)]">
        <span className="h-7 flex-1 mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)]" />
        <span className="h-7 flex-1 mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-accent-blue-soft)]" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="relative min-h-dvh overflow-hidden">
        <LandingNavigation />

        <section className="relative z-10 pb-[calc(var(--mw-space-section-lg)+var(--mw-space-xl))] pt-[var(--mw-space-section)] lg:pb-[8rem] lg:pt-[7rem]">
          <LiquidReveal className="mw-hero-section">
            <div className="mx-auto max-w-[940px] text-center">
              <p className="mw-label text-[var(--mw-ink)]">
                KTU focused academic intelligence
              </p>
              <h1 className="mw-display-page mw-hero-title mx-auto mt-[var(--mw-space-lg)] max-w-[900px] text-balance">
                <span className="whitespace-nowrap">Syllabus-grounded</span>{" "}
                AI exam prep.
              </h1>
              <p className="mx-auto mt-[var(--mw-space-lg)] max-w-[670px] text-[length:var(--mw-type-subtitle)] font-normal leading-[1.55] text-[var(--mw-body)]">
                ModuleWyse turns reviewed academic notes into structured,
                source-backed explanations and exam-oriented revision formats.
              </p>
              <LandingAuthActions className="mt-[var(--mw-space-xl)]" />
              <p className="mw-meta mx-auto mt-[var(--mw-space-lg)] max-w-[520px]">
                Built for focused academic revision, not generic chatbot
                browsing.
              </p>
            </div>
          </LiquidReveal>
        </section>

        <section className="relative z-10 border-y border-[var(--mw-hairline)] bg-[var(--mw-surface-card)]">
          <div className="mw-section grid gap-0 py-[var(--mw-space-lg)] sm:grid-cols-2 lg:grid-cols-5">
            {trustMarkers.map((marker) => (
              <div
                className="border-b border-[var(--mw-hairline)] py-[var(--mw-space-md)] last:border-b-0 sm:border-r sm:px-[var(--mw-space-md)] sm:last:border-r-0 lg:border-b-0"
                key={marker}
              >
                <p className="mw-label text-[var(--mw-ink)]">{marker}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="mw-section relative z-10 py-[var(--mw-space-section)] lg:py-[var(--mw-space-section-lg)]"
          id="about"
        >
          <SectionHeader
            align="center"
            eyebrow="Why ModuleWyse"
            title="Exam preparation needs structure, not another open-ended chat box."
            description="ModuleWyse is designed around the academic boundaries students actually revise within: subject, module state, reviewed notes, answer format, and source traceability."
          />

          <LiquidReveal
            className="mt-[var(--mw-space-xxl)] grid gap-[var(--mw-space-md)] md:grid-cols-2"
            delay={0.12}
          >
            {problemCards.map((card, index) => (
              <FeatureTile
                className="min-h-[260px]"
                description={card.description}
                key={card.title}
                label={card.label}
                title={card.title}
              >
                {index % 2 === 0 ? <DiagramBars /> : <DiagramLines />}
              </FeatureTile>
            ))}
          </LiquidReveal>
        </section>

        <section
          className="mw-section-frame relative z-10 py-[var(--mw-space-section)] lg:py-[var(--mw-space-section-lg)]"
          id="features"
        >
          <div className="mw-section">
            <SectionHeader
              eyebrow="Solution architecture"
              title="A calmer study workspace with source-aware answers."
              description="The product is intentionally narrow today so the answer flow can be reliable before broader subject expansion."
            />

            <LiquidReveal
              className="mt-[var(--mw-space-xxl)] grid gap-[var(--mw-space-md)] md:grid-cols-2 lg:grid-cols-3"
              delay={0.12}
            >
              {solutionCards.map((card) => (
                <FeatureTile
                  className="min-h-[230px]"
                  description={card.description}
                  key={card.title}
                  label={card.label}
                  title={card.title}
                />
              ))}
            </LiquidReveal>
          </div>
        </section>

        <section className="mw-section relative z-10 py-[var(--mw-space-section)] lg:py-[var(--mw-space-section-lg)]">
          <div className="grid gap-[var(--mw-space-xxl)] lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <SectionHeader
              eyebrow="How it works"
              title="Three steps from doubt to structured revision."
              description="Open the workspace, ask naturally, and review an answer shaped for exam preparation with the source trail kept visible."
            />

            <div className="mw-slab grid gap-0">
              {flowSteps.map((item) => (
                <article
                  className="grid gap-[var(--mw-space-md)] border-b border-[var(--mw-hairline)] p-[var(--mw-space-lg)] last:border-b-0 sm:grid-cols-[72px_1fr]"
                  key={item.step}
                >
                  <p className="mw-display text-4xl leading-none text-[var(--mw-accent-blue)]">
                    {item.step}
                  </p>
                  <div>
                    <h3 className="mw-heading-sm">{item.title}</h3>
                    <p className="mw-meta mt-[var(--mw-space-sm)]">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mw-section relative z-10 py-[var(--mw-space-section)] lg:py-[var(--mw-space-section-lg)]">
          <SectionHeader
            align="center"
            eyebrow="Answer modes"
            title="Choose the shape of the answer before you study."
            description="The same source-grounded question can become a quick recall note or a more elaborate exam-oriented response."
          />

          <div className="mt-[var(--mw-space-xxl)] grid gap-[var(--mw-space-md)] md:grid-cols-2 lg:grid-cols-4">
            {answerModes.map((mode) => (
              <article
                className="mw-panel flex min-h-[220px] flex-col justify-between p-[var(--mw-space-lg)]"
                key={mode.mode}
              >
                <p className="mw-label">{mode.mode}</p>
                <p className="mt-[var(--mw-space-xl)] text-[length:var(--mw-type-body)] leading-[1.5] text-[var(--mw-ink)]">
                  {mode.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mw-section-frame relative z-10 py-[var(--mw-space-section)] lg:py-[var(--mw-space-section-lg)]">
          <div className="mw-section">
            <div className="mx-auto max-w-[860px] text-center">
              <p className="mw-label">Private beta</p>
              <h2 className="mw-display-section mx-auto mt-[var(--mw-space-md)] max-w-[760px]">
                Start studying with clarity.
              </h2>
              <p className="mx-auto mt-[var(--mw-space-lg)] max-w-[680px] text-[length:var(--mw-type-body)] leading-[1.6] text-[var(--mw-body)]">
                Ask syllabus-grounded questions, choose the answer depth you
                need, and revise from structured explanations built around
                reviewed ModuleWyse notes.
              </p>
              <LandingAuthActions className="mt-[var(--mw-space-xl)]" />
              <p className="mw-meta mx-auto mt-[var(--mw-space-lg)] max-w-[520px]">
                Private beta currently starts with selected reviewed KTU
                content.
              </p>
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-[var(--mw-hairline)] bg-[var(--mw-canvas)]">
          <div className="mw-section grid gap-[var(--mw-space-xl)] py-[var(--mw-space-xl)] text-[length:var(--mw-type-link)] leading-[1.5] text-[var(--mw-body)] lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mw-heading-sm text-[var(--mw-ink)]">ModuleWyse</p>
              <p className="mt-[var(--mw-space-sm)] max-w-[560px]">
                A private beta study workspace for source-grounded KTU exam
                preparation. Not an official KTU service.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[var(--mw-muted)]">
              <p className="text-[var(--mw-body)]">(c) 2026 ModuleWyse / student beta</p>
              <Link className="text-[var(--mw-ink)] transition-colors hover:text-[var(--mw-body)]" href="/privacy">
                Privacy
              </Link>
              <Link className="text-[var(--mw-ink)] transition-colors hover:text-[var(--mw-body)]" href="/terms">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
