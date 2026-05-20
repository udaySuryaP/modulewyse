import path from "node:path";

import {
  loadStagedPreviousQuestions,
  preparePreviousQuestions,
} from "../lib/content/previous-questions";

const rootDir = process.cwd();
const inputPath = path.join(
  rootDir,
  "content",
  "oop",
  "questions-staging",
  "previous-year-questions.json",
);

async function main() {
  const source = await loadStagedPreviousQuestions(inputPath);
  const preview = preparePreviousQuestions(source);
  const totalSkipped = Object.values(preview.skippedReasons)
    .reduce((total, count) => total + count, 0);

  console.log("Previous-year question preview complete.");
  console.log(`Subject: ${source.subject ?? "Unknown"}`);
  console.log(`Subject code: ${source.subjectCode ?? "Unknown"}`);
  console.log(`Questions read: ${preview.total}`);
  console.log(`Ready questions: ${preview.prepared.length}`);
  console.log(`Skipped questions: ${totalSkipped}`);
  console.log(`Duplicate groups: ${preview.duplicateGroups}`);
  console.log(`Module distribution: ${JSON.stringify(preview.moduleDistribution)}`);
  console.log(`Unknown metadata: ${JSON.stringify(preview.unknownMetadata)}`);
  console.log(`Skipped reasons: ${JSON.stringify(preview.skippedReasons)}`);

  if (preview.invalidRecords.length > 0) {
    console.log(`Invalid records: ${preview.invalidRecords.length}`);
    for (const issue of preview.invalidRecords.slice(0, 20)) {
      console.log(`- ${issue.id ?? "unknown"}: ${issue.reason}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
