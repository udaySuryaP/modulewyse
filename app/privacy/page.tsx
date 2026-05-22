import type { Metadata } from "next";
import Link from "next/link";

import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | ModuleWyse",
  description:
    "Privacy information for ModuleWyse, an AI-assisted KTU study companion.",
};

const lastUpdated = "May 22, 2026";

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description="This Privacy Policy explains how ModuleWyse collects, uses, stores, and shares information when students use the app."
      sections={[
        {
          title: "1. Introduction",
          body: (
            <>
              <p>
                ModuleWyse is an AI-assisted study companion for KTU students.
                It helps students study from reviewed or curated academic notes
                and previous-question libraries.
              </p>
              <p>
                ModuleWyse is independent and is not an official KTU,
                university, college, or exam-authority service.
              </p>
            </>
          ),
        },
        {
          title: "2. Who operates ModuleWyse",
          body: (
            <p>
              ModuleWyse is currently operated as an independent
              student/product project. The legal operator and contact details
              should be finalized before public launch.
            </p>
          ),
        },
        {
          title: "3. Information we collect",
          body: (
            <>
              <p>
                We may collect account information such as email address and
                name if provided; authentication and session information through
                Supabase; and academic profile information such as branch,
                semester, college, focus subject, and graduation year if
                provided.
              </p>
              <p>
                We may store chat content, including questions, generated
                answers, source metadata, citations, feedback, conversation
                titles, timestamps, pin status, rename/delete actions, and
                answer preferences.
              </p>
              <p>
                We may also collect technical data such as device and browser
                information, logs, page views, performance data, error data, and
                local browser preferences stored in cookies, local storage, or
                session storage where applicable.
              </p>
            </>
          ),
        },
        {
          title: "4. How we use information",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide login, account access, and protected app routes.</li>
              <li>Personalize the study experience using academic profile data.</li>
              <li>Generate grounded AI answers from reviewed ModuleWyse notes.</li>
              <li>Store and reload chat history, feedback, and preferences.</li>
              <li>Improve retrieval quality, product reliability, and usability.</li>
              <li>Prevent abuse, investigate errors, and monitor performance.</li>
              <li>Comply with legal obligations if they apply.</li>
            </ul>
          ),
        },
        {
          title: "5. AI processing",
          body: (
            <>
              <p>
                User questions may be sent to AI providers such as OpenAI to
                generate answers. Retrieved source chunks from reviewed notes
                may be included in prompts to ground those answers.
              </p>
              <p>
                ModuleWyse attempts to restrict AI answers to reviewed notes,
                but AI outputs may still be incomplete or imperfect. Important
                academic information should be verified against official
                syllabus materials, textbooks, faculty guidance, or exam
                notifications.
              </p>
              <p>
                Do not submit highly sensitive personal data, passwords,
                financial information, private identifiers, or confidential
                material in chat.
              </p>
            </>
          ),
        },
        {
          title: "6. Third-party processors and services",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Supabase: authentication, database, and storage of user, profile, and chat data.</li>
              <li>OpenAI: AI answer generation and embeddings.</li>
              <li>Vercel: hosting, deployment, observability, and infrastructure operations.</li>
              <li>Vercel Analytics: privacy-focused website analytics.</li>
              <li>Upstash Redis: may be used for rate limiting or abuse prevention later.</li>
            </ul>
          ),
        },
        {
          title: "7. Analytics",
          body: (
            <p>
              ModuleWyse uses Vercel Analytics to understand page usage and
              product performance at a high level. Analytics helps us improve
              reliability and user experience without needing custom tracking in
              this phase.
            </p>
          ),
        },
        {
          title: "8. Data sharing",
          body: (
            <p>
              ModuleWyse does not sell user personal data. Information is
              shared only with service providers needed to operate the app, when
              required by law, to protect security and rights, or with user
              consent.
            </p>
          ),
        },
        {
          title: "9. Data retention",
          body: (
            <>
              <p>
                Account and profile information may be retained while the
                account is active. Chat history may be retained until the user
                deletes conversations or until an account deletion process is
                completed.
              </p>
              <p>
                Logs and analytics may be retained according to service-provider
                retention periods and operational needs. Deleted conversations
                should no longer appear in the app, subject to backups, logs,
                and infrastructure retention.
              </p>
            </>
          ),
        },
        {
          title: "10. User rights and choices",
          body: (
            <>
              <p>
                Users can access or update available profile information in the
                app, delete conversations where that feature is available, and
                adjust local display preferences where supported.
              </p>
              <p>
                Users may request account or data deletion through the contact
                channel listed below once that channel is finalized. Local
                browser preferences can also be cleared from browser storage.
              </p>
            </>
          ),
        },
        {
          title: "11. Security",
          body: (
            <p>
              ModuleWyse uses authentication, row-level security, server-only
              secret handling, and reasonable technical safeguards. No internet
              service is completely secure, so users should protect their
              accounts and avoid submitting highly sensitive personal data.
            </p>
          ),
        },
        {
          title: "12. Children and minors",
          body: (
            <p>
              ModuleWyse is intended for higher-education students and learners.
              If a user is under the age required to consent under applicable
              law, they should use ModuleWyse only with appropriate parent or
              guardian consent.
            </p>
          ),
        },
        {
          title: "13. International processing",
          body: (
            <p>
              User information may be processed on infrastructure outside the
              user&apos;s state or country by ModuleWyse service providers.
            </p>
          ),
        },
        {
          title: "14. Changes to this policy",
          body: (
            <p>
              ModuleWyse may update this Privacy Policy as the product changes.
              When updates are made, the last updated date should be changed.
              Continued use may mean acceptance where applicable.
            </p>
          ),
        },
        {
          title: "15. Contact",
          body: (
            <p>
              Contact: [add support email before launch]. Until operator and
              support details are finalized, legal and privacy requests should
              not be treated as fully operationalized.
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
        <Link className="hover:text-[var(--mw-ink)]" href="/terms">
          Terms of Service
        </Link>
      </div>
    </LegalPageShell>
  );
}
