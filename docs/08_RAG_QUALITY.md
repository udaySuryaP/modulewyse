# 08 — RAG Quality

## Rule
Correctness comes from the system, not the model alone.

## Pipeline
```txt
Question
→ verified answer check
→ embedding
→ filtered vector search
→ prompt assembly
→ o4-mini generation
→ o4-mini verification
→ answer/status
```

## Answer statuses
- verified
- generated_from_notes
- needs_review
- insufficient_source
- error

## Insufficient source rule
If retrieval is weak, do not hallucinate. Return: “I do not have enough verified content for this answer yet.”

## Verification checks
- Are claims supported?
- Is subject/module respected?
- Does answer match answer type?
- Are keywords missing?
- Is it safe to show?

## Eval score
0 wrong, 1 weak, 2 usable, 3 good, 4 excellent.

## Release threshold
A subject should be available only if 80%+ eval answers score 3+ and no critical wrong answers exist.
