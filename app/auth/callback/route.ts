import { NextResponse, type NextRequest } from "next/server";

import { ensureProfile } from "@/lib/auth/ensure-profile";
import { redirectAfterAuth, safeNextPath } from "@/lib/auth/redirects";
import { hasSupabasePublicEnv } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));

  if (!hasSupabasePublicEnv()) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL("/login?error=callback", request.url),
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await ensureProfile(supabase, user);
      return NextResponse.redirect(new URL(redirectAfterAuth(next), request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?error=callback", request.url));
}
