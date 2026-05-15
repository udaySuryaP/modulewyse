import { redirect } from "next/navigation";

import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { SubjectDetailPanel } from "@/components/subjects/subject-detail-panel";
import { getSubjectBySlug } from "@/lib/mock-subjects";

type SubjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SubjectDetailPage({
  params,
}: SubjectDetailPageProps) {
  const { id } = await params;
  const subject = getSubjectBySlug(id);

  if (!subject) {
    redirect("/subjects");
  }

  return (
    <StudentPageShell>
      <SubjectDetailPanel subject={subject} />
    </StudentPageShell>
  );
}
