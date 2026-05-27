"use client";

import { useState } from "react";

import { Field, FormMessage, TextInput } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import { cn } from "@/lib/utils";

type AppFeedbackFormProps = {
  defaultReplyEmail: string;
};

export function AppFeedbackForm({ defaultReplyEmail }: AppFeedbackFormProps) {
  const [subject, setSubject] = useState("");
  const [feedback, setFeedback] = useState("");
  const [replyEmail, setReplyEmail] = useState(defaultReplyEmail);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "success">("success");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const trimmedSubject = subject.trim();
    const trimmedFeedback = feedback.trim();
    const trimmedEmail = replyEmail.trim();

    if (trimmedSubject.length < 3) {
      setMessageTone("error");
      setMessage("Add a short subject for your feedback.");
      return;
    }

    if (trimmedFeedback.length < 10) {
      setMessageTone("error");
      setMessage("Write a little more detail so we can understand the issue.");
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      setMessageTone("error");
      setMessage("Enter a valid reply email.");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/feedback", {
        body: JSON.stringify({
          feedback: trimmedFeedback,
          replyEmail: trimmedEmail,
          subject: trimmedSubject,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not send feedback.");
      }

      setSubject("");
      setFeedback("");
      setMessageTone("success");
      setMessage("Feedback sent. Thank you for helping improve ModuleWyse.");
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not send feedback. Try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Subject">
          <TextInput
            className="w-full"
            maxLength={120}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="What is this about?"
            value={subject}
          />
        </Field>

        <Field label="Reply email">
          <TextInput
            className="w-full"
            inputMode="email"
            maxLength={254}
            onChange={(event) => setReplyEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            value={replyEmail}
          />
        </Field>
      </div>

      <Field label="Feedback">
        <textarea
          className={cn(
            "mw-input min-h-32 w-full resize-y px-4 py-3 text-[15px] font-normal leading-[1.55]",
            "sm:min-h-36 sm:text-[16px]",
          )}
          maxLength={4000}
          onChange={(event) => setFeedback(event.target.value)}
          placeholder="Tell us what worked, what felt confusing, or what you want improved."
          value={feedback}
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] leading-[1.45] text-[var(--mw-muted)]">
          We use this to improve the product and reply if needed.
        </p>
        <SubmitButton className="sm:w-auto sm:px-6" disabled={isSending}>
          {isSending ? "Sending..." : "Send feedback"}
        </SubmitButton>
      </div>

      {message ? <FormMessage tone={messageTone}>{message}</FormMessage> : null}
    </form>
  );
}
