import Link from "next/link";

import { GlassButton } from "@/components/landing/glass-button";
import { ROUTES } from "@/lib/constants";

export function LandingNavigation() {
  return (
    <header className="relative z-10 flex w-full items-center justify-between px-5 py-4 sm:px-8 lg:px-14">
      <Link
        className="text-[20px] font-normal leading-none tracking-[-0.03em] text-white sm:text-[24px]"
        href={ROUTES.HOME}
      >
        ModuleWyse
      </Link>

      <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
        <GlassButton
          className="hidden h-10 px-3 text-[12px] sm:inline-flex sm:h-11 sm:px-5 sm:text-[14px]"
          href={ROUTES.LOGIN}
          variant="secondary"
        >
          Login
        </GlassButton>
        <GlassButton
          className="h-10 px-3 text-[12px] sm:h-11 sm:px-5 sm:text-[14px]"
          href={ROUTES.SIGNUP}
        >
          Get Started
        </GlassButton>
      </nav>
    </header>
  );
}
