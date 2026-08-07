# 18. The evidence base

What four measurement sprints established about this reviewer, in one place, so none of it
has to be relearned. Written 2026-08-03, after the baseline, the calibration sprint, the
stability sprint and the critique-quality gate stop.

**Why this file exists.** The raw material lives in gitignored run folders on one laptop,
because it quotes real client decks. The *conclusions* are about the tool, not the clients,
so they belong here where they survive a lost machine and a new teammate. Nothing below
names a client, quotes a deliverable or reproduces a human gold label.

Voice rules apply.

---

## A. What is established

Ordered by how much weight it can carry. Each line says how it was measured, because a
finding without its method is a rumour.

### A1. It does not miss real problems. High confidence.

Blocking rules missed: **0%**. Across roughly thirty reviews spanning three prompt versions
and every experiment run to date. Not one case where a human gold fired a blocking rule and
the reviewer did not.

This is the single most important property the tool has. For a team whose realistic
alternative is no substantive review at all, an over-eager reviewer is a nuisance and a blind
one is worthless. The asymmetry runs the right way.

### A2. It does not fabricate evidence. High confidence.

Every quote in every finding is checked as a verbatim substring of the source, mechanically,
by `check-review-v2.js`. Reviews that fail are re-run, never hand-patched. No hallucinated
quote has ever survived to a scored result.

The quote-or-abstain rule is doing real work, and it is the reason a reader can trust a
finding they disagree with.

### A3. Its findings repeat across runs. Medium-high confidence.

Under a frozen prompt on byte-identical input, read by finding identity rather than by exact
quote span: one case repeated four of its five findings across all three draws, another
repeated its top critical finding in all three.

The raw `check-stability.js` stable-core figures (20 to 41%) badly understate this, and the
tool's own header warns that they are a floor. Most apparent drift is the same point quoted
from a different slide.

### A4. Its readiness verdict does not repeat. High confidence.

The same deck, same prompt, same bytes, returned **R0, R0 and R2** across three draws, with
blocking rules firing `1,4`, then `1,2`, then none. Across four total observations that case
has produced R2 twice and R0 twice.

This is not a scoring artifact. Readiness is compared as an exact level match and never
touches the finding matcher. The reviewer is genuinely making different blocking-rule
decisions on identical input.

**A3 and A4 together are the central result of this whole programme.** The reviewer reads
consistently and grades inconsistently.

### A5. It over-flags, and the damage is concentrated on good work. High confidence.

On the first real baseline it escalated every strong deck, six of six, four of them by two
full readiness levels. Every one of those two-level escalations fired blocking rule 1 and
neither one-level escalation did. Rule 1 is the only rule with a Not-ready ceiling, so it
alone manufactures the worst verdict.

Related and unresolved: the tool has never assigned either of its top two readiness levels on
real work, across nine decks where the human assigned the second-highest to a majority.

### A6. It reviews as a logician. The human reviews as a reader. Medium-high confidence.

Of eleven human-flagged issues examined closely across two golds, five were
communication-typed, and on one case the single must-catch issue was communication-typed. The
human's issues cluster on whether a busy reader gets anything from one pass. The tool's
cluster on sourcing, contradiction and recommendation specificity.

**This gap is designed in, not a capability limit.** The synthesis protocol instructs that
communication findings are cut first when the budget binds, and the diagnostic priority order
has no place for readability except "QA artifacts" at the bottom.

**Corroborated from outside the data, 2026-08-05.** An ex-McKinsey consultant, asked
independently where the return actually sits for a consultant, put roughly 60% of it on
clarity of communication: how the work is delivered when spoken, and how tightly the scope
and the contents are set out when written. His formulation was that work communicated well is
work done well, even where the underlying content is not the strongest.

That is the same claim A6 makes, reached without seeing the golds, the reviews or this
document. Two independent routes to one conclusion is why this moved from medium to
medium-high. What it does **not** license is treating 60% as a weight. It is one
practitioner's rule of thumb, not a measurement, and nothing here has measured the ratio. It
is evidence about **ordering**, and ordering is what the 2026-08-05 prompt edit changed. Any
version of this that puts a 0.6 coefficient in a rubric is overreading it.

