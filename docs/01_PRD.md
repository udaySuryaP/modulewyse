# 01 — Product Requirements Document

## Product name
ModuleWyse

## Target users
KTU CSE students preparing for exams.

## Problem
Students depend on scattered notes, PDFs, previous questions, and last-minute explanations. Generic AI can answer questions, but it does not know selected KTU subject context, module context, curated notes, answer format, or available platform content.

## Solution
A student selects semester, subject, module, and answer type, then asks a question. The app retrieves curated source chunks, generates an answer with `o4-mini`, verifies grounding, and returns a structured answer with source chips.

## MVP includes
- Landing page
- Signup/login/forgot password
- Onboarding
- Student app shell
- Chat
- Answer cards and states
- Subjects page
- Subject detail
- Library page
- Profile
- Settings
- Sign-out flow
- Student edge states
- OOP content ingestion
- RAG retrieval
- Feedback
- OOP eval testset

## MVP excludes
- Admin UI
- Student uploads
- OCR
- Payments
- All branches
- All CSE subjects
- Mobile app
- Faculty dashboard

## Core answer states
- `verified`
- `generated_from_notes`
- `needs_review`
- `insufficient_source`
- `error`

## Success metrics
- OOP eval pass rate above 80%
- No critical hallucinations in common questions
- High copy/feedback usefulness during beta
- 30–100 private beta students
