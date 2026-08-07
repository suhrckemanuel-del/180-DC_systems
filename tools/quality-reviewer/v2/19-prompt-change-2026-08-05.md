# 19. Prompt change, 2026-08-05: the two axes

**What changed:** four edits to section A of [04-prompt-templates.md](04-prompt-templates.md),
applied as one pass.
**Why now:** owner decision, on external corroboration of A6 plus a new second axis.
**Measurement status: unmeasured, and currently unmeasurable.** Read section 5 before quoting
any number from this prompt.

| version | sha256 (16) | size | archived | what it is |
|---|---|---|---|---|
| `frozen-2026-08-03` | `39c18fbca9e5d218` | 3058 tok | yes, verified | the measured baseline |
| `frozen-2026-08-05` | `a41bc6e2670f1a87` | 3713 tok | yes, verified | the two axes, first cut |
| `frozen-2026-08-05b` | `54a6c835299cabb3` | 4110 tok | **no, see below** | four ambiguities patched |
| **`frozen-2026-08-05c`** | **`80983d7179eb950f`** | **4349 tok** | current | three more patched. **Run this one.** |

**Archive discipline was broken once, on `b`, and this records it rather than hiding it.** The
rule is archive before edit. `b` was edited into `c` without being archived first, so `b` cannot
be restored byte-exact and its hash is the only surviving proof of it. The damage is contained:
`b` existed for one smoke test and nothing was measured on it, and the two revert points that
matter, the 08-03 baseline and the first two-axis version, are both archived and re-hash
correctly. Restoring either is one file copy.

**Why there is a `b` and a `c`.** Each came from the same cheap check, run twice. Hand the
prompt to blind reviewers on a real case, then ask them which instructions were ambiguous to
*execute*. Round one (two reviewers, `05` to `05b`) found four. Round two (a reviewer auditing
the patched version, `05b` to `05c`) found that three of the four patches had narrowed the
ambiguity rather than closed it. See sections 2.5 and 2.6.

---

## 1. Why this was the call

Two claims, from one conversation with an ex-McKinsey consultant on 2026-08-05, asked
independently where a consultant's return actually sits.

**Claim one, roughly 60% is clarity of communication.** How the work lands when spoken, how
tightly scope and contents are set out when written. Work communicated well reads as work done
well, even where the content is not the strongest.

This is [18-evidence-base.md](18-evidence-base.md) **A6**, reached from outside the data.
A6 was already established from the golds at medium confidence: of eleven human-flagged issues
across two golds, five were communication-typed, and on one case the must-catch itself was.
Two independent routes to one conclusion took A6 to medium-high.

The damning part was already written down. The prompt **cut this category first, by rule**:

> When the budget forces a choice, communication findings go first.

and the priority order had no slot for readability except "QA artifacts", last. The tool was
designed to discard the thing the expert says carries most of the value, and the baseline then
scored that as a recall failure.

**Claim two, interrogate the numbers.** Revenue moving from 10 to 20 is fast or slow only
against something. Name the comparator, say whether the answer is good or bad, and if it is
bad say what it is a symptom of. This is **C6**, and it is a hypothesis rather than a finding.

## 2. The four edits

### Edit 1. The blanket cut rule is gone

Deleted "When the budget forces a choice, communication findings go first" from step 3.
Replaced with a test on the same basis every other finding is held to: keep communication
findings that are about whether the message lands, cut the ones that are about polish. A
deliverable whose argument is sound and whose reader cannot extract it has failed at the only
thing it was for.

### Edit 2. The reader test, new synthesis step 4

The nine lenses all ask whether the argument is sound. None asked whether it survives being
read. The new step has the reviewer read the deliverable once the way its actual reader will,
fast and skimming and without the goodwill of someone paid to study it, and ask what that
reader carries away. Nothing, or a list of topics rather than an answer, is a finding that
ranks with the structural ones.

Stated as what the reader misses, deliberately, not as a formatting complaint. The failure mode
this edit invites is a reviewer that starts grading slide design.

### Edit 3. The comparator test, new synthesis step 5

