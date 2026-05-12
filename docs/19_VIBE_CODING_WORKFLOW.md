# 19 — Vibe Coding Workflow

## Build approach
AI writes most code. Human controls architecture, security, data quality, prompts, evals, and release decisions.

## Tools
Primary: Claude Code. Secondary: Codex for review/tests. Editor: Cursor or VS Code.

## Rule
Never ask AI to build the whole app at once. Implement one phase/ticket at a time.

## Recommended loop
1. Pick one ticket.
2. Ask Claude Code to implement only that ticket.
3. Run app/tests.
4. Ask Codex to review diff.
5. Fix issues.
6. Commit.

## Manual checkpoints
Review schema/RLS after database. Test auth routes. Inspect retrieved chunks manually. Run evals before beta.
