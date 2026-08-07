# Paste-ready build prompt: finish the real-case baseline (Track A)

<!-- check-docs: historical -->

**Dated record, not a status report. Ran 2026-07-26. Produced the first real baseline on 9 gold-backed cases.** For current state read [STATUS.md](STATUS.md).

Paste everything below the line into a fresh chat. It is self-contained.

Track B (the visual, porting v1 Team Lead Mode onto the v2 contract) comes after this and
has its own prompt. Do not start it here.

---

Working in `c:\Users\User\Desktop\180dc-ai`, branch `idea/reviewer-v2`. Everything below
lives under `tools/quality-reviewer/v2/`. **Build and run, do not write design documents.**

## The goal, in one sentence

Produce the first honest measurement of the reviewer on real client work: run the frozen
prompt over the 9 remaining gold-backed real cases, score each against its human gold, and
emit one aggregate scorecard.

## Where things stand

- **Golds: 11 of 14 real cases labeled**, by MS, single-pass protocol, 2026-07-25 to 07-27.
  `check-gold.js` reports 8 of 8 consistent. real-06, real-07 and real-09 have no gold and
  are **out of scope**. Do not label more cases. The owner has decided 11 is enough.
- **Baseline run: 2 of 11 collected.** Done: `real-04`, `real-12`.
  Pending: `real-01`, `real-02`, `real-03`, `real-05`, `real-08`, `real-10`, `real-11`,
  `real-13`, `real-14`.
- **Run folder:**
  `eval-runs/real-baseline/2026-07-29T16-29-44-subagent-packs/`
  It already holds every `<case>.input.md` pack, the `run-manifest.json`, and the finished
  outputs for the two collected cases.
- **Harness is built and working:** `run-reviews.js`, `score-review.js`, `scorecard.js`,
  `check-gold.js`, `check-review-v2.js`. All are currently **untracked in git**. Committing
  them is a task below.
- **Prompt is frozen:** `frozen-2026-07-26`, sha256 prefix `20cc7e4add709427`. It is read at
  run time out of section A of `04-prompt-templates.md` and hashed, so the manifest proves
  which text ran. **Do not edit `04-prompt-templates.md` during this run.** Any prompt edit
  invalidates every run in the set and forces a re-measure.

## How a case is run (no API is used)

The manifest note is the contract for this. For each pending `<case>.input.md` in the run
folder:

1. Have a **Claude Code subagent** read that one input pack. The pack already contains the
   frozen system prompt at the top followed by the case input. The subagent acts as the
   reviewer exactly as that prompt instructs.
2. The subagent writes **only** the JSON object (matching `03-output-contract.md`) to
   `<case>.review.json` in the same folder. No prose before or after the JSON.
3. After each batch, collect:
   `node run-reviews.js --collect "<absolute path to the run folder>"`

### Three rules that protect the measurement

- **Blindness.** The subagent must never read `eval-cases-real/labeling/`, any `*.gold.md`,
  any `*.worksheet.*`, `_LABELING-RECORD.md`, or another case's review. It sees one input
  pack and nothing else. If a subagent reads a gold, that case is burned and must be re-run
  in a fresh agent.
- **Batch size.** `progress.md` records three consecutive sessions where a large agent wave
  hit the account session limit and every agent was killed mid-task. Run **3 or 4 at a
  time**, collect after each batch, and never hold results only in memory. Write per item.
- **Confidentiality.** `eval-runs/real-baseline/` and everything under it is gitignored, as
  are the decks, golds and worksheets. Verified 2026-08-02. Never push any of it, never
  paste deck text or client names into a commit message or an issue.

## The work, in order

1. **Run the 9 pending cases** in batches of 3 or 4 per the above. Validate each as it
   lands: `node check-review-v2.js <case>.review.json <the case .md in eval-cases-real/>`.
   A review that fails the contract is re-run, not hand-patched.
2. **Score every case** against its gold:
   `node score-review.js <case>.review.json eval-cases-real/labeling/<case>.gold.md --json`
   Write each to `<case>.score.json`. `score-review.js --eligible eval-cases-real/labeling`
   lists which golds a run is allowed to use.
3. **Emit the aggregate scorecard** with `scorecard.js` across all 11 scored cases. Report,
   at minimum: readiness exact-match rate and within-one rate, must-catch recall,
   severity alignment, and the over-flagging rate on the gold restraint cases.
4. **Answer the open owner question with the numbers**, do not decide it: does the tool
   over-flag strong decks on *real* work the way it does on synthetic case 05 (which
   over-escalates 3 of 5 runs)? Identify which of the 11 golds are strong-deck cases and
   report the tool's behaviour on exactly those. This is the decision the whole baseline
   exists to inform. Present it, let the owner call it.
5. **Commit the harness.** `run-reviews.js`, `score-review.js`, `scorecard.js`,
   `check-gold.js`, `package.json`, `package-lock.json` and the `labeling/fixtures/`
   are untracked. Commit the code and the fixtures only. Confirm with
   `git status` that no real-case material is staged before committing.
6. **Update `STATUS.md` and `progress.md`.** STATUS.md is stale: it still says the long pole
   is human labeling and points at `calibration-batch.md`. Labeling is done. Rewrite the
   "what still needs to happen" list around the real numbers this run produces.

## What already exists on real-04, and why it matters

real-04 has been reviewed twice under the frozen prompt by two independent sessions
(2026-07-29 and 2026-08-02, the second saved as `real-04.review.replicate-2026-08-02.json`
with its score beside it). The two runs are **identical**: same 5 findings in the same order,
same severities, same readiness R0, same 4 blocking rules, same diagnosticMean 1.7, and the
same score on all four axes (readiness exact, must-catch hit, severity exact, no over-flag).

Treat that as the stability baseline for a **weak** deck, where the blocking rules fire
unambiguously and there is little room to diverge. It says nothing yet about strong decks,
which is where case 05 falls apart. Preserve both files. Do not overwrite them.

A short-mode review of the same deck is saved beside them as
`real-04.review.short-mode-2026-08-02.json` for the Track B renderer work.

## Definition of done

- 11 `*.review.json`, all contract-valid, all produced blind under the frozen prompt.
- 11 `*.score.json`.
- One aggregate scorecard with the five metrics in step 3.
- A short written answer to step 4, with the strong-deck cases named.
- Harness code committed, no real-case material in the repo.
- STATUS.md and progress.md current.

## What not to do

- Do not label new golds. Do not touch real-06, real-07, real-09.
- Do not edit the frozen prompt, the rubric or the output contract. If you find a defect in
  any of them, write it down and keep running. Mid-run prompt edits invalidate the baseline.
- Do not build the Track B visual here.
- Do not let any reviewing agent see a gold label.
