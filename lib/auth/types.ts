export type Profile = {
  id: string;
  full_name: string;
  email: string;
  college_name: string | null;
  graduation_year: number | null;
  branch: string | null;
  semester: number | null;
  focus_subject: string | null;
  referral_source: string | null;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
};

export type OnboardingDraft = {
  college_name?: string;
  graduation_year?: number;
  branch?: string;
  semester?: number;
  focus_subject?: string;
  referral_source?: string;
};
