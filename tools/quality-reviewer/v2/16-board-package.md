# 16. Board package: AI Quality Reviewer v2

The decision paper for the branch board. Everything here is traceable to a file in this
folder. Where a number is an estimate it says so and states the assumption. The risk
section is written to be uncomfortable, because a caveat a board discovers later is
worse than one it reads now.

Voice rules apply. No Oxford commas. No em or en dashes.

---

## 0. Read this before anything below it

**Written 2026-07-22. Corrected 2026-08-07. The body below is the paper as it was put to the
board and it has been left in that shape on purpose, with dated corrections inserted where it
is now wrong. It is not a current status report.** For current state read
[STATUS.md](STATUS.md), and for what is actually established read
[18-evidence-base.md](18-evidence-base.md).

Four things changed after this paper was written and a board reader needs all four.

**1. The work this paper asks for has been done.** Gold labeling ran, the stability
measurement ran, and the reviewer has been run on real anonymised deliverables twice. Section
A asks the board to approve a work package that no longer needs approving. Section E's "what
is NOT done" table is largely out of date and is corrected in place below.

**2. A stop condition in section I fired.** "Stability measurement shows the finding set or
blocking rules swinging enough to flip readiness between runs" was named in advance as a
pause. On 2026-08-03 the same deck, same prompt, byte-identical input returned R0, R0 and R2
with blocking rules firing 1,4 then 1,2 then none
([18-evidence-base.md](18-evidence-base.md) A4). It fired. What followed was not a pause but a
design change: readiness is now human-set and AI-suggested, it never reaches a student, and it
is not shipped as a verdict. That is a defensible answer to the condition and it is a
different answer from the one the board was promised. Section I records this now.

**3. Every performance number this project has ever published rests on a measuring instrument
that has since been measured and does not work.** On 2026-08-05, 178 gold-issue and finding
pairs were adjudicated blind by two independent agents who agreed at kappa 0.971. The matcher
agreed with them at AUC 0.718. At its single best possible cut point it classifies 88% of
pairs correctly, and calling every pair not-caught with no model at all gets 85%. **The whole
discriminative power of the instrument is three points over a constant that ignores the
input.** Precision at the re-fitted threshold is 46%, so more than half of what it calls a
catch is not one. Full method in [21-scorer-refit-sprint.md](21-scorer-refit-sprint.md).

The consequence for this document: **no recall, coverage or must-catch percentage anywhere in
this project should be quoted to anyone outside it**, in this paper or in a successor. The
numbers are not fabricated and the directions they show have survived re-scoring, but the
error bars are far wider than they have ever been reported. The honest sentence is "we have
not yet measured this reliably". The next build is a replacement matcher.

This paper is fortunate here rather than careful: it was written before the real baseline ran,
so it quotes no recall figure and there was none to correct. A successor written today would
have quoted one.

**4. Two claims in section D and section J are still overclaimed, and they were overclaimed
when the board read them.** The adversarial audit in
[16a-board-package-stress-test.md](16a-board-package-stress-test.md) found them on 2026-07-22
and its replacement wordings were never folded back into this file. They are marked below.

What has **not** changed: the product shape, the non-objectives, the sign-off gate, the
confidentiality policy and the honest verdict that this is a lead companion rather than a
student-facing tool. Sections B, C, F and the confidentiality risk stand as written.

---

## A. The ask, up front

**Decision requested.** Approve the pre-pilot work package: human gold labeling of the
14 real cases already built, a run-to-run stability measurement, one expert calibration
session, and a first baseline run of the reviewer on real anonymised material. Approve
the use of sanitized past deliverables for that work, and name the person who agrees the
first sanitization.

**What it costs.** Volunteer time only. Estimated 45 to 62 person-hours across two
labelers plus an expert hour (section F, estimates labeled there). Marginal money cost
is effectively zero today because the tool runs inside a Claude Project on an existing
subscription.

**What it unblocks.** The first honest number for whether this tool helps on real work.
Today there is none. The reviewer has never been run on a real deliverable.

**What is NOT being asked.** Not a student-facing rollout. Not a pilot with live client
projects. Not budget. Those decisions come after the baseline run produces evidence.

> **Correction, 2026-08-07.** The whole of section A is now historical. The package was
> executed: 11 golds labeled, 9 of them runnable, two baseline runs on real anonymised
> decks (07-26 and 08-03) and a stability measurement. The reviewer has been run on real
> deliverables. The ask no longer stands as an ask. What it did not unblock is the honest
> number, for the reason in section 0 point 3: the run happened, the instrument that scores
> it does not work, so the number is still owed.

