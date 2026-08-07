# 15. Implementation plan

The sequenced plan from here to an operational pilot. Written after the 14-case real
deck set was built and before any of it was labeled. It reads
[09-roadmap.md](09-roadmap.md) against [progress.md](progress.md) and re-sequences the
roadmap where reality has moved past it.

Voice rules apply. No Oxford commas. No em or en dashes.

**Status note, 2026-08-07. Phase 1.5, the workstream this plan exists to define, has run.**
Labeling, the stability measurement and two baseline runs on real cases are all done. The
sequencing argument in sections B and C was sound and it is now spent. What this plan did not
have a phase for, and what turned out to be on the critical path all along, is the scoring
instrument: it was treated throughout as a given rather than as something to validate, and on
2026-08-05 it was measured and found to be three percentage points better than a constant
that ignores the input ([21-scorer-refit-sprint.md](21-scorer-refit-sprint.md)). Read this
document for the reasoning, not for the state. State is in [STATUS.md](STATUS.md).

---

## A. Where we actually are

Three words are doing different work in this repo and the plan depends on keeping them
apart.

| State | Meaning | What is in this state |
|---|---|---|
| Designed | Written down, internally consistent, never exercised | Modes and views, coaching gate, printable, workflow and sign-off gate ([07-workflow.md](07-workflow.md)), seeded variants ([eval-cases-real/seeded/README.md](eval-cases-real/seeded/README.md)) |
| Validated | Exercised against evidence, with a number attached | Five synthetic single-flaw cases, green against [05-eval-harness.md](05-eval-harness.md) section E on one blind run per case, independently scored 2026-07-03 |
| Piloted | Run by someone who is not a builder, on real work, in a real cycle | Nothing |

The honest summary in four lines.

1. The reviewer has never run on a real deliverable. Not once. The 14 real cases in
   [eval-cases-real/](eval-cases-real/) are built and anonymisation-QA'd, no gold exists
   and no run is permitted before adjudicated gold does.
2. The green result is real but narrow. Five short synthetic decks, each engineered
   around one flaw, gold written by the same people who wrote the tool, no PDF extraction
   noise, one run per case. [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md)
   section 4 calls this a smoke test rather than a validation and it is right.
3. Run-to-run stability is unmeasured. Readiness matched on all five, but the finding
   set, the confidence, the blocking-rule accounting and diagnosticMean have never been
   run twice under a frozen prompt. The "green caveats" block in progress.md says this
   plainly.
4. The fitness verdict on record is expert or lead companion, not yet student-facing.
   Nothing since has changed that verdict, because nothing since has produced new
   behavioural evidence. Sessions 4 and 5 built infrastructure, not evidence.

**All four lines above are as at 2026-07-22 and three of them have since changed. Corrected
2026-08-07:**

1. It has run on real deliverables twice, blind, on the 9 gold-backed cases. The gate held:
   no run happened before gold existed.
2. The synthetic five are no longer the evidence base. What replaced them is
   [18-evidence-base.md](18-evidence-base.md), built on real cases.
3. Stability was measured on 2026-08-03. Findings repeat, the readiness verdict does not: R0,
   R0, R2 on byte-identical input. The consequence is that every single-draw metric this
   project produced before that date is one sample from a two-level distribution.
4. Unchanged. Lead companion, not student-facing, now enforced in the live product rather
   than stated in a document.

**And one line that was not on the list and should have been.** The scoring instrument was
never in any of the three states in the table above. It was assumed. It is now measured and it
does not work, which is the only thing on the critical path today.

Two things the roadmap does not yet reflect. Phase 1 is materially complete (live runs
done, validator built, full set scored, threshold cleared), and a whole workstream that
the roadmap never names sits between Phase 1 and Phase 2: real-case validation. This
plan calls it Phase 1.5 and treats it as a first-class phase, because everything the
expert and the pilot depend on runs through it.

---

## B. The critical path

The single chain that gates a pilot, verified against the files rather than assumed.

```
confirm two labelers
  -> calibration batch labeled blind (both, independently)
    -> agreement check against the PROTOCOL stop rule
      -> [if stop rule fires: rubric fix, relabel]
        -> remaining cases labeled and adjudicated
          -> 14 adjudicated gold files exist
            -> PROMPT FREEZE
              -> baseline run on all 14 real cases, blind
                -> independent scoring, disagreement log
                  -> one calibration round, full re-run
                    -> first honest number on real work
                      -> go / revise / stop decision for the pilot
```

Why this is the critical path and not something else.

- [12-real-deck-intake.md](12-real-deck-intake.md) section E gate 6 makes the baseline
  run conditional on adjudicated gold for every case. Section F forbids any tuning
  against a real case before the full baseline exists. So gold labeling is a hard
  predecessor with no workaround, and it is the only item on the chain that cannot be
  compressed by working harder alone, because it needs two humans and a stop rule.
