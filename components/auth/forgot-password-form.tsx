"use client";

import Link from "next/link";
import { useState } from "react";

import { Field, FormMessage, TextInput } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import { env, hasSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess("");

    if (!hasSupabasePublicEnv()) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/settings/account`,
      });

      if (error) {
        setMessage("Unable to send reset link. Please try again.");
        return;
      }

      setSuccess(
        "Check your email. We sent a password reset link if an account exists for this email.",
      );
    } catch {
      setMessage("Unable to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Field label="Email">
        <TextInput
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          required
          type="email"
          value={email}
        />
      </Field>

      {message ? <FormMessage>{message}</FormMessage> : null}
      {success ? <FormMessage tone="success">{success}</FormMessage> : null}

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </SubmitButton>

      <p className="text-center text-[14px] text-white/55">
        Remembered it?{" "}
        <Link className="text-white underline-offset-4 hover:underline" href="/login">
          Back to login
        </Link>
      </p>
    </form>
  );
}