---

## B. What it is

A human-controlled reviewer that reads a student consulting deliverable before it goes
to a nonprofit client, names the top 3 to 5 quality risks with a verbatim quote for
each, and gives the team one reusable consulting habit to build
([00-product-definition.md](00-product-definition.md) sections 1 and 3).

What it explicitly does not do
([00-product-definition.md](00-product-definition.md) section 4,
[07-workflow.md](07-workflow.md) sections B and C):

- It never approves or certifies a deliverable. A named human, the project lead, signs
  off and that sign-off is recorded.
- It does not write slide content. The fix is a direction plus a principle, never
  pasteable text.
- It does not evaluate, rank or comment on individual members.

---

## C. Why it matters to the branch

**Client risk.** Our deliverables go to nonprofits that act on them. The failure that
hurts a client is not an ugly slide, it is a recommendation the evidence does not
support, a headline number with no source, or a deck that answers a different question
than the one the client asked. The rubric's blocking rules are built around exactly
those ([01-rubric-v1.md](01-rubric-v1.md) section B).

**Member learning.** Project lead review capacity is the scarce good in a student
branch and it is uneven across projects. Every review separates delivery-critical issues
from minor improvements from a learning note, so a lead can read two minutes and a
consultant can sit with the coaching after the deadline
([00-product-definition.md](00-product-definition.md) section 7). The coaching gate is
designed so the consultant must attempt the reflect question before the fix unlocks
([07-workflow.md](07-workflow.md) section D).

One caveat the board should hear here rather than discover later: that separation exists
in the output contract, not yet on a screen. No v2 renderer is built, so today the
output is raw JSON and the coaching gate is a specified behaviour rather than an
enforced one. Whoever reads a review in the pre-pilot work reads structured text.

This is a review-quality and teaching question. It is not a technology question.

---

## D. What is done

Every row below is checkable against a file on the `idea/reviewer-v2` branch.

| Item | Evidence |
|---|---|
| Product definition, success standard, non-objectives | [00-product-definition.md](00-product-definition.md) |
| 10-dimension rubric, 5 blocking rules, 4 readiness levels | [01-rubric-v1.md](01-rubric-v1.md) |
| Output contract (structured JSON schema) | [03-output-contract.md](03-output-contract.md) |
| System prompt, three modes | [04-prompt-templates.md](04-prompt-templates.md) |
| Eval harness with 7 metrics and an acceptance threshold | [05-eval-harness.md](05-eval-harness.md) section E |
| Working validator: structure, verbatim quotes, noise budget, and severity coherence | `check-review-v2.js`. Its section 8 now enforces the 2026-07-03 severity calibration mechanically. Run against the archived outputs it passes 10 of 11 and fails exactly the pre-fix case 05 run that the independent scorer failed by hand, which is the intended behaviour. |
| Run-to-run stability tooling | `check-stability.js`. Computes the variance the measurement needs. It reports, it does not judge: no threshold has been agreed. |
| Expert feedback pack, assembled but gated | [06-expert-feedback-pack.md](06-expert-feedback-pack.md), `expert-pack/`. Not sendable yet: [09-roadmap.md](09-roadmap.md) section D holds a source-verification backlog that is an explicit phase 2 gate, because it goes to a practitioner who will check the numbers. |
| Workflow, sign-off gate, sanitization protocol | [07-workflow.md](07-workflow.md) sections C and E |
| Red team: 15 failure modes with stop conditions | [08-red-team.md](08-red-team.md) |
| Decision log, every design choice with its reason | [11-decision-log.md](11-decision-log.md) |

**The synthetic eval, passing on the second attempt, with one gap in the audit trail.**
Five synthetic cases with gold labels written before any AI review. All five have live
blind runs, and all five pass the validator including the verbatim-quote check.

The scoring history matters and should not be compressed into the word "green". The one
independent scoring artifact in the repo,
[eval-runs/scoring-2026-07-03.md](eval-runs/scoring-2026-07-03.md), scored the first
case 05 output and concluded **NOT GREEN**, failing two of the six criteria in harness
section E: readiness on case 05, and restraint on case 05. Its diagnosis was
over-escalation on a strong deck. A severity calibration fix was then applied, case 05
was re-run blind, and the new output lands at the gold readiness with two minor findings
([eval-runs/case-05-review-v2-live-r2.json](eval-runs/case-05-review-v2-live-r2.json),
which exists and passes the validator).

