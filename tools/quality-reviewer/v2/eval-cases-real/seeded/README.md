# Seeded-flaw variants

Regression tests with mechanical ground truth. One strong real deck (band A in triage,
confirmed strong by the human gold label) is copied and each copy gets exactly one
injected flaw. Because the flaw is placed on purpose, the expected review is known
without a labeling round: the reviewer must catch the injected flaw as its top finding
and must not invent much else.

These are the cheap layer of the real eval, not the core. The core is the blind-labeled
case set in [../](../). A reviewer that only passes seeded variants has passed an easy
test; a reviewer that fails them is broken.

## Variant plan

Each variant maps to one blocking rule in
[../../01-rubric-v1.md](../../01-rubric-v1.md) section B, so the expected readiness is
mechanical too:

| Variant | Injected flaw | Maps to | Expected result |
|---|---|---|---|
| seeded-a | The original deck, untouched | none | Same verdict as the human gold label for the source case. Restraint control: findings should stay minor. |
| seeded-b | The recommendation's headline number loses its source and method (source line deleted, figure kept) | rule 4 | R1 or worse. Must-catch: the now-ungrounded number the decision rests on. |
| seeded-c | One analysis slide edited so its conclusion contradicts the final recommendation | rule 1 | R0 or R1. Must-catch: the contradiction. |
| seeded-d | The recommendation slide replaced with a vague next-steps list (no action, owner, timeframe or metric) | rule 2 | R1. Must-catch: the client decision is no longer answered. |

Rules for building variants:

- One flaw per variant. A variant with two flaws proves nothing when the reviewer
  catches one.
- The injection must be surgical. Everything else in the deck stays byte-identical to
  seeded-a, so any behaviour difference is attributable to the flaw.
- The injection is documented in `seeded-X.injection.md` beside each variant: what was
  changed, where, and the expected must-catch. This file is the ground truth and stays
  sealed from any run.
- Variants are built only after the source case's human gold label exists, so seeded-a
  has a real verdict to anchor on.

## What they are for

- Fast regression after any prompt or rubric change: run four variants, check four
  known answers, minutes not days.
- Sensitivity check: does the reviewer notice a single surgical flaw inside an
  otherwise strong 30-slide deck, or does it only catch flaws in short synthetic decks
  built around them.
- Severity calibration: the same deck at four readiness levels tests that verdicts move
  with the evidence, not with deck length or polish.
