import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/env/public";
import {
  mockSubjects,
  type MockSubject,
  subjectModuleLabel,
  type SubjectModule,
} from "@/lib/mock-subjects";
import type { Module, Subject, SubjectStatus, SubjectWithModules } from "@/types/database";

const visibleSubjectStatuses = ["available", "beta", "coming-soon"] as const;
const statusRank: Record<(typeof visibleSubjectStatuses)[number], number> = {
  available: 0,
  beta: 1,
  "coming-soon": 2,
};

export type SubjectDataSource = "supabase" | "fallback";

export type SubjectModuleViewModel = {
  label: string;
  moduleNumber: number | null;
  status: SubjectStatus;
  title: string;
  value: SubjectModule;
};

export type SubjectViewModel = {
  code: string;
  description: string;
  id: string;
  modules: SubjectModuleViewModel[];
  name: string;
  semester: string;
  shortName: string;
  slug: string;
  source: SubjectDataSource;
  status: (typeof visibleSubjectStatuses)[number];
  topicSamples: string[];
};

export type SubjectListResult = {
  source: SubjectDataSource;
  subjects: SubjectViewModel[];
};

export type SubjectDetailResult = {
  source: SubjectDataSource;
  subject: SubjectViewModel | null;
};

function isVisibleStatus(status: string): status is SubjectViewModel["status"] {
  return visibleSubjectStatuses.includes(status as SubjectViewModel["status"]);
}

function sortSubjects(subjects: SubjectViewModel[]) {
  return [...subjects].sort((left, right) => {
    const statusDifference = statusRank[left.status] - statusRank[right.status];

    if (statusDifference !== 0) {
      return statusDifference;
    }

    const leftSemester = Number.parseInt(left.semester.replace(/^S/i, ""), 10);
    const rightSemester = Number.parseInt(right.semester.replace(/^S/i, ""), 10);

    if (Number.isFinite(leftSemester) && Number.isFinite(rightSemester)) {
      return leftSemester - rightSemester || left.name.localeCompare(right.name);
    }

    return left.name.localeCompare(right.name);
  });
}

function fallbackModules(subject: MockSubject): SubjectModuleViewModel[] {
  return subject.modules.map((module) => ({
    label: subjectModuleLabel(module),
    moduleNumber: module === "all" ? null : Number(module),
    status: subject.status,
    title: subjectModuleLabel(module),
    value: module,
  }));
}

function fallbackSubjectToViewModel(subject: MockSubject): SubjectViewModel {
  return {
    code: subject.code,
    description: subject.description,
    id: subject.slug,
    modules: fallbackModules(subject),
    name: subject.name,
    semester: subject.semester,
    shortName: subject.shortName,
    slug: subject.slug,
    source: "fallback",
    status: subject.status,
    topicSamples: subject.topicSamples,
  };
}

function fallbackSubjectList() {
  return sortSubjects(mockSubjects.map(fallbackSubjectToViewModel));
}

function moduleToViewModel(module: Module): SubjectModuleViewModel {
  const value = String(module.module_number) as SubjectModule;

  return {
    label: subjectModuleLabel(value),
    moduleNumber: module.module_number,
    status: module.status,
    title: module.title,
    value,
  };
}

function subjectToViewModel(
  subject: Subject,
  modules: Module[] = [],
): SubjectViewModel {
  const normalizedModules: SubjectModuleViewModel[] = [
    {
      label: "All modules",
      moduleNumber: null,
      status: subject.status,
      title: "All modules",
      value: "all",
    },
    ...modules
      .sort((left, right) => left.module_number - right.module_number)
      .map(moduleToViewModel),
  ];

  return {
    code: subject.code ?? "TBD",
    description: subject.description ?? "",
    id: subject.id,
    modules: normalizedModules.length > 1
      ? normalizedModules
      : [
          {
            label: "All modules",
            moduleNumber: null,
            status: subject.status,
            title: "All modules",
            value: "all",
          },
        ],
    name: subject.name,
    semester: subject.semester ? `S${subject.semester}` : "TBD",
    shortName: subject.short_name,
    slug: subject.slug,
    source: "supabase",
    status: isVisibleStatus(subject.status) ? subject.status : "coming-soon",
    topicSamples: [],
  };
}

export async function getSubjects(): Promise<Subject[]> {
  if (!hasSupabasePublicEnv()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .in("status", visibleSubjectStatuses)
    .order("semester", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as Subject[];
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", slug)
    .in("status", visibleSubjectStatuses)
    .maybeSingle();

  if (error) {
    return null;
  }

  return (data as Subject | null) ?? null;
}

export async function getSubjectModules(subjectId: string): Promise<Module[]> {
  if (!hasSupabasePublicEnv()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("subject_id", subjectId)
    .order("module_number", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as Module[];
}

export async function getSubjectWithModules(
  slug: string,
): Promise<SubjectWithModules | null> {
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    return null;
  }

  const modules = await getSubjectModules(subject.id);

  return {
    ...subject,
    modules,
  };
}

export async function getSubjectListWithFallback(): Promise<SubjectListResult> {
  const subjects = await getSubjects();

  if (subjects.length === 0) {
    return {
      source: "fallback",
      subjects: fallbackSubjectList(),
    };
  }

  return {
    source: "supabase",
    subjects: sortSubjects(subjects.map((subject) => subjectToViewModel(subject))),
  };
}

export async function getSubjectWithModulesAndFallback(
  slug: string,
): Promise<SubjectDetailResult> {
  const subjectWithModules = await getSubjectWithModules(slug);

  if (subjectWithModules) {
    return {
      source: "supabase",
      subject: subjectToViewModel(subjectWithModules, subjectWithModules.modules),
    };
  }

  const fallbackSubject = mockSubjects.find(
    (subject) => subject.slug.toLowerCase() === slug.toLowerCase(),
  );

  return {
    source: "fallback",
    subject: fallbackSubject ? fallbackSubjectToViewModel(fallbackSubject) : null,
  };
}

export function getFallbackSubjectBySlug(slug: string) {
  const fallbackSubject = mockSubjects.find(
    (subject) => subject.slug.toLowerCase() === slug.toLowerCase(),
  );

  return fallbackSubject ? fallbackSubjectToViewModel(fallbackSubject) : null;
}

export function getFallbackSubjectList() {
  return fallbackSubjectList();
}

export function normalizeSubjectModuleValue(
  value: string | undefined,
  modules: SubjectModuleViewModel[],
): SubjectModule {
  const normalized = value?.toLowerCase().replace(/^module\s+/, "");

  if (
    normalized &&
    modules.some((module) => module.value === normalized)
  ) {
    return normalized as SubjectModule;
  }

  return "all";
}