The gap: [progress.md](progress.md) session 3 records that an independent re-score then
confirmed the set green, but **no scoring artifact for that re-score exists in
`eval-runs/`**. The claim that the set now meets the acceptance threshold rests on that
prose note, not on a recorded score. Re-scoring the post-fix set and committing the
sheet is a small task and it should be done before this figure is quoted anywhere.

> **Correction, 2026-08-07, on the two overclaims 16a caught.** The audit's replacement
> wordings, never applied until now. First: "all five have live blind runs" should not imply
> one prompt version across the set. Cases 01 to 04 ran under the revised prompt and case 05
> under the revised prompt plus the later severity fix, so no single independent scoring pass
> covers the green set. Second: the sentence below correctly records that the confirming
> re-score has no artifact, and that gap was never closed. It should not be closed by finding
> the sheet now. The synthetic five have been superseded as an evidence base by the nine real
> gold-backed cases, and re-scoring them under a matcher known not to work would produce
> another number nobody can use.

**The real-deck case set, built. The gold labels are not.** The distinction is load
bearing: what exists is 14 anonymised real deliverables ready to be labeled, not 14
labeled cases. 181 past deliverable candidates triaged into a sealed
catalog, 14 cases selected across quality bands and project stages with one case per
client, case files written from the local full text with PDF extraction noise and draft
artifacts kept on purpose, and an orchestrator-level anonymisation sweep run over every
case body for client names, person names, emails, phone numbers, handles and live URLs.
One fix was applied and logged. Files are `eval-cases-real/real-01` through `real-14`
([12-real-deck-intake.md](12-real-deck-intake.md) section E2,
[progress.md](progress.md) session 5).

---

## E. What is NOT done

**Corrected 2026-08-07.** The middle column is the state as at 2026-07-22, kept so the board
can see what it was told. The right column is the state today. Read the right column.

