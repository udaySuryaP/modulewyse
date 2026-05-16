import { redirect } from "next/navigation";

import { getUserProfile } from "@/lib/auth/get-user-profile";

export default async function ProfilePage() {
  const { user } = await getUserProfile();

  if (!user) {
    redirect("/login?next=/profile");
  }

  redirect("/settings");
}
