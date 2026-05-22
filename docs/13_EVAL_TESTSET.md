# 13 — Eval Testset

## Purpose
No subject should be marked available without eval.

## First subject
Object Oriented Programming.

## Minimum OOP beta eval
For PBCST304 under the KTU 2024 scheme, cover Modules 1-4 only. Module 5 does not exist in the KTU 2024 scheme for PBCST304 and must not be included in QA prompts or expected-source checks.

Minimum beta coverage:
- Modules 1-3: supported answer tests from reviewed notes.
- Module 4: insufficient-source or review-state tests until reviewed notes are ready.
- Module 5: non-existent-module fallback test only.

## Full subject eval
30 short, 30 medium, 20 long, 20 previous-question style prompts.

## Eval fields
question, subject, module, topic, answer_type, expected_keywords, must_not_include, source_reference, ideal_answer_outline, score_criteria.

## Scoring
0 wrong, 1 weak, 2 usable, 3 good, 4 excellent.

## Pass gate
80%+ score 3+, no critical wrong answers, all valid PBCST304 modules represented, insufficient-source behavior works, and Module 5 questions explicitly state that PBCST304 under the KTU 2024 scheme does not include Module 5.
