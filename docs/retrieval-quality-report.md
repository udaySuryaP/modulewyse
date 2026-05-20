# ModuleWyse Retrieval Quality Report

Date: 2026-05-20

## Scope

This report covers vector retrieval quality for ready PBCST304 Object Oriented Programming note chunks from Modules 1-3.

No chat/RAG route, answer generation, app UI change, previous-year-question embedding, Module 4 embedding, or Module 5 content was added.

## Embedding Configuration

- Embedding model: `text-embedding-3-small`
- Embedding dimensions: `1536`
- Eligible content: ready OOP PBCST304 note chunks from Modules 1, 2, and 3
- Total eligible chunks: 242
- Embedded chunks: 242
- Failed chunks: 0
- Skipped chunks: 0

Excluded content:

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

## Embedding Status

Before generation:

- Total ready PBCST304 chunks: 242
- Embedded: 0
- Pending: 242
- Failed: 0
- Skipped: 0

After generation:

- Total ready PBCST304 chunks: 242
- Embedded: 242
- Pending: 0
- Failed: 0
- Skipped: 0

Module distribution after generation:

- Module 1: 144 embedded
- Module 2: 53 embedded
- Module 3: 45 embedded

## Retrieval Tests

### 1. Explain classes and objects

Top retrieved chunks:

1. Module 1, topic `Class`, similarity `0.5689`
2. Module 1, topic `Object`, similarity `0.5578`
3. Module 1, topic `Classes`, similarity `0.5314`

Judgment: good.

Notes: Top results are directly relevant and include both class and object explanations.

### 2. What is inheritance?

Top retrieved chunks:

1. Module 1, topic `Inheritance`, similarity `0.5750`
2. Module 1, topic `Members, Final Variables, Inner Classes`, similarity `0.4315`
3. Module 2, topic `Inheritance`, similarity `0.3823`

Judgment: acceptable.

Notes: The top result is strong. The second result is a syllabus/topic-list fragment and should be cleaned or down-ranked later.

### 3. Explain constructors in OOP

Top retrieved chunks:

1. Module 2, topic `Shipping Cost: $1.28`, similarity `0.5798`
2. Module 2, topic `Constructor B Obj2: A=10 B=20`, similarity `0.4911`
3. Module 1, topic `This() // Default Constructor`, similarity `0.4841`

Judgment: weak.

Notes: Content is constructor-related, but topic titles are extraction artifacts. Chunk headings should be cleaned before answer generation.

### 4. Difference between class and object

Top retrieved chunks:

1. Module 1, topic `Object`, similarity `0.5961`
2. Module 1, topic `Class`, similarity `0.5596`
3. Module 1, topic `Classes`, similarity `0.4998`

Judgment: good.

Notes: Top results are directly relevant and enough for a grounded answer.

### 5. Explain method overloading

Top retrieved chunks:

1. Module 2, topic `Method Overloading`, similarity `0.6665`
2. Module 2, topic `Add(doc1, Doc2) Merges Two Documents`, similarity `0.6384`
3. Module 2, topic `// System.out.println(p.message); // Error`, similarity `0.5521`

Judgment: acceptable.

Notes: The first result is strong. Later results contain useful content but noisy extracted titles.

### 6. What is polymorphism?

Top retrieved chunks:

1. Module 2, topic `Polymorphism`, similarity `0.7089`
2. Module 2, topic `Runtime Polymorphism (method Overriding)`, similarity `0.5679`
3. Module 2, topic `Compile Time Polymorphism (method Overloading)`, similarity `0.5243`

Judgment: good.

Notes: Top results are highly relevant and cover the core concept and subtypes.

### 7. Explain access specifiers

Top retrieved chunks:

1. Module 1, topic `Access Modifiers`, similarity `0.5190`
2. Module 2, topic `Protected Members`, similarity `0.5181`
3. Module 1, topic `Types Of Access Modifiers In Java: A. Private`, similarity `0.5129`

Judgment: good.

Notes: Results are relevant. Terminology differs between access specifiers and access modifiers but maps correctly.

### 8. What is dynamic binding?

Top retrieved chunks:

1. Module 2, topic `Runtime Polymorphism (method Overriding)`, similarity `0.4102`
2. Module 1, topic `Casting`, similarity `0.4005`
3. Module 2, topic `// System.out.println(p.message); // Error`, similarity `0.3512`

Judgment: weak.

Notes: The first result is indirectly relevant through dynamic method dispatch, but direct dynamic binding content is weak or missing. This needs content/chunk cleanup before answer generation.

## Main Retrieval Problems

- Several chunks have noisy extraction-derived titles, especially constructor and code-example sections.
- Some short syllabus/list fragments are retrieved for concept queries.
- Some content still contains page markers and copied-note artifacts.
- Dynamic binding does not retrieve a strong direct explanation.
- Similarity scores are usable for clear concepts, but weaker queries drop into noisy fragments quickly.

## Chunking Problems

- Topic detection is too literal when copied notes contain code output, captions, or OCR artifacts.
- Some useful content is split into narrow fragments with poor titles.
- Some concept headings should be normalized to canonical topic names.

## Final Verdict

PARTIALLY READY — RETRIEVAL NEEDS CLEANUP

The embedding pipeline works and retrieval is useful for classes/objects, polymorphism, access modifiers, and method overloading. Before RAG answer generation, the PBCST304 chunks should be cleaned for noisy headings and weak/missing direct coverage of constructors and dynamic binding.

## Next

1. Clean noisy PBCST304 chunk titles and extracted fragments.
2. Add or normalize direct topic sections for constructors and dynamic binding.
3. Rerun content preview/ingestion if source notes change.
4. Regenerate embeddings for changed chunks.
5. Rerun retrieval tests before wiring answer generation.
