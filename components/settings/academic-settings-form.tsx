"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Field,
  FormMessage,
  SelectInput,
  TextInput,
} from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import type { Profile } from "@/lib/auth/types";
import { mockSubjects } from "@/lib/mock-subjects";
import { createClient } from "@/lib/supabase/client";

type AcademicSettingsFormProps = {
  profile: Profile;
};

const subjectOptions = mockSubjects.map((subject) => subject.name);

export function AcademicSettingsForm({ profile }: AcademicSettingsFormProps) {
  const router = useRouter();
  const [collegeName, setCollegeName] = useState(profile.college_name ?? "");
  const [graduationYear, setGraduationYear] = useState(
    profile.graduation_year ? String(profile.graduation_year) : "",
  );
  const [branch, setBranch] = useState(profile.branch ?? "");
  const [semester, setSemester] = useState(
    profile.semester ? String(profile.semester) : "",
  );
  const [focusSubject, setFocusSubject] = useState(
    profile.focus_subject ?? "Object Oriented Programming",
  );
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "success">("error");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const parsedGraduationYear = graduationYear.trim()
      ? Number(graduationYear)
      : null;
    const parsedSemester = semester ? Number(semester) : null;

    if (
      parsedGraduationYear !== null &&
      (!Number.isInteger(parsedGraduationYear) || parsedGraduationYear < 2020)
    ) {
      setMessageTone("error");
      setMessage("Enter a valid graduation year.");
      return;
    }

    if (
      parsedSemester !== null &&
      (!Number.isInteger(parsedSemester) ||
        parsedSemester < 1 ||
        parsedSemester > 8)
    ) {
      setMessageTone("error");
      setMessage("Choose a semester between S1 and S8.");
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          college_name: collegeName.trim() || null,
          graduation_year: parsedGraduationYear,
          branch: branch || null,
          semester: parsedSemester,
          focus_subject: focusSubject.trim() || null,
        })
        .eq("id", profile.id);

      if (error) {
        throw error;
      }

      setMessageTone("success");
      setMessage("Academic settings saved.");
      router.refresh();
    } catch {
      setMessageTone("error");
      setMessage("Could not save academic settings. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Field label="College name">
        <TextInput
          className="w-full"
          onChange={(event) => setCollegeName(event.target.value)}
          placeholder="Enter your college name"
          value={collegeName}
        />
      </Field>

      <Field label="Graduation year">
        <TextInput
          className="w-full"
          inputMode="numeric"
          max="2035"
          min="2020"
          onChange={(event) => setGraduationYear(event.target.value)}
          placeholder="2026"
          type="number"
          value={graduationYear}
        />
      </Field>

      <Field label="Branch">
        <SelectInput
          className="w-full"
          onChange={(event) => setBranch(event.target.value)}
          value={branch}
        >
          <option value="">Choose branch</option>
          <option value="CSE">Computer Science Engineering</option>
          {branch && branch !== "CSE" ? <option value={branch}>{branch}</option> : null}
          <option disabled>Other branches coming later</option>
        </SelectInput>
      </Field>

      <Field label="Semester">
        <SelectInput
          className="w-full"
          onChange={(event) => setSemester(event.target.value)}
          value={semester}
        >
          <option value="">Choose semester</option>
          {Array.from({ length: 8 }, (_, index) => index + 1).map((item) => (
            <option key={item} value={item}>
              S{item}
            </option>
          ))}
        </SelectInput>
      </Field>

      <Field label="Focus subject">
        <SelectInput
          className="w-full"
          onChange={(event) => setFocusSubject(event.target.value)}
          value={focusSubject}
        >
          {subjectOptions.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </SelectInput>
      </Field>

      {message ? <FormMessage tone={messageTone}>{message}</FormMessage> : null}

      <SubmitButton disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Academic"}
      </SubmitButton>
    </form>
  );
}
