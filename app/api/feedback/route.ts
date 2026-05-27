import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const maxSubjectLength = 120;
const maxFeedbackLength = 4000;
const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type FeedbackRequest = {
  feedback?: unknown;
  replyEmail?: unknown;
  subject?: unknown;
};

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function normalizedText(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function normalizedFeedback(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return errorResponse("Authentication required.", 401);
  }

  let payload: FeedbackRequest;

  try {
    payload = (await request.json()) as FeedbackRequest;
  } catch {
    return errorResponse("Invalid JSON request.", 400);
  }

  const subject = normalizedText(payload.subject);
  const feedback = normalizedFeedback(payload.feedback);
  const replyEmail = normalizedText(payload.replyEmail).toLowerCase();

  if (subject.length < 3) {
    return errorResponse("Subject must be at least 3 characters.", 400);
  }

  if (subject.length > maxSubjectLength) {
    return errorResponse("Subject must be 120 characters or fewer.", 400);
  }

  if (feedback.length < 10) {
    return errorResponse("Feedback must be at least 10 characters.", 400);
  }

  if (feedback.length > maxFeedbackLength) {
    return errorResponse("Feedback must be 4000 characters or fewer.", 400);
  }

  if (!emailPattern.test(replyEmail)) {
    return errorResponse("Enter a valid reply email.", 400);
  }

  const { data, error } = await supabase
    .from("app_feedback")
    .insert({
      feedback,
      metadata: {
        source: "settings",
        userAgent: request.headers.get("user-agent") ?? null,
      },
      reply_email: replyEmail,
      subject,
      user_id: user.id,
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("App feedback insert failed.");
    return errorResponse("Could not send feedback. Try again.", 500);
  }

  return NextResponse.json({
    feedbackId: data.id,
    createdAt: data.created_at,
    status: "received",
  });
}
