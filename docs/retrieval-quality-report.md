# ModuleWyse Retrieval Quality Report

Date: 2026-05-20

## Scope

This report covers vector retrieval quality for ready PBCST304 Object Oriented Programming note chunks from Modules 1-3.

No chat/RAG route, answer generation, app UI change, previous-year-question embedding, Module 4 embedding, or Module 5 content was added. Module 5 is not part of the KTU 2024 scheme.

## Embedding Configuration

- Embedding model: `text-embedding-3-small`
- Embedding dimensions: `1536`
- Eligible content: ready OOP PBCST304 note chunks from Modules 1, 2, and 3
- Excluded content:
  - Module 4 draft/review notes
  - Module 5, which is not part of the KTU 2024 scheme
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

## Final Cleanup Pass

Additional source-supported cleanup:

- Retitled remaining constructor code-signature topics:
  - `Box(double Len)` -> `Parameterized Constructor Example`
  - `Box(box Ob)` -> `Copy Constructor Example`
  - `Boxweight(boxweight Ob)` -> `Subclass Copy Constructor Example`
  - `Person(person P) // Copy Constructor` -> `Copy Constructor with Object Parameter`
- Retitled constructor output/example topics:
  - `Box B2 = New Box();` -> `Constructor Overloading Output`
  - `Boxweight Mybox2 = New Boxweight();` -> `Subclass Constructor Output Example`
- Retitled access-modifier extraction headings:
  - `Types Of Access Modifiers In Java: A. Private` -> `Access Modifier Types`
  - `Outside The Package(subclass)` -> `Access Modifier Comparison Table`
- Updated chunk preparation to strip copied-note page markers from generated chunk content.
- Updated test-only retrieval ranking so exact constructor-overloading topics are preferred over adjacent constructor examples.

No source meaning was changed and no academic explanations were invented.

## Final Result

Preview result:

- Sources: 4
- Chunks: 178
- Warnings: 310

Ingestion result:

- Sources upserted: 3
- Chunks upserted: 178
- Sources skipped: 1 (`module-4.md`)

Embedding result:

- Total ready PBCST304 chunks: 178
- Embedded: 178
- Pending: 0
- Failed: 0
- Skipped: 0

Module distribution:

- Module 1: 107 embedded
- Module 2: 42 embedded
- Module 3: 29 embedded

Live exclusion check:

- Embedded Module 1-3 chunks: 178
- Embedded Module 4 chunks: 0
- Embedded Module 5 chunks: 0, because Module 5 is not part of the KTU 2024 scheme
- Embedded previous-question chunks: 0
- Embedded non-ready chunks: 0

## Final Retrieval Tests

### 1. Explain classes and objects

Top retrieved chunks:

1. Module 1, topic `Object`, similarity `0.6142`
2. Module 1, topic `Class`, similarity `0.5689`
3. Module 1, topic `Characteristics`, similarity `0.5104`

Judgment: good.

### 2. What is inheritance?

Top retrieved chunks:

1. Module 1, topic `Inheritance`, similarity `0.5750`
2. Module 2, topic `Inheritance`, similarity `0.3827`
3. Module 1, topic `Object Type Casting`, similarity `0.3793`

Judgment: acceptable.

### 3. Explain constructors in OOP

Top retrieved chunks:

1. Module 1, topic `Constructor Chaining with this()`, similarity `0.5421`
2. Module 2, topic `Calling Order of Constructors`, similarity `0.5414`
3. Module 1, topic `Default Constructor`, similarity `0.4448`

Judgment: acceptable.

Notes: The retrieved chunks are constructor-related and citation-safe. A broad constructor-definition chunk is still not the strongest result, so answer generation should use strict source-grounded synthesis from multiple chunks.

### 4. Difference between class and object

Top retrieved chunks:

1. Module 1, topic `Object`, similarity `0.6665`
2. Module 1, topic `Class`, similarity `0.5596`
3. Module 2, topic `Static Members`, similarity `0.4722`

Judgment: good.

### 5. Explain method overloading

Top retrieved chunks:

1. Module 2, topic `Method Overloading`, similarity `0.6814`
2. Module 2, topic `Compile Time Polymorphism (method Overloading)`, similarity `0.5325`
3. Module 2, topic `Method Overloading Output`, similarity `0.5118`

Judgment: good.

Notes: The noisy overriding/dynamic-dispatch results are no longer in the top 3 after test-only reranking.

### 6. What is polymorphism?

Top retrieved chunks:

1. Module 2, topic `Polymorphism`, similarity `0.6840`
2. Module 2, topic `Runtime Polymorphism (method Overriding)`, similarity `0.5696`
3. Module 1, topic `Polymorphism`, similarity `0.5461`

Judgment: good.

### 7. Explain access specifiers

Top retrieved chunks:

