import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      body="We will email a secure link that lets you create a new password. The reset link expires in 10 minutes."
      eyebrow="Account recovery"
      title="Reset access."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
