import { createClient } from "@/lib/supabase/server";
import type { Module, Subject, SubjectWithModules } from "@/types/database";

const visibleSubjectStatuses = ["available", "beta", "coming-soon"] as const;

export async function getSubjects(): Promise<Subject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .in("status", visibleSubjectStatuses)
    .order("semester", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Subject[];
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", slug)
    .in("status", visibleSubjectStatuses)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Subject | null) ?? null;
}

export async function getSubjectModules(subjectId: string): Promise<Module[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("subject_id", subjectId)
    .order("module_number", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Module[];
}

export async function getSubjectWithModules(
  slug: string,
): Promise<SubjectWithModules | null> {
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    return null;
  }

  const modules = await getSubjectModules(subject.id);

  return {
    ...subject,
    modules,
  };
}