| Gap | State at 2026-07-22 | State at 2026-08-07 |
|---|---|---|
| Gold labels for the 14 real cases | None exist. Blind labeling has not started ([12-real-deck-intake.md](12-real-deck-intake.md) E2 gate 5). | **Done, and smaller than planned.** 11 golds written. `check-gold.js` rejects real-10 and real-11 as internally contradictory, so the usable set is **9**, not 14. real-06, real-07 and real-09 have no gold and are out of scope. |
| Any run on a real deck | Zero. Blocked by design until adjudicated gold exists (gate 6). | **Done twice**, 07-26 and 08-03, nine cases each, blind. The gate was honoured. |
| Expert calibration session | Not held. No ex-consultant is lined up ([09-roadmap.md](09-roadmap.md) phase 2 and open question 2). | **Partly.** An ex-McKinsey consultant was consulted on 2026-08-05 and his answer drove a prompt change ([19-prompt-change-2026-08-05.md](19-prompt-change-2026-08-05.md)). He has **not** reviewed the tool's actual output against a real deck, which is the calibration this row meant. Still open. |
| Project-lead pilot | Not started ([09-roadmap.md](09-roadmap.md) phase 3). | **Still not started**, and now gated on the matcher rather than on the baseline. |
| Run-to-run stability | Unmeasured. One run per case per prompt version ([progress.md](progress.md) Next actions item 1). | **Measured 2026-08-03, and it failed.** Findings repeat, the readiness verdict does not: R0, R0, R2 on byte-identical input ([18-evidence-base.md](18-evidence-base.md) A3 and A4). This fired a section I stop condition. See section 0 point 2. |
| Full-set re-run under the revised prompt | Cases 01 to 04 were not re-run. Their green rests on a static regression argument, not a fresh run ([progress.md](progress.md) Green caveats). | Unchanged and now moot. The synthetic five are no longer the evidence base. |
| Inter-rater check on the synthetic gold | Required by rubric section F. Does not exist ([effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 4). | Still does not exist for the synthetic gold. The real golds are single-labeler, which is the same hole in a more load-bearing place ([18-evidence-base.md](18-evidence-base.md) section B). |
| Renderer for the v2 output | Not built. Phase 5, only if it earns its place. | **Built and live** at https://180dc-reviewer.pages.dev since 2026-08-05. A lead can triage findings, set their own readiness level and release a note. |

**One gap this table did not have, added 2026-08-07.** The scoring instrument. It was assumed
sound throughout and it is not ([21-scorer-refit-sprint.md](21-scorer-refit-sprint.md)). It is
now the only thing on the critical path, and it invalidates the precision of every number in
the rows above rather than their direction.

---

## F. What it costs

**Money.** Marginal cost today is effectively zero. The MVP is a single Claude Project
call on an existing subscription, which was a deliberate design decision
([11-decision-log.md](11-decision-log.md), 2026-07-01). Two places where cost enters
later: the multi-agent API or SDK build in phase 5
([09-roadmap.md](09-roadmap.md)), which is per-token and is explicitly not in this ask,
and subscription tier limits. The intake sessions hit account session limits twice and
killed running agents ([progress.md](progress.md) sessions 4 and 5), so throughput, not
price, is the binding constraint.

**Time.** All figures below are estimates. Assumptions stated per line. They are aligned
with the fuller breakdown in [15-implementation-plan.md](15-implementation-plan.md)
section D2, which is the authoritative version. Where the two differ, that file wins.

| Work | Estimate | Assumption |
|---|---|---|
| Blind labeling, 14 cases, 2 labelers | 18 to 24 person-hours | Scaled by case length, not a flat rate. `eval-cases-real/labeling/PROTOCOL.md` suggests 30 to 40 min per case, but that was written before the cases existed. The set runs 8,200 lines and three cases exceed 800 lines each, so longer cases need 45 to 60 min. |
| Adjudication of the 14 cases | 7 to 9 person-hours | 15 to 20 min per case with both labelers present, and it must be synchronous, which makes it the hardest part to schedule. |
| Writing the adjudicated gold files | about 5 person-hours | 14 gold files against the harness section C template. |
| Stability measurement, 5 synthetic cases | 4 to 6 person-hours | 3 to 5 runs per case under a frozen prompt, mostly machine time plus a variance write-up. Now tooled by `check-stability.js`, which reports the variance but does not judge it. |
| Baseline run on 14 real cases plus independent scoring | 6 to 10 person-hours | One blind run per case plus a fresh-context scorer filling the sheet ([12-real-deck-intake.md](12-real-deck-intake.md) gate 6). Estimate. |
| Expert calibration session plus prep and applying changes | 5 to 8 person-hours | A 60-minute expert session ([09-roadmap.md](09-roadmap.md) E5) plus preparation and prompt or rubric changes. Estimate. |
| **Total pre-pilot** | **45 to 62 person-hours** | Sum of the above. Higher than an earlier draft of this page, because the labeling estimate now scales with the real case lengths. |

The labeling block carries a contingency that is not in the total. The protocol has a
stop rule: if a third or more of the set ends in two-level readiness disagreement or is
contested, labeling halts and the rubric is fixed before relabeling. If that fires it
adds a rubric-revision round. Plan for it as a real branch, not as a tail risk, because
no inter-rater agreement check has ever been run on this rubric.

**Opportunity cost.** These are volunteer hours from people who would otherwise be on
client projects or on recruitment and training. The labeling block is the heaviest and
it is not delegable to AI by design: gold labels for real cases are human-only, because
machine-drafted gold would let the reviewer grade its own homework
([11-decision-log.md](11-decision-log.md), 2026-07-04). If the branch cannot fund those
hours, the honest answer is to pause, not to shortcut the gold.

---

## G. Risks

Each risk lists the mitigation that exists and the residual risk that the mitigation
does not close.

**1. The tool is not currently fit to face students directly.**
The internal effectiveness review's fitness verdict is: "expert-reviewer companion, not
yet a direct student-facing tool" ([effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md)
section 6). Its reasoning: the tool over-escalates on good work, its finding set and
confidence are not demonstrated to be reproducible, and its scorecard mean is not
comparable across cases. In front of a student team those flaws teach the wrong lessons,
over-fear and over-rewriting.
*Mitigation.* Pilot it as an assistant to a human who owns severity and readiness. The
lead sign-off gate is designed in ([07-workflow.md](07-workflow.md) section C).
*Residual.* This is the verdict as of 2026-07-03 and nothing since has changed it. The
verdict stands until the stability measurement and the real-deck baseline exist.

