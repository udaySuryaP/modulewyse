import { createClient } from "@/lib/supabase/server";

export type StudentActivityStats = {
  answersGenerated: number;
  conversations: number;
  feedbackGiven: number;
  questionsAsked: number;
  subjectsUsed: number;
};

const emptyStats: StudentActivityStats = {
  answersGenerated: 0,
  conversations: 0,
  feedbackGiven: 0,
  questionsAsked: 0,
  subjectsUsed: 0,
};

async function exactCount(
  query: PromiseLike<{ count: number | null; error: unknown }>,
) {
  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function getStudentActivityStats(
  userId: string,
): Promise<StudentActivityStats> {
  try {
    const supabase = await createClient();

    const [
      conversations,
      questionsAsked,
      answersGenerated,
      feedbackGiven,
      subjectRows,
    ] = await Promise.all([
      exactCount(
        supabase
          .from("conversations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
      ),
      exactCount(
        supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("role", "user"),
      ),
      exactCount(
        supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("role", "assistant"),
      ),
      exactCount(
        supabase
          .from("message_feedback")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
      ),
      supabase
        .from("conversations")
        .select("subject_slug")
        .eq("user_id", userId)
        .not("subject_slug", "is", null),
    ]);

    if (subjectRows.error) {
      throw subjectRows.error;
    }

    const subjectsUsed = new Set(
      (subjectRows.data ?? [])
        .map((row) => row.subject_slug)
        .filter((subject): subject is string => Boolean(subject)),
    ).size;

    return {
      answersGenerated,
      conversations,
      feedbackGiven,
      questionsAsked,
      subjectsUsed,
    };
  } catch {
    return emptyStats;
  }
}
