"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Field, TextInput } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import { ToastNotice, type ToastPriority } from "@/components/ui/toast-notice";
import { hasSupabasePublicEnv } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/client";

type AuthToast = {
  description?: string;
  priority: ToastPriority;
  title: string;
};

type RecoveryState = "checking" | "ready" | "expired";

function friendlyUpdateError(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("expired") || lowerMessage.includes("invalid")) {
    return "This reset link is invalid or has expired. Request a new password reset link to continue.";
  }

  if (lowerMessage.includes("password")) {
    return "Choose a password with at least 8 characters.";
  }

  return "Unable to update your password. Request a new reset link if this continues.";
}

export function ResetPasswordForm({
  hasRecoveryIntent,
}: {
  hasRecoveryIntent: boolean;
}) {
  const router = useRouter();
  const [recoveryState, setRecoveryState] =
    useState<RecoveryState>("checking");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState<AuthToast | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      if (!hasRecoveryIntent) {
        setRecoveryState("expired");
        return;
      }

      if (!hasSupabasePublicEnv()) {
        setRecoveryState("expired");
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!isMounted) {
          return;
        }

        if (error || !user) {
          setRecoveryState("expired");
          return;
        }

        setRecoveryEmail(user.email ?? "");
        setRecoveryState("ready");
      } catch {
        if (isMounted) {
          setRecoveryState("expired");
        }
      }
    }

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, [hasRecoveryIntent]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setToast(null);

    if (!password || !confirmPassword) {
      setToast({
        description: "Enter and confirm your new password.",
        priority: "error",
        title: "Password is required",
      });
      return;
    }

    if (password.length < 8) {
      setToast({
        description: "Choose a password with at least 8 characters.",
        priority: "error",
        title: "Password is too short",
      });
      return;
    }

    if (password !== confirmPassword) {
      setToast({
        description: "Re-enter the same password in both password fields.",
        priority: "error",
        title: "Passwords do not match",
      });
      return;
    }

    if (!hasSupabasePublicEnv()) {
      setToast({
        description: "Password reset is temporarily unavailable.",
        priority: "warning",
        title: "Supabase is not configured yet",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setToast({
          description: friendlyUpdateError(error.message),
          priority: "error",
          title: "Unable to update password",
        });
        return;
      }

      await supabase.auth.signOut();
      setPassword("");
      setConfirmPassword("");
      setToast({
        description: "Your password has been updated. Sign in again to continue.",
        priority: "success",
        title: "Password updated",
      });
      router.replace("/login?password=updated");
      router.refresh();
    } catch {
      setToast({
        description: "Check your connection and try again.",
        priority: "error",
        title: "Unable to connect",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (recoveryState === "checking") {
    return (
      <div className="grid gap-[var(--mw-space-md)] text-center">
        <h1 className="mw-heading-sm text-[var(--mw-ink)]">
          Checking reset link.
        </h1>
        <p className="mw-meta">
          Please wait while ModuleWyse verifies your password reset session.
        </p>
      </div>
    );
  }

  if (recoveryState === "expired") {
    return (
      <div className="grid gap-[var(--mw-space-md)] text-center">
        <h1 className="mw-heading-sm text-[var(--mw-ink)]">
          Reset link expired.
        </h1>
        <p className="mw-meta">
          This reset link is invalid or has expired. Request a new password
          reset link to continue.
        </p>
        <Link
          className="mw-pill-primary inline-flex h-11 items-center justify-center px-[var(--mw-space-lg)]"
          href="/forgot-password"
        >
          Request new link
        </Link>
        <Link
          className="text-center text-[14px] font-medium text-[var(--mw-muted)] underline-offset-4 hover:text-[var(--mw-ink)] hover:underline"
          href="/login"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      {toast ? (
        <ToastNotice
          description={toast.description}
          onDismiss={() => setToast(null)}
          priority={toast.priority}
          title={toast.title}
        />
      ) : null}

      <form className="grid gap-4" noValidate onSubmit={handleSubmit}>
        <div>
          <h1 className="mw-heading-sm text-[var(--mw-ink)]">
            Create a new password.
          </h1>
          <p className="mw-meta mt-[var(--mw-space-sm)]">
            Choose a new password for your ModuleWyse account.
          </p>
        </div>

        <div className="mw-panel-muted grid gap-1 px-[var(--mw-space-md)] py-[var(--mw-space-sm)]">
          <p className="mw-label text-[10px]">Recovery session</p>
          <p className="truncate text-[14px] font-semibold leading-[1.4] text-[var(--mw-ink)]">
            {recoveryEmail
              ? `Updating password for ${recoveryEmail}`
              : "Updating password for your ModuleWyse account"}
          </p>
          <p className="text-[12px] leading-[1.45] text-[var(--mw-muted)]">
            Reset links expire in 10 minutes.
          </p>
        </div>

        <Field label="New password">
          <TextInput
            autoComplete="new-password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a new password"
            required
            type="password"
            value={password}
          />
        </Field>

        <Field label="Confirm password">
          <TextInput
            autoComplete="new-password"
            minLength={8}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm your new password"
            required
            type="password"
            value={confirmPassword}
          />
        </Field>

        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Password"}
        </SubmitButton>

        <p className="text-center text-[14px] text-[var(--mw-muted)]">
          Need a new link?{" "}
          <Link
            className="text-[var(--mw-ink)] underline-offset-4 hover:underline"
            href="/forgot-password"
          >
            Request another reset
          </Link>
        </p>
      </form>
    </>
  );
}
