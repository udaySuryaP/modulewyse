import { redirect } from "next/navigation";

import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { SubjectDetailPanel } from "@/components/subjects/subject-detail-panel";
import { BackLink } from "@/components/ui/back-link";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getSubjectWithModulesAndFallback } from "@/lib/data/subjects";

type SubjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SubjectDetailPage({
  params,
}: SubjectDetailPageProps) {
  const { user } = await getUserProfile();
  const { id } = await params;

  if (!user) {
    redirect(`/login?next=/subjects/${encodeURIComponent(id)}`);
  }

  const { subject } = await getSubjectWithModulesAndFallback(id);

  if (!subject) {
    redirect("/subjects");
  }

  return (
    <StudentPageShell>
      <BackLink className="mb-6" href="/subjects" label="Back to subjects" />
      <SubjectDetailPanel subject={subject} />
    </StudentPageShell>
  );
}
