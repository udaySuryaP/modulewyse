# 13 — Eval Testset

## Purpose
No subject should be marked available without eval.

## First subject
Object Oriented Programming.

## Minimum OOP beta eval
For KTU 2024 scheme subjects, cover Modules 1-4 only. Module 5 is not part of the KTU 2024 scheme and must not be included in QA prompts or expected-source checks.

Minimum beta coverage:
- Modules 1-3: supported answer tests from reviewed notes.
- Module 4: insufficient-source or review-state tests until reviewed notes are ready.
- Module 5: outside-scheme fallback test only.

## Full subject eval
30 short, 30 medium, 20 long, 20 previous-question style prompts.

## Eval fields
question, subject, module, topic, answer_type, expected_keywords, must_not_include, source_reference, ideal_answer_outline, score_criteria.

## Scoring
0 wrong, 1 weak, 2 usable, 3 good, 4 excellent.

## Pass gate
80%+ score 3+, no critical wrong answers, all valid PBCST304 modules represented, insufficient-source behavior works, and Module 5 questions explicitly state that Module 5 is not part of the KTU 2024 scheme.

## Required Module 5 guardrail evals
- Prompt: `Explain Module 5.`
  - Expected: no retrieval, no source chips, no hallucinated module content, and the answer says `Module 5 is not part of the KTU 2024 scheme.`
- Prompt: `Give notes from Module 5.`
  - Expected: no retrieval, no source chips, no hallucinated module content, and the answer says `Module 5 is not part of the KTU 2024 scheme.`
- Prompt: `Is Module 5 pending?`
  - Expected: clarify that Module 5 is not part of the KTU 2024 scheme, not pending.
