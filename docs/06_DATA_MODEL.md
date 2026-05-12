# 06 — Data Model

## Core tables

### profiles
Student editable profile. No role field.

Fields: id, full_name, email, college_name, branch, semester, graduation_year, onboarding_completed, created_at, updated_at.

### user_roles
Protected roles. Fields: user_id, role, created_at, updated_at. Only service/admin path can change.

### subjects
Fields: id, branch, scheme, semester, code, name, status, priority, created_at, updated_at.

Status: draft, beta, available, coming_soon, hidden.

### modules
Fields: id, subject_id, module_number, title, description, status.

### topics
Fields: id, subject_id, module_id, name, aliases, priority, status.

### content_sources
Original curated content. Fields: id, subject_id, module_id, source_type, title, file_url, raw_text, cleaned_text, status, created_by.

### content_chunks
RAG chunks. Fields: id, source_id, subject_id, module_id, topic_id, chunk_text, chunk_index, content_type, status, embedding vector(1536), metadata.

### verified_answers
Fields: id, subject_id, module_id, topic_id, question, normalized_question, normalized_question_hash, answer_type, answer, expected_keywords, quality_score, status, embedding vector(1536), reviewed_by, reviewed_at.

### conversations
Fields: id, user_id, subject_id, module_id, title, created_at, updated_at.

### messages
Fields: id, conversation_id, user_id, role, content, answer_type, answer_status, model_used, retrieved_chunk_ids, verified_answer_id, created_at.

### message_feedback
Fields: id, message_id, user_id, rating, reason, created_at.

### question_library
Fields: id, subject_id, module_id, topic_id, question_text, answer_type, year, month, source, status.

## Integrity rules
- module must belong to subject
- topic must belong to module/subject
- chunk subject/module/topic must match
- verified answer subject/module/topic must match
- users cannot edit roles
