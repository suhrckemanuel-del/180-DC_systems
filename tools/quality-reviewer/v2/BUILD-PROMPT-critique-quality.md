# Paste-ready build prompt: close the critique-quality gap (the reader test)

<!-- check-docs: historical -->

**Dated record, not a status report. Ran 2026-08-03 and stopped at its own preregistered gate, unedited. Record in GATE-STOP-critique-quality.md.** For current state read [STATUS.md](STATUS.md).

Paste everything below the line into a fresh chat. It is self-contained.

Runs after [BUILD-PROMPT-stability-real.md](BUILD-PROMPT-stability-real.md). **Read the gate
at the top before doing anything.**

---

Working in `c:\Users\User\Desktop\180dc-ai`, branch `idea/reviewer-v2`. Everything below
lives under `tools/quality-reviewer/v2/`. **Build, run, measure. Do not write design
documents.**

## GATE. Read this first and be willing to stop

Open the stability sprint's `RESULT.md` in
`eval-runs/real-baseline/stability/` and find the **stable-core** figure per case, which is
what `check-stability.js` reports about findings (not readiness). Remember its own warning:
that number is a floor, never an overstatement.

- **If the stable core is high** (the same findings recur across runs while readiness swings)
  then findings-based measurement is valid and this sprint proceeds. Say so explicitly with
  the numbers.
- **If findings are as unstable as readiness**, stop. Do not make the edits. Write a short
  note saying findings-level measurement is not yet possible and hand it back to the owner.
  A critique-quality change cannot be measured on an instrument that does not repeat.

Do not proceed on a guess. If `RESULT.md` does not exist yet, stop and say so.

## Why this exists

Readiness is a separate, unresolved problem. This sprint does not touch it. This is about
**what the reviewer notices**, which is a different failure and a fixable one.

Reading two golds closely (real-01 and real-04, 11 issues total), the human's issues cluster
on readability and whether the thing is consulting at all: no clear takeaway for a skimmer,
volume against signal, no executive summary, wall of text, a summary of information rather
than advice. Five of those 11 are communication-typed, and **on real-01 the must-catch itself
is a communication issue.**

The tool's findings cluster elsewhere: unsourced numbers, contradictions, recommendation
specificity. Both are legitimate. But the human reviews as a reader and the tool reviews as a
logician.

**That gap is designed in.** Two lines in the current SYNTHESIS PROTOCOL cause it:

> 3. ... When the budget forces a choice, communication findings go first.

> 4. Rank the survivors by the diagnostic priority order: internal contradiction first,
>    then missing or late governing insight, then recommendations without a decision,
>    then ungrounded headline numbers, then QA artifacts.

Communication is cut first by rule, and never appears in the priority order except as "QA
artifacts" at the bottom. So the prompt discards the category the human values most, and the
baseline then measured that as a recall failure.

The justification for the fix comes from the gold itself. real-01's honest-uncertainty
section reads:

> The labeler skimmed rather than read closely, flagged deliberately and partly the point, a
> busy executive would skim too and the deck did not survive that read.

## The three edits, applied as ONE pass

All into section A of `04-prompt-templates.md`. Archive the current prompt first, verbatim,
to `eval-runs/prompt-archive/frozen-2026-08-03.txt`, and confirm it re-hashes to
`39c18fbca9e5d218`. Then bump `promptVersion` in `run-reviews.js` and confirm the new hash
prints and differs.

### Edit 1. Remove the blanket cut rule

Delete "When the budget forces a choice, communication findings go first" from step 3. Replace
with a test on the same decision-change basis every other finding is held to. Required
semantics:

> Judge a communication finding by whether the client gets the message, not by whether it is
> cosmetic. A deliverable whose argument is sound and whose reader cannot extract it has
> failed at the only thing it was for. Cut communication findings that are about polish. Keep
> the ones that are about whether the message lands.

### Edit 2. Add the reader test to the lens pass

The nine lenses ask whether the argument is sound. None asks whether it survives being read.
Add to the synthesis protocol, before the ranking step. Required semantics:

> Before ranking, read the deliverable once the way its actual reader will read it: fast, one
> pass, skimming, without the goodwill of someone being paid to study it. Ask what that
> reader carries away. If the answer is nothing, or a list of topics rather than an answer,
> that is a finding and it ranks with the structural ones. State it as what the reader misses,
> not as a formatting complaint.

### Edit 3. Put it in the priority order

Amend step 4's order so a deliverable that does not land is ranked structurally rather than
as a QA artifact. Required semantics: insert "then a deliverable whose message does not
survive one read" directly after "missing or late governing insight". A buried insight and an
absent one are different failures and the order currently only has room for the second.

## Isolation principle, this is what makes the result readable

**Change what gets reported. Do not change what gets blocked.** No edit here may touch the
blocking rules, the readiness ceilings, the severity definitions or the noise budget. Then any
readiness movement in the measurement is noise rather than effect, and you can say so with a
straight face. If you find yourself wanting to adjust a blocking rule, stop: that is the
previous sprint's unresolved territory.

## Case selection, derive it rather than assuming it

Do not reuse the four stability cases. Instead, parse all nine golds and count
communication-typed issues per case (the `type:` field on each ranked issue, plus the
dimension where it names Storyline or Slide-level communication). Pick the **four cases whose
golds are most communication-weighted**, and state the counts that produced the choice.
real-01 is near-certain to be in the set because its must-catch is a communication issue.

## Measurement

**N draws, not one.** That is now the standing rule for every experiment. Use three per case
unless the stability result shows findings repeat tightly enough to justify two, and say which
you chose and why.

Findings-based metrics only. Readiness is not evidence in this sprint:

- gold issue coverage, overall and **split by communication-typed versus the rest**
- must-catch recall, with real-01's specifically called out
- findings per review, to prove restraint did not collapse

## Expectations, written before the first run

Into `EXPECTATIONS.md` in the run folder.

- **Primary.** Coverage of communication-typed gold issues rises. real-01's must-catch is
  caught in at least two of three draws.
- **Guard 1, no trade.** Coverage of non-communication gold issues does not fall. Blocking
  rules missed stays 0%. Buying reader-sensitivity with logic-blindness is a failure.
- **Guard 2, restraint holds.** Findings per review stays inside the mode budget, and the
  tool does not start manufacturing communication findings on the strong decks. Restraint is
  a scored quality and this edit is the kind that erodes it.
- **Guard 3, no ghostwriting drift.** A reader-test finding must still be directional. If the
  fix field starts producing rewritten titles or slide text, the edit went too far.

## Definition of done

- Gate answered explicitly with the stable-core numbers, or a clean stop.
- Three edits in one pass, previous prompt archived and re-hash confirmed, version bumped.
- Case selection justified with the per-gold counts.
- `EXPECTATIONS.md` before the first run.
- N draws per case, all blind, contract-valid, in a new gitignored folder under
  `eval-runs/real-baseline/`. Never `eval-runs/stability/`, which is tracked and would leak.
- `RESULT.md` with the split coverage table and all three guards reported beside the primary
  result, not after it.
- `git status` clean of real-case material.

## What not to do

- Do not touch blocking rules, readiness ceilings, severity or the noise budget.
- Do not raise the noise budget to fit more findings in. If the reader test earns a slot it
  should displace something.
- Do not proceed past the gate on a guess.
- Do not report the primary result without the three guards next to it.
- Do not tune to real-01. If the change only helps the case whose must-catch you already
  know, it is overfitting to one deck.