> **Update, 2026-08-07.** Both now exist and the verdict is unchanged, on stronger evidence
> than it had. The tool is a lead companion. What the live product adds is that the
> separation is now enforced rather than promised: the student view shows only the findings a
> named lead chose to keep, and no readiness level at all.

**2. Run-to-run stability is unmeasured.**
The same deck may not get the same review twice and nobody has measured how much it
varies. There is exactly one run per case per prompt version, so finding sets,
confidence levels and blocking-rule accounting have never been run twice under a frozen
prompt ([effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section
3, [progress.md](progress.md) Next actions item 1). This is flagged in the repo as the
single most important pre-pilot fix. The review also names an untested edge case: two
blocking rules at different ceilings where the model fires only one would flip the
readiness verdict.
*Mitigation.* None yet. The planned fix is 3 to 5 runs per case with the variance
reported as a number.
*Residual.* Everything. "Readiness matched gold on 5 of 5" is the most robust output by
construction, because the synthetic cases are unambiguous. It is masking the instability
underneath it and should not be quoted as a stability result.

> **Update, 2026-08-07. This risk was measured and it landed on the bad side.** The planned
> fix ran on 2026-08-03. The same deck, same prompt, byte-identical input returned R0, R0 and
> R2, with blocking rules firing 1,4 then 1,2 then none. Findings, by contrast, repeat well:
> one case repeated four of its five across all three draws. The reviewer reads consistently
> and grades inconsistently ([18-evidence-base.md](18-evidence-base.md) A3 and A4).
>
> This is the stop condition in section I, and it fired. The response was a design change
> rather than a pause: readiness is now human-set with the AI's answer shown as a suggestion
> that is never preselected, and it never reaches a student. The board should know that a
> named stop condition was met and answered by changing the product rather than by stopping,
> because that is a substitution the board did not agree to in advance.
>
> One further consequence the paragraph above did not anticipate: every metric produced
> before 2026-08-03 is a single draw from a distribution now known to span two readiness
> levels. Single-draw evaluation is invalid, and every future experiment costs roughly three
> times as much ([18-evidence-base.md](18-evidence-base.md) A9).

**3. False positives waste team time. False negatives create false confidence.**
The designed test for false positives is case 05, the strong deck, and the tool failed
it before a calibration fix: it graded three minor findings as major and dragged a
no-blocker deck from R3 to R2 ([effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md)
section 2). On the false-negative side, a review that reads authoritative and misses the
issue is worse than no review, because a team walks into a client meeting reassured.
*Mitigation.* A severity block now defines critical, major and minor by whether closing
the finding changes the client's decision, plus a floor against demoting a strong deck
([11-decision-log.md](11-decision-log.md) 2026-07-03). The blind re-run landed R3 with
two minor findings. Every review states what it did not assess, so a human knows where
their judgment is still required.
*Residual.* The fix rests on a single post-fix run ([progress.md](progress.md) Green
caveats). It was driven by one case, which is the single-case tuning the harness warns
against. And "the tool is least trustworthy exactly where trust matters most, on good
work" is a live concern, not a closed one.

**4. Confidentiality.**
If someone pastes real client material into the tool, that material leaves the branch's
control. Red team failure mode 8 rates this Medium likelihood and High severity
([08-red-team.md](08-red-team.md)).
*Mitigation.* A written sanitization protocol: client name becomes a label, stakeholders
become roles, logos and identifying headers removed, identifying figures banded, and a
slide that cannot be sanitized is described rather than pasted
([07-workflow.md](07-workflow.md) section E). No real material touches the tool until
the sign-off gate and the protocol are in place and a lead has agreed them. Real-case
files were anonymisation-swept before use.
*Residual.* The protocol is a human checklist with no technical enforcement. It depends
on a tired student at 11pm following it. Also, by policy the real cases keep business
facts, figures, sector and geography, so a case is pseudonymised, not
de-identified ([12-real-deck-intake.md](12-real-deck-intake.md) section C). A leak is a
cross-cutting stop condition: pull and scrub immediately
([08-red-team.md](08-red-team.md)).

**5. The eval so far is a smoke test, not a validation.**
Five short synthetic single-flaw decks, 9 to 10 slides, hand-clean markdown, written by
the same people who wrote the tool and the gold, with no inter-rater check and file names
that announce the flaw. The effectiveness review's own words: "this is a smoke test, not
a validation. It should be labeled as one"
([effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 4).
Real decks are longer, have three overlapping flaws and no single dominant issue, and
arrive as noisy PDF extraction. The verbatim-quote rule is the tool's central safety
mechanism and it has never been tested against garbled multi-column text.
*Mitigation.* The 14-case real set exists precisely to close this and deliberately keeps
extraction noise ([12-real-deck-intake.md](12-real-deck-intake.md) section D).
*Residual.* The real set has no labels and has never been run. Until it is, every
performance claim about this tool comes from the smoke test.

> **Update, 2026-08-07.** The real set has labels for 9 cases and has been run twice. The
> smoke test is no longer the source of performance claims. The residual has moved rather
> than closed: performance claims now come from real cases scored by an instrument with three
> points of discriminative power over a constant (section 0 point 3). Two properties survived
> the move intact and are the strongest things this tool has: no blocking rule has ever been
> missed across roughly thirty reviews, and no fabricated quote has ever survived to a scored
> result, checked mechanically. Neither depends on the matcher.

**6. Over-reliance and deskilling.**
Consultants stop thinking and copy directions. Red team failure mode 11, Medium
likelihood and Medium severity ([08-red-team.md](08-red-team.md)).
*Mitigation.* The coaching gate requires a typed attempt before a fix unlocks, the
learning note is separated from delivery feedback, and the no-ghostwriting rule refuses
to produce slide text.
*Residual.* The red team file states plainly that this mitigation is unproven, and
repeat-flag tracking across cycles is only planned. Deskilling shows up over months and
we have no measurement running that would detect it.

---

## H. What is being asked for, concretely

1. **Decision.** Approve the pre-pilot work package in section A. This is a decision to
   generate evidence, not a decision to deploy.
2. **Resources.** Two labelers committing the 16 to 19 hours of blind labeling plus
   adjudication, and a named owner for the stability measurement and the baseline run.
   No money.
3. **Permission.** Approval to use sanitized past deliverables from the branch archive
   for eval purposes, held in the private repo under the anonymisation policy in
   [12-real-deck-intake.md](12-real-deck-intake.md) section C. The board names the
   person who agrees the first sanitization. This is open question 3 in
   [09-roadmap.md](09-roadmap.md) and it is a board call, not a builder call.
4. **Permission, second.** Agreement that the reviewer is used only in expert or lead
   companion mode until the effectiveness verdict is revisited against new evidence. No
   direct student-facing use is being requested today.
5. **Timeline.** Sequenced by dependency, not by date, because these are volunteer
   hours: stability measurement first (it is cheap and it gates trust in everything
   else), then blind labeling and adjudication, then the baseline run on the 14 real
   cases with independent scoring, then the expert session with the real-case evidence
   in hand. The board sees the baseline numbers before any pilot decision.

---

## I. Stop conditions

Named in advance so the exit is not a judgment call made under sunk cost. The first
three are cross-cutting and pull the tool from any real use immediately
([08-red-team.md](08-red-team.md)).

**Status column added 2026-08-07.** A stop condition that fires and is not recorded is worse
than no stop condition, because the exit it was meant to force becomes a judgment call after
all. One has fired.

| Condition | Action | Status |
|---|---|---|
| Any real client identifier found in the tool or the repo | Pull and scrub immediately. | Not fired. |
| Any judgment of a named individual in a review | Automatic case fail and a prompt fix before further use. | Not fired. |
| Any invented source or client fact in a review | Automatic case fail. | Not fired, and checked mechanically on every review since. |
| Labeler readiness disagreement of two levels or more, or contested, on a third or more of the 14 cases | Stop labeling. The rubric cannot carry two trained readers to the same answer, so it cannot carry the reviewer ([12-real-deck-intake.md](12-real-deck-intake.md) kill criterion). | Not fired as specified. Labeling ended up single-labeler, so the condition could not be tested. That is a hole, not a pass ([18-evidence-base.md](18-evidence-base.md) section B). |
| Stability measurement shows the finding set or blocking rules swinging enough to flip readiness between runs | Pause. A tool that changes its verdict on re-run has no authority with a team. | **FIRED, 2026-08-03.** R0, R0, R2 on byte-identical input. Not paused. Answered instead by making readiness human-set and keeping it away from students. See section 0 point 2 and risk 2. |
| Systematic expert disagreement on priorities across the samples | Do not pilot until calibrated ([08-red-team.md](08-red-team.md) mode 13). | Untested. No expert has reviewed the tool's output on a real deck. |
| Baseline run on real cases falls materially short of the acceptance threshold in [05-eval-harness.md](05-eval-harness.md) section E | Stop, revise heavily or kill. The decision after the baseline is explicitly one of continue, revise heavily or stop. | The call was taken on 2026-08-05: **iterate**. It rests on numbers the scorer cannot support, so it is a decision made on a broken measurement and should be revisited once the matcher lands. |
| Leads report the false-positive rate is not acceptable in a pilot | Pause the pilot ([09-roadmap.md](09-roadmap.md) phase 3 exit). | No pilot has run. |

**Missing stop condition, named 2026-07-22 by [16a](16a-board-package-stress-test.md) and
added here 2026-08-07.** There was no stop condition for a miss on real work. There is now,
carried in [STATUS.md](STATUS.md): a confirmed case of the reviewer missing a real blocking
problem pauses lead-companion use pending review. It matters more than any over-flagging
result, because it breaks the asymmetry that makes an imperfect tool worth using at all.

---

## J. One-slide summary

**Two slides, as of 2026-08-07.** The first is the slide the board saw on 2026-07-22, kept
because a paper that quietly rewrites its own summary teaches nobody anything. The second is
the slide today. If only one gets read, read the second.

### J2. The slide today, 2026-08-07

> **AI Quality Reviewer v2, status**
>
> **What.** Unchanged. A reviewer that finds the top 3 to 5 risks in a student deliverable
> before it reaches a nonprofit client. It never approves anything. A named project lead signs
> off. It does not write slides and does not evaluate members.
>
> **Live.** https://180dc-reviewer.pages.dev since 2026-08-05. A lead triages each finding,
> sets their own readiness level and releases a note. About four minutes on a five-finding
> deck. That is a measured time, not a measured saving: nobody has measured what this costs a
> lead today.
>
> **What we trust.** The findings, as a list of things worth looking at. No blocking rule
> missed across roughly thirty reviews. No fabricated quote has ever survived to a scored
> result, checked mechanically. Every quote is a verified verbatim substring of the input.
>
> **What we do not trust.** The readiness level. It returned R0 and R2 on byte-identical
> input, so it is a suggestion a human overrides and it never reaches a student.
>
> **The number we owe you, and do not have.** No recall, coverage or must-catch percentage
> from this project should be quoted anywhere outside it. On 2026-08-05 we measured the
> instrument that produces those numbers: at its best possible cut point it is three
> percentage points better than a constant that ignores the input entirely, and 46% of what
> it calls a catch is not one. The findings are not disproved by this. The percentages are
> unusable. The next build is the replacement.
>
> **Stop condition fired.** Readiness flipping between runs was named in advance as a pause.
> It happened on 2026-08-03. We did not pause. We made readiness human-set and kept it away
> from students. The board should decide whether it accepts that substitution.
>
> **Ask.** Nothing to approve. Next is a replacement matcher, then a re-run, then a small
> pilot. No pilot until the measurement works.

### J1. The slide as put to the board, 2026-07-22

> **AI Quality Reviewer v2, board decision**
>
> **What.** A reviewer that finds the top 3 to 5 risks in a student deliverable before
> it reaches a nonprofit client and coaches the team. It never approves anything. A
> named project lead signs off. It does not write slides and does not evaluate members.
>
> **Done.** Full design set, rubric, output contract, working validator. Five synthetic
> cases run blind and pass the validator. The one recorded independent score failed the
> set on restraint, a calibration fix was applied and the re-run is clean, but the
> confirming re-score was never written up. A 14-case real-deck case set is built and
> anonymisation-swept. It has no gold labels yet.
>
> **Not done.** No gold labels on the real cases. Never run on a real deck. No expert
> calibration. No pilot. Run-to-run stability unmeasured.
>
> **Honest verdict.** Our own effectiveness review: expert or lead companion, not yet
> a direct student-facing tool. The five-case eval is a smoke test, not a validation.
>
> **Ask.** Approve the pre-pilot package: labeling, stability measurement, baseline run,
> one expert session. Estimated 45 to 62 volunteer person-hours. No money, it runs on an
> existing subscription. Approve sanitized past deliverables and name who signs the first
> sanitization.
>
> **Exit.** We stop on any confidentiality leak, any hallucinated fact, labeler
> disagreement on a third of the set, readiness that flips between runs, or a real-case
> baseline below threshold.
