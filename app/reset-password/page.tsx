import { cookies } from "next/headers";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  const hasRecoveryIntent =
    cookieStore.get("modulewyse.recovery")?.value === "1";

  return (
    <AuthShell showHeader={false}>
      <ResetPasswordForm hasRecoveryIntent={hasRecoveryIntent} />
    </AuthShell>
  );
}
