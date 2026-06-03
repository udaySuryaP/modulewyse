# ModuleWyse Content Authoring Guide

## Purpose

ModuleWyse uses developer/admin-curated academic material. Students do not upload notes. The content foundation should stay reviewed, syllabus-grounded, and safe to ingest later.

Use this guide for writing individual content files. Use `docs/DATASET_PREPARATION_GUIDE.md` and `docs/DATASET_QA_CHECKLIST.md` for full subject-level dataset preparation, QA, ingestion readiness, and RAG testset planning.

## OOP-First Plan

Start with Object Oriented Programming for PBCST304 under the KTU 2024 scheme. KTU 2024 scheme subjects use Modules 1-4. PBCST304 Modules 1, 2, and 3 are ready. Module 4 should remain draft/review until cleaned and checked. Module 5 is not part of the KTU 2024 scheme and should not be created, required, or ingested. If a Module 5 file appears accidentally, validation should fail because it is outside the scheme.

Split each module by topic and keep content close to KTU syllabus language and exam expectations.

## Source File Format

Content files are Markdown with frontmatter:

```md
---
subject: oop
subject_name: "Object Oriented Programming"
subject_code: PBCST304
module: 1
title: "Module 1"
source_type: notes
status: ready
needs_review: false
topics:
  - Classes and objects
---

# Module 1

## Topic: Classes and objects

Paste cleaned notes here.
```

Required metadata:

- `subject`
- `subject_name`
- `subject_code`
- `module`
- `title`
- `source_type`
- `status`
- `needs_review`
- `topics`

## Writing Rules

- Do not paste random internet content.
- Do not include unsourced claims.
- Do not copy textbook dumps.
- Keep language exam-ready and student-readable.
- Prefer KTU syllabus terms where possible.
- Mark uncertain or incomplete content as `TODO`.
- Do not mark content as `ready` until manually reviewed.
- Keep Module 4 as `status: draft` and `needs_review: true` until reviewed.
- Do not create or ingest Module 5 because it is not part of the KTU 2024 scheme.
- Keep previous-year questions out of notes files; stage them separately for Library-only workflows.
- Only reviewed `ready` notes can become RAG answer sources.

## Dataset Readiness References

Before preparing a new subject dataset, read:

- `docs/DATASET_PREPARATION_GUIDE.md`
- `docs/DATASET_QA_CHECKLIST.md`

Those docs define:

- the expected folder structure for new subjects
- content quality rules for RAG-ready notes
- preparation statuses: `draft`, `review`, `ready`, `rejected`, and `outside-scheme`
- source type rules for notes, syllabus, previous-year questions, textbook references, and admin notes
- KTU 2024 module rules
- dataset and ingestion readiness checklists
- a reusable RAG testset template

## Chunking Guidelines

- Target 300-700 words per useful chunk.
- Keep topic boundaries intact.
- Avoid mixing unrelated topics.
- Preserve subject/module/topic/source metadata.
- Split long topics into multiple clear topic headings before ingestion.

## Metadata Rules

Every source and chunk should preserve:

- `subject_slug`
- `subject_code`
- `module_number`
- `topic_title`
- `source_type`
- `status`
- `source_title`
- `content_hash`

## Quality Checklist Before Ingestion

- Module is identified.
- Topic is identified.
- No duplicate content.
- No incomplete `TODO` markers if status is `ready`.
- Content is syllabus-relevant.
- Exam usefulness is clear.

## Future But Not Now

Do not add these in this phase:

- embeddings
- vector search
- OpenAI generation
- verification
- evals
- admin UI
