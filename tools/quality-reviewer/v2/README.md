# AI Quality Reviewer v2. Design folder

Design stage. This folder holds the build documents for v2 of the AI Quality
Reviewer, for 180 Degrees Consulting Delft-Rotterdam. Nothing here is running code
yet. The working v1 tool one level up in [../](../) stays untouched and shippable.

## What v2 is

A serious, human-controlled quality-assurance and learning system for student
consulting deliverables. It finds the highest-risk weaknesses in a deliverable before
client submission and helps consultants learn what good consulting reasoning and
communication look like. The success standard is not polish. It is whether a strong
human reviewer, for example an ex-McKinsey consultant, agrees the AI found the most
important issues and gave feedback that would improve client usefulness.

v2 is an evolution of v1, not a rewrite. It keeps what already earns trust: JSON as
the source of truth, quote or abstain, no ghostwriting, a static or printable render
and human accountability. It adds a 10-dimension rubric, blocking-issue readiness
logic (readiness is not an average of scores), a strict noise budget and an
evaluation harness that makes quality measurable.

The first serious version is a Claude Project single-call MVP that applies nine
specialist lenses (A to I) internally and returns one structured JSON object. True
independent multi-agent orchestration is documented as a staged target, built only
once the rubric, the output contract and the eval harness prove useful.

## Philosophy

It critiques before it rewrites. It prioritizes brutally. It surfaces uncertainty. It
says what it cannot assess. It helps teams think better, not just sound better. It
improves client usefulness, project lead leverage and consultant learning. It does not
replace human judgment.

## File map

| File | Sprint | Purpose |
|---|---|---|
| `00-product-definition.md` | 1 | objective, non-objectives, success standard, definition of done, v1 to v2 |
| `01-rubric-v1.md` | 2 | the 10-dimension rubric, anchors, sub-checks, readiness logic, artifact-type scope |
| `02-agent-architecture.md` | 7 | MVP and target multi-agent architecture, synthesis protocol |
| `03-output-contract.md` | 3 | JSON schema, worked example, report structure |
| `04-prompt-templates.md` | 3 | system prompt, input template, the five review modes |
| `05-eval-harness.md` | 5 | evaluation method, gold template, the 7 metrics, acceptance threshold |
| `06-expert-feedback-pack.md` | 6 | the reviewer feedback package, 30 and 60 minute versions |
| `07-workflow.md` | 8 | when and who, human sign-off, adoption, data protection |
| `08-red-team.md` | 9 | failure-mode table |
| `09-roadmap.md` | 9 | pilot roadmap, next actions, open questions |
| `10-source-register.md` | 2 | every source that justifies a design decision, with its limitation |
| `11-decision-log.md` | 1 | one line per decision, appended every sprint |
| `eval-cases/` | 4 | synthetic anonymized deliverables plus gold-label files |
| `expert-pack/` | 6 | the assembled pack and sample outputs |

## Voice rules (apply to every file here)

No Oxford commas. No em or en dashes: use a period, a colon or parentheses. Plain
hyphens only inside compound words. Quotes from a deliverable or a source keep their
own punctuation. Plain, direct, concrete. This is what makes the output read as a
sharp human, not an AI.

## Confidentiality

Testing uses synthetic or anonymized material only. When in doubt: Client A,
Stakeholder B, Team C, Segment D. Never real client names, private client data,
contracts, unpublished financials, named transcripts, personal member information or
confidential board discussions.

## Build order

The plan is in the branch `idea/reviewer-v2`. Sprints 1 to 6 are the critical path to
expert readiness. Sprint 7 is design-ahead. Sprints 8 and 9 harden for pilot. Each
sprint is one focused session with its own exit criteria, so a session ends when its
artifact is real and checked, not when a document merely exists.
