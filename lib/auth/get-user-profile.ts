import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      isOnboarded: false,
    };
  }

  const profile = await ensureProfile(supabase, user);

  return {
    user,
    profile,
    isOnboarded: Boolean(profile?.onboarding_completed),
  };
}