- Labeling is also the longest calendar item. Fourteen cases at two independent reads
  plus adjudication is roughly 32 to 40 person-hours (section D2 shows the arithmetic),
  spread across volunteers with a few hours a week.
- The stop rule can restart part of it. If five or more of fourteen cases land two
  readiness levels apart or contested, PROTOCOL.md says stop and fix the rubric. That is
  a rubric change, which invalidates prior labels on the contested cases and forces a
  relabel. Plan for it rather than hoping.

One strand runs alongside the critical path and must finish before the freeze, not
after. Call it prompt-freeze prep. The effectiveness review names three known prompt
defects (light-touch L dimension scoring has no mechanical denominator, blockingIssues
lists non-binding rules, timeline tile vocabulary clashes with severity vocabulary) and
one unmeasured property (run-to-run stability). Harness section G and intake gate 6 both
forbid prompt changes mid-baseline. So a known defect left unfixed at freeze time means
the first real number measures a prompt we have already decided to change. Fix the known
defects and measure stability on the synthetic set while labeling runs, then freeze.

What is explicitly not on the critical path.

- The expert session. It is gated by the source backlog and by expert availability, not
  by gold. It can happen before the baseline, and there is an argument for pulling it
  early (section F, Q2). It does not block the baseline run either way.
- The seeded-flaw variants. They need the source case's human gold first, so they follow
  labeling, but nothing downstream waits on them. They are cheap regression, not
  evidence.
- Any form, folder workflow or multi-agent work. Roadmap Phase 5, correctly parked.
  (The renderer was on this list until 2026-07-22, when it was built. It was pulled forward
  ahead of its roadmap slot because the board demo needs something a human can read and
  because there is no route to student-mode feedback without it. It is still not on the
  critical path: nothing in the labeling chain waits on it.)

---

## C. What the timing assumes

Weeks are relative to the week work restarts, never absolute dates, because volunteer
capacity is the binding constraint and it is unknown.

Assumptions, stated so they can be corrected in one line each.

1. The project owner has 6 to 8 focused hours a week on this. If it is 3, every week
   number roughly doubles.
2. A second labeler exists and has 3 to 4 hours a week. This is currently an assumption,
   not a fact (see section H decision 1).
3. No ex-consultant time is confirmed. Anything involving the expert is drawn as a
   parallel track with an unknown start.
4. Phase 3 attaches to a real semester project cycle. Its start is calendar-gated by the
   branch cycle, not by how fast the work goes. If the chain finishes mid-cycle, Phase 3
   waits.
5. Agent-run work happens in waves, not fleets. Sessions 4 and 5 both lost agents to
   account session limits. Every batched agent item below assumes write-per-item
   discipline so a killed agent loses at most one item.
6. Person-hour estimates are for the human's own time. Agent wall-clock is not counted
   except where a human must supervise or read the output.

Where an estimate cannot be defended from the files it says so rather than inventing a
number.

---

## D. The sequenced plan

### D1. Phase 1.5. Real-case validation (new, not in the roadmap)

**Entry.** Synthetic set green against harness section E (met 2026-07-03), 14 real cases
built and QA'd (met 2026-07-07).

**Exit.** Every real case has an adjudicated gold file, the baseline run has happened on
all 14 under a frozen prompt, an independent scorer has filled the sheet and the
disagreement log, and one calibration round has closed. The set need not be green on the
first pass. The exit condition is that we have a defensible number, not that the number
is good.

