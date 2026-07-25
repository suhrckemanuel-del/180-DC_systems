# Case 05 re-measurement on the current package, 2026-07-25

Why this exists. The seventeen stability runs in [../README.md](../README.md) measured a
package that no longer sits on disk. Commit 54171e5 (2026-07-24) applied an unmeasured
readiness rewrite and the issueType enum to 04 section A, and the rubric's 2026-07-23
redesign decoupled no-blocker readiness from the major count. The famous case 05 result,
R2 in three of five runs, was measured before all of that. So it is stale. This folder is
the honest re-measurement of the current package on the one case that varied.

## Conditions

- **Package.** Current 04 section A (post 54171e5) plus the current rubric (post the
  2026-07-23 redesign) plus the output contract, delivered to each runner in one
  self-contained blind pack. The rubric copy in the pack had its 2026-07-23 redesign note
  stripped, because that note names case 05 and its gold and would break blindness. Every
  scoring rule was kept. The system prompt and contract were included verbatim.
- **Input.** The same byte-identical case 05 input pack the seventeen runs used
  ([../inputs/case-05-input.md](../inputs/case-05-input.md)), failure-mode header stripped.
- **Calibration.** The case 01 trio, matching the deployed Claude Project knowledge, same
  as the earlier runs.
- **Blindness.** Each run was a fresh-context instance that received only the pack and was
  instructed to read no other file. No gold, no eval-runs, no progress or stability notes.
- **Model.** Claude Opus 4.8.
- **Runs.** Five were launched (f to j). The account session limit (resets 1:10am
  Europe/Berlin) killed h and j before they wrote, and interrupted g and i, but
  write-per-item discipline meant f, g and i were already on disk and valid. So this is a
  **three of five** measurement, not five. The two missing runs are to be completed after
  the session resets, to match the five-run bar the earlier case 05 measurement set.

## Result

| Run | Readiness | crit / major / minor | blocking | confidence | diagnosticMean | contract |
|---|---|---|---|---|---|---|
| f | Nearly ready with minor edits (R3) | 0 / 0 / 2 | 0 | Medium | 4.6 | pass |
| g | Nearly ready with minor edits (R3) | 0 / 0 / 3 | 0 | Medium | 4.7 | pass |
| i | Nearly ready with minor edits (R3) | 0 / 0 / 2 | 0 | Medium | 4.5 | pass |

`check-stability.js` across the three: readiness **stable at R3**, severity **zero majors
in every run**, confidence stable Medium, diagnosticMean spread 0.20. Finding-set stable
core is 2 of 10 (20 percent): the strong-deck finding drift the earlier sheet documented is
still present, the reviewer surfaces a slightly different set of minor observations each
run, which is expected on a deck with no dominant flaw and does not move the verdict.

Reproduce:

```
node ../../../check-stability.js case-05-cur-run-f.json case-05-cur-run-g.json case-05-cur-run-i.json
node ../../../check-review-v2.js case-05-cur-run-f.json ../../../eval-cases/case-05-good-but-not-perfect.md
```

## What it means

**The strong-deck over-escalation is not reproduced on the current package.** Gold is R3.
The superseded package returned R2 in three of five runs, and section C of the earlier
sheet pinned the cause: each R2 run promoted one finding to major and a rule then forced
R2. The current package returns R3 in three of three completed runs with zero majors. This
is structural, not sampling luck: the rule that produced the R2s ("any one major forces
R2") was removed by the 2026-07-23 rubric redesign, which decouples no-blocker readiness
from the major count and routes it through a single decision-change test with an R3
default. The three runs confirm the redesigned structure behaves as intended.

**The issueType enum fix is confirmed.** All three runs pass the contract validator with no
invented issueType value. The earlier package produced `analysis` in two of fifteen runs
because the prompt then lacked the enum. The current prompt lists it and the defect is gone.

**Path A is redundant and was not applied.** The severity-consistency clause drafted in
progress.md Session 8 was designed against the superseded major-count coupling. The current
rubric already carries essentially the same logic ("a deck that fires none of them is sound
by construction and its residual findings are refinement"), and this measurement shows the
over-escalation is already gone. Adding Path A would be a further prompt change with no
demonstrated benefit, and it would itself need re-measurement. It stays drafted as a
fallback if the two remaining runs, or the real-case baseline, resurface over-escalation.

## Caveats

- **Three of five, not five.** Case 05 was the case taken to five runs precisely because it
  varied. Three identical R3 readings is strong evidence, and the causal argument above
  raises confidence beyond a raw three-sample frequency, but the record should reach five to
  match the earlier bar. Complete f to j after the session reset.
- **Still one short synthetic single-flaw deck.** Nothing here says anything about a real
  1400-line extraction-noisy deck. The real-case baseline remains the test that matters, and
  it is gated on the human golden set, which has not started.
- **No threshold invented.** As with the earlier sheet, this reports rather than passes or
  fails. Three stable R3 runs on the restraint case is a good number, not a certified one.
