import type { Profile } from "@/lib/auth/types";

export function safeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return null;
  }

  return next;
}

export function redirectAfterAuth(profile: Profile | null, next?: string | null) {
  if (!profile?.onboarding_completed) {
    return "/onboarding/academic-profile";
  }

  return safeNextPath(next ?? null) ?? "/chat";
}

export function loginUrlWithNext(pathname: string, search = "") {
  return `/login?next=${encodeURIComponent(`${pathname}${search}`)}`;
}