| # | Item | Weeks | Role | Depends on | Effort |
|---|---|---|---|---|---|
| 1.5a | Confirm the two labelers and agree the per-case time budget | 1 | project owner | nothing | 1 to 2 h |
| 1.5b | Both labelers read the rubric and harness section C cold, per PROTOCOL step 2 | 1 | hand-labelers | 1.5a | 1.5 h each |
| 1.5c | Calibration batch: 4 cases labeled independently, then adjudicated | 1 to 2 | hand-labelers | 1.5b | 10 to 14 person-h |
| 1.5d | Agreement check on the batch against the stop rule, logged | 2 | hand-labelers, project owner | 1.5c | 1 h |
| 1.5e | Rubric fix and relabel, only if 1.5d trips the rule | 2 to 4 | project owner writes, both labelers relabel | 1.5d | 8 to 16 person-h, contingent |
| 1.5f | Remaining 10 cases labeled and adjudicated | 3 to 5 | hand-labelers | 1.5d clean | 24 to 30 person-h |
| 1.5g | Gold files written into harness section C shape, agreement log complete | 5 | hand-labelers | 1.5f | 4 to 5 h |
| 1.5h | ~~Stability measurement: 5 synthetic cases, 4 runs each, frozen prompt, variance reported~~ **DONE 2026-07-22**, 3 runs each. [eval-runs/stability/README.md](eval-runs/stability/README.md) | 1 to 3 | project owner, agent runners | nothing | 8 to 10 h |
| 1.5i | L-dimension denominator rule fixed, vacuous sub-check resolves to na | 3 | project owner | 1.5h evidence | 3 to 4 h |
| 1.5j | blockingIssues reports the binding blocker as primary, others secondary | 3 | project owner | none | 2 to 3 h |
| 1.5k | Regression re-run of the synthetic five after 1.5i and 1.5j, independently scored | 4 | project owner, agent runners | 1.5i, 1.5j | 6 to 8 h |
| 1.5l | **Prompt freeze.** Version tagged, decision log entry, no edits until 1.5o | 5 | project owner | 1.5g, 1.5k | 1 h |
| 1.5m | Baseline run: 14 real cases, blind, per eval-runs/README protocol | 6 | project owner, agent runners | 1.5l | 5 to 7 h |
| 1.5n | Independent fresh-context scoring, sheet and disagreement log filled | 6 to 7 | project owner (orchestrating a fresh scorer) | 1.5m complete for all 14 | 8 to 10 h |
| 1.5o | Cluster the disagreements, smallest change per cluster, full re-run | 7 to 8 | project owner | 1.5n | 12 to 16 h |
| 1.5p | Seeded variants built from the strongest gold-labeled case and run | 7 to 8 | project owner | 1.5g | 6 h |

Notes on the estimates.

- 1.5c and 1.5f use the PROTOCOL suggestion of 30 to 40 minutes per case per labeler,
  adjusted for case length. The set is not uniform: the case files run from 141 lines
  (real-11) to 1405 lines (real-02). A flat 35 minutes is defensible for the short half
  and optimistic for the long half. Band it: 25 to 30 minutes for cases under 400 lines,
  45 to 60 for cases over 800. Across 14 cases that is roughly 9 to 12 hours per labeler,
  so 18 to 24 person-hours of independent reading, plus 15 to 20 minutes per case of
  joint adjudication for two people, which is another 7 to 9 person-hours, plus gold file
  writing. Total 32 to 40 person-hours for the labeling round.
- 1.5h is defensible: 20 runs at roughly 15 to 20 minutes of supervised orchestration
  each, plus about 3 hours to write up variance in findings, confidence and blocking-rule
  sets. Four runs per case is the low end of the effectiveness review's "three to five".
- 1.5m and 1.5n cannot be defended tightly. Nobody has run this prompt on a 1400-line
  extraction-noisy case, so per-case run time and scorer read time are unknown. The
  numbers given are extrapolated from synthetic-case runs and should be re-estimated
  after the first three real cases run.
- 1.5o is the widest estimate in the plan. If the reviewer performs on real decks roughly
  as it does on synthetic ones, one small change round closes it. If real decks break the
  verbatim-quote mechanism or the noise budget, this is a redesign and the estimate is
  meaningless. That is exactly the risk the baseline exists to surface.

**Kill criterion, inherited.** If labeler disagreement is severe across the set, stop and
fix the rubric before any prompt work. Prompt tuning against unstable gold is overfitting
to noise.

### D2. Phase 2. Expert calibration

**Entry.** The source-verification backlog is clear and the expert has a confirmed slot.
The roadmap makes the backlog a hard gate because the pack goes to a practitioner who
will check. Only one item remains open: confirm the S4 journal tables match the working
paper figures quoted in [10-source-register.md](10-source-register.md). S6, S8, S9 and
S10 were closed in the 07-02 and 07-03 passes.

**Exit (roadmap wording, kept).** No systematic expert disagreement on priorities across
the samples.

| # | Item | Weeks | Role | Depends on | Effort |
|---|---|---|---|---|---|
| 2a | Close S4: check the Organization Science tables against the working paper, quote one defensible number | 1 to 2 | project owner | nothing | 1 to 2 h |
| 2b | Recruit the ex-consultant reviewer and confirm a 60-minute slot | 1 onward | project owner, VP or board for introductions | nothing | unknown, relationship-dependent |
| 2c | Decide whether the expert also acts as a third rater on 3 real cases (see F, Q2) | 1 | project owner | 2b | 0.5 h decision |
| 2d | Refresh the pack to show real-case output rather than synthetic-only | 8 to 9 | project owner | 1.5o | 4 to 6 h |
| 2e | Run the 60-minute session per [06-expert-feedback-pack.md](06-expert-feedback-pack.md) section C | 9 to 10 | project owner, ex-consultant reviewer | 2a, 2b, 2d | 1 h expert, 2 h owner |
| 2f | Log every answer as TP / FP / FN / low-value, cluster, convert to the smallest prompt or rubric change | 10 | project owner | 2e | 6 to 8 h |
| 2g | Re-run the full set (synthetic five plus 14 real) against the changed prompt | 10 to 11 | project owner, agent runners | 2f | 10 to 14 h |

