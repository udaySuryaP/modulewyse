"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { GlassButton } from "@/components/landing/glass-button";
import { ROUTES } from "@/lib/constants";
import { nextRouteForAuthAction } from "@/lib/landing-flow";
import { cn } from "@/lib/utils";

type LandingAuthActionsProps = {
  className?: string;
  inverse?: boolean;
};

export function LandingAuthActions({
  className,
  inverse = false,
}: LandingAuthActionsProps) {
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
    <div
      className={cn(
        "mx-auto flex w-full max-w-[390px] flex-col items-center justify-center gap-[var(--mw-space-sm)] sm:w-auto sm:max-w-none sm:flex-row",
        className,
      )}
    >
      <GlassButton
        className={cn(
          "w-full min-w-[168px] sm:w-auto",
          inverse && "bg-white text-[var(--mw-navy)] hover:bg-white/90",
        )}
        onClick={() => handleAuthAction(ROUTES.SIGNUP)}
      >
        Get Started
      </GlassButton>
      <GlassButton
        className={cn(
          "w-full min-w-[168px] sm:w-auto",
          inverse &&
            "border-white/25 bg-transparent text-white hover:bg-white/10",
        )}
        onClick={() => handleAuthAction(ROUTES.LOGIN)}
        variant="secondary"
      >
        Login
      </GlassButton>
    </div>
  );
}
