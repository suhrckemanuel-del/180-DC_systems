# Portfolio workbench

This is the private operating area for turning selected past 180DC engagements into public portfolio case studies. It is not a library of client deliverables and it must never become one.

## The workflow

1. **Triage** the archive and create a shortlist.
2. **Score** candidates against `selection-rubric.md`, using the source artifact as evidence.
3. **Clear publication safety** before copying any source, exhibit or claim into a public case study.
4. **Build a case-study source pack** using the local-only template, then create a separate public-facing case study. Do not upload the raw deck or report.
5. **Run the Quality Reviewer method** on the public-facing version: quote-or-abstain, evidence/logic/readability checks, strict finding budget and a human lead decision.
6. **Publish only selected exhibits** to the website, with a clear call to action. The public site should never expose a client source file by default.

## Folder conventions

- `qa/` contains temporary renders and inspection material. It is not publishable.
- Each approved candidate gets a numbered folder with a short public-safe slug.
- Raw source files, extracted client text and original screenshots are local-only and must remain ignored by Git.
- A `PUBLIC-OK.md` file, completed by a named branch lead, is required before any public copy or exhibit is used.

## Working documents

- `selection-rubric.md` is the strict candidate-evaluation rubric.
- `review-and-rebuild-protocol.md` explains the source-pack, Quality Reviewer and human-signoff sequence.
- `PUBLIC-OK-template.md` is the final release record.
- `website-integration.md` defines the card and case-study experience for the client site.
- `v15-case-study-section.md` turns the existing V15 placeholder area into the first three case-study cards.

## Decision rule

An attractive source deck does not make a public case study. A candidate must pass every publication-safety gate and score at least 78/100 on the selection rubric. Human approval is the final gate.
