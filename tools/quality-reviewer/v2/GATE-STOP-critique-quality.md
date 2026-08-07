# GATE STOP — critique-quality sprint, 2026-08-03

<!-- check-docs: historical -->

**Dated record, not a status report. The gate-stop record itself, written 2026-08-03. Its threshold figures are the pre-refit ones and are correct as history.** For current state read [STATUS.md](STATUS.md).

**Verdict: stopped at the gate. No prompt edits were made.** `04-prompt-templates.md` is
untouched and `run-reviews.js` still prints `frozen-2026-08-03 sha256:39c18fbca9e5d218`.

The gate asked whether findings repeat well enough to measure a critique-quality change.
They do not — but not for the reason the gate anticipated, and the distinction matters for
what to do next. No deck text is quoted below, so this file is safe to track.

## First problem: the stability sprint never finished

There is no `RESULT.md` in `eval-runs/real-baseline/stability/`. The sprint collected runs A
and B for four cases and promoted them, then collected run C for all four cases and stopped.
Run C's manifest still reads `status: pending` for every case; nothing was contract-checked,
scored or promoted.

I completed only the missing measurement steps needed to answer the gate — no re-runs, no new
model calls. All three collections carry the same frozen prompt hash, so they are comparable.

Contract-checking run C now: **real-01, real-03, real-04 valid. real-13 invalid** — finding 1
is `deliveryCritical` with no blocking issue listed. Per the stability sprint's own reading
rules a contract failure is a data point, not a discard, so real-13 is reported below on two
runs and its third slot is still owed.

## The stable-core numbers the gate asked for

`check-stability.js`, findings identity by evidence quote:

| case | runs | distinct findings | stable core | drift |
|---|---|---|---|---|
| real-01 | 3 | 25 | **5 (20%)** | 20 (80%) |
| real-03 | 3 | 32 | **4 (13%)** | 28 (88%) |
| real-04 | 3 | 17 | **7 (41%)** | 10 (59%) |
| real-13 | 2 | 19 | **6 (32%)** | 13 (68%) |

Readiness, by contrast, was stable across draws on three of the four cases. So the literal
reading is the gate's stop branch and then some: the findings are *less* reproducible than
readiness, the opposite of the condition that would have let this sprint proceed.

**But that number is a floor and here it badly understates.** The script says so itself and
asks a human to eyeball the drift list before believing a low score. I did. Reading the
finding titles across draws rather than their quotes:

- **real-04** — four of its five findings appear in all three draws (no recommendation in the
  recommendations section; chapters written as promotional copy; costs absent and deferred;
  the medical-center revenue claims). Scored 41%, semantically ~80%.
- **real-01** — the top critical finding, that the deck never answers the question it was set,
  is present in **all three draws**. Two more recur in all three.

The reviewer is more consistent than the quote matcher can see. Two draws making the same
point from different slides count as two different findings, and that is most of the drift.

## The decisive test: does the *scored* instrument repeat?

Quote containment is not this sprint's instrument. Gold coverage and must-catch recall are,
and `score-review.js` matches on concept overlap, which is more forgiving. So I scored every
stability run against its gold — the exact metrics the sprint proposed to move:

| case | run A | run B | run C |
|---|---|---|---|
| real-01 | miss, 0 hit / 2 near of 6 | **near**, 0 hit / 3 near | miss, **1 hit** / 2 near |
| real-03 | miss, 0 hit / 2 near of 5 | miss, 0 hit / 2 near | **near**, **1 hit** / 2 near |
| real-04 | **hit**, 4 hit / 1 near of 5 | **hit**, 4 hit / 1 near | **hit**, 4 hit / 1 near |
| real-13 | miss, 0 hit / 1 near of 3 | **near**, 0 hit / 2 near | — (contract failure) |

Under a frozen prompt, on identical input, the must-catch verdict flips between `miss` and
`near` on three of four cases, and the hit count moves by one on two of them.

## Why it flips — the actionable part

The must-catch match scores, against thresholds `T_NEAR = 0.28` and `T_HIT = 0.45`:

| case | run A | run B | run C | span |
|---|---|---|---|---|
| real-01 | 0.270 | 0.433 | 0.243 | straddles the whole near band |
| real-03 | 0.275 | 0.294 | 0.333 | flip decided by **0.005** |
| real-13 | 0.270 | 0.280 | — | flip decided by **0.010** |
| real-04 | 0.883 | 0.825 | 0.854 | far above hit, never in doubt |

The instrument is bimodal, not broken. Where the match is decisive it repeats **exactly** —
real-04 returned an identical scored result three times. Where the match sits near 0.28 the
verdict is decided by hundredths of a point of wording variance.

Two things make this fatal for this sprint specifically:

1. **The target population is the ambiguous band.** The communication-typed gold issues this
   sprint wants to start catching are, by construction, the ones currently scoring at or below
   `near`. The sprint would be measuring its effect entirely inside the region where the
   instrument coin-flips.
2. **The primary success criterion is already noise.** The bar was "real-01's must-catch is
   caught in at least two of three draws." real-01's must-catch is confirmed
   communication-typed (`major / Storyline and pyramid logic / communication`) — the right
   target. But under the *unedited* prompt it already scored near / miss / miss, and its run-B
   score of 0.433 came within 0.017 of a hit with no edit at all. A post-edit result of
   near / near / miss would be indistinguishable from this.

Worth noting: `score-review.js` labels `T_HIT` and `T_NEAR` **UNVALIDATED**, calibrated on
fabricated fixtures only, with an instruction to review them against the first batch of real
`near` verdicts before anyone quotes the recall number. That review has never happened. This
is that batch.

## What would unblock the sprint

Roughly in order of cost:

1. **Adjudicate the near band by hand.** Twelve scored runs are sitting in the stability
   folder. Read each `near` and record whether a human calls it a catch. That is the threshold
   calibration the scorer has been asking for, and it is the cheapest thing here.
2. **Re-fit `T_NEAR`/`T_HIT` to those judgements and bump `MATCHER_VERSION`.** Scores across
   matcher versions are not comparable, so this has to happen before a baseline is frozen, not
   after.
3. **Then re-run this gate.** If the boundary cases land as decisively as real-04 does, the
   sprint proceeds as written — the three edits are well argued and the case for them does not
   depend on anything above.

The two owed items are independent of that: real-13 still needs a third run, and the stability
sprint still needs its `RESULT.md`, which needs an owner call on its readiness decision rules.

## What was not done

No edit to `04-prompt-templates.md`. No `promptVersion` bump. Nothing archived to
`prompt-archive/` — archiving is only meaningful alongside the edit it precedes. No case
selection, no `EXPECTATIONS.md`, no review runs. `git status` carries no real-case material;
everything under `eval-runs/real-baseline/` is gitignored and stayed there.

`04-prompt-templates.md` and `run-reviews.js` do show as modified in `git status`, but that
predates this session — both were already uncommitted at its start. The working copy is the
frozen prompt (`39c18fbca9e5d218`, re-confirmed via `--dry-run` after the gate call); the
committed version is the older one. Nothing here changed either file.
