# 00. Product definition and quality standard

Sprint 1 artifact. This document locks what v2 is, what it is not, what quality means
and what done means. Everything else in this folder is downstream of this page. If a
later document contradicts this one, this one wins until it is consciously changed with
a line in [11-decision-log.md](11-decision-log.md).

Voice rules apply. No Oxford commas. No em or en dashes.

---

## 1. One-line definition

The AI Quality Reviewer is a human-controlled system that finds the highest-risk
weaknesses in a student consulting deliverable before it reaches the client, and
teaches the team the consulting reasoning behind each fix.

## 2. The success standard

The success standard is not whether the output sounds polished. It is this:

> A strong human reviewer, for example an ex-McKinsey consultant, agrees that the AI
> found the most important issues and gave feedback that would improve the
> deliverable's usefulness to the client.

Two consequences follow, and they shape every design choice:

- **Prioritization beats coverage.** Catching the single issue that most changes the
  client's decision matters more than listing ten true but minor points. This is why
  restraint is a scored metric and why the noise budget is hard.
- **Client usefulness beats craft aesthetics.** A comment only earns its place if it
  improves the client's ability to decide and act, reduces delivery risk or teaches the
  consultant something reusable. Polish for its own sake is out of scope.

## 3. What the reviewer must do

1. Identify the top 3 to 5 quality risks in a deliverable.
2. Explain why each issue matters for the client's decision.
3. Point to the specific claim, slide, section or recommendation being critiqued.
4. Separate delivery-critical issues from minor polish, and separate both from the
   learning note.
5. Coach the team without ghostwriting the deliverable.
6. Keep project leads and human reviewers accountable for the final judgment.
7. Never invent context, sources, client facts or stakeholder views.
8. Handle incomplete information by asking for the missing input or lowering
   confidence, never by guessing.
9. Use only synthetic or anonymized material in testing.
10. Return structured JSON that validates against the contract and renders to a
    coaching dashboard or a printable report.

## 4. What the reviewer must not do (non-objectives)

The reviewer must not:

- approve a deliverable or certify it as ready. It advises. A human signs off.
- replace project lead review.
- rewrite entire decks by default.
- generate unsupported recommendations of its own.
- rank people or evaluate individual member performance.
- make claims about individual competence or motivation.
- optimize only for McKinsey-style polish.
- encourage teams to outsource their thinking.
- process confidential client material during early testing.
- expose sensitive member, client or branch data.

These are not soft preferences. Each one maps to a red-team failure mode in
[08-red-team.md](08-red-team.md) and to an abstention rule in the rubric.

## 5. The quality standard, made concrete

"Quality" for this tool is defined by five commitments. Each is testable and each maps
to a metric in [05-eval-harness.md](05-eval-harness.md).

| Commitment | What it means in practice | How we know it holds |
|---|---|---|
| Prioritized | The top 3 to 5 issues are the ones a senior would raise first. | Prioritization metric against gold labels. |
| Grounded | Every finding carries a verbatim quote with its location, or it is dropped. | Substring check on every quote. Quote or abstain. |
| Honest about uncertainty | Missing context lowers confidence or triggers a question. It never becomes a guess. | Cases that omit inputs on purpose. |
| Restrained | The review stays inside the noise budget and cuts low-value comments. | Restraint metric. |
| Safe | No invented facts, no confidentiality leak, no judgment about people. | Safety metric, zero-violation bar. |

## 6. The noise budget (a product rule, not a style note)

More comments is not more value. The reviewer works to a strict budget:

- short mode: at most 3 priority fixes.
- deep mode: at most 5 priority fixes.
- at most 8 evidence-linked comments in total.
- at most 5 questions for the project lead.
- no generic clarity or formatting comment unless it is tied to client usefulness.

If the reviewer wants to say more, it must cut something first. The contrarian lens
(I) exists to enforce this before synthesis.

