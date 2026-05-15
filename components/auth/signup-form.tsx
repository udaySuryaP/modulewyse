"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Field, FormMessage, TextInput } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { env, hasSupabasePublicEnv } from "@/lib/env/public";
import {
  chatHrefWithQuestion,
  pendingDestinationRoute,
  readPendingQuestion,
} from "@/lib/landing-flow";
import { createClient } from "@/lib/supabase/client";

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
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess("");

    if (!fullName.trim()) {
      setMessage("Full name is required.");
      return;
    }

    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!hasSupabasePublicEnv()) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (error) {
        setMessage(authErrorMessage(error.message));
        return;
      }

      if (data.session && data.user) {
        await ensureProfile(supabase, data.user);
        const pendingQuestion = readPendingQuestion();
        router.push(
          pendingDestinationRoute() ??
            (pendingQuestion ? chatHrefWithQuestion(pendingQuestion) : "/chat"),
        );
        router.refresh();
        return;
      }

      setSuccess(
        "Check your email. Confirm your account, then sign in to continue.",
      );
    } catch {
      setMessage("Unable to connect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-3 sm:gap-4" onSubmit={handleSubmit}>
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

      {message ? <FormMessage>{message}</FormMessage> : null}
      {success ? <FormMessage tone="success">{success}</FormMessage> : null}

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Account"}
      </SubmitButton>

      <p className="text-center text-[14px] text-white/55">
        Already have an account?{" "}
        <Link className="text-white underline-offset-4 hover:underline" href="/login">
          Login
        </Link>
      </p>
    </form>
  );
}
