import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { QuestionLibrary } from "@/components/library/question-library";

export default function LibraryPage() {
  return (
    <StudentPageShell>
      <QuestionLibrary />
    </StudentPageShell>
  );
}
