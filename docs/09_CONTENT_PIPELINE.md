# 09 — Content Pipeline

## Current approach
Admin UI is deferred. Content is curated manually through scripts, seed files, Supabase dashboard, and protected internal routes.

## Flow
```txt
Collect source
→ clean text
→ assign subject/module/topic
→ chunk
→ embed
→ store chunks
→ test retrieval
→ run eval
→ publish subject
```

## Source types
syllabus, notes, answer_key, question_paper, manual, verified_answer.

## First content priority
1. OOP notes
2. OOP syllabus
3. OOP previous questions
4. OOP verified answers
5. DBMS, OS, CN, Data Structures

## Chunk metadata
Store subject, subject_code, semester, module_number, topic, source_type, source_title, and scheme.

## Do not prioritize now
OCR, handwritten notes, student uploads, all branches, all subjects.
