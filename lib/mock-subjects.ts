export type SubjectStatus = "available" | "beta" | "coming-soon";
export type SubjectModule = "all" | "1" | "2" | "3" | "4" | "5";

export type MockSubject = {
  slug: string;
  name: string;
  shortName: string;
  code: string;
  semester: string;
  status: SubjectStatus;
  description: string;
  modules: SubjectModule[];
  topicSamples: string[];
};

export const subjectModules: SubjectModule[] = ["all", "1", "2", "3", "4", "5"];

export const mockSubjects: MockSubject[] = [
  {
    slug: "oop",
    name: "Object Oriented Programming",
    shortName: "OOP",
    code: "PBCST304",
    semester: "S4",
    status: "available",
    description:
      "Covers classes, objects, inheritance, polymorphism, exception handling, and core OOP principles.",
    modules: ["all", "1", "2", "3", "4"],
    topicSamples: [
      "Classes and objects",
      "Inheritance",
      "Polymorphism",
      "Exception handling",
    ],
  },
  {
    slug: "dbms",
    name: "Database Management Systems",
    shortName: "DBMS",
    code: "TBD",
    semester: "TBD",
    status: "beta",
    description:
      "Covers database models, ER diagrams, SQL, normalization, transactions, and relational design foundations.",
    modules: subjectModules,
    topicSamples: ["ER diagrams", "SQL queries", "Normalization", "Transactions"],
  },
  {
    slug: "os",
    name: "Operating Systems",
    shortName: "OS",
    code: "TBD",
    semester: "TBD",
    status: "coming-soon",
    description:
      "Covers process management, scheduling, memory management, file systems, and operating system services.",
    modules: subjectModules,
    topicSamples: [
      "Process scheduling",
      "Deadlocks",
      "Memory management",
      "File systems",
    ],
  },
  {
    slug: "cn",
    name: "Computer Networks",
    shortName: "CN",
    code: "TBD",
    semester: "TBD",
    status: "coming-soon",
    description:
      "Covers network models, protocols, transport layers, routing, addressing, and application-layer concepts.",
    modules: subjectModules,
    topicSamples: ["TCP and UDP", "Routing", "IP addressing", "OSI model"],
  },
  {
    slug: "ds",
    name: "Data Structures",
    shortName: "DS",
    code: "TBD",
    semester: "TBD",
    status: "coming-soon",
    description:
      "Covers arrays, stacks, queues, linked lists, trees, graphs, searching, and sorting techniques.",
    modules: subjectModules,
    topicSamples: ["Stacks and queues", "Linked lists", "Trees", "Sorting"],
  },
];

export function getSubjectBySlug(slug: string | undefined) {
  if (!slug) {
    return undefined;
  }

  return mockSubjects.find((subject) => subject.slug === slug.toLowerCase());
}

export function isChatEnabledSubject(subject: MockSubject) {
  return subject.status === "available" || subject.status === "beta";
}

export function normalizeSubjectModule(
  subject: MockSubject,
  module: string | undefined,
): SubjectModule {
  const normalized = module?.toLowerCase().replace(/^module\s+/, "");

  if (
    normalized &&
    subject.modules.includes(normalized as SubjectModule)
  ) {
    return normalized as SubjectModule;
  }

  return "all";
}

export function subjectModuleLabel(module: SubjectModule) {
  return module === "all" ? "All modules" : `Module ${module}`;
}

export function subjectStatusLabel(status: SubjectStatus) {
  if (status === "coming-soon") {
    return "Coming soon";
  }

  return status;
}
