import { hasSupabasePublicEnv } from "@/lib/env/public";
import {
  mockSubjects,
  type MockSubject,
  subjectModuleLabel,
  type SubjectModule,
} from "@/lib/mock-subjects";
import { createClient } from "@/lib/supabase/server";
import type {
  Module,
  Subject,
  SubjectStatus,
  SubjectWithModules,
  Topic,
} from "@/types/database";

const visibleSubjectStatuses = ["available", "beta", "coming-soon"] as const;
const statusRank: Record<(typeof visibleSubjectStatuses)[number], number> = {
  available: 0,
  beta: 1,
  "coming-soon": 2,
};
const ktu2024MaxModuleNumber = 4;

type ContentCounter = {
  chunkCount: number;
  readyChunkCount: number;
  readySourceCount: number;
  sourceCount: number;
};

type SubjectSupplementalData = {
  chunks: SubjectChunkStats[];
  modules: Module[];
  sources: SubjectSourceStats[];
  topics: SubjectTopicStats[];
};

type SubjectSourceStats = {
  id: string;
  metadata: Record<string, unknown>;
  module_id: string | null;
  status: string;
  subject_id: string;
};

type SubjectChunkStats = {
  id: string;
  metadata: Record<string, unknown>;
  module_id: string | null;
  status: string;
  subject_id: string;
};

type SubjectTopicStats = Pick<
  Topic,
  "id" | "module_id" | "priority" | "subject_id" | "title"
>;

export type SubjectDataSource = "supabase" | "fallback";
export type ModuleReadiness = "ready" | "review" | "empty";

export type SubjectModuleViewModel = {
  chunkCount: number;
  contentStatus: "Ready" | "In review" | "No notes yet";
  hasFedContent: boolean;
  hasReadyContent: boolean;
  label: string;
  moduleNumber: number;
  moduleReadiness: ModuleReadiness;
  readyChunkCount: number;
  readySourceCount: number;
  sourceCount: number;
  status: SubjectStatus;
  title: string;
  topicCount: number;
  value: SubjectModule;
};