Sequencing note. 2b is the longest lead item in the whole plan and it is not on the
critical path, so start it in week 1 and let it land whenever it lands. If the expert
becomes available before the baseline exists, run the session on the current pack rather
than waiting. An expert reading synthetic samples still answers questions 1 to 6 and 9 of
the feedback form usefully, and expert time is the scarcest input in the project.

### D3. Phase 3. Small project-lead pilot

**Entry.** Phase 1.5 exit met, expert changes applied or consciously deferred, the
confidentiality gate agreed and signed by whoever owns it, and two or three project leads
who have said yes. Also required by
[07-workflow.md](07-workflow.md) section E: no real client material touches the tool
until the sign-off gate and the sanitization protocol are in place and a lead has agreed
them.

**Exit (roadmap wording, kept).** Leads say it saves time and the false-positive rate is
acceptable.

| # | Item | Weeks | Role | Depends on | Effort |
|---|---|---|---|---|---|
| 3a | Write the one-page sanitization checklist a lead can apply in 10 minutes | 8 to 9 | project owner | 07 section E | 3 to 4 h |
| 3b | Get the checklist and the sign-off gate agreed by the confidentiality owner | 9 | project owner, VP or board | 3a | 1 to 2 h owner, plus their time |
| 3c | Recruit 2 to 3 pilot project leads and brief them for 30 minutes each | 9 to 10 | project owner, pilot project leads | 3b | 3 h |
| 3d | Lead-mode only pilot: the lead runs it, the students never see raw output | cycle weeks | pilot project leads | 3c | 15 min per deliverable per lead |
| 3e | False-positive and false-negative log, one line per lead override | cycle weeks | pilot project leads, project owner | 3d | 0.5 h per review |
| 3f | Adoption-burden assessment: time to run, time to read, time to act | end of cycle | project owner, pilot project leads | 3d | 4 h |
| 3g | Lead debrief interviews, 30 minutes each | end of cycle | project owner, pilot project leads | 3f | 3 to 4 h |

Two constraints this phase must respect and the roadmap does not spell out.

- **Lead mode first, students later.** The standing fitness verdict is expert or lead
  companion, not direct student-facing. Phase 3 should be lead-mode only, with the lead
  deciding what reaches the team. Opening the student coaching view is a separate
  decision that Phase 3's own evidence should drive, not a default.
- **Phase 3 is calendar-locked.** It needs live deliverables at draft-deck and
  final-review points, which exist only inside a semester cycle. If the chain finishes
  outside a cycle window, use the wait productively: run more stability measurement, build
  more seeded variants, extend the real case set from the sealed catalog (167 candidates
  remain unused).

### D4. Phase 4. Operational pilot

**Entry.** Phase 3 exit met, and a decision on record about whether the student coaching
view opens.

**Exit (roadmap wording, kept).** The tool runs a full project cycle without a
stop-condition breach.

| # | Item | Weeks | Role | Depends on | Effort |
|---|---|---|---|---|---|
| 4a | Cut reviewer v1.0: freeze the prompt, rubric and contract, tag them | pre-cycle | project owner | Phase 3 exit | 2 to 3 h |
| 4b | Usage guide, one page, written for a lead who has 5 minutes | pre-cycle | project owner | 4a | 4 h |
| 4c | Confidentiality guide, derived from 3a and the agreed checklist | pre-cycle | project owner, VP or board | 3b | 2 h |
| 4d | Escalation guide: when a contested readiness goes to a board reviewer | pre-cycle | project owner, VP or board | 07 section B | 2 h |
| 4e | Review archive and improvement log, both plain folders | pre-cycle | project owner | 4a | 2 h |
| 4f | Run the full cycle across participating teams | one cycle | pilot teams, pilot project leads | 4a to 4e | ongoing, unknown |
| 4g | Cycle-end review: stop conditions, adoption, improvement log clusters | end of cycle | project owner, VP or board | 4f | 6 to 8 h |

Effort for 4f cannot be estimated from the repo. It depends on how many teams and how
many deliverables per team, neither of which is decided.

### D5. One-page view of the sequence

| Weeks | Critical path | Parallel |
|---|---|---|
| 1 to 2 | Labelers confirmed, calibration batch, agreement check | Stability runs start, expert recruitment starts, S4 closed |
| 3 to 5 | Remaining 10 cases labeled and adjudicated, gold written | L-rule and blockingIssues fixes, synthetic regression re-run |
| 5 | Prompt freeze | Sanitization checklist drafted |
| 6 to 7 | Baseline run on 14 real cases, independent scoring | Seeded variants built |
| 7 to 8 | Calibration round, full re-run, Phase 1.5 exit | Confidentiality gate agreed |
| 8 to 11 | Expert session, changes applied, full re-run | Pilot leads recruited |
| next cycle | Phase 3 lead-mode pilot | v1.0 packaging prepared |
| cycle after | Phase 4 operational pilot | |

