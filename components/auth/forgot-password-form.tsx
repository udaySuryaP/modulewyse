"use client";

import Link from "next/link";
import { useState } from "react";

import { Field, TextInput } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import { ToastNotice, type ToastPriority } from "@/components/ui/toast-notice";
import { env, hasSupabasePublicEnv } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/client";

type AuthToast = {
  description?: string;
  priority: ToastPriority;
  title: string;
};

function isValidEmail(value: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

function passwordResetRedirectUrl() {
  const url = new URL("/auth/callback", env.NEXT_PUBLIC_APP_URL);
  url.searchParams.set("next", "/reset-password");
  return url.toString();
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<AuthToast | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setToast(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setToast({
        description: "Enter the email address linked to your account.",
        priority: "error",
        title: "Email is required",
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
        description: "Password reset is temporarily unavailable.",
        priority: "warning",
        title: "Supabase is not configured yet",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        {
          redirectTo: passwordResetRedirectUrl(),
        },
      );

      if (error) {
        setToast({
          description: "Please try again in a moment.",
          priority: "error",
          title: "Unable to send reset link",
        });
        return;
      }

      setToast({
        description:
          "If an account exists for that email, a reset link has been sent. The link expires in 10 minutes.",
        priority: "success",
        title: "Check your email",
      });
    } catch {
      setToast({
        description: "Please try again in a moment.",
        priority: "error",
        title: "Unable to send reset link",
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
            Reset your password.
          </h1>
          <p className="mw-meta mt-[var(--mw-space-sm)]">
            Enter your email and we&apos;ll send a secure password reset link.
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

        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </SubmitButton>

        <p className="text-center text-[14px] text-[var(--mw-muted)]">
          Remembered it?{" "}
          <Link
            className="text-[var(--mw-ink)] underline-offset-4 hover:underline"
            href="/login"
          >
            Back to login
          </Link>
        </p>
      </form>
    </>
  );
}
