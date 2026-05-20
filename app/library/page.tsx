import { redirect } from "next/navigation";

import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { QuestionLibrary } from "@/components/library/question-library";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getLibraryQuestionsWithFallback } from "@/lib/data/library";

export default async function LibraryPage() {
  const { user } = await getUserProfile();

  if (!user) {
    redirect("/login?next=/library");
  }

  const library = await getLibraryQuestionsWithFallback();

  return (
    <StudentPageShell>
      <QuestionLibrary
        dataSource={library.source}
        questions={library.questions}
      />
    </StudentPageShell>
  );
}
