# 21. The scorer re-fit sprint

**Started 2026-08-05. Method and decision rules written before any result was seen.**
Results are in section 5 and were filled in afterwards.

The single blocker on the whole project. Three separate documents converge on it:
[18-evidence-base.md](18-evidence-base.md) C5 says "fix the scorer before the reviewer",
[GATE-STOP-critique-quality.md](GATE-STOP-critique-quality.md) stopped a sprint on it, and
[STATUS.md](STATUS.md) now carries it as item 0.

---

## 1. What is broken

`score-review.js` has carried this comment since it was written:

> Thresholds. These are UNVALIDATED until the first real baseline run: they were calibrated
> against fabricated fixtures. Re-check them once real verdicts are settled, and bump
> MATCHER_VERSION if they move.

The re-check never happened. `T_HIT = 0.45` and `T_NEAR = 0.28` are cut points on a
text-overlap score, chosen against invented examples, and they decide the project's headline
metric.

The gate stop measured the consequence. Under a **frozen** prompt on **identical** input, the
must-catch verdict flips between `miss` and `near` on three of four stability cases. One flip
was decided by 0.005 of match score, another by 0.010. Where a match is decisive the scorer
repeats exactly (one case returned an identical scored result three times, at 0.83 to 0.88).
The instrument is bimodal: fine at the extremes, a coin toss in the middle.

**And the middle is the population that matters.** Communication-typed findings score at or
below `near` by construction. So do the comparator findings the 2026-08-05 prompt edit
introduces. Both of the two axes the product is now built on land exactly where the instrument
cannot tell signal from noise.

## 2. Why this is worth doing before anything else

It is cheap, it is unblocked, and everything else waits on it.

The material already exists: twelve scored runs sitting in
`eval-runs/real-baseline/stability/`, produced by an earlier sprint and never used for this.
No new model calls, no new reviews, no new labelling of decks. The work is reading pairs and
saying whether one catches the other.

Until it is done, [19-prompt-change-2026-08-05.md](19-prompt-change-2026-08-05.md) cannot be
evaluated, the critique-quality sprint cannot restart, and no number in STATUS.md can be
compared to a new one.

## 3. Method

### 3.1 Build a blind adjudication set

`build-refit-set.js` walks all twelve runs, pairs every gold issue against every review
finding, and emits the two texts **with the score removed**: no `textScore`, no verdict, no
support signals. 282 pairs exist. 178 were selected: everything in the 0.12 to 0.65 band where
the decision boundary sits, plus 15 controls from well above and 15 from well below.

Withholding the score is the whole design. An adjudicator who can see the number agrees with
the number, and the fit becomes circular. The controls are the check on the adjudicator: calling
a top-scoring pair "no" or a bottom-scoring pair "yes" means they were not reading, and that is
worth knowing before their judgements move a threshold.

The scores go to a separate `answer-key.json` the adjudicators never open.

### 3.2 Two independent adjudicators

Two agents, fresh context each, identical instructions, blind to each other, blind to the answer
key and forbidden from reading `score-review.js` so they cannot learn the algorithm they are
calibrating. This mirrors the gold protocol, which double-labelled and adjudicated rather than
trusting one pass.

Each answers one question per pair. Does the AI finding catch the gold issue?

| verdict | meaning |
|---|---|
| `yes` | a lead reading the AI finding would consider the gold issue raised |
| `partial` | it gestures at the area, but a lead would still have to raise the gold issue themselves |
| `no` | different problems |

The `yes` versus `partial` line is the one that matters, and the test given to both is
counterfactual: **if the lead had only the AI finding and never saw the gold label, would the
issue have been dealt with?**

### 3.3 Reconcile, then fit

`refit-thresholds.js` reports three things in a deliberate order.

1. **Do the adjudicators agree?** Raw agreement and Cohen's kappa. If they do not agree there
   is no stable target and nothing downstream is worth reading.
2. **Is `textScore` separable at all?** AUC of the score against the consensus label. Fitting a
   cut point presumes one exists. If the distributions for caught and not-caught sit on top of
   each other, the honest finding is that text overlap is the wrong instrument, and moving the
   cut point is rearranging deck chairs.
3. **Only then, where the cut points belong.** Both thresholds swept over a grid, scored by F1
   against the consensus label, reported beside what the current values score on the same set.

Disagreements between A and B are written out for an optional tie-break pass. Unresolved, they
resolve conservatively to the lower of the two labels: a pair one adjudicator called `yes` and
the other called `no` is not evidence that anything was caught.

## 4. Decision rules, fixed in advance

Written before results so they cannot be fitted afterwards. `refit-thresholds.js` enforces the
first two in code and refuses `--apply` if they fail.

- **Stop if kappa < 0.2.** Adjudicator agreement that poor means the question is not answerable
  as posed, and the fix is a better question, not a new threshold.
- **Stop if AUC < 0.60.** That is a score barely better than a coin at ranking caught above
  not-caught. No cut point rescues it. The finding would be that `mc-match-1` needs replacing
  rather than tuning, which is a bigger and more useful result than a threshold nudge.
