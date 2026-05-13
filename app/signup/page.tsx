import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      body="Create your student account, then open the ModuleWyse dashboard. You can complete academic setup from chat."
      eyebrow="Student access"
      title="Start with ModuleWyse."
    >
      <SignupForm />
    </AuthShell>
  );
}
