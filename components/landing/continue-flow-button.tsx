"use client";

import { useRouter } from "next/navigation";

import { GlassButton } from "@/components/landing/glass-button";
import { pendingDestinationRoute } from "@/lib/landing-flow";

type ContinueFlowButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export function ContinueFlowButton({
  children,
  className,
}: ContinueFlowButtonProps) {
  const router = useRouter();

  return (
    <GlassButton
      className={className}
      onClick={() => router.push(pendingDestinationRoute() ?? "/chat")}
    >
      {children}
    </GlassButton>
  );
}
