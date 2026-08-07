# Paste-ready build prompt: measure run-to-run variance on real cases

<!-- check-docs: historical -->

**Dated record, not a status report. Ran 2026-08-03. Produced A3 and A4: findings repeat, the readiness verdict does not.** For current state read [STATUS.md](STATUS.md).

Paste everything below the line into a fresh chat. It is self-contained.

Runs after [BUILD-PROMPT-calibration-sprint.md](BUILD-PROMPT-calibration-sprint.md). This
sprint measures. It changes nothing.

---

Working in `c:\Users\User\Desktop\180dc-ai`, branch `idea/reviewer-v2`. Everything below
lives under `tools/quality-reviewer/v2/`. **Measure and report. Do not tune anything.**

## Why this exists

The calibration sprint moved every headline metric the right way and all three regression
guards held. It also produced this, which outranks the win:

> real-03's first attempt failed the contract and was re-run. That attempt assigned **R1 and
> explicitly declined rule 1**. The re-run assigned **R0 and fired it**. Same prompt, same
> input pack, two readiness levels apart.

The sprint's headline gain is real-13 moving R0 to R2, a single case moving two levels. That
sits entirely inside a variance band just observed to be two levels wide. **Until variance is
measured, the sprint result cannot be read as signal.**

`check-stability.js` was built for exactly this question and has never been run on a real
case. Run it.

## The design

Prompt `frozen-2026-08-03`, sha256 `39c18fbca9e5d218`. **Do not edit the prompt, the rubric or
the contract during this sprint.** Any edit invalidates the measurement.

Four cases, three runs each, twelve runs total. Each case earns its slot:

| case | why it is in the set | what the sprint got |
|---|---|---|
| real-13 | carries the entire claimed win | R0 → **R2**, exact |
| real-01 | the other case that moved | R0 → R1 |
| real-03 | the observed two-level flip | R0 (after a failed R1 attempt) |
| real-04 | the guard, must not move | R0, exact, still fires rule 1 |

Three runs is enough to detect gross instability and not enough to measure it finely. That is
the right trade for a Wednesday decision. Say so in the write-up rather than implying more
precision than three runs supports.

## Where the output goes, read this before writing any file

**`eval-runs/stability/` is NOT gitignored.** It holds the synthetic case-01 to case-05 runs
and is tracked on purpose. Writing real-case reviews there would push verbatim client deck
quotes to the public repo.

Verified 2026-08-02 with `git check-ignore`:

- `eval-runs/stability/real-13-run-a.json` → **tracked, would leak**
- `eval-runs/real-baseline/stability/real-13-run-a.json` → **ignored, safe**

Write every real-case run to **`eval-runs/real-baseline/stability/`**, named
`<case>-run-a.json`, `-run-b.json`, `-run-c.json`. Confirm with `git check-ignore` before the
first write, and confirm `git status` is clean of real-case material before you finish.

## Running it

1. Build the input packs from the same source the calibration sprint used, so they are
   **byte-identical** to the packs already on disk. Diff them against the sprint's packs and
   say so in the write-up. If the packs differ, the comparison is void.
2. One Claude Code subagent per run, seeing only its own input pack. It must never read
   `eval-cases-real/labeling/`, any `*.gold.md`, any `*.worksheet.*`, `_LABELING-RECORD.md`,
   any other case, **or any earlier run of the same case**. That last one is new and it
   matters: a subagent that sees run A will anchor on it and you will measure nothing.
3. Batch 3 to 4 at a time and collect after each batch. Large waves have hit the account
   session limit and been killed mid-task.
4. Validate each with `check-review-v2.js`. **A contract failure is itself a data point:
   record it, then re-run that slot.** The calibration sprint's most important finding came
   out of a contract failure, so do not quietly discard them.

### Two harness traps already known

- `--collect` only processes manifest rows still marked `pending`. A contract-failed case
  stays `invalid` and its re-run is silently skipped until that row is reset.
- `--help` is now guarded and exits cleanly. Unknown flags, `--flag=value` and stray
  positionals exit 2 rather than starting a live run. Do not test that again.

## What to compute

Per case, run `node check-stability.js <run-a> <run-b> <run-c>`. Read its own header first:
it reports rather than passes or fails, and its stable-core percentage is a **floor** on
agreement because findings are matched by quote containment. Do not quote it as an exact
figure.

Then produce, per case:

- **Readiness spread.** How many distinct levels across the three runs, and which.
- **Blocking rules fired, per run.** This is the behaviour the calibration sprint changed, so
  track it directly rather than inferring it from readiness. Rule 1 firing or not firing on
  the same input is the specific instability observed on real-03.
- **Stable core.** The findings all three runs caught, and the ones only one run caught.
- **Score against gold** for each run, so readiness spread can be read against the target.

## Decision rules, write them down BEFORE the first run

Put these in `EXPECTATIONS.md` in the run folder before anything executes.

- **real-13 returns R2 in 2 or 3 of 3** → the sprint gain is real. Rule 2 becomes the next
  edit.
- **real-13 returns R2 in 0 or 1 of 3** → the gain is inside the noise band. Stop tuning
  rules. Variance becomes the problem to solve, and the human-in-the-loop route becomes the
  primary path to a pilot rather than a parallel one.
- **real-04 returns R0 in fewer than 3 of 3** → the sprint's regression guard held by luck,
  not by design, and every guard result from the sprint needs re-reading.
- **Any case shows a two-level spread** → that is the headline of the write-up regardless of
  what else moved.

## Deliverable

`RESULT.md` in the run folder. Local only, and that is fine: Wednesday is a product demo, not
a repo read, so nothing here needs to be tracked or presentable. It is a decision input for
the owner.

It contains the per-case tables above, the four decision-rule outcomes stated plainly, and a
one-paragraph verdict on whether the calibration sprint's result survives contact with
variance. **Present it, do not decide it.**

## Definition of done

- 12 contract-valid runs in `eval-runs/real-baseline/stability/`, all blind, all under
  `frozen-2026-08-03`, packs confirmed byte-identical to the sprint's.
- `EXPECTATIONS.md` written before the first run.
- `check-stability.js` output for all four cases, plus per-run blocking-rule firing.
- `RESULT.md` with the four decision-rule outcomes answered.
- Any contract failures recorded rather than discarded.
- `git status` confirmed clean of real-case material.

## What not to do

- Do not edit the prompt, the rubric or the contract. Not one word.
- Do not start on blocking rule 2. It will still be there Thursday, and tuning a second rule
  against an unmeasured variance band is how a week disappears.
- Do not write real-case runs to `eval-runs/stability/`.
- Do not let any subagent see an earlier run of its own case.
- Do not report a stability percentage without the caveat that it is a floor.
