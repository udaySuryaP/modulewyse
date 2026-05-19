# ModuleWyse Content Authoring Guide

## Purpose

ModuleWyse uses developer/admin-curated academic material. Students do not upload notes. The content foundation should stay reviewed, syllabus-grounded, and safe to ingest later.

## OOP-First Plan

Start with Object Oriented Programming. Split the subject into five module files, then split each module by topic. Keep content close to KTU syllabus language and exam expectations.

## Source File Format

Content files are Markdown with frontmatter:

```md
---
subject: oop
module: 1
title: Module 1
source_type: notes
status: draft
topics:
  - Classes and objects
---

# Module 1

## Topic: Classes and objects

Paste cleaned notes here.
```

Required metadata:

- `subject`
- `module`
- `title`
- `source_type`
- `status`
- `topics`

## Writing Rules

- Do not paste random internet content.
- Do not include unsourced claims.
- Do not copy textbook dumps.
- Keep language exam-ready and student-readable.
- Prefer KTU syllabus terms where possible.
- Mark uncertain or incomplete content as `TODO`.
- Do not mark content as `ready` until manually reviewed.

## Chunking Guidelines

- Target 300-700 words per useful chunk.
- Keep topic boundaries intact.
- Avoid mixing unrelated topics.
- Preserve subject/module/topic/source metadata.
- Split long topics into multiple clear topic headings before ingestion.

## Metadata Rules

Every source and chunk should preserve:

- `subject_slug`
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
