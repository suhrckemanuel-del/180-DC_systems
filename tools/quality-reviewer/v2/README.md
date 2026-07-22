# AI Quality Reviewer v2

This folder holds v2 of the AI Quality Reviewer, for 180 Degrees Consulting
Delft-Rotterdam: the build documents, the evaluation evidence and the renderer. The
working v1 tool one level up in [../](../) stays untouched and shippable.

**To see it, open [index.html](index.html) in a browser.** No server, no build step, no
install. Pick one of the bundled live reviews and read it as a student, as a project lead
or as a printable.

Running code here: [index.html](index.html) (the renderer),
[check-review-v2.js](check-review-v2.js) (the contract validator),
[check-stability.js](check-stability.js) (run-to-run variance) and
[bundle-reviews.js](bundle-reviews.js). The reviewer itself is a prompt, not a program:
it runs in a Claude Project built from [04-prompt-templates.md](04-prompt-templates.md).

Status in one line: green on five synthetic cases, independently scored twice, with
run-to-run stability now measured. It has never run on a real client deliverable, and it
must not until human gold labels exist. See [progress.md](progress.md).

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
| `index.html` | - | the renderer: student coaching view, project lead view, printable |
| `bundle-reviews.js` | - | inlines the eval-runs outputs into index.html so it works from file:// |
| `check-review-v2.js` | - | the contract validator |
| `check-stability.js` | - | run-to-run variance across repeated runs of one case |
| `eval-cases/` | 4 | synthetic anonymized deliverables plus gold-label files |
| `eval-cases-real/` | - | 14 anonymised real deliverables, awaiting human gold labels |
| `eval-runs/` | - | live blind outputs, scoring sheets and the stability runs |
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
