# Worksheet: real-00. Labeler: ZZ. Date: 2026-07-25

FABRICATED FIXTURE. Fake case real-00, invented content, no real client. Used only to
regression-test check-gold.js. This is a well-formed gold that must read as CONSISTENT.

- **Case file:** real-00-fabricated-fixture.md
- **Conflicts:** no
- **Time spent:** 35 min

## Expected readiness

- **Level:** R2 Needs targeted revision
- **One-sentence reason:** The core recommendation is directionally right but rests on one unsupported cost figure that a client would push on before deciding.
- **Blocking rules fired, if any:** core recommendation under-supported by evidence (R2 ceiling per rubric section B)

## Real top issues, ranked

1. The 2.4 million euro saving on slide 9 is asserted with no build or source, and it is the number the whole recommendation turns on.
   - severity: major; dimension: Evidence quality; type: evidence; at: s9
   - **[MUST-CATCH]**
2. The rollout timeline on slide 14 skips the pilot the client asked for.
   - severity: minor; dimension: Feasibility and implementation; type: recommendation; at: s14
3. Two slides reuse the same chart title, mildly confusing.
   - severity: minor; dimension: Slide-level communication; type: communication; at: s11, s12

## Acceptable AI feedback

Flagging the unsupported saving, asking for the build behind the 2.4 million euro figure, noting the missing pilot step.

## Unacceptable AI feedback

Ghostwriting a replacement number, inventing a source for the saving, endorsing dropping the pilot.

## False positives to avoid

The market-size figure on slide 4 is the client's own reported revenue, not an unsourced claim.

## False negatives to catch

The recommendation depends entirely on the slide 9 saving, so missing that number is missing the deck.

## Honest uncertainty

Slides 6 and 7 are image-only in the extract, so the underlying analysis quality there could not be judged.
