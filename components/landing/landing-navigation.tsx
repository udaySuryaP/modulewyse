"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GlassButton } from "@/components/landing/glass-button";
import { ROUTES } from "@/lib/constants";
import { nextRouteForAuthAction } from "@/lib/landing-flow";

export function LandingNavigation() {
  const router = useRouter();
  const [isRouting, setIsRouting] = useState(false);

  async function handleAuthAction(fallbackRoute: "/login" | "/signup") {
    if (isRouting) {
      return;
    }

    setIsRouting(true);

    try {
      const route = await nextRouteForAuthAction(fallbackRoute);
      router.push(route);
    } finally {
      setIsRouting(false);
    }
  }

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
          onClick={() => handleAuthAction(ROUTES.LOGIN)}
          variant="secondary"
        >
          Login
        </GlassButton>
        <GlassButton
          className="px-4 text-[14px] sm:px-5 sm:text-[15px]"
          onClick={() => handleAuthAction(ROUTES.SIGNUP)}
        >
          Get Started
        </GlassButton>
      </nav>
    </header>
  );
}
