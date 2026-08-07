# AI Quality Reviewer v2

This folder holds v2 of the AI Quality Reviewer, for 180 Degrees Consulting
Delft-Rotterdam: the build documents, the evaluation evidence and the renderer. The
working v1 tool one level up in [../](../) stays untouched and shippable.

**Start at [STATUS.md](STATUS.md).** It is the current state in one page and it is the only
document maintained as current. Everything else here, this file included, is either a dated
record or downstream of it.

**To see the tool, open https://180dc-reviewer.pages.dev.** It is live. To run the renderer
locally instead, open [index.html](index.html) in a browser: no server, no build step, no
install.

Running code here: [index.html](index.html) (the renderer),
[run-reviews.js](run-reviews.js) (the run harness, with `--dry-run` and `--emit-packs`),
[score-review.js](score-review.js) (scoring against a gold label),
[scorecard.js](scorecard.js), [check-gold.js](check-gold.js) (gold-label contradictions),
[check-review-v2.js](check-review-v2.js) (the contract validator),
[check-stability.js](check-stability.js) (run-to-run variance),
[check-docs.js](check-docs.js) (documentation drift) and
[bundle-reviews.js](bundle-reviews.js). The reviewer itself is a prompt, not a program:
it runs from section A of [04-prompt-templates.md](04-prompt-templates.md), read and hashed
at run time so the harness cannot drift from the document.

Status in one line, 2026-08-07: live, run on nine real gold-backed cases twice, and the
instrument that scores those runs was measured on 2026-08-05 and does not work, so no recall
or coverage percentage from this project is quotable. The findings are trustworthy and the
readiness level is not. See [STATUS.md](STATUS.md), and
[18-evidence-base.md](18-evidence-base.md) for what is actually established.

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
| `12-real-deck-intake.md` | - | the pipeline that turned past deliverables into real eval cases |
| `13-usage-guide.md` | - | how to run it and read the output |
| `14-value-proposition.md` | - | the case for the tool, written for a sceptical reader |
| `15-implementation-plan.md` | - | the phased build plan |
| `16-board-package.md` | - | the 2026-07-22 decision paper, with dated corrections in section 0 |
| `16a-board-package-stress-test.md` | - | dated adversarial audit of 16 |
| `17-override-log.md` | - | the lead override record and the Triage Desk design |
| `18-evidence-base.md` | - | **what is actually established**, separated from what is hypothesis |
| `19-prompt-change-2026-08-05.md` | - | the two-axis prompt change and its archive and revert record |
| `20-running-it-free.md` | - | running the harness with no API spend |
| `21-scorer-refit-sprint.md` | - | the sprint that measured the matcher and found it broken |
| `STATUS.md` | - | **the entry point.** Current state, and the only file kept current |
| `LIVE-URL.md` | - | the deployed URL and how to redeploy |
| `index.html` | - | the renderer: student coaching view, project lead view, printable |
| `run-reviews.js` | - | the run harness: dry run, cost estimate, packs, collect |
| `score-review.js` | - | scores one review against a gold label. **Its matcher is known broken** |
| `scorecard.js` | - | rolls scored reviews into a run scorecard |
| `check-gold.js` | - | rejects internally contradictory gold labels |
| `bundle-reviews.js` | - | inlines the eval-runs outputs into index.html so it works from file:// |
| `check-review-v2.js` | - | the contract validator |
| `check-stability.js` | - | run-to-run variance across repeated runs of one case |
| `check-docs.js` | - | documentation drift: version strings and dead references |
| `eval-cases/` | 4 | synthetic anonymized deliverables plus gold-label files |
| `eval-cases-real/` | - | 14 anonymised real deliverables. 11 have human golds, 9 are usable |
| `eval-runs/` | - | live blind outputs, scoring sheets and the stability runs |
| `expert-pack/` | 6 | the assembled pack and sample outputs |

Build prompts (`BUILD-PROMPT-*.md`) and gate records (`GATE-STOP-*.md`) are dated working
documents for one sprint each. They are not maintained after that sprint runs.

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
