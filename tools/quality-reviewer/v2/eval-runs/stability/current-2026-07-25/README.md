# Case 05 re-measurement on the current package, 2026-07-25

Why this exists. The seventeen stability runs in [../README.md](../README.md) measured a
package that no longer sits on disk. Commit 54171e5 (2026-07-24) applied an unmeasured
readiness rewrite and the issueType enum to 04 section A, and the rubric's 2026-07-23
redesign decoupled no-blocker readiness from the major count. The famous case 05 result,
R2 in three of five runs, was measured before all of that. So it is stale. This folder is
the honest re-measurement of the current package on the one case that varied.

**Read the whole sheet before quoting a number.** An interim version of this sheet, written
after the first three runs landed, said the over-escalation was not reproduced. The fourth
run reproduced it. Three runs misled again, the same trap the earlier case 05 measurement
fell into. The five-run result below supersedes that interim reading.

## Conditions

- **Package.** Current 04 section A (post 54171e5) plus the current rubric (post the
  2026-07-23 redesign) plus the output contract, delivered to each runner in one
  self-contained blind pack. The rubric copy in the pack had its 2026-07-23 redesign note
  stripped, because that note names case 05 and its gold and would break blindness. Every
  scoring rule was kept. The system prompt and contract were included verbatim.
- **Input.** The same byte-identical case 05 input pack the seventeen runs used
  ([../inputs/case-05-input.md](../inputs/case-05-input.md)), failure-mode header stripped.
- **Calibration.** The case 01 trio, matching the deployed Claude Project knowledge.
- **Blindness.** Each run was a fresh-context instance that received only the pack and was
  instructed to read no other file. No gold, no eval-runs, no progress or stability notes.
- **Model.** Claude Opus 4.8.
- **Runs.** Five, f to j. The account session limit killed h and j on the first wave and
  interrupted g and i, so f, g and i were scored first (all R3). After the reset, h and j
  ran. Write-per-item meant nothing was lost. The pack was byte-identical across all five.

## Result

| Run | Readiness | crit / major / minor | blocking | confidence | mean | contract |
|---|---|---|---|---|---|---|
| f | Nearly ready (R3) | 0 / 0 / 2 | 0 | Medium | 4.6 | pass |
| g | Nearly ready (R3) | 0 / 0 / 3 | 0 | Medium | 4.7 | pass |
| h | **Needs targeted revision (R2)** | 0 / **1** / 1 | 0 | Medium | 4.5 | **INVALID** |
| i | Nearly ready (R3) | 0 / 0 / 2 | 0 | Medium | 4.5 | pass |
| j | Nearly ready (R3) | 0 / 0 / 2 | 0 | Medium | 4.6 | pass |

`check-stability.js` across the five: **readiness R3, R3, R2, R3, R3, correct in four of
five and over-escalated in one.** Severity is zero majors in four runs and one major in run
h. Confidence stable Medium, diagnosticMean spread 0.20. Finding-set stable core is 0 of 13
this sample: on a strong deck with no dominant flaw the reviewer surfaces a different set of
minor observations each run, which the earlier sheet already documented and which does not
move the verdict on four of five runs.

Reproduce:

```
node ../../../check-stability.js case-05-cur-run-f.json case-05-cur-run-g.json case-05-cur-run-h.json case-05-cur-run-i.json case-05-cur-run-j.json
node ../../../check-review-v2.js case-05-cur-run-h.json ../../../eval-cases/case-05-good-but-not-perfect.md
```

## What it means

**The over-escalation is reduced, not eliminated.** Gold is R3. The superseded package
returned R2 in three of five runs. The current package returns R2 in one of five. That is a
real, measured improvement, driven by the 2026-07-23 rubric redesign that removed the
any-one-major-forces-R2 rule. But run h shows the failure mode is still reachable.

**The residual is a severity wobble on one specific finding.** The 5 percent full-launch
gate (slide 10) sitting below the 8 percent conversion the revenue case depends on (slide 8)
is the most consistently surfaced observation, it appears in four of five runs. In three of
those it is a minor finding or a comment and readiness stays R3. In run h it is promoted to
major and readiness falls to R2. This is the exact finding adjudicated on 2026-07-03 as a
real observation graded too high: the deck frames year one as a deliberately small pilot, so
the gap sharpens rigor but does not change the go decision, and gold stays R3. So run h is a
genuine over-escalation against the adjudicated gold, not a new catch.

**Run h is also contract-invalid.** It marked the major finding deliveryCritical with no
blocking issue listed, which check-review-v2.js rule 8a rejects, so the renderer would
refuse to draw it. That is an incidental guard, not a reliable one: an over-escalated R2
with one major and deliveryCritical set to false would pass the validator. Do not count the
validator as the fix for over-escalation.

**Path A is back in play.** The interim reading retired the drafted severity clause as
redundant. With the residual over-escalation confirmed, it is not redundant: it targets
exactly run h, tightening the major test so a no-blocker finding like the gate reconciliation
stays minor. Whether to apply it is the owner call re-opened with this number, because run
h's mainReason does name a decision-change (the client commits to a full launch at a level
delivering closer to 3,000 pounds than 5,000), so under a literal reading of the current
rule its R2 is arguable, and the boundary is a genuine judgment call the rubric's own
philosophy chooses to resolve toward R3 with the project lead as the backstop.

## Caveats

- **Still one short synthetic single-flaw deck.** Nothing here bounds behaviour on a real
  1400-line extraction-noisy deck. The real-case baseline remains the test that matters, and
  the rubric's redesign note explicitly names the real-case baseline as where residual
  over-escalation or under-escalation should be judged. It is gated on the human golden set,
  which has not started.
- **Five runs is still a small sample.** One in five is "reduced", not a precise rate.
- **No threshold invented.** This reports rather than passes or fails.
