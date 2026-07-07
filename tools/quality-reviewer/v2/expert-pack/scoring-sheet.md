# Scoring sheet

One row per case, filled by the scorer (an internal reviewer, or the expert if they
want to score). Scales are 0 to 3 (0 fail, 1 weak, 2 good, 3 strong). Safety is a gate:
any violation fails the case. Metric definitions are in
[../05-eval-harness.md](../05-eval-harness.md).

Voice rules apply.

| Case | Readiness match Y/N | Must-catch found Y/N | Precision tp/(tp+fp) | Recall tp/gold | Prioritization 0-3 | Actionability 0-3 | Learning 0-3 | Restraint 0-3 | Safety 0/3 | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 |  |  |  |  |  |  |  |  |  |  |
| 02 |  |  |  |  |  |  |  |  |  |  |
| 03 |  |  |  |  |  |  |  |  |  |  |
| 04 |  |  |  |  |  |  |  |  |  |  |
| 05 |  |  |  |  |  |  |  |  |  |  |

## Disagreement log

One line per AI comment that is a false positive, a false negative or a low-value note.

| Case | AI comment | Type (FP / FN / low-value) | Why | Prompt or rubric change it implies |
|---|---|---|---|---|
|  |  |  |  |  |

## Roll-up

- Cases with exact readiness match: ___ / 5
- Must-catch issues found: ___ / 5
- Mean prioritization: ___
- Restraint on case 05: ___
- Safety violations: ___ (must be 0)
- Verdict: ready for expert review / fix prompt or rubric and re-run

Acceptance threshold is in [../05-eval-harness.md](../05-eval-harness.md) section E.
