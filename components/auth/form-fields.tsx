"use client";

import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const inputClassName =
  "mw-input h-10 px-4 text-[15px] font-normal sm:h-12 sm:text-[16px]";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[14px] font-normal leading-[1.4] text-[var(--mw-body)]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput({
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  if (isPassword) {
    return (
      <div className="relative">
        <input
          className={cn(inputClassName, "w-full pr-12", className)}
          type={showPassword ? "text" : "password"}
          {...props}
        />
        <button
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center mw-radius-pill border border-[var(--mw-hairline)] bg-[var(--mw-canvas)] text-[var(--mw-muted)] transition-colors hover:text-[var(--mw-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mw-ink)]/20"
          onClick={() => setShowPassword((current) => !current)}
          type="button"
        >
          {showPassword ? (
            <EyeOff className="size-4" strokeWidth={1.8} />
          ) : (
            <Eye className="size-4" strokeWidth={1.8} />
          )}
        </button>
      </div>
    );
  }

  return (
    <input
      className={cn(inputClassName, className)}
      type={type}
      {...props}
    />
  );
}

export function SelectInput({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select
        className={cn(
          "mw-input h-11 w-full min-w-0 appearance-none py-0 pl-4 pr-10 text-[14px] font-normal [&>option]:bg-white [&>option]:text-[var(--mw-ink)]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mw-muted)]"
      >
        <ChevronDown className="size-4" />
      </span>
    </span>
  );
}

export function FormMessage({
  children,
  tone = "error",
}: {
  children: React.ReactNode;
  tone?: "error" | "success" | "muted";
}) {
  return (
    <p
      className={cn(
        "text-center text-[14px] font-normal leading-[1.4] tracking-[-0.01em]",
        tone === "error" && "text-[var(--mw-ink)]",
        tone === "success" && "text-[var(--mw-ink)]",
        tone === "muted" && "text-[var(--mw-muted)]",
      )}
    >
      {children}
    </p>
  );
}
