"use client";

import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

export type ToastPriority = "info" | "success" | "warning" | "error";

const toastStyles: Record<
  ToastPriority,
  {
    icon: ComponentType<{ className?: string; strokeWidth?: number }>;
    iconColor: string;
    iconSurface: string;
    label: string;
  }
> = {
  error: {
    icon: AlertCircle,
    iconColor: "text-[var(--mw-semantic-danger)]",
    iconSurface: "bg-[#fff1f1]",
    label: "Error",
  },
  info: {
    icon: Info,
    iconColor: "text-[var(--mw-primary)]",
    iconSurface: "bg-[var(--mw-accent-blue-soft)]",
    label: "Information",
  },
  success: {
    icon: CheckCircle2,
    iconColor: "text-[var(--mw-semantic-success)]",
    iconSurface: "bg-[#eefbf5]",
    label: "Success",
  },
  warning: {
    icon: TriangleAlert,
    iconColor: "text-[var(--mw-semantic-warning)]",
    iconSurface: "bg-[#fff7e8]",
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
      className="pointer-events-none fixed inset-x-[var(--mw-space-md)] top-[var(--mw-space-md)] z-[90] flex justify-center md:inset-x-auto md:bottom-[var(--mw-space-lg)] md:right-[var(--mw-space-lg)] md:top-auto"
      role={role}
    >
      <div className="pointer-events-auto flex w-full max-w-[510px] items-start gap-[var(--mw-space-md)] mw-radius-card border border-[var(--mw-hairline-strong)] bg-white px-[var(--mw-space-lg)] py-[var(--mw-space-md)] text-[var(--mw-ink)] shadow-[0_22px_70px_rgba(10,11,13,0.16)] md:w-[510px]">
        <span
          className={cn(
            "mt-0.5 grid size-7 shrink-0 place-items-center mw-radius-input",
            style.iconColor,
            style.iconSurface,
          )}
        >
          <Icon className="size-4" strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[15px] font-semibold leading-[1.3] tracking-[-0.01em]">
            {title}
          </p>
          {description ? (
            <p className="mt-1 text-[14px] font-normal leading-[1.45] text-[var(--mw-muted)]">
              {description}
            </p>
          ) : null}
          <span className="sr-only">{style.label}</span>
          {onDismiss ? (
            <button
              className="mt-[var(--mw-space-sm)] text-[14px] font-semibold leading-none text-[var(--mw-muted)] transition-colors hover:text-[var(--mw-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mw-ink)]/20"
              onClick={onDismiss}
              type="button"
            >
              Dismiss
            </button>
          ) : null}
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
