# ModuleWyse Retrieval Quality Report

Date: 2026-05-20

## Scope

This report covers vector retrieval quality for ready PBCST304 Object Oriented Programming note chunks from Modules 1-3.

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

## Before Cleanup

- Embedded chunks: 242
- Verdict: `PARTIALLY READY - RETRIEVAL NEEDS CLEANUP`
- Weak queries:
  - constructors
  - dynamic binding
- Main problems:
  - code-output headings were treated as topic titles
  - syllabus/list fragments appeared in concept retrieval
  - constructor chunks had noisy titles such as `Shipping Cost: $1.28`
  - method-overriding chunks had noisy titles such as `// System.out.println(p.message); // Error`
  - dynamic binding was retrieved indirectly instead of through a direct `Dynamic Method Dispatch` topic

## Cleanup Performed

### Source Markdown

Changed files:

- `content/oop/module-1.md`
- `content/oop/module-2.md`

Structural cleanup:

- Converted the initial Module 1 syllabus outline from standalone topic headings into an outline paragraph.
- Normalized constructor sections:
  - `Constructor Definition`
  - `Default Constructor`
  - `Parameterized Constructor`
  - `Copy Constructor`
  - `Constructor Chaining with this()`
- Replaced code/output headings with inline example/output text where the content was source-supported.
- Normalized Module 2 constructor material:
  - `Superclass Constructor Call Example`
  - `Calling Order of Constructors`
- Normalized runtime polymorphism material:
  - `Method Overriding`
  - `Dynamic Method Dispatch`
  - `Late Binding and Early Binding`

No academic explanations were invented. Edits reorganized and retitled existing copied notes only.

### Chunking Rules

Changed file:

- `scripts/prepare-content-chunks.ts`

Improvements:

- obvious code/output headings are attached to the previous valid topic instead of becoming standalone chunks
- short syllabus/outline fragments can be skipped from retrieval chunks
- generated chunk metadata now includes:
  - `chunkKind`
  - `retrievalEligible`

### Retrieval Test Ranking

Changed file:

- `scripts/test-content-retrieval.ts`

Improvements:

- added test-only query expansion for:
  - constructors
  - constructor overloading
  - default constructor
  - dynamic binding / dynamic method dispatch
  - access specifiers
- this is not wired into chat or answer generation

## After Cleanup

Preview result:

- Sources: 4
- Chunks: 175
- Warnings: 303

Ingestion result:

- Sources upserted: 3
- Chunks upserted: 175
- Sources skipped: 1 (`module-4.md`)

Embedding result:

- Total ready PBCST304 chunks: 175
- Embedded: 175
- Pending: 0
- Failed: 0
- Skipped: 0

Module distribution:

- Module 1: 107 embedded
- Module 2: 38 embedded
- Module 3: 30 embedded

Live exclusion check:

- Embedded Module 1-3 chunks: 175
- Embedded Module 4 chunks: 0
- Embedded Module 5 chunks: 0
- Embedded previous-question chunks: 0
- Embedded non-ready chunks: 0

## Retrieval Tests After Cleanup

### 1. Explain classes and objects

Top retrieved chunks:

1. Module 1, topic `Object`, similarity `0.6143`
2. Module 1, topic `Class`, similarity `0.5689`
3. Module 1, topic `Classes`, similarity `0.5314`

Judgment: good.

### 2. What is inheritance?

Top retrieved chunks:

1. Module 1, topic `Inheritance`, similarity `0.5750`
2. Module 2, topic `Inheritance`, similarity `0.3823`
3. Module 1, topic `Object Type Casting`, similarity `0.3746`

Judgment: acceptable.

### 3. Explain constructors in OOP

Top retrieved chunks:

1. Module 1, topic `Constructor Chaining with this()`, similarity `0.5421`
2. Module 2, topic `Calling Order of Constructors`, similarity `0.5354`
3. Module 2, topic `Superclass Constructor Call Example`, similarity `0.5148`

Judgment: acceptable.

Notes: The bad currency/output titles are gone. The top results are constructor-related, but a general constructor definition is still not the strongest result.

### 4. Difference between class and object

Top retrieved chunks:

1. Module 1, topic `Object`, similarity `0.6663`
2. Module 1, topic `Class`, similarity `0.5596`
3. Module 1, topic `Classes`, similarity `0.4999`

