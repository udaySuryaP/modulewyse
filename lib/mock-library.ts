import type { SubjectModule } from "@/lib/mock-subjects";

export type LibraryQuestion = {
  id: string;
  question: string;
  subjectSlug: string;
  subjectLabel: string;
  subjectCode: string | null;
  module: SubjectModule;
  answerType: string;
  exam: string;
  year: string;
  status: string;
};

export const mockLibraryQuestions: LibraryQuestion[] = [
  {
    id: "oop-inheritance-2024",
    question: "Explain inheritance in OOP.",
    subjectSlug: "oop",
    subjectLabel: "Object Oriented Programming",
    subjectCode: "PBCST304",
    module: "3",
    answerType: "Part B",
    exam: "Model",
    year: "2024",
    status: "Available",
  },
  {
    id: "cn-tcp-udp-2023",
    question: "Differentiate TCP and UDP.",
    subjectSlug: "cn",
    subjectLabel: "Computer Networks",
    subjectCode: null,
    module: "4",
    answerType: "Short",
    exam: "Unknown exam",
    year: "2023",
    status: "Subject coming soon",
  },
  {
    id: "dbms-normalization-2024",
    question: "Explain normalization in DBMS.",
    subjectSlug: "dbms",
    subjectLabel: "Database Management Systems",
    subjectCode: null,
    module: "2",
    answerType: "Long",
    exam: "Unknown exam",
    year: "2024",
    status: "Beta",
  },
  {
    id: "os-process-scheduling-2022",
    question: "Explain process scheduling.",
    subjectSlug: "os",
    subjectLabel: "Operating Systems",
    subjectCode: null,
    module: "3",
    answerType: "Part C",
    exam: "Unknown exam",
    year: "2022",
    status: "Subject coming soon",
  },
];
