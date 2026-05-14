import { NextResponse, type NextRequest } from "next/server";

import { loginUrlWithNext } from "@/lib/auth/redirects";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

const publicRoutes = new Set([
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/auth/callback",
]);

const onboardingRoutes = new Set([
  "/onboarding/academic-profile",
  "/onboarding/branch",
  "/onboarding/semester",
  "/onboarding/final-setup",
]);

const protectedPrefixes = [
  "/chat",
  "/subjects",
  "/library",
  "/profile",
  "/settings",
];

function isProtectedRoute(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function redirect(request: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!hasSupabasePublicEnv()) {
    return NextResponse.next();
  }

  const { supabase, getResponse } = createMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublic = publicRoutes.has(pathname);
  const isOnboarding = onboardingRoutes.has(pathname);
  const isProtected = isProtectedRoute(pathname);

  if (!user) {
    if (isProtected || isOnboarding) {
      return redirect(request, loginUrlWithNext(pathname, search));
    }

    return getResponse();
  }

  if ((pathname === "/" || pathname === "/login" || pathname === "/signup") && user) {
    return redirect(request, "/chat");
  }

  if (isPublic || isOnboarding || isProtected) {
    return getResponse();
  }

  return getResponse();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|file.svg|globe.svg|next.svg|vercel.svg|window.svg).*)",
  ],
};
