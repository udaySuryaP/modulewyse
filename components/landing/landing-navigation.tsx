"use client";

import Link from "next/link";

import { GlassButton } from "@/components/landing/glass-button";
import { ROUTES } from "@/lib/constants";

export function LandingNavigation() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 py-5 sm:px-8 lg:px-14">
      <Link
        className="text-[20px] font-medium leading-none tracking-[-0.03em] text-[var(--mw-ink)] sm:text-[24px]"
        href={ROUTES.HOME}
      >
        ModuleWyse
      </Link>

      <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
        <GlassButton
          className="hidden sm:inline-flex"
          href={ROUTES.LOGIN}
          variant="secondary"
        >
          Login
        </GlassButton>
        <GlassButton
          className="px-4 text-[14px] sm:px-5 sm:text-[15px]"
          href={ROUTES.SIGNUP}
        >
          Get Started
        </GlassButton>
      </nav>
    </header>
  );
}
