import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      body="Enter your email and ModuleWyse will send a secure password reset link."
      eyebrow="Account recovery"
      title="Reset access safely."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
