import { redirect } from "next/navigation";

import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { QuestionLibrary } from "@/components/library/question-library";
import { getUserProfile } from "@/lib/auth/get-user-profile";

export default async function LibraryPage() {
  const { user } = await getUserProfile();

  if (!user) {
    redirect("/login?next=/library");
  }

  return (
    <StudentPageShell>
      <QuestionLibrary />
    </StudentPageShell>
  );
}