---

## E. Roadmap section E's five actions, re-sequenced

The roadmap's immediate five were written before the 07-02, 07-03, 07-04 and 07-07
sessions. Four of the five are done or superseded. Stated plainly.

| Roadmap action | Status | What replaces it |
|---|---|---|
| 1. Run the prompt live in a Claude Project, case 03 blind | **Stale, done.** Sessions 1 and 2 ran all five cases live and blind under the revised prompt | Nothing. Retire it |
| 2. Produce AI reviews for cases 02 and 04 | **Stale, done.** Both ran 07-02 and re-ran as r2 under the revised prompt | Nothing. Retire it |
| 3. Build check-review-v2 and a scoring script | **Half done.** check-review-v2.js exists and all reviews pass it. The scoring *script* was never built; scoring is done by fresh-context human-shaped scorers | Do not build the script now. It needs machine-readable gold, and real-case gold is human prose by policy. Revisit only if Phase 4 volume makes hand-scoring the bottleneck |
| 4. Score the five-case set on the seven metrics | **Stale, done.** [eval-runs/scoring-2026-07-03.md](eval-runs/scoring-2026-07-03.md) is authoritative and the set is green | Replaced by: score the 14 real cases (item 1.5n) |
| 5. Line up an ex-consultant and clear the source backlog | **Live, and the long pole.** Backlog is down to S4 only. No expert is confirmed | Keep, and start it in week 1 rather than after everything else. See D2 note |

The re-sequenced immediate five.

1. **Measure run-to-run stability.** Four runs per synthetic case under the frozen
   prompt, reporting variance in the finding set, confidence, blocking-rule accounting and
   diagnosticMean, not just the mode. progress.md and the effectiveness review both name
   this as the single most important pre-pilot fix now that severity is calibrated. It is
   also the cheapest item that can change the plan, because instability would mean the
   real-case baseline measures noise. Do it first and do it before the freeze. 8 to 10 h.
2. **Confirm the two labelers and start the calibration batch.** This is the critical
   path and it is people-gated, so it starts on day one and runs continuously. 1.5a to
   1.5d.
3. **Start expert recruitment.** Longest lead time in the project, no dependencies, and
   the answer changes the labeling design (F, Q2). Ask in week 1 even if the session is
   two months out.
4. **Close S4 and fix the two known prompt defects.** The L-dimension denominator and the
   blockingIssues primary-versus-secondary rule, then regression-run the synthetic five.
   These must land before the freeze or the baseline measures a prompt we already plan to
   change. 6 to 9 h combined.
5. **Draft the sanitization checklist and take it to the confidentiality owner.** Not
   urgent by the critical path, but it involves other people's calendars and it hard-gates
   Phase 3. Starting it early costs 4 hours and removes a later blocker.

Retired outright: roadmap actions 1, 2 and 4. Partially retired: action 3. Carried
forward and promoted: action 5.

---

## F. The five open questions

### Q1. Do all ten dimensions score every time, or does short mode score only the core

**What the repo implies.** The mode table has short scoring the core (1, 3, 4, 6) in full
and the rest light-touch. That is the current answer and nothing contradicts it. But the
effectiveness review section 3(a) shows light-touch scoring has no mechanical rule: case
01 scored a light dimension out of 2 while cases 02 and 03 scored the same dimension out
of 4. The denominator is chosen per run, so diagnosticMean is not comparable across cases
or across reviewers, and the rubric's own two-scorer agreement test is not mechanically
achievable while that holds.

**Recommendation.** Keep the mode split. Fix the mechanism underneath it before the
freeze: give every dimension a fixed sub-check count in the rubric so the denominator is
never invented, resolve a sub-check with no applicable content to `na` rather than pass,
and exclude light-touch dimensions from diagnosticMean entirely so the one number the
report presents as objective is computed from full-scored dimensions only. Then confirm
the mode split in the pilot as the roadmap intends.

**Confidence.** High on the mechanism fix, which is a defect with evidence behind it.
Medium on the mode split itself, which is a usability judgment that only pilot leads can
settle.

### Q2. Who hand-labels new gold, and is an ex-consultant lined up

This is the question the whole plan hangs on, so it gets the space.

**What the repo says.** PROTOCOL.md names "the two builders for now, an expert later if
one is available". [12-real-deck-intake.md](12-real-deck-intake.md) section B fixes the
design: two humans, blind, independent, then adjudication, with disagreement logged per
case. The AI never writes or suggests a gold label for a real case. Nothing in the repo
identifies a second builder with confirmed hours, and nothing identifies an ex-consultant
at all. The expert pack has been ready since sprint 6 and has never been sent.