Three questions in order, on every figure the recommendation leans on. Compared to what (the
prior period, the market, a peer, the client's own target or need)? So is that good or bad?
And if it is bad, what is it a symptom of?

Two guards are written into the step. It must **not invent the comparator**: it names that one
is missing and says which would settle it, which keeps it inside the quote-or-abstain
discipline that A2 protects. And a deck that compares but never says what the comparison
implies fails the same test one step later, which is the "wall of facts with no therefore"
failure the rubric was already built around.

Lens E was amended to match, since it is the lens that feeds this.

### Edit 4. The priority order, and the reviewer's own prose

The order is now: internal contradiction, missing or late governing insight, **a deliverable
whose message does not survive one read**, recommendations without a decision, **a
decision-driving number with no comparator**, ungrounded headline numbers, QA artifacts.

Uncompared sits above unsourced on purpose. A number with no source might be wrong. A number
with no comparator is meaningless even when it is right, and a recommendation resting on one
is a recommendation resting on nothing.

Separately, a new **LEAD WITH THE POINT** section. The reviewer preaches action titles and
governing insight first, then writes findings that bury the point mid-paragraph. Each field now
opens with its conclusion, with soft caps (diagnosis about 70 words, why about 40) and an
instruction not to restate the diagnosis inside why. This is the reader test turned on the
reviewer's own output, which is also the answer to the review being dense to read.

## 2.5. The `b` pass: four ambiguities, found by running the prompt rather than reading it

The cheapest quality check available turned out to be handing the edited prompt to a blind
reviewer on a real case and asking it, afterwards, which instructions were ambiguous to
execute. Two reviewers did this independently. **They reported the same four problems**, which
is what makes them worth fixing rather than debating.

| # | what was ambiguous | why it mattered | fix |
|---|---|---|---|
| 1 | The reader test and "missing or late governing insight" are adjacent but separate ranks in step 6, yet on a deck with no governing insight they are one observation. Step 3's fold rule pushed toward merging, step 4 pushed toward splitting. | A standing risk of double-counting the same failure, spending two of five budget slots on a distinction the reader never experiences. | Step 4 now says it is one finding, folds into the governing-insight finding when no insight exists, and stands alone only in the buried-insight case. |
| 2 | Severity says a critical finding pairs with a blocking rule. The reader test has no blocking rule, so grading one critical required inventing a pairing. | Severity inflation on exactly the category the sprint was trying to promote, which would have looked like the edit working. | Major by default. Critical only when a blocking rule that fired pairs with it. |
| 3 | "For every figure the recommendation leans on" reads as licensing one comparator finding per figure. | Directly against the noise budget and against restraint, which is scored. A decade of student decks carry many figures. | Raise it once for the deliverable, naming the figures it covers. Explicitly a lens I failure to do otherwise. |
| 4 | The comparator test collides with the extraction rule. If the comparator would sit in a table the extraction notes flag as unreliable, the reviewer may neither build on it nor claim the comparison is absent, because the deck may well make it. | This is A7 (it does not know its input is damaged) reappearing through a new door. The 08-03 calibration pass added extraction awareness to the evidence rule and the new step routed around it. | On flagged material: questionsForLead, notAssessed, lower confidence. Raise the finding only where no flagged material could have supplied the comparator. |

The re-test on `b` came back contract-valid: four findings against a budget of five, 17 of 17
quotes verbatim, and the reviewer reported that the added reference material resolved all three
of the earlier structural ambiguities.

**This does not make the prompt measured.** It makes it unambiguous, which is a precondition
for measuring it and a plausible variance reduction in its own right, since two reviewers
resolving the same ambiguity differently is exactly how a frozen prompt produces different
answers on identical input.

## 2.6. The `c` pass: the patches had narrowed the ambiguity, not closed it

An auditing reviewer read the patched prompt and made the sharper version of the same
criticism: three of the four `b` fixes replaced a coarse ambiguity with a finer one.

**1. The reader test asked for a simulation the model cannot run.** "Read the deliverable once
the way its actual reader will read it: fast, one pass, skimming." A model has no
degraded-attention mode. It reads everything at even weight, so "what the reader carries away"
was self-report with nothing anchoring two runs to the same answer. Given A4 already shows this
prompt flipping readiness on byte-identical input, adding an unoperationalised simulation was
more likely to add variance than remove it.

**Fixed with a procedure instead of an instruction:** read the page titles in order plus the
first sentence of each, and nothing else. That is now the skim. It is mechanical, reproducible,
and it quotes what it is built on.

**2. The extraction-damage patch demanded counterfactual reasoning.** "Raise the finding only on
figures where no flagged material could have supplied the comparator" asks the model to reason
about what an unread, damaged table might have contained. A cautious reviewer would suppress
every comparator finding near any flag; a narrow one would protect only figures literally inside
it. Wider divergence than the ambiguity it replaced.

**Fixed with a mechanical test:** if the extraction notes flag anything on the same page as the
figure, or in any table or exhibit that page refers to, the comparator is unassessable for that
figure. Checkable, no counterfactual needed.

**3. The comparator test had no severity default and could not reach critical**, while sitting
*above* ungrounded headline numbers in the priority order, which does have a blocking rule
behind it. The intent and the mechanism disagreed.

**Fixed both ways:** the comparator test now has the same severity default as the reader test
(major, critical only on a blocking-rule pairing), and the priority order now states outright
that it governs what survives the budget and not how severe anything is, with the reason
uncompared outranks unsourced spelled out.

**Not fixed, and recorded as an open tension instead.** The reviewer also observed that the
reader test is capped at one finding and the comparator test at one, against a deep budget of
five. So the two axes can occupy at most 2 of 5 slots, and communication alone at most 1 of 5,
against a thesis that puts ~60% of the value on communication. The caps are right, because they
protect restraint, which is scored. The tension is real. It is in STATUS.md under the prompt
section and it is not resolved by more words in the prompt: it is a question about whether
finding count is the right instrument for expressing where value sits, and the rubric carrying
one communication dimension of ten is part of the same question.

## 3. What was deliberately not touched

The isolation principle from [BUILD-PROMPT-critique-quality.md](BUILD-PROMPT-critique-quality.md):
**change what gets reported, not what gets blocked.** No edit here touches the five blocking
rules, the readiness ceilings, the severity definitions or the noise budget. Any readiness
movement in a future measurement is therefore noise rather than effect, and that can be said
with a straight face.

The output contract, the rubric and `check-review-v2.js` are all unchanged, so the renderer at
https://180dc-reviewer.pages.dev keeps working against this prompt's output with no change.

## 4. What this does to the noise budget

Nothing directly, and that is the risk. The budget is still five findings in deep mode, and
there are now two more ways to earn a slot. If the reader test and the comparator test both
fire, they should **displace** a sourcing finding, not extend the list. Watch findings per
review in the first run: if it climbs, the edits are being additive rather than reordering,
and that is a failure of this change even if coverage improves.

## 5. This is unmeasured, and the reason matters

Every metric in [STATUS.md](STATUS.md) describes `frozen-2026-08-03`. They do not describe this
prompt. Do not quote them against it.

Worse, per **A8** and the [gate stop](GATE-STOP-critique-quality.md), the scorer cannot
currently resolve this change even if the runs were done. `T_NEAR` and `T_HIT` in
`score-review.js` are labelled UNVALIDATED, fitted against fabricated fixtures, and
communication-typed findings score at or below `near` **by construction**. Comparator findings
will land in the same band. Three of four stability cases flipped between `miss` and `near`
under a frozen prompt on identical input, one on 0.005.

So a re-run of the nine cases right now would produce numbers that move, and nobody could say
whether the movement was the edit or the coin.

**The unblock is cheap and it has not moved since 08-03:**

1. Read the `near` verdicts across the twelve scored runs already sitting in
   `eval-runs/real-baseline/stability/` and record, per verdict, whether a human calls it a
   catch. This is the threshold calibration `score-review.js` has been asking for in a comment
   since it was written.
2. Re-fit `T_NEAR` and `T_HIT` to those judgements and bump `MATCHER_VERSION`. Scores are not
   comparable across matcher versions, so this happens **before** a new baseline is frozen.
3. Then run all nine cases, N draws per case per A9, and compare to the 08-03 run.

Step 1 is a human reading maybe thirty judgements. It is the cheapest unblocked thing in the
whole project and it gates everything downstream.

## 6. Expectations, written before any run

Recorded here so they cannot be fitted afterwards.

- **Primary.** Coverage of communication-typed gold issues rises. real-01's must-catch, which is
  confirmed communication-typed, is caught in at least two of three draws.
- **Secondary.** At least one comparator finding appears on a deck whose gold flags an
  uninterpreted number, phrased as a missing comparison rather than an invented benchmark.
- **Guard 1, no trade.** Coverage of non-communication gold issues does not fall. Blocking rules
  missed stays at 0%. Buying reader-sensitivity with logic-blindness is a failure, and A1 is the
  property most worth protecting.
- **Guard 2, restraint holds.** Findings per review stays inside the mode budget and does not
  climb. Strong decks do not start collecting comparator findings.
- **Guard 3, no fabrication.** Every comparator finding still carries a verbatim quote and names
  a missing comparison. A reviewer that supplies its own benchmark has broken A2, which is the
  single rarest property this tool has.
- **Guard 4, no ghostwriting drift.** Reader-test findings stay directional. If `fix` starts
  producing rewritten titles or slide text, edit 2 went too far.

## 7. If it has to come back

```
copy eval-runs\prompt-archive\frozen-2026-08-03.txt over section A of 04-prompt-templates.md
set promptVersion back to frozen-2026-08-03 in run-reviews.js
node run-reviews.js --dry-run     # must print sha256:39c18fbca9e5d218
```

The 07-29 and 08-02 run folders are untouched and remain the comparison set.
