import { NextResponse, type NextRequest } from "next/server";

import { loginUrlWithNext } from "@/lib/auth/redirects";
import { hasSupabasePublicEnv } from "@/lib/env/public";
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

function redirect(
  request: NextRequest,
  pathname: string,
  cookieSource?: NextResponse,
) {
  const response = NextResponse.redirect(new URL(pathname, request.url));

  cookieSource?.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!hasSupabasePublicEnv()) {
    return NextResponse.next();
  }

  const isPublic = publicRoutes.has(pathname);
  const isOnboarding = onboardingRoutes.has(pathname);
  const isProtected = isProtectedRoute(pathname);
  const shouldCheckSession =
    isProtected ||
    isOnboarding ||
    pathname === "/login" ||
    pathname === "/signup";

  if (!shouldCheckSession) {
    return NextResponse.next();
  }

  const { supabase, getResponse } = createMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isProtected || isOnboarding) {
      return redirect(request, loginUrlWithNext(pathname, search), getResponse());
    }

    return getResponse();
  }

  if ((pathname === "/login" || pathname === "/signup") && user) {
    return redirect(request, "/chat", getResponse());
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
