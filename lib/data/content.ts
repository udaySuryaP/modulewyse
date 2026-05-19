import { hasSupabasePublicEnv } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";
import type { ContentChunk, ContentSource } from "@/types/database";

export async function getReadyContentSourcesBySubject(subjectSlug: string) {
  if (!hasSupabasePublicEnv()) {
    return [] as ContentSource[];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_sources")
    .select("*, subjects!inner(slug)")
    .eq("status", "ready")
    .eq("subjects.slug", subjectSlug)
    .order("created_at", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as unknown as ContentSource[];
}

export async function getReadyChunksBySubjectModule(
  subjectSlug: string,
  moduleNumber: number,
) {
  if (!hasSupabasePublicEnv()) {
    return [] as ContentChunk[];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_chunks")
    .select("*, subjects!inner(slug), modules!inner(module_number)")
    .eq("status", "ready")
    .eq("subjects.slug", subjectSlug)
    .eq("modules.module_number", moduleNumber)
    .order("chunk_index", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as unknown as ContentChunk[];
}

export async function getReadyChunksByTopic(topicId: string) {
  if (!hasSupabasePublicEnv()) {
    return [] as ContentChunk[];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_chunks")
    .select("*")
    .eq("status", "ready")
    .eq("topic_id", topicId)
    .order("chunk_index", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as ContentChunk[];
}