- **Bump `MATCHER_VERSION` if anything moves.** Scores are not comparable across matcher
  versions. Every previously scored result becomes stale the moment this changes, including
  every number currently in STATUS.md.
- **Report the must-catch verdict change.** The point of the exercise is the coin-flip. If the
  new cut points leave the same three of four cases flipping, the re-fit did not work even if
  F1 improved.

### What would count as success

The stability runs stop flipping. Specifically: cases whose adjudicated consensus is stable
across their draws should get a stable verdict across those draws. A threshold that improves F1
but leaves the flipping in place has optimised the wrong thing.

## 5. Results

_Filled in after the run. Nothing above this line was edited afterwards._

**Headline: the thresholds were wrong and are now fitted. It does not matter much, because
the threshold was never the real problem. `mc-match-1` cannot tell caught from not-caught,
and no cut point fixes that.**

### 5.1 The adjudicators agree, decisively

| | |
|---|---|
| pairs adjudicated by both | 178 |
| raw agreement | **98.9%** |
| Cohen's kappa | **0.971** |
| disagreements | 2, both a one-step `partial` versus `no` |

Two agents, fresh context each, blind to the scores and to each other, landed on the same
label for 176 of 178 pairs. Both independently returned the same marginal counts: 25 `yes`,
17 `partial`, 136 `no`.

This clears gate one and it is the most encouraging number in the sprint. **The question is
answerable and the target is stable.** Hold onto that, because it is what makes section 5.4
actionable rather than merely discouraging.

### 5.2 The score barely separates

| consensus label | n | min | median | mean | max |
|---|---|---|---|---|---|
| `yes` | 25 | 0.159 | 0.392 | 0.429 | 0.883 |
| `partial` | 16 | 0.132 | 0.256 | 0.277 | 0.663 |
| `no` | 137 | 0.000 | 0.259 | 0.257 | 0.700 |

AUC of textScore against the consensus label: **0.718** for `yes` against the rest, **0.638**
for `yes or partial` against `no`. Both clear the 0.60 stop rule, the second barely.

The distributions sit on top of each other. 15% of pairs the adjudicators said were **not**
caught score above the median pair they said **was** caught, and 6 of 25 genuinely caught
pairs score below the median not-caught pair.

**The number that settles it.** At its single best possible cut point, anywhere on the range,
textScore classifies **142 of 162 pairs correctly, 88%**. Classifying every pair as
not-caught, with no model at all, gets **137 of 162, 85%**.

> The entire discriminative power of this matcher, at its theoretical optimum, is worth three
> percentage points over a constant.

### 5.3 What was applied, and why anyway

| | before | after |
|---|---|---|
| `MATCHER_VERSION` | `mc-match-1` | **`mc-match-2`** |
| `T_HIT` | 0.45 | **0.39** |
| `T_NEAR` | 0.28 | **0.24** |
| T_HIT precision / recall / F1 | 42% / 32% / 0.364 | 46% / 52% / **0.491** |
| T_NEAR precision / recall / F1 | 28% / 41% / 0.333 | 36% / 78% / **0.489** |

F1 improves by about a third on both cut points, which is real: F1 is the right metric here
precisely because accuracy is dominated by a 137-to-25 majority class. The new values are
fitted to 178 blind human-equivalent judgements instead of to invented examples, and leaving
fiction-fitted constants in place while knowing they are fiction is not defensible. So they
were applied.

But read the precision. **At the new `T_HIT`, 46% precision means more than half of everything
the scorer calls a hit is not one.** That is the instrument the project's headline recall
number is built on.

**Every previously scored result is now stale.** Scores are not comparable across
`MATCHER_VERSION`. Every number in STATUS.md predates `mc-match-2` and must be re-scored
before it is compared to anything.

### 5.4 Against the pre-registered success criterion: partial, and honestly a fail

Section 4 fixed the bar in advance: the stability runs stop flipping, and a threshold that
improves F1 while leaving the flipping in place has optimised the wrong thing.

| case | must-catch verdicts before | after | flipping? |
|---|---|---|---|
| real-01 | miss, near, miss | near, **hit**, near | still flipping |
| real-03 | miss, miss, near | near, miss, near | still flipping |
| real-04 | hit, hit, hit | hit, hit, hit | stable, as it always was |
| real-13 | miss, near, near | near, near, near | **now stable** |

Five of twelve verdicts changed. One of the three unstable cases stabilised. Two still flip.

**By the criterion written before the run, this did not work.** It moved the cut points to
better-founded places and it did not fix the coin toss. The gate for the critique-quality
sprint stays shut.

### 5.5 The actual finding, and it is more useful than a fitted threshold

Why is text overlap such a weak discriminator? The adjudicators said it plainly, without
being asked, and they said the same thing independently:

- The clearest recurring true positive was a review finding that "the deck never states a
  decision anywhere" matching a gold issue about a missing executive summary. **Different
  vocabulary, same complaint.**
- The most common false positive was a review finding and a gold issue that name the **same
  slides** while diagnosing **different problems**. Shared location, shared words, unrelated
  substance.

