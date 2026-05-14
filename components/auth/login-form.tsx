"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Field, FormMessage, TextInput } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { safeNextPath } from "@/lib/auth/redirects";
import { hasSupabasePublicEnv } from "@/lib/env/public";
import {
  chatHrefWithQuestion,
  pendingDestinationRoute,
  readPendingQuestion,
} from "@/lib/landing-flow";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const callbackError = searchParams.get("error") === "callback";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice] = useState(
    callbackError
      ? "Unable to complete sign in. Please try again."
      : next
        ? "Sign in to continue."
        : "",
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!hasSupabasePublicEnv()) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        setMessage("Invalid email or password.");
        return;
      }

      await ensureProfile(supabase, data.user);

      const pendingQuestion = readPendingQuestion();
      router.push(
        pendingDestinationRoute() ??
          (pendingQuestion
            ? chatHrefWithQuestion(pendingQuestion)
            : next ?? "/chat"),
      );
      router.refresh();
    } catch {
      setMessage("Unable to connect. Please try again.");
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

      {notice && !message ? (
        <FormMessage tone={callbackError ? "error" : "muted"}>
          {notice}
        </FormMessage>
      ) : null}
      {message ? <FormMessage>{message}</FormMessage> : null}

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Signing In..." : "Login"}
      </SubmitButton>

      <div className="grid gap-2 text-center text-[14px] text-white/55">
        <Link
          className="text-white underline-offset-4 hover:underline"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
        <p>
          New to ModuleWyse?{" "}
          <Link
            className="text-white underline-offset-4 hover:underline"
            href="/signup"
          >
            Get started
          </Link>
        </p>
      </div>
    </form>
  );
}
