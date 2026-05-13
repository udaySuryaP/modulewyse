"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const inputClassName =
  "h-10 rounded-[12px] border border-white/22 bg-white/10 px-4 text-[15px] font-normal text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] outline-none backdrop-blur-[18px] placeholder:text-white/45 focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/24 sm:h-12 sm:text-[16px]";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[14px] font-normal leading-[1.4] tracking-[-0.01em] text-white/72">
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
          className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-[12px] border border-white/14 bg-white/8 text-white/72 transition-colors hover:bg-white/14 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/24"
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
    <select
      className={cn(
        "h-10 rounded-[12px] border border-white/22 bg-white/10 px-4 text-[15px] font-normal text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] outline-none backdrop-blur-[18px] focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/24 sm:h-12 sm:text-[16px] [&>option]:bg-[#101111] [&>option]:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </select>
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
        tone === "error" && "text-red-200",
        tone === "success" && "text-[#A8F5A0]",
        tone === "muted" && "text-white/55",
      )}
    >
      {children}
    </p>
  );
}
