# ModuleWyse Dataset Preparation Guide

This guide defines how to prepare new academic datasets before any ModuleWyse ingestion, chunking, embedding, or RAG use. It is a preparation standard only; it does not approve a dataset for ingestion by itself.

## Scope

Use this guide for new KTU 2024 subject datasets, module notes, syllabus material, and previous-year-question staging.

Do not use this guide to:

- ingest new datasets
- generate embeddings
- mark unreviewed content as ready
- add Module 5 placeholders
- mix previous-year questions into notes

## Canonical Academic Rule

KTU 2024 scheme subjects use Modules 1-4. Module 5 is not part of the KTU 2024 scheme.

For KTU 2024 datasets:

- valid modules: `1`, `2`, `3`, `4`
- invalid/outside-scheme modules: `5` and above
- Module 4 may exist as draft/review content when not answer-ready
- Module 5 must not be created as missing, pending, draft, skipped, or placeholder content
- if Module 5 appears in a source dataset, flag it as `outside-scheme` and do not ingest it

If a user-facing fallback is needed later, the correct wording is:

> Module 5 is not part of the KTU 2024 scheme.

## Dataset Folder Structure

Each new subject should have a dedicated folder under `content/` using a stable lowercase subject slug.

```txt
content/
  <subject-slug>/
    README.md
    module-1.md
    module-2.md
    module-3.md
    module-4.md
    assets/
      <subject-code>_module-<n>_figure-<nn>_<description>.png
    questions-staging/
      previous-year-questions.md
      previous-year-questions.json
```

Example:

```txt
content/oop/
  README.md
  module-1.md
  module-2.md
  module-3.md
  module-4.md
  assets/
  questions-staging/
```

Do not create `module-5.md` for KTU 2024 subjects.

## Subject Metadata

Every dataset must define these subject-level fields before ingestion work starts:

| Field | Required | Example | Notes |
| --- | --- | --- | --- |
| `subject` | Yes | `oop` | Stable lowercase slug. |
| `subject_name` | Yes | `Object Oriented Programming` | Human-readable subject name. |
| `subject_code` | Yes | `PBCST304` | Official course code. |
| `scheme` | Yes | `2024` | Used for module-count rules. |
| `semester` | Yes | `S4` | Use the official academic semester. |
| `module` | Yes | `1` | KTU 2024 valid range is 1-4. |
| `title` | Yes | `Module 1` | Module/source title. |
| `module_title` | Recommended | `Java Basics and OOP Concepts` | Use official syllabus wording where available. |
| `source_type` | Yes | `notes` | See source type rules below. |
| `status` | Yes | `draft`, `review`, or `ready` | See status system below. |
| `needs_review` | Yes | `true` or `false` | `ready` content must be `false`. |
| `topics` | Yes | `Classes and objects` | Must match topic headings in the file. |

## Notes File Template

Use one Markdown file per module for notes. Keep the structure consistent with the existing OOP workspace.

```md
---
subject: <subject-slug>
subject_name: "<Subject Name>"
subject_code: <SUBJECT_CODE>
scheme: 2024
semester: <SEMESTER>
module: 1
title: "Module 1"
module_title: "<Official module title>"
source_type: notes
status: draft
needs_review: true
topics:
  - "<Topic title>"
---

# Module 1

## Topic: <Topic title>

Cleaned, syllabus-grounded notes go here.
```

For current ingestion compatibility, keep existing script-supported frontmatter fields intact. If a dataset is still being prepared, keep it out of `ready` status even if the preparation checklist is partially complete.

## Content Quality Rules

RAG-ready content must be:

- syllabus-grounded and aligned with the official subject/module plan
- module-specific, without mixed-module notes inside one topic
- written with clean headings and `## Topic: ...` boundaries
- free of OCR garbage, broken words, repeated page numbers, copied navigation, headers, footers, and watermarks
- free of duplicate chunks or repeated paragraphs
- free of unsupported claims and invented explanations
- clear enough to answer direct concept, comparison, example, short-answer, and long-answer exam prompts
- separated from previous-year questions
- reviewed manually by a human before `ready`
- limited to KTU 2024 Modules 1-4