**What the protocol implies about throughput.** Working from the actual numbers.

- Suggested budget is 30 to 40 minutes per case per labeler. Case files run 141 to 1405
  lines, so band it: 25 to 30 minutes under 400 lines, 35 to 45 in the middle, 45 to 60
  over 800 lines.
- Independent reading: roughly 9 to 12 hours per labeler for 14 cases, so 18 to 24
  person-hours.
- Adjudication: 15 to 20 minutes per case for two people together, so 7 to 9
  person-hours, and it must be synchronous, which makes it the hardest part to schedule.
- Gold file writing into the harness section C template: 15 to 20 minutes per case, 4 to
  5 hours.
- Total: **32 to 40 person-hours** for a clean run, plus contingency for the stop rule.
- The stop rule fires at a third of the set, which for 14 cases means 5 cases at two-plus
  levels apart or contested. Realistic contingency is 30 to 40 percent on top, so budget
  **42 to 56 person-hours** end to end.

**Capacity options.**

| Option | Shape | Calendar | Cost | Verdict |
|---|---|---|---|---|
| A | Two builders label all 14 | 4 to 6 weeks at 4 h each per week | 32 to 40 person-h | Baseline. Zero recruitment, slowest calendar, and the insider-gold criticism from the effectiveness review carries straight over to the real set |
| B | Two builders, but staged: 4-case calibration batch first, agreement check, then 10 | Same total, stop rule surfaces in week 2 not week 5 | Same | **Recommended.** Same cost, far cheaper failure |
| C | Four labelers in two pairs, 7 cases each | 2 to 3 weeks | 32 to 40 person-h plus a cross-calibration case labeled by all four, about 4 h extra | Only if four people genuinely exist. Halves calendar, adds a between-pair consistency risk the agreement log cannot see |
| D | B plus the ex-consultant as a third rater on 3 cases | Adds 2 to 3 h of expert time | Small | **Recommended if the expert exists.** Buys external-validity evidence the insider gold cannot |
| E | Board or VP-level reviewer as the second labeler instead of a builder | Same hours, different person | Same | Attractive on independence, but a board member with 12 hours to spend is a strong assumption |

**Recommendation.** Run option B, with option D layered on if and when an expert appears.
The calibration batch should be 4 cases picked for spread by stage rather than by
anything the labelers can see: one D1, one D2, one final, one of the long ones. Four
cases is enough to see whether the rubric carries two readers to the same answer, and
losing four cases to a rubric fix is a survivable cost. Losing fourteen is not.

Keep the roles distinct even if the same person could do both. A labeler who has written
gold for a case is no longer a blind reader of the reviewer's output on that case. If the
ex-consultant labels 3 cases as a third rater, those 3 cases are still fair game for the
baseline run, but the expert-pack session should use cases they did not label.

**Owner decision required.** Whether a second labeler with 12 or more hours exists, who
they are, and whether an ex-consultant relationship exists at all. The repo cannot answer
any of this. See section H, decisions 1 and 2.

### Q3. When do sanitized real deliverables come in, and who agrees the first sanitization

The repo shows this question has quietly split into two, and only one half is still open.

**Half one: the eval corpus. Already happened.** As of 2026-07-07 the repo contains 14
case files built from actual past client deliverables, pseudonymised under
[12-real-deck-intake.md](12-real-deck-intake.md) section C: client names to codenames,
people to role labels, URLs and handles stripped, business facts and figures kept
deliberately. An orchestrator-level anonymisation sweep ran across every case body and
one fix was applied. The codename-to-client mapping lives only in the sealed selection
memo. So the answer to "when" for eval material is "it already came in", under a policy
that was written down first and applied by the builders. What was never done is a human
sign-off on that policy by anyone other than the builders. Section C itself concedes the
cases are not fully de-identifiable and that this is accepted for private use.

**Recommendation for half one.** Ratify retroactively rather than re-do. The project
owner walks the confidentiality owner (VP or board level) through intake section C and
two sample case files, and gets a written line saying the pseudonymisation standard is
acceptable for private-repo use. Half an hour of someone's time. Also add one line to the
policy stating what triggers a re-scrub: any case leaving the private repo, any use in a
public artifact, any request from a former client. If the confidentiality owner rejects
the standard, the fallback is to band or remove the figures on the affected cases, which
would cost a rebuild of those cases and materially weaken them.

**Half two: live pilot material. Still open and it hard-gates Phase 3.**
[07-workflow.md](07-workflow.md) section E is explicit that no real client material
touches the tool until the sign-off gate and the sanitization protocol are in place and a
lead has agreed them, and that nothing from a review leaves the project folder without VP
permission. Past deliverables from finished projects are one risk class. A live deck for a
current client mid-engagement is a different and higher one.

