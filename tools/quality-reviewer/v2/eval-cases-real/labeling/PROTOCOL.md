# Single-pass labeling protocol for real cases

The team labels every case in [../](../) once to produce the gold labels: one gold label
per case, no second independent labeler, no reconciliation of two sheets. This replaces
the earlier two-labeler blind-then-adjudicate design, which the team does not have the
capacity to run. See the 2026-07-25 decision-log entry for the rationale and the trade.

What a single pass loses, and how this protocol compensates:

- Lost: the inter-rater agreement number and the two-reader stop rule. Replaced by a team
  calibration round up front (step 1) that surfaces rubric ambiguity the same way, and by
  honesty in the record: the gold is single-pass team gold and the baseline readiness-match
  must be read with that caveat.
- Lost: a second independent judgment catching a first reader's slip. Compensated by an AI
  mechanical consistency check on every finished gold (step 4) that never suggests a label,
  only flags internal contradictions, and by an optional expert spot-check on a few cases
  (step 5).

Blindness is unchanged and still the whole point: a gold anchored to the reviewer's own
output is worthless.

## Before you start

1. Do not read the sealed selection memo, any AI review, any triage band or any reviewer
   output for these cases. If you have accidentally seen one, say so in that case's
   worksheet header.
2. Read [../../01-rubric-v1.md](../../01-rubric-v1.md) and
   [../../05-eval-harness.md](../../05-eval-harness.md) section C once, fresh, before your
   first case.
3. Severity rule, same as the reviewer's calibration: an issue is critical or major only if
   closing it could change the client's decision. Style and polish are minor.

## Step 1. Team calibration round (do this first, together)

Label the four cases in [calibration-batch.md](calibration-batch.md) as a team in one
sitting, discussing each to a shared standard. This aligns everyone on how to read the
rubric and it is the safety valve the two-reader stop rule used to be:

- If the team reaches a stable shared readiness on all four without persistent unresolved
  debate, your rubric reading is calibrated. Proceed to step 2.
- If the team cannot settle two or more of the four (readiness keeps moving, or you split
  and cannot argue to a resolution), stop. The rubric is not carrying trained readers to one
  answer, so it cannot carry the reviewer either. Fix the rubric, then redo the four.

Write one gold label per calibration case as you agree it. These four count as done.

## Step 2. Label the remaining ten (single pass)

Label real-01, real-03, real-04, real-05, real-06, real-07, real-09, real-10, real-11 and
real-14, one gold label each. Split them among the team or do them together, your choice:
the calibration round is what keeps split work consistent. Budget 30 to 40 minutes per
case. Judge the deck as it stood, not what the project later became. If you worked on a
project, flag it in that case's header and label it anyway.

## Step 3. Write each gold

Use [labeling-workstation.html](labeling-workstation.html): open a case, fill the worksheet
beside it, and it enforces the shape (every required part filled, exactly one must-catch or
the restraint box) before it lets you export. For a single pass the completed worksheet is
the gold: save it as `real-NN.gold.md`. Filling the section C template by hand is equally
fine. The two-worksheet adjudication-workstation.html is not used in a single-pass run; it
is kept for reference only.

## Step 4. AI consistency check (mechanical, never a label)

Once a gold exists, run the mechanical check and resolve any internal contradictions it
reports. From this directory:

```
node ../../check-gold.js real-NN.gold.md
```

It reports only internal contradictions for you to resolve: exactly one must-catch or a
declared restraint case, a valid readiness level, readiness at or below any blocking rule
you cite, a blocking rule present if readiness is R0 or R1, no critical issue sitting under
an R3, valid severities, dimensions and issue types, every section filled. It never
proposes or changes a label, you resolve every flag. It exits 0 when the sheet is
internally consistent and 1 with a flag list otherwise, and it runs locally with no API
cost. This is the compensating control for the missing second reader. It runs after a gold
exists, so it does not block labeling from starting.

The checker is exercised by two fabricated fixtures under [fixtures/](fixtures/) (fake case
real-00, no real client): `real-00.gold.PASS.md` must read CONSISTENT and
`real-00.gold.FAIL.md` must report contradictions. Run them any time to confirm the checker
still works before trusting it on a real gold.

## Step 5. Optional expert spot-check

If the ex-consultant is available, have them independently label two or three cases as an
external-validity signal. Log where their read and the team gold diverge in
[agreement-log.md](agreement-log.md) as information about the gold, not to override it. This
is the only place a second pass happens and it is optional.

## After labeling

Only now open the sealed selection memo if you need it. Machine triage bands never override
a gold. Every case then has a `real-NN.gold.md` and the baseline run is unblocked, once the
prompt is frozen.
