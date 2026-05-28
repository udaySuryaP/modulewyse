"use client";

import {
  BookOpen,
  CalendarDays,
  Clock,
  Library,
  Menu,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { PageOverlay } from "@/components/landing/page-overlay";
import { VideoBackground } from "@/components/landing/video-background";
import { StudentSidebar } from "@/components/dashboard/student-sidebar";

const mobileNavItems = [
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/subjects", icon: BookOpen, label: "Subjects" },
  { href: "/library", icon: Library, label: "Library" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

type StudentPageShellProps = {
  children: React.ReactNode;
};

export function StudentPageShell({ children }: StudentPageShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches,
  );

  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="min-h-dvh text-[var(--mw-ink)] md:flex">
        <MobileStudentTopbar
          isOpen={mobileMenuOpen}
          onToggle={() => setMobileMenuOpen((current) => !current)}
        />

        <StudentSidebar
          className="hidden md:flex"
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((current) => !current)}
        />

        <section className="min-w-0 flex-1 overflow-x-hidden px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </section>
      </main>
    </>
  );
}

function MobileStudentTopbar({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  useEffect(() => {
    function updateDateTime() {
      const now = new Date();
      const date = new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(now);
      const time = new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);

      setDateTime({ date, time });
    }

    updateDateTime();
    const interval = window.setInterval(updateDateTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--mw-hairline)] bg-white/95 px-3 py-3 text-[var(--mw-ink)] shadow-sm md:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link
          className="text-[20px] font-medium leading-none tracking-[-0.03em] text-[var(--mw-ink)]"
          href="/chat"
        >
          ModuleWyse
        </Link>
        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse menu" : "Expand menu"}
          className="grid size-10 place-items-center mw-radius-pill border border-[var(--mw-hairline-strong)] bg-white text-[var(--mw-ink)]"
          onClick={onToggle}
          type="button"
        >
          {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {isOpen ? (
        <div className="mt-4 grid gap-4">
          <nav className="grid gap-2" aria-label="Student dashboard mobile">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  className="flex h-10 items-center gap-3 mw-radius-pill border border-[var(--mw-hairline)] bg-white px-3 text-[13px] font-medium text-[var(--mw-body)]"
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="grid gap-1.5 text-[12px] font-medium uppercase leading-[1.5] tracking-[0.08em] text-[var(--mw-muted)]">
            <span className="flex items-center gap-2">
              <Clock className="size-3.5 shrink-0" />
              <span>{dateTime.time}</span>
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="size-3.5 shrink-0" />
              <span>{dateTime.date}</span>
            </span>
          </div>
        </div>
      ) : null}
    </header>
  );
}
