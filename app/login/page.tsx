import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      body="Sign in to continue to your ModuleWyse dashboard and restore any pending question from the landing page."
      eyebrow="Welcome back"
      title="Return to exam prep."
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
