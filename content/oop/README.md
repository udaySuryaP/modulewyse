# OOP Content Workspace

This folder is for curated Object Oriented Programming notes prepared by the ModuleWyse team.

Students do not upload notes. Paste only reviewed, syllabus-relevant material that the platform is allowed to use.

## How To Add Notes

1. Open the matching `module-*.md` file.
2. Keep the frontmatter at the top.
3. Add notes under `## Topic:` headings.
4. Keep one topic per section.
5. Mark incomplete sections with `TODO`.
6. Keep `status: draft` until the content is manually reviewed.

## Topic Boundaries

Keep each topic focused. Do not mix unrelated areas in one topic section. If a topic becomes too long, split it into multiple `## Topic:` sections with clearer names.

## Preview

Run:

```bash
npm run content:preview
```

The script writes chunk previews to:

```text
content/generated/oop-chunks.preview.json
```

Review that JSON before any ingestion.