Content is not RAG-ready if it:

- contains TODO markers
- has uncertain source quality
- mixes PYQ content into notes
- mixes syllabus outline fragments with explanation content
- uses Module 5 or above for KTU 2024
- contains copied index pages, menus, ads, copyright pages, or unrelated website text
- lacks enough topic context for citations
- is exam-like but not source-supported

## Status System

Use these preparation statuses when reviewing datasets:

| Status | Meaning | RAG eligibility |
| --- | --- | --- |
| `draft` | Raw or partially cleaned content. | Never eligible. |
| `review` | Cleaned enough for academic review, but not approved. | Never eligible. |
| `ready` | Manually reviewed, syllabus-grounded, and source-clean. | Eligible only if `source_type: notes`. |
| `rejected` | Content should not be used because quality, source, or relevance is unacceptable. | Never eligible. |
| `outside-scheme` | Content is outside the academic scheme, such as Module 5 for KTU 2024. | Never eligible. |

Only `ready` notes may become RAG answer sources.

Current scripts may still use narrower stored statuses in some places. Treat `review`, `rejected`, and `outside-scheme` as preparation/review states unless and until the ingestion schema is expanded. They must not be embedded or exposed as answer sources.

## Source Type Rules

Use these source types when preparing datasets:

| Source type | Purpose | RAG answer source? |
| --- | --- | --- |
| `notes` | Reviewed academic notes and cleaned module explanations. | Yes, only after `ready`. |
| `syllabus` | Official topic/module outline. | No by default; use for scope validation and metadata. |
| `previous_year_question` | Previous-year questions and appearances. | Library-only unless explicitly approved later. |
| `textbook_reference` | Bibliographic or reading reference. | No by default; do not copy textbook dumps. |
| `admin_note` | Internal curator notes, decisions, or review comments. | Never. |

Previous-year questions must stay in `questions-staging/` or the Library pipeline. Do not mix PYQs into `notes` files.

## Topic Structure

Each module notes file should use:

```md
## Topic: <Topic title>
```

Topic titles should be:

- concise
- syllabus-aligned
- concept-oriented
- unique within a module where possible
- free of copied code/output headings

Avoid topic titles such as:

- `Output`
- `System.out.println(...)`
- page headers
- website names
- long syllabus comma lists

## Asset Rules

Place diagrams or images under `assets/` and link them with relative paths. Use descriptive names:

```txt
<subject-code>_module-<n>_figure-<nn>_<description>.png
```

Before ingestion readiness, verify:

- every image link resolves
- diagrams are academically relevant
- images do not contain unrelated website chrome or ads
- image content is not required for text-only answer quality unless described in notes

## Previous-Year Question Rules

Previous-year-question datasets must remain separate from notes.

Required fields for staged PYQs:

- question text
- subject code
- subject slug
- module number, if known
- topic, if known
- year, if known
- exam, if known
- marks, if known
- question type, if known
- confidence
- review status

For KTU 2024, any PYQ mapped to Module 5 must be flagged invalid/outside-scheme with:

```txt
Module 5 is not part of the KTU 2024 scheme.
```

PYQs are not RAG answer sources unless a future explicit approval changes that policy.

## Pre-Ingestion Preparation Flow

1. Create the subject folder and README.
2. Collect official subject metadata.
3. Confirm scheme and valid module range.
4. Create only Modules 1-4 for KTU 2024.
5. Separate notes, syllabus, previous-year questions, and admin review notes.
6. Clean source text and remove OCR/page/navigation artifacts.
7. Split content into module-specific topic sections.
8. Assign status for every source.
9. Keep uncertain content as `draft` or `review`.
10. Mark outside-scheme content as invalid and do not ingest it.
11. Run preview and QA checklists before any ingestion command.

## Commands To Use Later

Run these only when a dataset is ready for preview or ingestion work.

```bash
npm run content:preview
npm run questions:preview
npm run content:ingest
npm run questions:ingest
npm run embeddings:generate
npm run embeddings:status
npm run retrieval:test
```

For this preparation phase, do not ingest or embed new datasets.

