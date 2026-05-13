import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      body="Create your student account and open the ModuleWyse dashboard."
      eyebrow="Student access"
      title="Start with ModuleWyse."
    >
      <SignupForm />
    </AuthShell>
  );
}