export type SubjectViewModel = {
  code: string;
  contentStatusLabel: string;
  description: string;
  draftModules: number;
  hasFedContent: boolean;
  hasReadyContent: boolean;
  id: string;
  moduleCountLabel: string;
  modules: SubjectModuleViewModel[];
  name: string;
  readyModules: number;
  semester: string;
  shortName: string;
  slug: string;
  source: SubjectDataSource;
  status: (typeof visibleSubjectStatuses)[number];
  topicSamples: string[];
  totalModules: number;
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

function pluralizeModules(count: number) {
  return count === 1 ? "1 module" : `${count} modules`;
}

function contentStatusLabel(totalModules: number, readyModules: number) {
  if (totalModules === 0) {
    return "No notes yet";
  }

  if (readyModules === 0) {
    return "In review";
  }

  const draftModules = totalModules - readyModules;

  if (draftModules <= 0) {
    return `${readyModules} ready`;
  }

  return `${readyModules} ready · ${draftModules} in review`;
}

function metadataModuleNumber(metadata: Record<string, unknown>) {
  const value = metadata.moduleNumber;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function emptyCounter(): ContentCounter {
  return {
    chunkCount: 0,
    readyChunkCount: 0,
    readySourceCount: 0,
    sourceCount: 0,
  };
}

function counterFor(
  countersByModuleNumber: Map<number, ContentCounter>,
  moduleNumber: number,
) {
  const existing = countersByModuleNumber.get(moduleNumber);

  if (existing) {
    return existing;
  }

  const next = emptyCounter();
  countersByModuleNumber.set(moduleNumber, next);
  return next;
}

function moduleValue(moduleNumber: number): SubjectModule {
  return String(moduleNumber) as SubjectModule;
}

function isKtu2024ModuleNumber(
  moduleNumber: number | null | undefined,
): moduleNumber is number {
  return (
    typeof moduleNumber === "number" &&
    Number.isInteger(moduleNumber) &&
    moduleNumber >= 1 &&
    moduleNumber <= ktu2024MaxModuleNumber
  );
}

function moduleReadinessLabel(
  moduleStatus: SubjectStatus,
  hasFedContent: boolean,
  hasReadyContent: boolean,
): SubjectModuleViewModel["contentStatus"] {
  if (hasReadyContent) {
    return "Ready";
  }

  if (hasFedContent && moduleStatus !== "coming-soon") {
    return "In review";
  }

  return "No notes yet";
}

function fallbackModules(subject: MockSubject): SubjectModuleViewModel[] {
  return subject.modules
    .filter((module) => module !== "all")
    .map((module) => {
      const moduleNumber = Number(module);
      const hasFedContent = subject.status !== "coming-soon";
      const hasReadyContent = subject.status === "available";
      const contentStatus = moduleReadinessLabel(
        subject.status,
        hasFedContent,
        hasReadyContent,
      );

      return {
        chunkCount: 0,
        contentStatus,
        hasFedContent,
        hasReadyContent,
        label: subjectModuleLabel(module),
        moduleNumber,
        moduleReadiness: hasReadyContent
          ? "ready"
          : hasFedContent
            ? "review"
            : "empty",
        readyChunkCount: 0,
        readySourceCount: 0,
        sourceCount: 0,
        status: subject.status,
        title: subjectModuleLabel(module),
        topicCount: 0,
        value: module,
      };
    });
}

function fallbackSubjectToViewModel(subject: MockSubject): SubjectViewModel {
  const modules = fallbackModules(subject);
  const readyModules = modules.filter((module) => module.hasReadyContent).length;
  const totalModules = modules.length;

  return {
    code: subject.code,
    contentStatusLabel: contentStatusLabel(totalModules, readyModules),
    description: subject.description,
    draftModules: Math.max(totalModules - readyModules, 0),
    hasFedContent: totalModules > 0,
    hasReadyContent: readyModules > 0,
    id: subject.slug,
    moduleCountLabel: pluralizeModules(totalModules),
    modules,
    name: subject.name,
    readyModules,
    semester: subject.semester,
    shortName: subject.shortName,
    slug: subject.slug,
    source: "fallback",
    status: subject.status,
    topicSamples: subject.topicSamples,
    totalModules,
  };
}

function fallbackSubjectList() {
  return sortSubjects(mockSubjects.map(fallbackSubjectToViewModel));
}

function normalizeSubjectWithStats(
  subject: Subject,
  data: SubjectSupplementalData,
): SubjectViewModel {
  const visibleModules = data.modules.filter((module) =>
    isKtu2024ModuleNumber(module.module_number),
  );
  const moduleById = new Map(visibleModules.map((module) => [module.id, module]));
  const moduleNumbers = new Set(visibleModules.map((module) => module.module_number));
  const topicCountByModuleId = new Map<string, number>();
  const countersByModuleNumber = new Map<number, ContentCounter>();

  data.topics.forEach((topic) => {
    if (topic.module_id && !moduleById.has(topic.module_id)) {
      return;
    }

    topicCountByModuleId.set(
      topic.module_id,
      (topicCountByModuleId.get(topic.module_id) ?? 0) + 1,
    );
  });

  data.sources.forEach((source) => {
    const moduleNumber = source.module_id
      ? moduleById.get(source.module_id)?.module_number
      : metadataModuleNumber(source.metadata);

    if (!isKtu2024ModuleNumber(moduleNumber)) {
      return;
    }

    moduleNumbers.add(moduleNumber);
    const counter = counterFor(countersByModuleNumber, moduleNumber);
    counter.sourceCount += 1;

    if (source.status === "ready") {
      counter.readySourceCount += 1;
    }
  });

  data.chunks.forEach((chunk) => {
    const moduleNumber = chunk.module_id
      ? moduleById.get(chunk.module_id)?.module_number
      : metadataModuleNumber(chunk.metadata);

    if (!isKtu2024ModuleNumber(moduleNumber)) {
      return;
    }

    moduleNumbers.add(moduleNumber);
    const counter = counterFor(countersByModuleNumber, moduleNumber);
    counter.chunkCount += 1;

    if (chunk.status === "ready") {
      counter.readyChunkCount += 1;
    }
  });

  const moduleViews = [...moduleNumbers]
    .sort((left, right) => left - right)
    .map((moduleNumber) => {
      const moduleRecord = data.modules.find(
        (item) => item.module_number === moduleNumber,
      );
      const counter = countersByModuleNumber.get(moduleNumber) ?? emptyCounter();
      const topicCount = moduleRecord
        ? topicCountByModuleId.get(moduleRecord.id) ?? 0
        : 0;
      const hasReadyContent =
        counter.readyChunkCount > 0 || counter.readySourceCount > 0;
      const hasFedContent =
        Boolean(moduleRecord) ||
        topicCount > 0 ||
        counter.sourceCount > 0 ||
        counter.chunkCount > 0;
      const status = moduleRecord?.status ?? subject.status;
      const contentStatus = moduleReadinessLabel(
        status,
        hasFedContent,
        hasReadyContent,
      );
      const moduleReadiness: ModuleReadiness = hasReadyContent
        ? "ready"
        : contentStatus === "In review"
          ? "review"
          : "empty";
      const value = moduleValue(moduleNumber);

      return {
        chunkCount: counter.chunkCount,
        contentStatus,
        hasFedContent,
        hasReadyContent,
        label: subjectModuleLabel(value),
        moduleNumber,
        moduleReadiness,
        readyChunkCount: counter.readyChunkCount,
        readySourceCount: counter.readySourceCount,
        sourceCount: counter.sourceCount,
        status,
        title: moduleRecord?.title ?? subjectModuleLabel(value),
        topicCount,
        value,
      };
    });

  const readyModules = moduleViews.filter((module) => module.hasReadyContent).length;
  const totalModules = moduleViews.length;
  const topicSamples = data.topics
    .filter((topic) => !topic.module_id || moduleById.has(topic.module_id))
    .sort((left, right) => left.priority - right.priority || left.title.localeCompare(right.title))
    .map((topic) => topic.title)
    .filter((topic, index, topics) => topics.indexOf(topic) === index)
    .slice(0, 4);

  return {
    code: subject.code ?? "TBD",
    contentStatusLabel: contentStatusLabel(totalModules, readyModules),
    description: subject.description ?? "",
    draftModules: Math.max(totalModules - readyModules, 0),
    hasFedContent:
      totalModules > 0 ||
      data.topics.length > 0 ||
      data.sources.length > 0 ||
      data.chunks.length > 0,
    hasReadyContent: readyModules > 0,
    id: subject.id,
    moduleCountLabel: pluralizeModules(totalModules),
    modules: moduleViews,
    name: subject.name,
    readyModules,
    semester: subject.semester ? `S${subject.semester}` : "TBD",
    shortName: subject.short_name,
    slug: subject.slug,
    source: "supabase",
    status: isVisibleStatus(subject.status) ? subject.status : "coming-soon",
    topicSamples,
    totalModules,
  };
}

async function getSupplementalData(
  subjectIds: string[],
): Promise<Map<string, SubjectSupplementalData> | null> {
  if (subjectIds.length === 0 || !hasSupabasePublicEnv()) {
    return new Map();
  }

  const supabase = await createClient();
  const [modulesResult, topicsResult, sourcesResult, chunksResult] =
    await Promise.all([
      supabase
        .from("modules")
        .select("id, subject_id, module_number, title, description, status, created_at, updated_at")
        .in("subject_id", subjectIds)
        .order("module_number", { ascending: true }),
      supabase
        .from("topics")
        .select("id, subject_id, module_id, title, priority")
        .in("subject_id", subjectIds)
        .order("priority", { ascending: true }),
      supabase
        .from("content_sources")
        .select("id, subject_id, module_id, status, metadata")
        .in("subject_id", subjectIds),
      supabase
        .from("content_chunks")
        .select("id, subject_id, module_id, status, metadata")
        .in("subject_id", subjectIds),
    ]);

  if (
    modulesResult.error ||
    topicsResult.error ||
    sourcesResult.error ||
    chunksResult.error
  ) {
    return null;
  }

  const dataBySubject = new Map<string, SubjectSupplementalData>();

  subjectIds.forEach((subjectId) => {
    dataBySubject.set(subjectId, {
      chunks: [],
      modules: [],
      sources: [],
      topics: [],
    });
  });

  ((modulesResult.data ?? []) as Module[]).forEach((module) => {
    if (!isKtu2024ModuleNumber(module.module_number)) {
      return;
    }

    dataBySubject.get(module.subject_id)?.modules.push(module);
  });

  ((topicsResult.data ?? []) as SubjectTopicStats[]).forEach((topic) => {
    dataBySubject.get(topic.subject_id)?.topics.push(topic);
  });

  ((sourcesResult.data ?? []) as SubjectSourceStats[]).forEach((source) => {
    dataBySubject.get(source.subject_id)?.sources.push(source);
  });

  ((chunksResult.data ?? []) as SubjectChunkStats[]).forEach((chunk) => {
    dataBySubject.get(chunk.subject_id)?.chunks.push(chunk);
  });

  return dataBySubject;
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
    .lte("module_number", ktu2024MaxModuleNumber)
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

  const supplementalData = await getSupplementalData(
    subjects.map((subject) => subject.id),
  );

  if (!supplementalData) {
    return {
      source: "fallback",
      subjects: fallbackSubjectList(),
    };
  }

  return {
    source: "supabase",
    subjects: sortSubjects(
      subjects.map((subject) =>
        normalizeSubjectWithStats(
          subject,
          supplementalData.get(subject.id) ?? {
            chunks: [],
            modules: [],
            sources: [],
            topics: [],
          },
        ),
      ),
    ),
  };
}

export async function getSubjectWithModulesAndFallback(
  slug: string,
): Promise<SubjectDetailResult> {
  const subject = await getSubjectBySlug(slug);

  if (subject) {
    const supplementalData = await getSupplementalData([subject.id]);

    if (supplementalData) {
      return {
        source: "supabase",
        subject: normalizeSubjectWithStats(
          subject,
          supplementalData.get(subject.id) ?? {
            chunks: [],
            modules: [],
            sources: [],
            topics: [],
          },
        ),
      };
    }
  }

  const fallbackSubject = mockSubjects.find(
    (item) => item.slug.toLowerCase() === slug.toLowerCase(),
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

  if (normalized === "all") {
    return "all";
  }

  if (
    normalized &&
    modules.some((module) => module.value === normalized)
  ) {
    return normalized as SubjectModule;
  }

  return "all";
}
