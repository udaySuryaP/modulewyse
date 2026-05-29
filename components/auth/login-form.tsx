"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Field, TextInput } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import { ToastNotice, type ToastPriority } from "@/components/ui/toast-notice";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { safeNextPath } from "@/lib/auth/redirects";
import { hasSupabasePublicEnv } from "@/lib/env/public";
import {
  chatHrefWithQuestion,
  pendingDestinationRoute,
  readPendingQuestion,
} from "@/lib/landing-flow";
import { createClient } from "@/lib/supabase/client";

type AuthToast = {
  description?: string;
  priority: ToastPriority;
  title: string;
};

function isValidEmail(value: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const callbackError = searchParams.get("error") === "callback";
  const passwordUpdated = searchParams.get("password") === "updated";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<AuthToast | null>(
    callbackError
      ? {
          description: "Please try signing in again.",
          priority: "error",
          title: "Unable to complete sign in",
        }
      : passwordUpdated
        ? {
            description: "Your password has been updated. Sign in with your new password.",
            priority: "success",
            title: "Password updated",
          }
      : next
        ? {
            description: "Sign in to continue to the requested page.",
            priority: "info",
            title: "Sign in required",
          }
        : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setToast(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setToast({
        description: "Enter both your email and password to continue.",
        priority: "error",
        title: "Missing sign-in details",
      });
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setToast({
        description: "Use a valid email address, for example name@example.com.",
        priority: "error",
        title: "Enter a valid email",
      });
      return;
    }

    if (!hasSupabasePublicEnv()) {
      setToast({
        description: "Authentication is temporarily unavailable.",
        priority: "warning",
        title: "Supabase is not configured yet",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error || !data.user) {
        setToast({
          description: "Check your credentials and try again.",
          priority: "error",
          title: "Invalid email or password",
        });
        return;
      }

      await ensureProfile(supabase, data.user);

      const pendingQuestion = readPendingQuestion();
      router.replace(
        pendingDestinationRoute() ??
          (pendingQuestion
            ? chatHrefWithQuestion(pendingQuestion)
            : next ?? "/chat"),
      );
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
          Sign in with email
        </h1>
        <p className="mw-meta mt-[var(--mw-space-sm)]">
          Continue to your ModuleWyse workspace using your registered email.
        </p>
      </div>

      <Field label="Email">
        <TextInput
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          required
          type="text"
          value={email}
        />
      </Field>
      <Field label="Password">
        <TextInput
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          required
          type="password"
          value={password}
        />
      </Field>

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Signing In..." : "Login"}
      </SubmitButton>

      <div className="mw-meta grid gap-[var(--mw-space-xs)] text-center">
        <Link
          className="text-[var(--mw-ink)] underline-offset-4 hover:underline"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
        <p>
          New to ModuleWyse?{" "}
          <Link
            className="text-[var(--mw-ink)] underline-offset-4 hover:underline"
            href="/signup"
          >
            Get started
          </Link>
        </p>
      </div>
      </form>
    </>
  );
}
