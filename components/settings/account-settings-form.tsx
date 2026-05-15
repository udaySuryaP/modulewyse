"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Field, FormMessage, TextInput } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import type { Profile } from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/client";

type AccountSettingsFormProps = {
  profile: Profile;
};

export function AccountSettingsForm({ profile }: AccountSettingsFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "success">("error");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    setIsSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("id", profile.id);

      if (error) {
        throw error;
      }

      setMessageTone("success");
      setMessage("Account saved.");
      router.refresh();
    } catch {
      setMessageTone("error");
      setMessage("Could not save account settings. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Field label="Full name">
        <TextInput
          className="w-full"
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Your full name"
          value={fullName}
        />
      </Field>

      <Field label="Email">
        <TextInput
          className="w-full opacity-70"
          readOnly
          value={profile.email}
        />
      </Field>

      {message ? <FormMessage tone={messageTone}>{message}</FormMessage> : null}

      <SubmitButton disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Account"}
      </SubmitButton>
    </form>
  );
}
