"use client";

import { useState } from "react";

import { PageOverlay } from "@/components/landing/page-overlay";
import { VideoBackground } from "@/components/landing/video-background";
import { StudentSidebar } from "@/components/dashboard/student-sidebar";

type StudentPageShellProps = {
  children: React.ReactNode;
};

export function StudentPageShell({ children }: StudentPageShellProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches,
  );

  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="flex min-h-dvh text-white">
        <StudentSidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((current) => !current)}
        />

        <section className="min-w-0 flex-1 px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </section>
      </main>
    </>
  );
}