The second half of that conversation was a different claim, about interrogating numbers. It
is not established, so it is not in this section. It is C6.

### A7. It does not know its input is damaged. High confidence.

On one case it built its headline blocking issue by setting an executive-summary claim against
an orphaned value from an appendix table. That gold had warned, in advance and in writing,
that the table's values were flattened during PDF extraction.

Every case file carries extraction notes. Nothing in the prompt told the reviewer that
degraded text is not a defect in the team's work.

### A8. The scoring instrument cannot tell caught from not-caught. High confidence.

**Rewritten 2026-08-05 after the re-fit sprint measured it directly. The old heading said the
thresholds were unvalidated. They were, they now are not, and it barely helped.**

178 gold-issue/finding pairs from the twelve stability runs were adjudicated blind by two
independent agents who never saw the scores. They agreed at **98.9%, kappa 0.971**, so the
judgement is stable and answerable. The matcher then agreed with them at **AUC 0.718**.

The decisive figure: at its single best possible cut point, `textScore` classifies **88%** of
pairs correctly, and calling every pair not-caught with no model at all gets **85%**. The whole
discriminative power of the instrument is three points over a constant.

Thresholds were re-fitted to the adjudications anyway (`T_HIT` 0.45 to 0.39, `T_NEAR` 0.28 to
0.24, `MATCHER_VERSION` now `mc-match-2`). F1 improved by about a third on both, and precision
at the new `T_HIT` is still **46%**, so more than half of everything called a hit is not one.
One of three unstable stability cases stabilised. Two still flip.

**The cause is now known.** `mc-match-1` scores vocabulary overlap. The judgement that matters
is whether two texts describe the same problem. The adjudicators, independently, both reported
the two failure shapes: the strongest true positives were same-complaint-different-vocabulary,
and the commonest false positives were same-slides-different-problem. Overlap scoring gets both
backwards, and more synonym clusters make the second worse.

**Consequence: every recall and coverage number this project has published is measured on an
instrument that is wrong about half the time in the band where it is asked to decide.** The
numbers are not fabricated, but the error bars are far wider than they have ever been reported.

Full method and result in [21-scorer-refit-sprint.md](21-scorer-refit-sprint.md).

### A8b. Every subagent run was made with an incomplete pack. High confidence.

Found 2026-08-05 by a blind smoke-test reviewer. `--emit-packs` extracted only section A of the
prompt document, so every pack back to the 07-29 baseline told the reviewer to "cut to the noise
budget (below)" with no below, referred to a scope matrix it was never given, and never carried
the output contract. Runs came back contract-valid because the human operator supplied the
missing pieces in the subagent brief, unrecorded and unhashed.

Fixed in `run-reviews.js`; packs are now self-contained and the manifest records a
`contextSha256`. Not retro-fixable: findings-per-review and `na`-dimension figures from before
2026-08-05 carry an unrecorded operator variable, which matters most for restraint, since
restraint was scored against a budget the reviewer was never shown.

### A8c. Historical note: the bimodality that led to A8.

`score-review.js` labels `T_HIT` and `T_NEAR` UNVALIDATED, fitted against fabricated fixtures,
with a standing instruction to re-check them against the first real batch of near verdicts.
That never happened.

Where a match is decisive the scorer repeats exactly (one case returned an identical scored
result three times, well above threshold). Where it is ambiguous the verdict flips on
hundredths: one case's must-catch flipped on 0.005, another on 0.010, both within 0.03 of
`T_NEAR`.

**The ambiguous band is exactly the population any critique-quality work targets**, because
communication-typed findings score at or below near by construction.

### A9. Single-draw evaluation is invalid. High confidence.

Every metric produced before 2026-08-03 is one draw per case from a distribution now known to
span two readiness levels. The baseline's headline and the calibration sprint's apparent
improvement are both single samples. The difference between them may be nothing.

Every future experiment runs on N draws. This roughly triples the cost of an experiment and
that cost is not optional.

---

## B. What is unresolved

- Whether the three calibration edits (extraction awareness, a decision-change test on rule 1,
  severity not inheriting from readiness) actually helped. Unmeasurable until the scorer
  thresholds are re-fit.