Judgment: good.

### 5. Explain method overloading

Top retrieved chunks:

1. Module 2, topic `Method Overloading`, similarity `0.6598`
2. Module 2, topic `Method Overriding`, similarity `0.5729`
3. Module 2, topic `Dynamic Method Dispatch`, similarity `0.5437`

Judgment: acceptable.

Notes: The first result is strong. The following results are related polymorphism material but should be ranked below compile-time polymorphism in a future reranker.

### 6. What is polymorphism?

Top retrieved chunks:

1. Module 2, topic `Polymorphism`, similarity `0.6840`
2. Module 2, topic `Runtime Polymorphism (method Overriding)`, similarity `0.5679`
3. Module 2, topic `Compile Time Polymorphism (method Overloading)`, similarity `0.5243`

Judgment: good.

### 7. Explain access specifiers

Top retrieved chunks:

1. Module 1, topic `Types Of Access Modifiers In Java: A. Private`, similarity `0.7369`
2. Module 2, topic `Types Of Access Modifiers In Java: A. Private`, similarity `0.7286`
3. Module 2, topic `Outside The Package(subclass)`, similarity `0.6329`

Judgment: acceptable.

Notes: Results are relevant but could benefit from a cleaner consolidated access-modifier table chunk.

### 8. What is dynamic binding?

Top retrieved chunks:

1. Module 2, topic `Dynamic Method Dispatch`, similarity `0.7085`
2. Module 2, topic `Runtime Polymorphism (method Overriding)`, similarity `0.6453`
3. Module 2, topic `Method Overriding`, similarity `0.5301`

Judgment: good.

### 9. Explain default constructor

Top retrieved chunks:

1. Module 1, topic `Default Constructor`, similarity `0.6718`
2. Module 1, topic `Constructor Chaining with this()`, similarity `0.5035`
3. Module 2, topic `Person(person P) // Copy Constructor`, similarity `0.4008`

Judgment: acceptable.

Notes: The top result is correct. Some constructor example headings still need cleanup.

### 10. Explain runtime polymorphism

Top retrieved chunks:

1. Module 2, topic `Runtime Polymorphism (method Overriding)`, similarity `0.7113`
2. Module 2, topic `Compile Time Polymorphism (method Overloading)`, similarity `0.6395`
3. Module 2, topic `Dynamic Method Dispatch`, similarity `0.5810`

Judgment: good.

### 11. Explain dynamic method dispatch

Top retrieved chunks:

1. Module 2, topic `Dynamic Method Dispatch`, similarity `0.7387`
2. Module 2, topic `Runtime Polymorphism (method Overriding)`, similarity `0.6352`
3. Module 2, topic `Method Overriding`, similarity `0.5921`

Judgment: good.

### 12. Explain constructor overloading

Top retrieved chunks:

1. Module 2, topic `Superclass Constructor Call Example`, similarity `0.6388`
2. Module 2, topic `Boxweight(boxweight Ob)`, similarity `0.5957`
3. Module 2, topic `Box(double Len)`, similarity `0.5911`

Judgment: acceptable.

Notes: Results point to the right Box constructor examples, but the example headings are still noisy. This should be manually curated before answer generation.

## Remaining Problems

- Some constructor example headings are still code-shaped:
  - `Boxweight(boxweight Ob)`
  - `Box(double Len)`
  - `Box(box Ob)`
- Access-modifier retrieval is relevant but still table-like and fragmented.
- Method-overloading retrieval pulls related overriding/dynamic-dispatch chunks after the first result.
- Several copied-note artifacts and page markers remain in chunk content.

## Final Verdict

PARTIALLY READY - RETRIEVAL NEEDS CLEANUP

Retrieval is materially better than the previous run. Dynamic binding and dynamic method dispatch are now good. Constructor retrieval is acceptable, but constructor-overloading examples still have noisy code-derived headings. Before answer generation, manually curate the remaining constructor example sections and consider a simple reranker that prefers exact topic matches and concept chunks over examples.

## Next

1. Manually curate remaining constructor example headings in Module 2.
2. Consolidate access-modifier table content into a cleaner source-supported topic chunk.
3. Rerun preview, ingestion, embeddings, and retrieval tests.
4. Build retrieval-backed answer generation only after top constructor results are clean enough for citations.