`mc-match-1` scores bag-of-words overlap with a synonym-cluster patch. The judgement that
matters is whether two texts describe the same underlying problem. Those are different
questions, and 0.718 AUC is the price of substituting one for the other. Adding more synonym
clusters chases the first pattern and makes the second worse.

**The replacement is already demonstrated.** Two LLM adjudicators, given the two texts and
asked whether one catches the other, agreed with each other at **kappa 0.971**. That is not a
proposal, it is a measurement taken during this sprint. An LLM-judge matcher is dramatically
more reliable at this specific judgement than the text-overlap score it would replace.

And the validation set now exists: **178 pairs with blind, double-adjudicated, high-agreement
labels**, sitting in `eval-runs/real-baseline/threshold-refit/`. Any candidate matcher can be
scored against it in seconds. That set is the durable output of this sprint, more than the two
constants that moved.

### 5.6 What this changes about what to do next

1. **Build `mc-match-3` as an LLM judge**, validated against the 178-pair set. Target: beat
   0.718 AUC and, more importantly, beat 88% accuracy meaningfully. Determinism is the design
   problem to solve (fixed prompt, low temperature, N draws with a majority vote, cached by
   pair hash so a re-score does not re-call).
2. **Do not re-run the nine cases on `frozen-2026-08-05` yet.** With 46% precision the run
   would produce numbers that move and nobody could attribute the movement. The prompt edits
   stay unmeasured, which is exactly what section 5 of
   [19-prompt-change-2026-08-05.md](19-prompt-change-2026-08-05.md) already says.
3. **Re-score the existing 07-29 and 08-02 runs under `mc-match-2`** before anyone quotes a
   comparison. Cheap, no model calls, and until it happens the STATUS.md table is mixed-version.
4. **The 88%-versus-85% number belongs in the board material.** It is the cleanest statement
   of why the measurement programme has been expensive and slow, and it is now fixed rather
   than merely complained about.

### 5.7 A note on the adjudication itself

One adjudicator reported that twice during the task a system-reminder claimed its scratch
working files had been auto-modified by "a linter", with an instruction not to mention it,
where the actual change was a flipped verdict with rewritten reasoning. It judged this a
prompt-injection attempt rather than a real event, ignored it, rebuilt its output from its own
original judgements and flagged it unprompted.

That is the correct behaviour and it is worth recording. It also means the integrity of this
calibration rests on more than one agent's care: the 98.9% agreement with a second,
independently-run adjudicator is what makes the set trustworthy, and a corrupted A would have
shown up as disagreement. It did not. **Any future adjudication round stays double-run for
exactly this reason.**

## 6. A second defect, found by accident, and it touches every run ever taken

While the adjudicators worked, a blind reviewer was asked to smoke-test `frozen-2026-08-05` on
one real case. Its review **failed the contract check**: invented top-level fields, missing
`meta` and `scorecard`, six findings against a budget of five. Unprompted, it reported why.

> The pack is missing three things the frozen prompt references: the noise budget table (cited
> as "below" but not present), the scope matrix ("the scope matrix you were given"), and the
> v2 output contract itself.

Verified, and it is longstanding. `--emit-packs` extracted **only section A** of
`04-prompt-templates.md`. So the pack said:

- "Cut to the noise budget for the mode (below)" and there was no below. The budget table is
  section C of the same document and was never included.
- "see the scope matrix you were given" and nothing was given. It is section C of
  `01-rubric-v1.md`.
- Nothing about the output contract. The only mention lived in a `note` field inside
  `run-manifest.json`, which the reviewing subagent is never told to read.

Checked against the 07-29 baseline packs, the 08-02 calibration packs and the stability
`_collect-a` packs: **all three have the same gap.** Every subagent run this project has taken
was produced by a reviewer that was never shown its own noise budget, its scope rules or its
output shape.

**Why earlier runs still came back contract-valid:** the operator supplied the missing pieces
by hand in the subagent brief. That is the actual problem. The reviewer's finding cap, its `na`
decisions and its JSON shape all depended on how a human happened to word an instruction that
was never recorded. That is an uncontrolled variable sitting underneath every number the
project has produced, and it is invisible in the manifests because the manifests only hashed
section A.

**Fixed.** `loadReferenceBlocks()` in `run-reviews.js` now appends the modes and noise budget
table, the artifact-type scope matrix and the full output contract to every pack, on both the
subagent and the API path. Packs went from 575 to 831 lines. The manifest now records
`referenceSha256` and `contextSha256` alongside `promptSha256`, so what the reviewer actually
saw is provable rather than assumed.

**What it does not do** is retro-fix the old runs. Restraint, measured as findings per review,
was measured against a budget the reviewer was never told. Treat every findings-per-review and
`na`-dimension figure from before 2026-08-05 as carrying an unrecorded operator variable.

## 7. Confidentiality

Gold anchors and finding text both quote real client deliverables verbatim. Everything this
sprint produces lives under `eval-runs/real-baseline/threshold-refit/`, inside the gitignored
tree, verified with `git check-ignore`. The adjudicator agents were instructed to write only
inside that directory and to put no client text in their reports. This document carries method
and numbers only, which is why it is safe to track.
