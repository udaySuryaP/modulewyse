"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GlassButton } from "@/components/landing/glass-button";
import { ROUTES } from "@/lib/constants";
import { nextRouteForAuthAction } from "@/lib/landing-flow";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "/subjects", label: "Subjects" },
  { href: "/library", label: "Library" },
  { href: "#about", label: "About" },
];

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
    <header className="relative z-10 mx-auto w-full max-w-[1200px] px-[var(--mw-space-lg)] py-[var(--mw-space-lg)] lg:px-[var(--mw-space-xxl)]">
      <div className="mw-panel flex items-center justify-between gap-[var(--mw-space-md)] px-[var(--mw-space-md)] py-[var(--mw-space-sm)]">
        <Link className="mw-wordmark" href={ROUTES.HOME}>
          ModuleWyse
        </Link>

        <nav
          aria-label="Landing sections"
          className="hidden items-center gap-[var(--mw-space-lg)] lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              className="text-[length:var(--mw-type-link)] font-medium leading-none text-[var(--mw-body)] transition-colors hover:text-[var(--mw-ink)]"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
          <GlassButton
            className="hidden sm:inline-flex"
            onClick={() => handleAuthAction(ROUTES.LOGIN)}
            variant="secondary"
          >
            Login
          </GlassButton>
          <GlassButton
            className="px-[var(--mw-space-md)] text-[length:var(--mw-type-link)] sm:px-[var(--mw-space-lg)]"
            onClick={() => handleAuthAction(ROUTES.SIGNUP)}
          >
            Get Started
          </GlassButton>
        </nav>
      </div>
    </header>
  );
}
