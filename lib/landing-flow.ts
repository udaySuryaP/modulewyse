import { hasSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

export const PENDING_QUESTION_KEY = "modulewyse.pendingQuestion";
export const PENDING_DESTINATION_KEY = "modulewyse.pendingDestination";

export type PendingDestination = "/chat" | "/subjects";

export function savePendingQuestion(question: string) {
  if (typeof window === "undefined") {
    return;
  }

  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    sessionStorage.removeItem(PENDING_QUESTION_KEY);
    return;
  }

  sessionStorage.setItem(PENDING_QUESTION_KEY, trimmedQuestion);
}

export function readPendingQuestion() {
  if (typeof window === "undefined") {
    return "";
  }

  return sessionStorage.getItem(PENDING_QUESTION_KEY) ?? "";
}

export function clearPendingQuestion() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(PENDING_QUESTION_KEY);
}

export function savePendingDestination(destination: PendingDestination) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(PENDING_DESTINATION_KEY, destination);
}

export function readPendingDestination() {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(PENDING_DESTINATION_KEY) as PendingDestination | null;
}

export function clearPendingDestination() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(PENDING_DESTINATION_KEY);
}

export function chatHrefWithQuestion(question: string) {
  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    return "/chat";
  }

  return `/chat?q=${encodeURIComponent(trimmedQuestion)}`;
}

export function pendingDestinationRoute() {
  const destination = readPendingDestination();

  if (destination === "/subjects") {
    clearPendingDestination();
    return "/subjects";
  }

  if (destination === "/chat") {
    clearPendingDestination();
    return chatHrefWithQuestion(readPendingQuestion());
  }

  return null;
}

async function getClientAuthState() {
  if (!hasSupabasePublicEnv()) {
    return {
      isAuthenticated: false,
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isAuthenticated: false,
    };
  }

  return {
    isAuthenticated: true,
  };
}

export async function nextRouteForQuestion(question: string) {
  const { isAuthenticated } = await getClientAuthState();

  savePendingQuestion(question);
  savePendingDestination("/chat");

  if (!isAuthenticated) {
    return "/signup";
  }

  return chatHrefWithQuestion(question);
}

export async function nextRouteForAuthAction(fallbackRoute: "/login" | "/signup") {
  const { isAuthenticated } = await getClientAuthState();

  if (isAuthenticated) {
    return "/chat";
  }

  return fallbackRoute;
}