**Recommendation for half two.** Three concrete moves.

1. Write the sanitization checklist as a one-pager a lead can apply in 10 minutes, drawn
   directly from 07 section E: replace the client name, replace stakeholders with roles,
   strip logos and headers, band identifying figures and mark them banded, describe rather
   than paste anything that cannot be sanitized without losing the point.
2. Make the first live sanitization a two-person act. The pilot project lead sanitizes,
   the project owner checks against the checklist before anything is pasted, and both
   record it in the project log. After the first two or three, the lead does it alone.
3. Put the checklist in front of the confidentiality owner for a yes before pilot week 1,
   not during it. This is the item most likely to stall a pilot at the last minute, and it
   costs about 4 hours of drafting to de-risk.

**Confidence.** High on the sequencing and on the two-person first sanitization. The
question of who at board level actually owns confidentiality is an org fact the repo does
not contain. See section H, decision 3.

### Q4. Is the printable a board and lead PDF, with the gated coaching view for students

**What the repo implies.** [07-workflow.md](07-workflow.md) section E already states it as
policy: the student coaching view is for the team, the lead view is for the project lead,
the printable is for the lead and, if the lead chooses, the board. Section B assigns
sign-off to the lead and escalation to a board reviewer, which is exactly the audience the
printable serves. The roadmap's own lean is yes.

**Recommendation.** Confirm yes, and add one constraint the current wording leaves open:
the printable must carry the readiness verdict and the notAssessed block, because a board
reviewer reading a stripped summary would not know where human judgment is still required.
Also keep the readiness verdict out of the student view entirely, per the two-modes
decision from session 4. A readiness label read by a student without a lead's framing is
the most likely source of the over-fear failure mode the effectiveness review warns about.

**Confidence.** High on the split, which is already policy. Unknown on whether the board
wants a PDF at all, which nobody has asked them. That is a conversation, not a design
question.

### Q5. Which model holds the rubric most cheaply, and does any dimension regress

**What the repo implies.** The roadmap gates this on the validator and scoring script
existing. The validator exists. The script does not and this plan recommends not building
it. Meanwhile sessions 4 and 5 produced real cost evidence for a different question: an
8-agent Fable fleet on MCP reads burned a five-hour session window in minutes, while
local-text Sonnet agents did the same job at roughly a quarter of the cost. That is
evidence about the *pipeline*, not about the reviewer, and it should not be read across.
Every reviewer result on record comes from one model tier on hand-clean synthetic inputs.

**Recommendation.** Do not run the bake-off yet, and do not run it against the synthetic
set at all. Sequence it after the real baseline, as a second arm on the same 14 cases plus
the 5 synthetic ones, scored on the same seven metrics by the same fresh-context method.
Reason: a cheaper model that holds up on five short single-flaw decks tells you nothing
about a 1400-line extraction-noisy deck, and the noise-budget and verbatim-quote
behaviours are exactly where a cheaper model would be expected to slip. Running the arm
before the primary baseline exists also doubles the cost of every calibration round.
Provisional expectation to test rather than assume: the blocking-rule and readiness layers
survive a cheaper model, the restraint and severity layers do not.

**Confidence.** Medium. The sequencing argument is solid. The prediction about which
layers degrade is a hypothesis with no evidence behind it and should be labeled as one.
There is also an unknown the repo cannot resolve: whether pilot users would run the tool
in a Claude Project or through an API path, which changes what "cheaply" even means. See
section H, decision 6.

---

## G. Risks and mitigations

