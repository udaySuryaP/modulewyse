import { LandingNavigation } from "@/components/landing/landing-navigation";
import { PageOverlay } from "@/components/landing/page-overlay";
import { StatusBadge } from "@/components/landing/status-badge";
import { VideoBackground } from "@/components/landing/video-background";

const subjects = [
  ["Object Oriented Programming", "available"],
  ["DBMS", "beta"],
  ["Operating Systems", "coming soon"],
  ["Computer Networks", "coming soon"],
  ["Data Structures", "coming soon"],
] as const;

export default function SubjectsPage() {
  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="min-h-dvh">
        <LandingNavigation />
        <section className="mx-auto w-full px-5 py-16 sm:px-8 lg:px-14">
          <div className="rounded-[12px] border border-white/18 bg-white/12 p-6 backdrop-blur-[28px] sm:p-8">
            <p className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
              Subjects
            </p>
            <h1 className="mt-4 text-[36px] font-normal leading-[1.1] tracking-[-0.03em] text-white">
              Browse available and upcoming ModuleWyse subjects.
            </h1>
            <p className="mt-4 max-w-[760px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
              Start with available subjects and see what is currently in beta
              or coming soon.
            </p>

            <div className="mt-8 grid gap-3">
              {subjects.map(([name, status]) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-[12px] border border-white/12 bg-white/8 px-4 py-3"
                  key={name}
                >
                  <span className="text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
                    {name}
                  </span>
                  <StatusBadge status={status} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
