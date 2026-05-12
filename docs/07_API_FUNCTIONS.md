# 07 — API Functions

## Auth
- `POST /api/auth/signup`
- `POST /api/auth/signout`
- Supabase login handled client/server helper
- forgot password via Supabase Auth

## Onboarding
`POST /api/onboarding/complete`

Saves college, graduation year, branch, semester, focus subject, referral, and sets onboarding_completed.

## Profile/settings
- `GET /api/profile`
- `PATCH /api/profile`
- `GET /api/settings`
- `PATCH /api/settings/account`
- `PATCH /api/settings/academic`
- `PATCH /api/settings/preferences`

Never allow role updates through profile/settings APIs.

## Subjects
- `GET /api/subjects`
- `GET /api/subjects/:id`

Return only student-visible subjects.

## Library
- `GET /api/library`

Filters: subject_id, module_id, answer_type, year.

## Chat
`POST /api/chat`

Input: conversation_id, subject_id, module_id, answer_type, message, exam_mode.

Flow: auth → visibility validation → rate limit → verified answer check → retrieval → generation → verification → save → response.

## Feedback
`POST /api/feedback`

Input: message_id, rating, reason.

## Internal content routes
For scripts/admin only. Must require service role/admin. Not student-accessible.