| Risk | Why it is live here | Mitigation |
|---|---|---|
| Volunteer attrition mid-labeling | 32 to 40 person-hours spread over weeks in a branch with semester turnover. A labeler leaving after 6 cases leaves 6 half-labeled cases and an unusable agreement log | Stage the work (option B). Adjudicate each batch before starting the next, so a departure costs the current batch and not the set. Keep worksheets committed per case, never held to the end |
| Session and cost limits killing agent work | Sessions 4 and 5 both lost agents to account limits mid-wave. Session 4 lost the whole 8-agent triage wave and produced 3 rows of 181 | Waves not fleets. Write per item so a killed agent loses at most one item, which is already the proven pattern from session 5. Run the 14-case baseline in 3 waves rather than one. Budget wall-clock across two or three sessions, not one |
| Gold-label disagreement trips the stop rule | Two labelers, no prior inter-rater check ever run, and the rubric's own two-scorer agreement test has never been demonstrated. The effectiveness review flags this as an open hole | The calibration batch is the mitigation: surface it at 4 cases, not 14. Have a rubric-fix contingency of 8 to 16 person-hours already in the plan. If it fires twice, the rubric is the deliverable and the reviewer waits |
| Confidentiality gate stalls the pilot | Phase 3 cannot start without an agreed sanitization protocol and a lead who has signed it. This depends on people outside the project | Draft the checklist in week 8 or 9, weeks before it is needed. Ratify the existing eval-corpus policy at the same meeting so one conversation clears both halves of Q3 |
| The prompt gets edited mid-baseline | Harness section G and intake gate 6 both forbid it, and the temptation will be strongest exactly when the first real case fails badly | Tag the frozen prompt at 1.5l with a decision log line. Record mid-baseline observations in the disagreement log and change nothing until all 14 have run |
| Real decks break the verbatim-quote mechanism | Named in effectiveness review section 4 as untested. Extraction noise scrambles column order and floats chart values, and the quote check is the tool's central safety mechanism | The baseline is the test. If the mechanism fails, that is a finding not a failure. Do not soften the quote rule to make the number look better, that removes the safety property that justifies the tool |
| The set never reaches green on real cases | Real decks have several overlapping flaws and no dominant issue, which the tool has never been tested against | Accept in advance that Phase 1.5's exit is a defensible number rather than a good one. The go / revise / stop decision after 1.5o is a real decision with stop as a real option |
| Insider gold on real cases too | Same people wrote the tool, the cases and now the gold. The effectiveness review already flags this on the synthetic set | Option D: an ex-consultant third rater on 3 cases. Even 3 gives a signal on whether the builders' rubric reading is idiosyncratic |
| Over-escalation burns a pilot team on day one | The single behaviour the effectiveness review says most threatens adoption, and its fix rests on one post-fix run | Lead-mode only in Phase 3, so a human owns severity before anything reaches a student. Stability measurement (1.5h) before the freeze |

---

## H. Decisions only the project owner can make

These depend on people, relationships, budget or org facts that the repo cannot supply.
Each is a crisp question with options and a recommendation, answerable in one pass.

1. **Who is the second hand-labeler, and do they have 12 or more hours over 5 weeks?**
   Options: (a) a second builder, (b) a project lead from a past cycle, (c) a board or VP
   reviewer, (d) nobody, which means a single-labeler design that breaks the protocol and
   the gold. *Recommendation: (a) or (b). If the honest answer is (d), stop and solve this
   before anything else, because the whole critical path rests on it.*

2. **Does an ex-consultant relationship exist, and can they give 60 minutes plus
   optionally 3 hours as a third rater?** Options: (a) yes, one person, (b) yes, several,
   pick by sector fit, (c) not yet, needs a board or alumni introduction, (d) no route.
   *Recommendation: start the ask in week 1 regardless of the answer. If (d), substitute a
   senior alumnus or a lead from another branch and label the evidence accordingly. Do not
   let a missing expert block the baseline, it is not on the critical path.*

3. **Who at branch or board level owns confidentiality, and will they ratify the existing
   pseudonymisation standard for the 14 built cases?** Options: (a) a named VP or board
   role signs off in one meeting, (b) the standard is tightened first and the affected
   cases are rebuilt, (c) the cases stay builders-only until a policy exists. *Recommendation:
   (a), in the same conversation that clears the pilot sanitization checklist.*

4. **How many pilot project leads, and in which cycle?** Options: (a) 2 leads next cycle,
   (b) 3 leads next cycle, (c) wait a cycle and use the gap to extend the real case set.
   *Recommendation: (b) if three volunteer, (a) otherwise. Three gives a chance of seeing
   disagreement between leads, which two cannot.*

5. **Does the student coaching view open in Phase 3, or does Phase 3 stay lead-mode only?**
   Options: (a) lead mode only, students see nothing raw, (b) lead mode plus coaching view
   for one team as a probe, (c) both views open. *Recommendation: (a). The standing fitness
   verdict says expert or lead companion, and nothing has changed it. Revisit with Phase 3
   evidence.*

6. **What runtime do pilot users get, and is there any budget attached?** Options: (a)
   Claude Project, zero marginal cost, manual paste, (b) an API path with a real bill, (c)
   decide after the model comparison. *Recommendation: (a) for Phase 3, because zero cost
   removes a whole class of blocker and the paste burden is 2 minutes. The repo contains no
   budget information of any kind, so anything beyond (a) is an owner call.*

7. **If the real-case baseline comes back materially worse than the synthetic one, what
   happens?** Options: (a) one calibration round then re-baseline, (b) redesign the noise
   budget and severity model, (c) narrow the product to lead-mode triage only, (d) stop.
   *Recommendation: pre-commit to (a) with a single round, and to making the (b) / (c) / (d)
   choice on the second baseline rather than the first. Deciding the stopping rule before
   seeing the number is the only way it stays honest.*

8. **Does the plan's assumed capacity of 6 to 8 owner hours a week hold?** Every week
   number in section D scales off this one input and the repo has no evidence about it.
   *Recommendation: correct it once, in writing, and rescale section D rather than
   discovering it in week 4.*
