# Paste-ready build prompt: the calibration sprint (rule 1, extraction, severity)

<!-- check-docs: historical -->

**Dated record, not a status report. Ran 2026-08-02. Produced the three calibration edits and the second baseline. Whether the edits helped is still unmeasurable.** For current state read [STATUS.md](STATUS.md).

Paste everything below the line into a fresh chat. It is self-contained.

Runs after [BUILD-PROMPT-real-baseline.md](BUILD-PROMPT-real-baseline.md), which produced the
9-case baseline this sprint is measured against. Target: a decision on Wednesday 2026-08-05.

---

Working in `c:\Users\User\Desktop\180dc-ai`, branch `idea/reviewer-v2`. Everything below
lives under `tools/quality-reviewer/v2/`. **Build, run and measure. Do not write design
documents.**

## The goal, in one sentence

Make three batched changes to the frozen reviewer prompt, re-run the same 9 real cases, and
produce a before/after table against the same human golds so the owner can decide on
Wednesday whether the calibration is fixed.

## What the baseline found

Run `frozen-2026-07-26`, 9 gold-backed real cases, in
`eval-runs/real-baseline/2026-07-29T16-29-44-subagent-packs/`.

| case | gold | tool | delta | blocking rules fired |
|---|---|---|---|---|
| real-01 | R2 | R0 | **-2** | **1** |
| real-02 | R2 | R0 | **-2** | **1**, 2, 4 |
| real-03 | R2 | R0 | **-2** | **1**, 4 |
| real-13 | R2 | R0 | **-2** | **1**, 4 |
| real-05 | R2 | R1 | -1 | 2 |
| real-14 | R2 | R1 | -1 | 2, 3 |
| real-04 | R0 | R0 | 0 | 1, 2, 3, 4 |
| real-08 | R0 | R1 | +1 | 2, 4 |
| real-12 | R1 | R1 | 0 | 2, 4 |

Headline metrics: readiness exact 22.2%, within-one 55.6%, over-flag rate 66.7%,
strong-deck over-flag 6 of 6, severity exact where matched 100% (n=2), blocking rules
missed 0%.

**Three facts drive this sprint.**

1. **Rule 1 causes every 2-level miss.** It fired on all four and on neither 1-level miss.
   It is the only rule with an R0 ceiling, so it alone manufactures "Not ready".
2. **The tool has never used its top two readiness levels on real work.** Six of the nine
   golds are R2. The tool assigned R2 zero times and R3 zero times, across all nine.
3. **The tool does not know its input is damaged.** On real-01 it built its rule-1 blocker
   by setting the executive summary against an orphaned value from the appendix basket
   table. That gold's "False positives to avoid" section had warned, in advance, that the
   basket table's series values were flattened by extraction. The blocker was built out of
   extraction debris.

## The three edits, applied as ONE pass

All three go into section A of `04-prompt-templates.md` in a single edit. **Any prompt edit
invalidates every existing run**, so batching is mandatory and you re-measure once. This is
already the rule in `progress.md`.

Before editing, archive the current prompt so the before/after stays reproducible:
copy section A verbatim to `eval-runs/prompt-archive/frozen-2026-07-26.txt`.

### Edit 1. Extraction awareness (append to the EVIDENCE RULE section)

The reviewer has no concept that its input is extracted PDF text. Add a rule to that effect.
Required semantics, adapt the wording to the voice rules:

> Your input is extracted text and it may be damaged. The intake notes name what broke in
> extraction. Never build a finding on a figure, table or series that those notes flag as
> unreliable. This binds hardest on blocking issues: a contradiction whose only evidence is
> a value extraction may have mangled is not a contradiction, it is a question. Put it in
> questionsForLead, note it in notAssessed and lower confidence. A missing or odd number
> inside a flagged table is a defect in the file, not in the team's work.

### Edit 2. Rule 1 needs a decision-change test

Current text, in the READINESS blocking-rule list:

> 1 A contradiction the recommendation walks into, or a recommendation that could mislead
>   the client. Ceiling Not ready.

"Walks into" is an undefined loophole and the model reads it as "any inconsistency near a
recommendation". Qualify it. Required semantics:

> A contradiction fires this rule only when both hold: the client cannot resolve it from the
> deliverable itself, and the two readings lead the client to do different things. Name that
> difference in one sentence in the blocking issue label. An inconsistency the client would
> simply ask about, or one where the client's action is the same either way, is a major
> finding and fires nothing. Two slides citing different figures for the same quantity is
> the common case and is usually a major finding, not a blocker.