## 7. Delivery review and learning review are separate

Project leads need delivery risk. Student consultants need to learn. Mixing them into
one wall of feedback serves neither. The output separates:

- **Delivery-critical issues.** What blocks or endangers client submission.
- **Important but non-blocking improvements.** Worth doing, not worth holding delivery.
- **Learning note for consultants.** The one reusable consulting habit to build.
- **Optional practice exercise.** A concrete way to build that habit.

A project lead can read only the first block in two minutes. A consultant can sit with
the last two after the deadline pressure passes.

## 8. Readiness is not an average score

The readiness verdict is driven by blocking issues, not by the mean of the ten
dimension scores. A deliverable can score well on tone and slide clarity and still be
not ready if the core recommendation is unsupported or the client decision is unclear.
The four readiness levels and the blocking rules that set the ceiling are specified in
[01-rubric-v1.md](01-rubric-v1.md). Dimension scores are diagnostic. They inform the
team where to look. They never override a blocking issue.

## 9. Human accountability stance

Human accountability is designed in, not added as a disclaimer. Every AI output routes
to a named human decision:

- the **team** decides which fixes to make and does its own rewrites.
- the **project lead** validates whether the AI feedback is right and signs off before
  anything reaches the client. The AI never signs off.
- a **board reviewer** is the escalation path for a contested or high-stakes call.

The reviewer always states what it did not assess (see the notAssessed block in
[03-output-contract.md](03-output-contract.md)), so a human knows exactly where their
judgment is still required.

## 10. From v1 to v2

v1 is a working single-pass reviewer: one Claude call, JSON as the source of truth, a
static `index.html` renderer, contract validation through `check-review.js`, five
binary-checked criteria, a maximum of three findings and a typed-attempt gate that
stops ghostwriting. It runs at zero marginal cost inside a Claude Project.

v2 keeps all of that and adds the following. v1's five criteria map into v2's ten
dimensions as a subset, so this is a superset, not a break.

| Area | v1 today | v2 target |
|---|---|---|
| Criteria | 5 binary-checked criteria | 10 dimensions, v1 five map in |
| Readiness | tracks the mean score | blocking-issue ceiling, scores diagnostic only |
| Findings | max 3, one flat list | noise budget plus delivery, improvement and learning blocks separated |
| Lenses | one implicit reviewer | 9 named specialist lenses applied in one MVP call |
| Restraint | a prompt rule | a scored metric plus the contrarian prune |
| Stage | assumes a near-final deck | artifact-type aware |
| Output | scorecard, timeline, findings | adds readiness, top fixes with owner and issue-type, lead questions, learning note, notAssessed |
| Evidence base | leans partly on a withdrawn arXiv rubric | re-grounded on verified sources in the source register |
| Evaluation | one calibration example | gold-labelled cases, 7 metrics, an acceptance threshold |
| Runtime | Claude Project | Claude Project MVP now, API or SDK staged |

## 11. Definition of done (v2 design phase)

The design phase is not done because documents exist. It is done only when all of these
hold:

- [ ] the rubric is understandable to a consultant reading it cold.
- [ ] the prompt reliably produces valid structured JSON against the v2 contract.
- [ ] at least 3 synthetic cases exist (target 5).
- [ ] AI review outputs exist for those cases.
- [ ] an expert feedback pack is assembled and ready to send.
- [ ] a scoring sheet exists and has been run against the sample outputs.
- [ ] the next decision is unambiguous: continue, revise heavily or stop.

Each sprint also has its own exit criteria in the plan, so no session drifts.

## 12. Scope boundary for this design phase

In scope now: the documents in this folder, the synthetic cases, the sample AI outputs
and the expert pack. Out of scope now: building the API or SDK multi-agent
orchestration, changing the v1 renderer or schema in `../`, and any run on real client
material. The trigger to move to the API phase is a written condition in
[09-roadmap.md](09-roadmap.md).
