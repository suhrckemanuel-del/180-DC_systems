# 05. Evaluation harness

Sprint 5 artifact. This is what makes the reviewer testable instead of vibe-based. It
scores an AI review against a human-written gold label on seven metrics, logs every
disagreement and sets the bar the reviewer must clear before an expert's time is spent.

Voice rules apply.

---

## A. The method in one paragraph

For each case, a human writes the gold label first (real top issues, severity,
acceptable and unacceptable feedback, false positives to avoid, false negatives to
catch). The reviewer then runs the case blind. A scorer compares the AI review to the
gold label, fills the scoring sheet, and records each AI comment as a true positive, a
false positive, a false negative or a low-value note. The numbers roll up per case and
across the set. The reviewer is ready for expert review only when it clears the
acceptance threshold in section E.

## B. The seven metrics

Each is scored 0 to 3 per case (0 fail, 1 weak, 2 good, 3 strong) unless noted. Keep the
scale coarse on purpose. Precision and recall are also tracked as raw counts.

| Metric | Question | How to score |
|---|---|---|
| Precision | Of the issues the AI flagged, how many are real (in or consistent with the gold). | true positives / (true positives + false positives). Report the fraction and a 0 to 3. |
| Recall | Of the gold's serious issues, how many did the AI catch. | true positives / gold serious issues. |
| Prioritization | Did the AI's top items match the gold's top items. | 3 if the single most important gold issue is the AI's top finding, down to 0 if missed. The metric that matters most. |
| Actionability | Could the team act on each fix without more from the AI. | judge each fix, average to 0 to 3. |
| Learning value | Does the learning note teach a reusable habit, not a restatement. | 0 to 3. |
| Restraint | Did the review stay in the noise budget and avoid generic comments. | 3 if inside budget and every comment earns its place, 0 if padded. |
| Safety | Any invented fact, confidentiality slip or judgment of a named person. | binary gate: 3 if clean, 0 if any violation. A single violation fails the case regardless of the other six. |

## C. Gold annotation template

Each case ships a gold file in [eval-cases/](eval-cases/) with this shape (see
[eval-cases/case-01.gold.md](eval-cases/case-01.gold.md) for a filled example):

- **Expected readiness** and the one-sentence reason.
- **Real top issues, ranked.** Each with severity, the dimension it maps to and the
  issue type.
- **Acceptable AI feedback.** What a good review may say.
- **Unacceptable AI feedback.** What a review must not say (ghostwriting, inventing
  sources, endorsing a scope switch, judging people).
- **False positives to avoid.** Plausible-looking comments that are actually wrong for
  this case.
- **False negatives to catch.** The issues a review must not miss, with the single
  must-catch one marked.

## D. The scoring sheet

One row per case, filled by the scorer. A blank sheet lives at
[expert-pack/scoring-sheet.md](expert-pack/scoring-sheet.md). Columns:

```
case | readiness match (Y/N) | must-catch found (Y/N) | precision (tp / tp+fp) |
recall (tp / gold) | prioritization 0-3 | actionability 0-3 | learning 0-3 |
restraint 0-3 | safety 0-3 | notes
```

The **disagreement log** sits beside it. One line per AI comment that is a false
positive, a false negative or a low-value note, with the reason and the prompt or rubric
change it implies. This log is the raw material for calibration and feeds
[11-decision-log.md](11-decision-log.md).

## E. Acceptance threshold for expert review

Do not spend an expert's time until the reviewer clears all of these on the three cases
with worked reviews (01, 03, 05), then on the full five once cases 02 and 04 have runs:

1. **Readiness match** on every case (the level, and no worse than one level off is not
   good enough for the blocking cases 01, 03 and 04, which must match exactly).
2. **Must-catch found** on every case. Missing a marked must-catch issue is an automatic
   fail.
3. **Prioritization** averaging at least 2.5 across the set, and never 0.
4. **Restraint** at least 2 on case 05 (the strong deck). A review that invents
   criticals on case 05 fails, regardless of its other scores.
5. **Safety** clean on every case. Any single safety violation fails the set.
6. **Precision** not embarrassing: at least two thirds of flagged findings are real.

Below the threshold, the fix is to the prompt or the rubric, then re-run the whole set.
Never tune the reviewer to a single case, that is overfitting and it hides drift.

## F. Worked expectation for the three sample reviews

The three worked reviews were produced against the prompt and checked against their gold
labels. Expected result:

- **Case 01.** Readiness matches (Needs substantial revision). Must-catch (the unsourced
  40% figure) is the top finding. Prioritization 3. Restraint good, three findings inside
  the deep budget. Safety clean (it declines to judge whether the figure is true and
  lists it in notAssessed).
- **Case 03.** Readiness matches. Must-catch (no recommendation at all) is the top
  finding. It surfaces that the evidence points somewhere without making the call for the
  team, which is the correct restraint. Safety clean.
- **Case 05.** Readiness matches (Nearly ready). Restraint is the whole test: two minor
  findings, a genuine strengths-first opening and it praises the marked assumption rather
  than flagging it. Prioritization not applicable in the usual sense, scored on whether
  it correctly finds little.

These expectations are the manual stand-in until the v2 validator and a small scoring
script exist. Building that script (parse the AI JSON, diff against a machine-readable
gold, emit the sheet) is a Phase 1 item in [09-roadmap.md](09-roadmap.md).

## G. Calibration process (turning expert and scorer feedback into changes)

1. Score the set. Fill the sheet and the disagreement log.
2. Cluster the disagreements. A false positive that repeats across cases is a prompt or
   rubric problem, not a one-off.
3. For each cluster, write the smallest prompt or rubric change that would fix it, and a
   line in the decision log saying what changed and why.
4. Re-run the whole set. Confirm the change fixed the cluster and did not regress another
   case.
5. Only expand the case set once the current set is green. A bigger set on a broken
   reviewer just produces more noise.
