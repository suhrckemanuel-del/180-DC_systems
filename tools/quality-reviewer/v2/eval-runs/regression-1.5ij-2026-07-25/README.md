# Pre-freeze regression, the 1.5i + 1.5j prompt pass (2026-07-25, runs completed 2026-07-26)

The blind regression that plan item 1.5k requires before the freeze (1.5l). It confirms the
pre-freeze prompt pass (scorecard scope 1.5i, blocking primary 1.5j and the short-mode
scope correction) still produces valid, correctly-calibrated reviews on the five synthetic
cases, and re-measures the case 05 strong-deck over-escalation under the changed prompt.

Path A was not applied (owner decision 2026-07-25, accept 1 in 5), so this measures only the
1.5i and 1.5j mechanical changes, not a severity recalibration.

## Conditions

- **Prompt.** The current package: [04-prompt-templates.md](../../04-prompt-templates.md)
  section A with 1.5i and 1.5j applied, plus the rubric ([01](../../01-rubric-v1.md)) and the
  output contract ([03](../../03-output-contract.md)). One frozen candidate, no edits during
  the run.
- **Input.** The byte-identical stability input packs in
  [../stability/inputs/](../stability/inputs/), reused unchanged (my prompt edit does not
  touch the input). Each pack fills the section B template from the case metadata with the
  failure-mode header stripped, every optional field blank.
- **Blindness.** Each run was a separate fresh-context Opus 4.8 instance that read one
  self-contained pack file and nothing else: system prompt, rubric, contract, the case 01
  calibration trio (cases 02 to 05 only), then the deliverable. No runner could open
  eval-cases, eval-runs, any gold, any scoring sheet or progress.md. The pack builder is
  scratch-only and not committed. Cases 01 to 04 got one run each, case 05 got five (k to o)
  to re-measure its over-escalation frequency.
- **Model.** Claude Opus 4.8, all nine runs.
- **Scoring.** [check-review-v2.js](../../check-review-v2.js) for validity against the new
  contract and verbatim quotes against each deck, [check-stability.js](../../check-stability.js)
  for the case 05 variance. Gold was read only after every output existed.

## Results

| Case | Runs | Readiness | Gold | Match | Blockers | diagnosticMean | Findings | Valid |
|---|---|---|---|---|---|---|---|---|
| 01 vague recommendation | 1 (a) | R1 Needs substantial revision | R1 | yes | 2 | 2.4 | 5 | pass |
| 02 framing drift | 1 (a) | R1 Needs substantial revision | R1 | yes | 1 | 2.1 | 3 | pass |
| 03 weak storyline | 1 (a) | R1 Needs substantial revision | R1 | yes | 1 | 2.4 | 3 | pass |
| 04 contradiction | 1 (a) | R0 Not ready for client review | R0 | yes | 3 | 2.7 | 4 | pass |
| 05 strong deck | 5 (k to o) | R3 Nearly ready, all five | R3 | yes | 0 | 4.6, 4.6, 4.8, 4.6, 4.5 | 3, 3, 2, 3, 3 | pass |

Readiness match: **9 of 9**. Case 05 restraint held in **5 of 5** runs.

## What this shows

- **The new schema is emitted correctly and validates.** All nine runs carry a `scope` on
  every dimension and a `primary` on every blocking issue, and all nine pass the new
  validator (scope matches the artifact-type matrix, checksTotal 1 to 4, full-scope
  diagnosticMean, one primary equal to the lowest ceiling) plus the verbatim-quote check.
  The 1.5i and 1.5j changes work in live blind runs, not just in fixtures.
- **1.5i in the wild.** case-01 (draft deck) marks exactly one dimension light,
  Feasibility and implementation, matching the matrix, and averages the nine full-scope
  dimensions. case-04 and case-05 (final rec decks) mark all ten full, so their means are
  unchanged in kind from before.
- **1.5j in the wild.** case-04 fired three rules and marked rule 1 (ceiling Not ready, the
  most severe) primary with rules 2 and 4 secondary. case-01 fired two and marked one
  primary. The binding blocker is now explicit.
- **Case 05 over-escalation did not reproduce.** Five of five landed R3, against the
  pre-1.5i package's four of five. diagnosticMean was stable at 4.5 to 4.8 (spread 0.30),
  confidence stable Medium, blocking set stable empty.

## Honest caveats

- Five runs cannot prove the case 05 over-escalation is eliminated. Zero in five is
  consistent with a true rate anywhere up to roughly one in three at this sample size. The
  owner accepted one in five on 2026-07-25 and the real-case baseline is the true calibration
  test. This sheet shows the 1.5i and 1.5j change did not make over-escalation worse, and if
  anything it did not appear at all in these five.
- Cases 01 to 04 got one run each. This regression tests that the changed prompt still lands
  the right readiness and valid new-format output on them, not their run-to-run variance
  (measured earlier in [../stability/](../stability/), which still stands for the finding-set
  and mean spread on cases 01 to 04 since 1.5i and 1.5j do not touch severity or the ladder).
- The finding-set drift check-stability.js reports for case 05 (section 1 of its output) is
  the same quote-containment floor described in the stability sheet, not new instability.
