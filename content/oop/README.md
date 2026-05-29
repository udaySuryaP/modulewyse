# OOP PBCST304 Content Workspace

This folder holds curated Object Oriented Programming notes for PBCST304. Students do not upload notes; these files are developer/admin curated before ingestion.

## Current ingestion status

- Module 1: ready
- Module 2: ready
- Module 3: ready
- Module 4: draft/review
- Module 5: not part of the KTU 2024 scheme and should not be created or ingested

## File rules

Use `module-1.md`, `module-2.md`, `module-3.md`, and `module-4.md` only for this course. Keep previous-year questions in `questions-staging/` until a dedicated question-library schema exists.

Each ready notes file should use frontmatter with `subject: oop`, `subject_code: PBCST304`, `source_type: notes`, and `status: ready`. Draft or uncertain files must use `status: draft` and `needs_review: true`.

Run:

```bash
npm run content:preview
```

Review `content/generated/oop-chunks.preview.json` before running ingestion. Do not ingest draft files, previous-year questions, or unresolved TODO content.
