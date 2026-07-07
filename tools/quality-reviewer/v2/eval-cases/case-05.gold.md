# Case 05. Gold label

Human-written before the AI reviewed the case. This case exists to test restraint. The
correct review is short and generous. Voice rules apply.

- **Case:** [case-05-good-but-not-perfect.md](case-05-good-but-not-perfect.md)
- **Artifact type:** final recommendation deck.
- **Expected readiness:** Nearly ready with minor edits (R3).
- **Expected readiness reason:** no blocking issue. The decision is clear and answered
  early, the recommendation is specific and sequenced, the headline number is marked as
  an assumption and the main risk is named.

## Real top issues (ranked)

There are no blocking or delivery-critical issues. At most two minor findings, and a
strong review may raise only one. Manufacturing more is the failure mode this case
tests.

1. **Minor: the partner discount is unquantified (dimension 4, minor).** Slide 7 offers
   "a discount with local partners" without saying whether partners have agreed or what
   the discount is. Worth a line, not a blocker. Issue type: evidence.
2. **Minor: comparability is asserted, not shown (dimension 4, minor).** Slide 5 calls
   the three groups comparable without stating on what basis (size, art form, area). A
   one-line note would close it. Issue type: evidence.

## Acceptable AI feedback

- Readiness Nearly ready with minor edits, stated plainly and positively.
- A genuine strengths-first opening: the early answer, the assumption marked as an
  assumption on slide 8, the sequenced soft launch with an owner and a trigger.
- At most two minor findings, or one, or none beyond the strengths. Restraint is correct
  here.

## Unacceptable AI feedback

- Inventing a critical issue to fill a quota of three findings.
- Marking readiness below R3 without a blocking issue.
- Treating the 8% assumption as an ungrounded number. It is explicitly flagged as an
  assumption to test on slide 8, which is exactly right, and rule 4 does not fire.

## False positives to avoid

- Flagging the 8% figure as unsourced. The deck already marks it as a conservative
  assumption and builds a test around it. Praising this is more appropriate than
  flagging it.
- Flagging the single-tier start as insufficiently ambitious. That is a deliberate, well
  reasoned choice, not a weakness.

## False negatives to catch

- None are serious. The test is not about catching a hidden critical (there is none). It
  is about not inventing one. A review that lands below R3 or lists three criticals has
  failed this case.

## Adjudication note (2026-07-03)

Added after the live blind run and the fresh-context scoring, and kept separate from the
pre-registered gold above so the original answer key is not rewritten around the tool's
output. The readiness answer does not change: it stays R3.

The 2026-07-03 live run returned R2 with three findings all graded major, two marked
delivery-critical. An independent fresh-context scorer and a contrarian reviewer both read
the three findings on the merits and reached the same verdict: the observations are real
but the severity is inflated, and the demotion to R2 is the manufactured over-escalation
this case exists to catch. See [../eval-runs/scoring-2026-07-03.md](../eval-runs/scoring-2026-07-03.md).

For future scoring, the three points the live run surfaced are legitimate minor findings a
generous review may raise, and raising them as minors while holding R3 is correct:

- The soft launch gate (slide 10, full launch if the soft launch clears 5%) is set below
  the 8% assumption (slide 8) and runs on the most engaged 200 contacts (slide 9), the
  segment that converts above the list average. A sharp reviewer may note that passing the
  gate does not validate the 8% the revenue rests on. This is worth a line, not a blocker,
  and the deck already flags 8% as the thing to test and builds a soft launch to de-risk it.
- The year one figure (5,000 pounds) is never sized against total income. Fair to note on
  a deck whose question is diversification, but the deck deliberately starts small and
  defers scale to after the soft launch, so this is a minor addition, not a delivery gap.
- The "conservative" label on the 8% leans on the 32% attendance rate, which measures
  attendance not willingness to pay. This is the same ground as minor issue 2 above.

None of the three makes the recommendation wrong or unsupported, so none is major and none
caps readiness. The correct review is R3 with at most two minor findings. A review that
grades any of these major or delivery-critical, or demotes below R3, fails the case. The
fix for the tool is a severity-calibration change to the prompt and rubric, not a change to
this readiness answer.
