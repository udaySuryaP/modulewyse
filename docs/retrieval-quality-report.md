# ModuleWyse Retrieval Quality Report

Date: 2026-05-20

## Scope

This report covers the embedding/retrieval preparation phase for ready PBCST304 Object Oriented Programming note chunks only.

No chat/RAG route, answer generation, app UI change, previous-year-question embedding, Module 4 embedding, or Module 5 content was added.

## Embedding Configuration

- Embedding model: `text-embedding-3-small`
- Embedding dimensions: `1536`
- Eligible content: ready OOP PBCST304 note chunks from Modules 1, 2, and 3
- Excluded content:
  - Module 4 draft/review notes
  - Module 5, which does not exist for PBCST304
  - previous-year questions
  - draft content

## Live Database Verification

- `pgvector` extension: verified live, version `0.8.0`
- `public.content_chunks` embedding columns: verified live
- Embedding indexes: verified live
  - `content_chunks_embedding_status_idx`
  - `content_chunks_embedding_model_idx`
  - `content_chunks_embedding_hnsw_idx`
- Retrieval function: `public.match_content_chunks`
- Function access:
  - `anon`: no execute
  - `authenticated`: no execute
  - `service_role`: execute

## Embedding Status Before Generation

- Total ready PBCST304 chunks: 242
- Embedded: 0
- Pending: 242
- Failed: 0
- Skipped: 0

Module distribution:

- Module 1: 144 pending
- Module 2: 53 pending
- Module 3: 45 pending

## Embedding Generation

Embedding generation did not run because `OPENAI_API_KEY` is missing or empty in the local environment.

The script stopped before making an OpenAI request and before modifying embedding rows.

## Retrieval Tests

Retrieval tests were not run because no embeddings were generated.

Planned test queries:

1. Explain classes and objects
2. What is inheritance?
3. Explain constructors in OOP
4. Difference between class and object
5. Explain method overloading
6. What is polymorphism?

## Relevance Judgment

No relevance judgment is available yet because retrieval cannot be evaluated without generated embeddings.

## Problems Found

- `OPENAI_API_KEY` is missing or empty locally.
- All eligible chunks remain pending.
- Retrieval quality cannot be evaluated until embeddings are generated.

## Verdict

NOT READY - EMBEDDINGS/RETRIEVAL BROKEN

Reason: the database foundation is live and verified, but embeddings were not generated because the local OpenAI API key is missing or empty. Retrieval tests must be rerun after the key is configured and `npm run embeddings:generate` succeeds.

## Next

1. Set `OPENAI_API_KEY` locally without committing `.env.local`.
2. Run `npm run embeddings:generate`.
3. Run `npm run embeddings:status`.
4. Run `npm run retrieval:test`.
5. Revisit this report with actual top retrieved chunks and relevance judgments.
