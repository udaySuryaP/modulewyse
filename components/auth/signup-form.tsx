"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Field, TextInput } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import { ToastNotice, type ToastPriority } from "@/components/ui/toast-notice";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { env, hasSupabasePublicEnv } from "@/lib/env/public";
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

function authErrorMessage(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("already") || lowerMessage.includes("registered")) {
    return "An account with this email already exists.";
  }

  if (lowerMessage.includes("password")) {
    return "Use at least 8 characters.";
  }

  if (lowerMessage.includes("rate limit")) {
    return "Too many emails were sent. Please wait and try again.";
  }

  return "Unable to connect. Please try again.";
}

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState<AuthToast | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setToast(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!fullName.trim()) {
      setToast({
        description: "Add your name before creating the account.",
        priority: "error",
        title: "Full name is required",
      });
      return;
    }

    if (!normalizedEmail) {
      setToast({
        description: "Use the email address you want to use for ModuleWyse.",
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

    if (password.length < 8) {
      setToast({
        description: "Create a password with at least 8 characters.",
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
        description: "Account creation is temporarily unavailable.",
        priority: "warning",
        title: "Supabase is not configured yet",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (error) {
        setToast({
          description: authErrorMessage(error.message),
          priority: "error",
          title: "Could not create account",
        });
        return;
      }

      if (data.session && data.user) {
        await ensureProfile(supabase, data.user);
        const pendingQuestion = readPendingQuestion();
        router.replace(
          pendingDestinationRoute() ??
            (pendingQuestion ? chatHrefWithQuestion(pendingQuestion) : "/chat"),
        );
        router.refresh();
        return;
      }

      setToast({
        description: "Confirm your account from the email link, then sign in to continue.",
        priority: "success",
        title: "Check your email",
      });
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

      <form className="grid gap-3 sm:gap-4" noValidate onSubmit={handleSubmit}>
      <div className="mb-1">
        <h1 className="mw-heading-sm text-[var(--mw-ink)]">
          Get started
        </h1>
        <p className="mw-meta mt-[var(--mw-space-sm)]">
          Create your ModuleWyse account and start learning from syllabus-grounded notes.
        </p>
      </div>

      <Field label="Full name">
        <TextInput
          autoComplete="name"
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Enter your full name"
          required
          value={fullName}
        />
      </Field>
      <Field label="Email">
        <TextInput
          autoComplete="email"
          inputMode="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          required
          type="text"
          value={email}
        />
      </Field>
      <Field label="Password">
        <TextInput
          autoComplete="new-password"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
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
          placeholder="Confirm your password"
          required
          type="password"
          value={confirmPassword}
        />
      </Field>

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Account"}
      </SubmitButton>

      <p className="mw-meta text-center">
        Already have an account?{" "}
        <Link className="text-[var(--mw-ink)] underline-offset-4 hover:underline" href="/login">
          Login
        </Link>
      </p>
      </form>
    </>
  );
}
