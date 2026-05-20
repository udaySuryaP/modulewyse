import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  loadStagedPreviousQuestions,
  preparePreviousQuestions,
} from "../lib/content/previous-questions";
import type { PreviousQuestionAppearanceInput } from "../types/library";

const rootDir = process.cwd();
const inputPath = path.join(
  rootDir,
  "content",
  "oop",
  "questions-staging",
  "previous-year-questions.json",
);

async function loadLocalEnv() {
  for (const fileName of [".env.local", ".env"]) {
    try {
      const raw = await readFile(path.join(rootDir, fileName), "utf8");

      for (const line of raw.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

        if (!match) {
          continue;
        }

        const [, key, rawValue] = match;

        if (process.env[key]) {
          continue;
        }

        process.env[key] = rawValue
          .trim()
          .replace(/^['"]|['"]$/g, "");
      }
    } catch {
      // Optional local env file.
    }
  }
}

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for previous-question ingestion.`);
  }

  return value;
}

function appearanceKey(appearance: PreviousQuestionAppearanceInput) {
  return [
    appearance.year ?? "",
    appearance.exam ?? "",
    appearance.sourceFile ?? "",
    appearance.sourcePage ?? "",
  ].join("|");
}

async function main() {
  await loadLocalEnv();

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const source = await loadStagedPreviousQuestions(inputPath);
  const preview = preparePreviousQuestions(source);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  const { data: subject, error: subjectError } = await supabase
    .from("subjects")
    .select("id, slug, code")
    .eq("slug", "oop")
    .single();

  if (subjectError || !subject) {
    throw subjectError ?? new Error("OOP subject was not found.");
  }

  const { data: modules, error: moduleError } = await supabase
    .from("modules")
    .select("id, module_number")
    .eq("subject_id", subject.id);

  if (moduleError) {
    throw moduleError;
  }

  const moduleIdByNumber = new Map<number, string>(
    (modules ?? []).map((module) => [module.module_number, module.id]),
  );
  const moduleIds = [...moduleIdByNumber.values()];
  const { data: topics, error: topicsError } = moduleIds.length > 0
    ? await supabase
        .from("topics")
        .select("id, module_id, title")
        .in("module_id", moduleIds)
    : { data: [], error: null };

  if (topicsError) {
    throw topicsError;
  }

  const topicIdByModuleAndTitle = new Map<string, string>(
    (topics ?? []).map((topic) => [`${topic.module_id}|${topic.title}`, topic.id]),
  );
  const { data: existingQuestions, error: existingQuestionsError } = await supabase
    .from("previous_questions")
    .select("id, metadata")
    .eq("subject_id", subject.id);

  if (existingQuestionsError) {
    throw existingQuestionsError;
  }

  const existingQuestionIdByHash = new Map<string, string>();
  for (const existingQuestion of existingQuestions ?? []) {
    const hash = typeof existingQuestion.metadata?.questionHash === "string"
      ? existingQuestion.metadata.questionHash
      : null;

    if (hash) {
      existingQuestionIdByHash.set(hash, existingQuestion.id);
    }
  }

  let questionsUpserted = 0;
  let appearancesUpserted = 0;
  let questionsSkipped = Object.values(preview.skippedReasons)
    .reduce((total, count) => total + count, 0);

  for (const question of preview.prepared) {
    const moduleId = question.moduleNumber
      ? moduleIdByNumber.get(question.moduleNumber) ?? null
      : null;

    if (!moduleId) {
      questionsSkipped += 1;
      continue;
    }

    const topicId = question.topicTitle
      ? topicIdByModuleAndTitle.get(`${moduleId}|${question.topicTitle}`) ?? null
      : null;

    const questionPayload = {
      answer_available: question.answerAvailable,
      confidence: question.confidence,
      exam: question.exam,
      marks: question.marks,
      metadata: question.metadata,
      module_id: moduleId,
      question: question.question,
      question_type: question.questionType,
      source_file: question.sourceFile,
      source_page: question.sourcePage,
      status: question.status,
      subject_id: subject.id,
      topic_id: topicId,
      year: question.year,
    };

    const questionId = existingQuestionIdByHash.get(question.questionHash);
    const { data: savedQuestion, error: saveQuestionError } = questionId
      ? await supabase
          .from("previous_questions")
          .update(questionPayload)
          .eq("id", questionId)
          .select("id")
          .single()
      : await supabase
          .from("previous_questions")
          .insert(questionPayload)
          .select("id")
          .single();

    if (saveQuestionError || !savedQuestion) {
      throw saveQuestionError;
    }

    questionsUpserted += 1;
    existingQuestionIdByHash.set(question.questionHash, savedQuestion.id);

    const { error: deleteAppearancesError } = await supabase
      .from("previous_question_appearances")
      .delete()
      .eq("question_id", savedQuestion.id);

    if (deleteAppearancesError) {
      throw deleteAppearancesError;
    }

    const appearances = [
      ...new Map(question.appearances.map((appearance) => [appearanceKey(appearance), appearance])).values(),
    ];

    if (appearances.length > 0) {
      const { error: appearanceError } = await supabase
        .from("previous_question_appearances")
        .insert(
          appearances.map((appearance) => ({
            exam: appearance.exam,
            metadata: {
              ...appearance.metadata,
              questionHash: question.questionHash,
              subjectCode: question.subjectCode,
              subjectSlug: question.subjectSlug,
            },
            question_id: savedQuestion.id,
            source_file: appearance.sourceFile,
            source_page: appearance.sourcePage,
            year: appearance.year,
          })),
        );

      if (appearanceError) {
        throw appearanceError;
      }

      appearancesUpserted += appearances.length;
    }
  }

  console.log("Previous-question ingestion complete.");
  console.log(`Questions read: ${preview.total}`);
  console.log(`Questions upserted: ${questionsUpserted}`);
  console.log(`Questions skipped: ${questionsSkipped}`);
  console.log(`Appearances upserted: ${appearancesUpserted}`);
  console.log(`Module distribution: ${JSON.stringify(preview.moduleDistribution)}`);
  console.log(`Unknown metadata: ${JSON.stringify(preview.unknownMetadata)}`);
  console.log(`Skipped reasons: ${JSON.stringify(preview.skippedReasons)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
