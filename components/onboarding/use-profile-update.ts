"use client";

import { useRouter } from "next/navigation";

import { ensureProfile } from "@/lib/auth/ensure-profile";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

export function useProfileUpdate() {
  const router = useRouter();

  async function updateProfile(values: Record<string, unknown>) {
    if (!hasSupabasePublicEnv()) {
      throw new Error("Supabase is not configured yet.");
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?next=/onboarding/academic-profile");
      throw new Error("Sign in to continue.");
    }

    await ensureProfile(supabase, user);

    const { error } = await supabase
      .from("profiles")
      .update(values)
      .eq("id", user.id);

    if (error) {
      throw error;
    }
  }

  return updateProfile;
}