1. Module 1, topic `Access Modifier Types`, similarity `0.7326`
2. Module 2, topic `Access Modifier Types`, similarity `0.7257`
3. Module 2, topic `Access Modifier Comparison Table`, similarity `0.6435`

Judgment: acceptable.

Notes: Results are relevant and the old extraction headings are gone. The table content is still compact, but usable for citation-backed answers.

### 8. What is dynamic binding?

Top retrieved chunks:

1. Module 2, topic `Dynamic Method Dispatch`, similarity `0.7089`
2. Module 2, topic `Runtime Polymorphism (method Overriding)`, similarity `0.6524`
3. Module 2, topic `Late Binding and Early Binding`, similarity `0.4710`

Judgment: good.

### 9. Explain default constructor

Top retrieved chunks:

1. Module 1, topic `Default Constructor`, similarity `0.6791`
2. Module 1, topic `Constructor Chaining with this()`, similarity `0.5035`
3. Module 2, topic `Copy Constructor with Object Parameter`, similarity `0.4008`

Judgment: acceptable.

Notes: The top result is correct and the remaining constructor result titles are semantic.

### 10. Explain copy constructor

Top retrieved chunks:

1. Module 1, topic `Copy Constructor`, similarity `0.6201`
2. Module 1, topic `Constructor Chaining with this()`, similarity `0.3689`
3. Module 2, topic `Copy Constructor with Object Parameter`, similarity `0.3541`

Judgment: acceptable.

### 11. Explain parameterized constructor

Top retrieved chunks:

1. Module 1, topic `Parameterized Constructor`, similarity `0.5874`
2. Module 1, topic `Constructor Chaining with this()`, similarity `0.5398`
3. Module 1, topic `Default Constructor`, similarity `0.4486`

Judgment: acceptable.

### 12. Explain runtime polymorphism

Top retrieved chunks:

1. Module 2, topic `Runtime Polymorphism (method Overriding)`, similarity `0.7341`
2. Module 2, topic `Compile Time Polymorphism (method Overloading)`, similarity `0.6395`
3. Module 2, topic `Dynamic Method Dispatch`, similarity `0.5809`

Judgment: good.

### 13. Explain dynamic method dispatch

Top retrieved chunks:

1. Module 2, topic `Dynamic Method Dispatch`, similarity `0.7400`
2. Module 2, topic `Runtime Polymorphism (method Overriding)`, similarity `0.6524`
3. Module 2, topic `Method Overriding`, similarity `0.5956`

Judgment: good.

### 14. Explain constructor overloading

Top retrieved chunks:

1. Module 2, topic `Constructor Overloading Output`, similarity `0.5844`
2. Module 2, topic `Constructor Overloading Example`, similarity `0.5842`
3. Module 2, topic `Subclass Copy Constructor Example`, similarity `0.6082`

Judgment: acceptable.

Notes: The direct constructor-overloading chunks now rank first. The third result is adjacent constructor material, but no code-signature topic titles remain.

### 15. Difference between private public protected and default access modifiers

Top retrieved chunks:

1. Module 2, topic `Access Modifier Types`, similarity `0.7069`
2. Module 1, topic `Access Modifier Types`, similarity `0.7039`
3. Module 2, topic `Access Modifiers in Java`, similarity `0.5581`

Judgment: good.

### 16. Difference between method overloading and overriding

Top retrieved chunks:

1. Module 2, topic `Method Overloading`, similarity `0.5830`
2. Module 2, topic `Compile Time Polymorphism (method Overloading)`, similarity `0.4655`
3. Module 2, topic `Method Overriding`, similarity `0.6059`

Judgment: good.

Notes: The top results include both overloading and overriding source chunks, so this is citation-safe for a comparison answer.

## Remaining Problems

- General constructor queries retrieve relevant constructor chunks, but the exact `Constructor Definition` chunk is not always top-ranked.
- Some source notes remain compact/OCR-like because the cleanup avoided inventing explanations.
- Access-modifier comparison content is still table-like, but headings are now semantic and citation-safe.
- Test-only reranking is not yet wired into app retrieval or chat.

## Final Verdict

READY FOR RAG ANSWER GENERATION

Retrieval is clean enough to start a strict RAG MVP for PBCST304. Constructors, constructor overloading, access specifiers, dynamic binding, dynamic method dispatch, method overloading, and polymorphism all retrieve source-supported, semantically titled chunks. Answer generation should still use an insufficient-source fallback whenever retrieved chunks are too thin or too example-heavy.

## Next

1. Build retrieval-backed answer generation for PBCST304 using embedded chunks.
2. Include citations/source chips and an insufficient-source fallback.
3. Keep Module 4 and previous-year questions out of retrieval until their own ingestion/embedding phase. Keep Module 5 out permanently because it is not part of the KTU 2024 scheme.
