"use client";

import {
  BookOpen,
  CalendarDays,
  Clock,
  Library,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/subjects", icon: BookOpen, label: "Subjects" },
  { href: "/library", icon: Library, label: "Library" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

type StudentSidebarProps = {
  children?: React.ReactNode;
  className?: string;
  expanded: boolean;
  onToggle: () => void;
};

export function StudentSidebar({
  children,
  className,
  expanded,
  onToggle,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  useEffect(() => {
    function updateDateTime() {
      const now = new Date();
      const day = new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(now);
      const time = new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);

      setDateTime({ date: day, time });
    }

    updateDateTime();
    const interval = window.setInterval(updateDateTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <aside
      className={cn(
        "sticky top-0 z-20 flex h-dvh shrink-0 flex-col border-r border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] px-2 py-4 transition-[width] duration-300 sm:px-3 sm:py-5",
        expanded ? "w-[60px] sm:w-[72px] lg:w-[228px]" : "w-[60px] sm:w-[72px]",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          expanded ? "justify-center lg:justify-between" : "justify-center",
        )}
      >
        <Link
          className={cn(
            "min-w-0 truncate font-medium leading-none tracking-[-0.03em] text-[var(--mw-ink)]",
            expanded
              ? "hidden text-[20px] lg:block"
              : "block text-[15px] sm:text-[16px]",
          )}
          href="/chat"
        >
          {expanded ? "modulewyse" : "mw"}
        </Link>
        <button
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className="hidden size-9 shrink-0 place-items-center mw-radius-pill border border-[var(--mw-hairline-strong)] bg-white text-[var(--mw-muted)] transition-colors hover:text-[var(--mw-ink)] lg:grid"
          onClick={onToggle}
          type="button"
        >
          {expanded ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </button>
      </div>

      <nav className="mt-8 grid gap-2 sm:mt-10" aria-label="Student dashboard">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              className={cn(
                "flex h-10 items-center justify-center mw-radius-pill border border-transparent px-0 text-[13px] font-medium text-[var(--mw-body)] transition-colors hover:bg-[var(--mw-surface-strong)] hover:text-[var(--mw-ink)] sm:h-11",
                "lg:gap-3",
                expanded && "lg:justify-start lg:px-3",
                isActive && "border-[var(--mw-hairline-strong)] bg-white text-[var(--mw-ink)]",
              )}
              href={item.href}
              key={item.href}
              title={item.label}
            >
              <Icon className="size-4 shrink-0" />
              {expanded ? <span className="hidden lg:inline">{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      {expanded && children ? (
        <div className="mt-6 hidden min-w-0 lg:block">{children}</div>
      ) : null}

      <div className="mt-auto hidden text-[11px] font-medium uppercase leading-[1.5] tracking-[0.08em] text-[var(--mw-muted)] lg:block">
        {expanded ? (
          <p className="grid gap-1.5">
            <span className="flex items-center gap-2">
              <Clock className="size-3.5 shrink-0" />
              <span>{dateTime.time}</span>
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="size-3.5 shrink-0" />
              <span>{dateTime.date}</span>
            </span>
          </p>
        ) : null}
      </div>
    </aside>
  );
}
