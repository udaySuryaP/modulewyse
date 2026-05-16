/**
 * App-wide constants for ModuleWyse.
 * Derived from docs/03_DESIGN_SYSTEM_STUDENT.md and docs/05_ARCHITECTURE.md.
 */

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------
export const APP_NAME = "ModuleWyse";
export const APP_DESCRIPTION =
  "A curated AI exam-prep platform for KTU students with module-aware, syllabus-grounded answers from structured academic notes.";

// ---------------------------------------------------------------------------
// Student Routes
// ---------------------------------------------------------------------------
export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",

  // Onboarding
  ONBOARDING_ACADEMIC: "/onboarding/academic-profile",
  ONBOARDING_BRANCH: "/onboarding/branch",
  ONBOARDING_SEMESTER: "/onboarding/semester",
  ONBOARDING_FINAL: "/onboarding/final-setup",

  // Student App
  CHAT: "/chat",
  SUBJECTS: "/subjects",
  SUBJECT_DETAIL: (id: string) => `/subjects/${id}` as const,
  LIBRARY: "/library",
  PROFILE: "/settings",
  SETTINGS: "/settings",
  SETTINGS_ACCOUNT: "/settings/account",
  SETTINGS_ACADEMIC: "/settings/academic",
  SETTINGS_PREFERENCES: "/settings/preferences",
} as const;

// ---------------------------------------------------------------------------
// Design Tokens (from docs/03_DESIGN_SYSTEM_STUDENT.md)
// ---------------------------------------------------------------------------
export const COLORS = {
  burntOrange: "#B8653F",
  clayBrown: "#8F4B35",
  deepRust: "#6F3328",
  warmBeige: "#D7A077",
  darkCharcoal: "#101111",
  softWhite: "#F8F5EF",
} as const;