- Whether blocking rule 2 needs the same decision-change test rule 1 received. It became the
  binding ceiling once rule 1 loosened.
- Whether the rule-1 edit traded a biased instrument for a noisy one. Rule 1 fired reliably
  and too often before; it now fires erratically in both directions. Timing is consistent with
  cause and the evidence is not conclusive.
- Whether the human gold labels generalise beyond one labeler. They are single-pass, one
  person. Two competent readers already landed at opposite ends of the scale on one deck.
- Whether the 2026-08-05 edits (the reader test, the comparator test, lead-with-the-point)
  do anything. Same blocker as the calibration edits: unmeasurable until the scorer
  thresholds are re-fit, and worse here, because communication-typed and comparator-typed
  findings both land in the ambiguous band by construction. See C6 and A8.
- Whether the comparator test costs restraint. It gives the reviewer a reason to flag every
  unbenchmarked figure on a deck, and student decks carry many. If findings per review climbs
  or strong decks start collecting comparator findings, the test is too eager and needs the
  same decision-change gate the severity rules got.

---

## C. What this means for the product

These follow from section A and should not be relitigated without new evidence.

1. **Readiness is human-set and AI-suggested.** A4 forbids shipping it as a verdict, and A3
   says the underlying reading is worth showing. This is the Triage Desk shape. See
   [17-override-log.md](17-override-log.md).
2. **The findings are the product.** Not the score, not the readiness level. A1, A2 and A3 all
   support the finding list; only A4 undermines the verdict.
3. **Restraint and evidence discipline are the differentiators.** A2 is rare and worth
   protecting in every future edit.
4. **Lead overrides replace hand-labelling as the calibration source.** Nine golds cost about
   thirty hours. A lead triaging a real deliverable produces a comparable record in minutes,
   from work they were doing anyway.
5. **Fix the scorer before the reviewer.** A8 says the instrument cannot currently resolve the
   changes A6 proposes.
6. **The comparator test is the second axis, and it is a hypothesis rather than a finding.**
   The same 2026-08-05 conversation argued that the other half of a consultant's value is
   interrogating numbers rather than reporting them: revenue moving from 10 to 20 is fast or
   slow only against something, and a consultant's job is to name the comparator, say whether
   the answer is good or bad, and then say what a bad answer is a symptom of (no
   product-market fit, for instance). Broken into steps it is: compared to what, so is that
   good, and if not why.

   The underlying weakness is not new. Rubric dimension 5 is built on it, sourced to the
   failure taxonomy, and its stated common failure is "a wall of market facts with no
   therefore". What is new is the **test**. Dimension 5 asks whether findings are "interpreted"
   and whether implications are "drawn", which is vague enough that a reviewer can pass a deck
   that never benchmarks anything. The three questions are mechanical and a reviewer either ran
   them or did not.

   This shipped in the 2026-08-05 prompt as synthesis step 5 and a slot in the priority order.
   **Nothing has measured whether it helps**, and per A8 nothing can until the scorer
   thresholds are re-fit. Treat it as the leading hypothesis, not as a result.

---

## D. What would change our mind

- **A3 falsified.** If findings turn out to be as unstable as verdicts once measured with a
  re-fit scorer, the product thesis in C2 collapses and the tool needs rethinking rather than
  tuning.
- **A1 falsified.** A single confirmed case of the reviewer missing a real blocking problem
  would matter more than any over-flagging result, because it breaks the asymmetry that makes
  an imperfect tool worth using.
- **A6 widened and reversed.** If a broader read of the golds shows the human's issues are not
  communication-weighted after all, the critique-quality sprint loses its premise.

---

## E. Where the raw material lives

All local-only and gitignored, because it quotes real client deliverables.

| what | where |
|---|---|
| Real case files and human golds | `eval-cases-real/`, `eval-cases-real/labeling/` |
| Baseline, calibration and stability runs | `eval-runs/real-baseline/` |
| Archived frozen prompts | `eval-runs/prompt-archive/` |
| Labeling provenance | `eval-cases-real/_LABELING-RECORD.md` |

Tracked and public: the harness code, the fabricated `real-00` fixtures, the labeling kit,
every numbered document in this folder and the build prompts.
