import { cookies } from "next/headers";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  const hasRecoveryIntent =
    cookieStore.get("modulewyse.recovery")?.value === "1";

  return (
    <AuthShell
      body="Use the secure recovery session from your email to create a new password."
      eyebrow="Account recovery"
      title="Create a new password."
    >
      <ResetPasswordForm hasRecoveryIntent={hasRecoveryIntent} />
    </AuthShell>
  );
}