This is the same surgery the 2026-07-23 redesign performed on "changes the recommendation or
its defensibility". See [11-decision-log.md](11-decision-log.md) for that precedent and match
its reasoning.

### Edit 3. Severity does not inherit from readiness (append to the SEVERITY section)

Evidence: real-01 gold has 0 critical findings, the tool produced 1. real-04 gold has 2, the
tool produced 5. Required semantics:

> Grade severity per finding on its own merits. Severity does not inherit from readiness. A
> deck at Not ready can carry one critical finding and four major ones, and usually does: the
> blocking rule explains the readiness, the rest is still work. Before grading a finding
> critical, name the specific decision the client gets wrong without the fix. If you cannot,
> it is major.

The existing "default to minor on a no-blocker deck" paragraph stays. It governs a different
case and it is not the problem here.

### After editing

Bump `promptVersion` in `run-reviews.js` (currently `'frozen-2026-07-26'`) to
`'frozen-2026-08-03'`. The sha256 is computed from the document at run time, so it updates
itself. Confirm the new hash is printed and differs from `20cc7e4add709427`.

## Write the success test BEFORE you run anything

Record these in the run folder as `EXPECTATIONS.md` before the first case runs, so the
result cannot be rationalised afterwards.

- **Primary.** Does the tool assign R2 or R3 to any of the six R2 golds (real-01, 02, 03,
  05, 13, 14)? Baseline is zero. Any non-zero is movement. Three or four is a fixed
  instrument.
- **Regression guard.** real-04 and real-12 must stay exact. real-08 must not get softer
  than R1. If strong-deck accuracy is bought by going blind on genuinely bad decks, the
  change failed.
- **Secondary.** Strong-deck over-flag rate must fall below 6 of 6. Blocking rules missed
  must stay at 0%.

## The run

1. New run folder. **Do not overwrite the 07-29 baseline**, it is the comparison.
2. Re-run all 9 cases blind, one Claude Code subagent per case, seeing only its own input
   pack. The subagent must never read `eval-cases-real/labeling/`, any `*.gold.md`, any
   `*.worksheet.*`, `_LABELING-RECORD.md`, or another case's review. A subagent that sees a
   gold burns that case; re-run it in a fresh agent.
3. **Batch 3 to 4 at a time and collect after each batch.** Large waves have hit the account
   session limit and been killed mid-task three sessions running.
4. Validate each review as it lands with `check-review-v2.js`. A contract failure is re-run,
   not hand-patched.
5. Score each against its gold with `score-review.js`, then aggregate with `scorecard.js`.

### Known trap, do not step in it

`run-reviews.js` does not recognise `--help` and treats unknown flags as a real run. In a
previous session a `--help` call started a live API run over all 9 cases. Every request
failed on a grammar error so nothing was written and it cost nothing, but do not rely on
that. **Read the usage comment at the top of the file instead of guessing flags.** Add a
`--help` guard as part of this sprint. The API path is separately broken by a "compiled
grammar is too large" 400; the subagent path is the working one and the one to use.

## Deliverable

A before/after table on the identical 9 golds:

| case | gold | 07-26 | 08-03 | moved |
|---|---|---|---|---|

Plus the metric deltas (readiness exact, within-one, over-flag, strong-deck over-flag,
blocking missed) and a one-paragraph verdict against the primary test and the regression
guard. **Present it, do not decide it.** The owner calls ship, iterate once, or revert on
Wednesday.

## Definition of done

- Three edits applied in one pass, old prompt archived, version bumped, new hash confirmed.
- `EXPECTATIONS.md` written before the run.
- 9 contract-valid reviews in a new folder, all produced blind under the new prompt.
- 9 score files and an aggregate scorecard.
- The before/after table and the verdict paragraph.
- `--help` guard added to `run-reviews.js`.
- `STATUS.md` and `progress.md` updated with the result, whichever way it goes.

## What not to do

- Do not edit the prompt again mid-run. One pass, one measurement.
- Do not label new golds. Do not touch real-06, real-07, real-09.
- Do not touch the output contract, the renderer or `index.html`. The design track is
  running in parallel and must not collide.
- Do not tune to individual cases. If a change only helps real-01, it is overfitting to one
  labeler's read of one deck.
- Do not report an improvement without the regression guard result beside it.
