import type { Metadata } from "next";
import Link from "next/link";

import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms of Service | ModuleWyse",
  description:
    "Terms for using ModuleWyse, an AI-assisted KTU study companion.",
};

const lastUpdated = "May 22, 2026";

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      description="These Terms explain the rules for using ModuleWyse as a student-facing AI study companion."
      sections={[
        {
          title: "1. Acceptance",
          body: (
            <p>
              By using ModuleWyse, you agree to these Terms of Service. If you
              do not agree, you should not use the service.
            </p>
          ),
        },
        {
          title: "2. What ModuleWyse is",
          body: (
            <>
              <p>
                ModuleWyse is an AI-assisted study companion for KTU students.
                It provides study support using reviewed notes,
                previous-question library material, and AI-generated
                explanations.
              </p>
              <p>
                ModuleWyse is not an official university, KTU, college, or
                exam-authority service. It is not a replacement for official
                syllabus documents, textbooks, faculty guidance, or exam
                notifications.
              </p>
            </>
          ),
        },
        {
          title: "3. Eligibility",
          body: (
            <p>
              ModuleWyse is intended for students and learners. You must be able
              to enter a binding agreement or use the service with appropriate
              guardian consent where required. You must provide accurate account
              information.
            </p>
          ),
        },
        {
          title: "4. Accounts",
          body: (
            <p>
              You are responsible for keeping your account secure. Do not share
              login credentials. If you believe your account has been accessed
              without permission, report it through the contact channel once it
              is finalized.
            </p>
          ),
        },
        {
          title: "5. Acceptable use",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Do not misuse, disrupt, overload, scrape, or attack the service.</li>
              <li>Do not attempt unauthorized access or bypass security or rate limits.</li>
              <li>Do not submit illegal, harmful, confidential, or highly sensitive personal data.</li>
              <li>Do not use ModuleWyse to cheat, impersonate others, or violate academic rules.</li>
              <li>Do not reverse engineer, resell, or redistribute the service at scale without permission.</li>
            </ul>
          ),
        },
        {
          title: "6. AI answer limitations",
          body: (
            <>
              <p>
                AI answers may be incomplete, incorrect, or outdated. ModuleWyse
                attempts to ground answers in reviewed notes, but it cannot
                guarantee perfect accuracy.
              </p>
              <p>
                You should verify important academic information with official
                materials. ModuleWyse does not guarantee marks, grades, exam
                outcomes, academic performance, or admission/career results.
              </p>
            </>
          ),
        },
        {
          title: "7. Academic integrity",
          body: (
            <p>
              ModuleWyse is for learning, revision, and understanding. You are
              responsible for following your institution&apos;s academic
              policies, exam rules, and plagiarism rules.
            </p>
          ),
        },
        {
          title: "8. Content and intellectual property",
          body: (
            <>
              <p>
                The ModuleWyse interface, code, content structure, branding, and
                product experience belong to the project/operator unless stated
                otherwise. Some academic content may be curated from permitted
                or reviewed sources.
              </p>
              <p>
                You retain rights to your own input where applicable. You grant
                ModuleWyse a limited permission to process your inputs to
                provide, secure, and improve the service.
              </p>
            </>
          ),
        },
        {
          title: "9. Previous-year questions and notes",
          body: (
            <p>
              Previous-year questions and notes are provided for study and
              reference where available. They may contain metadata gaps or
              formatting limitations. Official exam materials should be treated
              as authoritative.
            </p>
          ),
        },
        {
          title: "10. Availability and changes",
          body: (
            <p>
              ModuleWyse may change, be interrupted, or be discontinued. Beta
              features may be unstable, and module or subject coverage may
              expand over time.
            </p>
          ),
        },
        {
          title: "11. Third-party services",
          body: (
            <p>
              ModuleWyse depends on service providers such as Supabase, OpenAI,
              Vercel, and analytics or monitoring tools. Their availability,
              security practices, and terms may affect ModuleWyse.
            </p>
          ),
        },
        {
          title: "12. Disclaimers",
          body: (
            <p>
              ModuleWyse is provided &quot;as is&quot; and &quot;as
              available.&quot; It does not provide professional, legal, or
              official academic advice, and does not guarantee uninterrupted
              service or error-free answers.
            </p>
          ),
        },
        {
          title: "13. Limitation of liability",
          body: (
            <p>
              To the extent permitted by applicable law, ModuleWyse is not
              responsible for academic loss, missed deadlines, exam outcomes, or
              decisions made solely based on AI outputs or app content.
            </p>
          ),
        },
        {
          title: "14. Termination",
          body: (
            <p>
              ModuleWyse may suspend or restrict access for abuse, security
              violations, or serious policy violations. You may stop using the
              service at any time. Until self-serve account deletion is added,
              deletion requests should be handled through the contact channel
              once finalized.
            </p>
          ),
        },
        {
          title: "15. Governing law and jurisdiction",
          body: (
            <p>
              [Add governing law and jurisdiction before public launch]. This
              section should be confirmed with the finalized legal operator
              before wider public availability.
            </p>
          ),
        },
        {
          title: "16. Contact",
          body: (
            <p>
              Contact: [add support email before launch]. Operator and support
              details should be finalized before public launch.
            </p>
          ),
        },
      ]}
    >
      <div className="mt-5 flex flex-wrap gap-2 text-[13px] text-[var(--mw-muted)]">
        <span>Effective date: {lastUpdated}</span>
        <span aria-hidden="true">/</span>
        <span>Last updated: {lastUpdated}</span>
        <span aria-hidden="true">/</span>
        <Link className="hover:text-[var(--mw-ink)]" href="/privacy">
          Privacy Policy
        </Link>
      </div>
    </LegalPageShell>
  );
}
