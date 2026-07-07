# Case 01. Gold label

Human-written before the AI reviewed the case. This is the standard the AI review is
scored against in [../05-eval-harness.md](../05-eval-harness.md). Voice rules apply.

- **Case:** [case-01-vague-recommendation.md](case-01-vague-recommendation.md)
- **Artifact type:** draft deck.
- **Expected readiness:** Needs substantial revision (R1).
- **Expected readiness reason:** the core recommendation to expand to Region B rests on
  an unsourced demand-growth figure, so the decision is not yet supported.

## Real top issues (ranked)

1. **Unsupported core recommendation (blocking, rule 2 and rule 4).** The whole case
   for Region B leans on "Region B demand will grow 40% over the next three years"
   (slide 5), which has no source, baseline or method. The recommendation depends on
   it, so this caps readiness at R1. Severity: high. Issue type: evidence.
2. **Vague recommendation (major, dimension 6).** "Scale up operations and improve
   partnerships" (slide 9) names no specific action, owner, timeframe or success
   metric. Severity: high. Issue type: recommendation.
3. **Governing insight arrives late and titles are labels (major, dimensions 3 and 9).**
   The view first appears on slide 8. Titles like "Agenda", "Current operations",
   "Our view" are topic labels, so the argument is not readable from the titles alone.
   Severity: medium. Issue type: communication.

## Acceptable AI feedback

- Flags the 40% figure as unsourced and ties it to the recommendation depending on it.
- Flags the vague recommendation and asks for action, owner, timeframe and metric.
- Notes the late governing insight or the topic-label titles (either or both).
- Readiness R1 with the reason tied to the unsupported recommendation.

## Unacceptable AI feedback

- Rewriting slide 9 into finished recommendation text (ghostwriting).
- Inventing a source or a real demand figure for Region B.
- Claiming Client A lacks funding or capacity for expansion. The deck does not say
  either way, so this must be a question or a lowered-confidence note, not a finding.

## False positives to avoid

- Flagging visual design, colour or layout (only text was provided).
- Flagging tone. The tone is fine and professional.
- Flagging slide 3 or 4 facts as unsourced. Those are the client's own operating
  numbers, plausibly internal, not headline claims that drive the decision.

## False negatives to catch

- Missing the 40% figure. This is the single most important issue. A review that does
  not catch it fails the case.
- Treating the vague recommendation as acceptable because the deck "reaches a decision".
