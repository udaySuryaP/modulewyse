import { NextResponse, type NextRequest } from "next/server";

import { ensureProfile } from "@/lib/auth/ensure-profile";
import { redirectAfterAuth, safeNextPath } from "@/lib/auth/redirects";
import { hasSupabasePublicEnv } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const isRecoveryFlow =
    next === "/reset-password" ||
    requestUrl.searchParams.get("type") === "recovery" ||
    requestUrl.searchParams.get("flow") === "recovery";

  if (!hasSupabasePublicEnv()) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      if (isRecoveryFlow) {
        return NextResponse.redirect(
          new URL("/forgot-password?error=reset_link", request.url),
        );
      }

      return NextResponse.redirect(
        new URL("/login?error=callback", request.url),
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      if (isRecoveryFlow) {
        const response = NextResponse.redirect(
          new URL("/reset-password", request.url),
        );

        response.cookies.set("modulewyse.recovery", "1", {
          httpOnly: true,
          maxAge: 600,
          path: "/reset-password",
          sameSite: "lax",
          secure: requestUrl.protocol === "https:",
        });

        return response;
      }

      try {
        await ensureProfile(supabase, user);
        return NextResponse.redirect(
          new URL(redirectAfterAuth(next), request.url),
        );
      } catch {
        return NextResponse.redirect(
          new URL("/login?error=callback", request.url),
        );
      }
    }
  }

  if (isRecoveryFlow) {
    return NextResponse.redirect(
      new URL("/forgot-password?error=reset_link", request.url),
    );
  }

  return NextResponse.redirect(new URL("/login?error=callback", request.url));
}
