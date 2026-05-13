export const PENDING_QUESTION_KEY = "modulewyse.pendingQuestion";
export const PENDING_DESTINATION_KEY = "modulewyse.pendingDestination";
export const DEMO_AUTHENTICATED_KEY = "modulewyse.demo.authenticated";
export const DEMO_ONBOARDING_COMPLETE_KEY =
  "modulewyse.demo.onboardingComplete";

export type PendingDestination = "/chat" | "/subjects";

export type ClientAuthState = {
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
};

export function getClientAuthState(): ClientAuthState {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      isOnboardingComplete: false,
    };
  }

  return {
    isAuthenticated: localStorage.getItem(DEMO_AUTHENTICATED_KEY) === "true",
    isOnboardingComplete:
      localStorage.getItem(DEMO_ONBOARDING_COMPLETE_KEY) === "true",
  };
}

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

export function nextRouteForQuestion(question: string) {
  const { isAuthenticated, isOnboardingComplete } = getClientAuthState();

  savePendingQuestion(question);
  savePendingDestination("/chat");

  if (!isAuthenticated) {
    return "/signup";
  }

  if (!isOnboardingComplete) {
    return "/onboarding/academic-profile";
  }

  return chatHrefWithQuestion(question);
}

export function nextRouteForSubjects() {
  const { isAuthenticated, isOnboardingComplete } = getClientAuthState();

  savePendingDestination("/subjects");

  if (!isAuthenticated) {
    return "/signup";
  }

  if (!isOnboardingComplete) {
    return "/onboarding/academic-profile";
  }

  return "/subjects";
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

  return "/chat";
}
