"use client";

import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

export type ToastPriority = "info" | "success" | "warning" | "error";

const toastStyles: Record<
  ToastPriority,
  {
    accent: string;
    icon: ComponentType<{ className?: string; strokeWidth?: number }>;
    label: string;
  }
> = {
  error: {
    accent: "border-l-[var(--mw-semantic-danger)]",
    icon: AlertCircle,
    label: "Error",
  },
  info: {
    accent: "border-l-[var(--mw-primary)]",
    icon: Info,
    label: "Information",
  },
  success: {
    accent: "border-l-[var(--mw-semantic-success)]",
    icon: CheckCircle2,
    label: "Success",
  },
  warning: {
    accent: "border-l-[var(--mw-semantic-warning)]",
    icon: TriangleAlert,
    label: "Warning",
  },
};

export function ToastNotice({
  description,
  onDismiss,
  priority,
  title,
}: {
  description?: string;
  onDismiss?: () => void;
  priority: ToastPriority;
  title: string;
}) {
  const style = toastStyles[priority];
  const Icon = style.icon;
  const role = priority === "error" || priority === "warning" ? "alert" : "status";

  return (
    <div
      aria-live={role === "alert" ? "assertive" : "polite"}
      className="pointer-events-none fixed inset-x-[var(--mw-space-md)] top-[var(--mw-space-md)] z-[90] flex justify-center sm:inset-x-[var(--mw-space-lg)] sm:justify-end"
      role={role}
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-[430px] items-start gap-[var(--mw-space-md)] mw-radius-card border border-l-4 border-[var(--mw-hairline)] bg-white px-[var(--mw-space-md)] py-[var(--mw-space-sm)] text-[var(--mw-ink)] shadow-[0_18px_60px_rgba(10,11,13,0.12)]",
          style.accent,
        )}
      >
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center mw-radius-pill bg-[var(--mw-canvas)] text-[var(--mw-ink)]">
          <Icon className="size-4" strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-[1.3] tracking-[-0.01em]">
            {title}
          </p>
          {description ? (
            <p className="mt-1 text-[12px] font-normal leading-[1.45] text-[var(--mw-body)]">
              {description}
            </p>
          ) : null}
          <span className="sr-only">{style.label}</span>
        </div>
        {onDismiss ? (
          <button
            aria-label="Dismiss notification"
            className="grid size-8 shrink-0 place-items-center mw-radius-pill text-[var(--mw-muted)] transition-colors hover:bg-[var(--mw-canvas)] hover:text-[var(--mw-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mw-ink)]/20"
            onClick={onDismiss}
            type="button"
          >
            <X className="size-4" strokeWidth={1.8} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
