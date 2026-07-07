# Expert pack

The assembled package to hand to an ex-McKinsey, tech or VC reviewer. How to run the
session is in [../06-expert-feedback-pack.md](../06-expert-feedback-pack.md).

## Contents

- [one-pager.md](one-pager.md) the tool, objective, non-objectives and rubric in brief.
- [feedback-form.md](feedback-form.md) the structured questions.
- [scoring-sheet.md](scoring-sheet.md) optional scoring against the seven metrics.

## Samples (decks from ../eval-cases/, reviews from ../eval-runs/)

Hand these alongside the pack. Each is a deliverable plus the AI review it produced. The
review in each row is a live output: a fresh-context instance generated it blind from the
deployed prompt package and the filled input, with the gold label withheld. These are not
the hand-worked design-time reviews. Each passes the contract validator
[../check-review-v2.js](../check-review-v2.js) including the verbatim-quote check, and the
full five-case set clears the harness acceptance threshold (section E).

| Sample | Deck | AI review (live) | What it shows |
|---|---|---|---|
| Broken | [../eval-cases/case-01-vague-recommendation.md](../eval-cases/case-01-vague-recommendation.md) | [../eval-runs/case-01-review-v2-live.json](../eval-runs/case-01-review-v2-live.json) | catches an unsourced number the recommendation rests on |
| Weak | [../eval-cases/case-03-weak-storyline.md](../eval-cases/case-03-weak-storyline.md) | [../eval-runs/case-03-review-v2-live.json](../eval-runs/case-03-review-v2-live.json) | catches a findings dump that never answers the question |
| Strong | [../eval-cases/case-05-good-but-not-perfect.md](../eval-cases/case-05-good-but-not-perfect.md) | [../eval-runs/case-05-review-v2-live-r2.json](../eval-runs/case-05-review-v2-live-r2.json) | shows restraint, two minor findings, no invented criticals |

The strong sample is the run under the current prompt, after a severity-calibration fix.
An earlier run over-escalated this deck to three major findings and a lower readiness. The
eval caught it, the fix corrected it, and the story is recorded in
[../effectiveness-review-2026-07-03.md](../effectiveness-review-2026-07-03.md) and the
decision log. Show it to the expert if useful: it is evidence the eval loop works.

## Assembly note

For the session, render each live review JSON to the readable report shape described in
[../03-output-contract.md](../03-output-contract.md) section C, so the expert reads a
report, not raw JSON. The 30-minute session uses the broken sample only. The 60-minute
session uses all three.
