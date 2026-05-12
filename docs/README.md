# KTU Prep AI — Current Documentation Pack

Updated: 2026-05-12  
Status: Current canonical project docs  
Scope: Student-side MVP first, CSE-first, important subjects first  
Product model: OpenAI `o4-mini`  
Embedding model: OpenAI `text-embedding-3-small`  
Vector dimension: `1536`

## Current project direction
KTU Prep AI is a curated KTU CSE exam-prep answer engine. It is not a generic chatbot.

Students can sign up, complete onboarding, select semester/subject/module, ask questions, get syllabus-grounded answers from curated content, copy answers, give feedback, browse subjects/library, edit profile/settings, and sign out.

Students do not upload notes. Admin UI is deferred. Content is initially curated by the developer through scripts, seed files, Supabase dashboard, and protected internal routes.

## Read order
1. `00_MASTER_PLAN.md`
2. `01_PRD.md`
3. `02_USERFLOW_STUDENT.md`
4. `03_DESIGN_SYSTEM_STUDENT.md`
5. `04_TECH_STACK.md`
6. `05_ARCHITECTURE.md`
7. `06_DATA_MODEL.md`
8. `07_API_FUNCTIONS.md`
9. `08_RAG_QUALITY.md`
10. `09_CONTENT_PIPELINE.md`
11. `10_SECURITY_RLS.md`
12. `11_ERROR_EDGE_CASES_STUDENT.md`
13. `12_PROMPTS.md`
14. `13_EVAL_TESTSET.md`
15. `14_IMPLEMENTATION_TICKETS.md`
16. `15_ROADMAP_TIMELINE.md`
17. `16_PROJECT_DIARY.md`
18. `17_RELEASE_CRITERIA.md`
19. `18_UI_SCREEN_MAP_STUDENT.md`
20. `19_VIBE_CODING_WORKFLOW.md`

## Non-negotiables
- Build CSE first, not all branches.
- Build important subjects first, not all subjects.
- Start with OOP.
- Use `o4-mini` because free OpenAI API credits are available.
- Keep model IDs in env variables.
- Use `text-embedding-3-small` with `vector(1536)`.
- Do not ship weak subjects.
- Do not rely on the model alone for correctness.
- Do not expose draft/hidden content.
- Do not let users edit roles.
