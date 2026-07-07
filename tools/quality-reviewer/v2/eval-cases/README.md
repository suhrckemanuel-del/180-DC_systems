# Evaluation cases

Synthetic, fully anonymized consulting deliverables built to test the reviewer against
known issues. Each case has a deck (`case-NN-*.md`), a human-written gold label
(`case-NN.gold.md`) written before any AI review, and for three of them a worked AI
review (`case-NN.review.json`) conforming to [../03-output-contract.md](../03-output-contract.md).

No real client, no real data. When in doubt the cases use Client A, Segment B and so on.

| Case | Failure mode under test | Expected readiness | AI review |
|---|---|---|---|
| 01 | Vague recommendation, decision rests on an unsourced number | Needs substantial revision | yes (worked) |
| 02 | Problem framing drift, answers the wrong question | Needs substantial revision | yes (live blind run, see [../eval-runs/](../eval-runs/)) |
| 03 | Weak storyline, no governing insight, question unanswered | Needs substantial revision | yes (worked) |
| 04 | Internal contradiction and overconfident conclusion | Not ready for client review | yes (live blind run, see [../eval-runs/](../eval-runs/)) |
| 05 | Good but not perfect, tests restraint and honest calibration | Nearly ready with minor edits | yes (worked) |

The three cases with worked reviews (01, 03, 05) are the samples in the expert feedback
pack. They span a broken deck, a structurally weak deck and a strong deck, so the expert
can judge whether the reviewer shows discernment rather than always finding three
criticals. Cases 02 and 04 get their AI reviews when the golden set is run in the pilot,
tracked in [../09-roadmap.md](../09-roadmap.md).

## How these are used

- **Calibration.** A subset goes into the Claude Project knowledge as worked examples so
  any new deliverable is a clean test. See [../04-prompt-templates.md](../04-prompt-templates.md) section E.
- **Scoring.** Each AI review is scored against its gold label on the seven metrics in
  [../05-eval-harness.md](../05-eval-harness.md).
- **Restraint check.** Case 05 is the guard against a reviewer that manufactures
  problems. The correct review there is short and generous.
