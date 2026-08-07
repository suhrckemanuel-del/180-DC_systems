# Paste-ready build prompt: documentation integrity (findings D1 and D2)

**Run on Sonnet.** High-volume systematic verification across ~25 documents, against ground
truth that already exists. It needs care and thoroughness rather than deep judgment, and the
volume makes a fast model the right call. Escalate to Opus only if you hit a contradiction that
needs a real decision rather than a correction.

Paste everything below the line into a fresh chat. It is self-contained.

---

Working in `c:\Users\User\Desktop\180dc-ai`, branch `idea/reviewer-v2`. Everything lives under
`tools/quality-reviewer/v2/`. **Verify and correct. Write no new strategy documents.**

## The finding this exists to close

An audit on 2026-08-05 found two failures in `STATUS.md`, the document whose entire job is to
make current state legible:

- **D1.** A measurement sprint had run and produced a preregistered failure. STATUS still
  described it as not yet started, and none of its numbers appeared anywhere in the summary.
  The detail document stated the negative result cleanly. The summary did not carry it.
- **D2.** The top of the file reported a decision as already taken. The bottom of the same file
  still presented that same decision as open, with a deadline that had passed.

Both are now fixed in `STATUS.md` specifically. **The failure mode is not.** This project has
around 25 tracked documents written across two months, they cross-reference each other heavily,
and nothing checks that they still agree. D1 and D2 are the two instances that happened to be
caught by an audit that was looking at something else.

## Ground truth, in priority order

When two documents disagree, these decide. Higher beats lower.

1. **The code and its output.** Hashes from `node run-reviews.js --dry-run`, the constants in
   `score-review.js`, the contents of run manifests. A number a script prints beats a number a
   document remembers.
2. **`18-evidence-base.md`.** The deliberate separation of established, unresolved and
   hypothesis. If a doc states as fact something 18 lists as hypothesis, the doc is wrong.
3. **`21-scorer-refit-sprint.md` and `19-prompt-change-2026-08-05.md`.** The most recent
   measurement and the most recent prompt change.
4. **`STATUS.md`.** Just rewritten and believed current.

Everything else is downstream and may be stale.

## The job

### 1. Sweep every tracked document for drift

Go through every `*.md` in `tools/quality-reviewer/v2/` that is tracked by git. For each, check
and correct:

- **Prompt version and hash.** The current prompt is `frozen-2026-08-05c`, sha `80983d7179eb950f`.
  Earlier versions are real history and must not be rewritten where a document is describing a
  past run. A doc saying "the frozen prompt is 39c18fbca9e5d218" as a **present-tense** claim is
  wrong. A doc saying "the 08-02 run used 39c18fbca9e5d218" is right and stays.
- **Matcher version.** Now `mc-match-2`, `T_HIT` 0.39, `T_NEAR` 0.24. Anything quoting 0.45 or
  0.28 as current is wrong. Same past-tense rule applies.
- **The headline metrics.** Both baselines were re-scored under `mc-match-2` on 2026-08-05 and
  two numbers changed materially: must-catch recall reads 22.2% to 44.4% (not 33.3%), gold issue
  coverage reads 35.1% to 37.8% (not 21.6% to 32.4%). Find every place the old numbers appear
  and correct or date-stamp them. **`16-board-package.md` and `16a-board-package-stress-test.md`
  matter most here**, because those are the documents that go in front of people.
- **Claims of state.** Anything saying a thing is pending that has happened, or open that has
  been decided. The ship/iterate/revert call was resolved on 2026-08-05: iterate.
- **Dead references.** Links to files that do not exist, and sections that reference numbered
  documents by a heading they no longer have.

### 2. Carry the negative result into the summaries

This is D1 generalised and it is the important half of the sprint.

The 2026-08-05 sprint found that the matcher's entire discriminative power is **three
percentage points better than a constant that ignores the input** (88% against 85% at the best
possible cut point). `21-scorer-refit-sprint.md` states it plainly. Check every summary-level
document that makes a claim about the tool's measured performance and make sure it carries that
caveat rather than quoting a recall figure as though it were solid.

The board package is the sharpest case. It exists to be read by people who will not open the
detail. If it quotes coverage or recall numbers without the error bar the sprint established,
fix it, and be blunt about what changed.

**Do not soften the finding to protect the board package.** Correct the board package.

### 3. Build the check that catches this next time

The prompt has a hash discipline that makes drift visible. Documentation has nothing. Build the
cheapest thing that would have caught D1 and D2:

`check-docs.js`, no network, no API. At minimum it should:

- extract the current prompt version, prompt hash, matcher version and thresholds from the code,
  then flag any tracked `.md` asserting a **different** value in the present tense
- flag any internal link to a file or anchor that does not exist
- exit non-zero when it finds something, so it can be run before a commit

Keep it mechanical and keep its false-positive rate near zero. A checker people learn to ignore
is worse than none. Past-tense statements about historical runs are correct and must not be
flagged: if you cannot distinguish tense reliably, prefer under-flagging and say so.

## Hard constraints

- **Do not touch** `04-prompt-templates.md` section A, `01-rubric-v1.md`, `03-output-contract.md`
  or anything under `eval-runs/` or `eval-cases-real/`. Those last two are real client material
  and are gitignored. You do not need to open them for this work.
- **Correct, do not rewrite.** These documents carry deliberate reasoning and a specific voice.
  Fix what is factually wrong or contradictory. Do not restructure a document because you would
  have organised it differently.
- **Voice rules apply**: no Oxford commas, no em or en dashes.
- Preserve history. A statement about what a past run showed is not drift, even where the number
  has since been re-scored. Date-stamp it rather than deleting it.

## Definition of done

- Every tracked `.md` swept, with a list of what changed and what was checked and found correct.
  The second list matters as much as the first.
- The board package carries the scorer's error bar.
- `check-docs.js` exists, runs clean or reports honestly, and is documented in one line in
  `STATUS.md`.
- A short note at the end: which document was worst, and whether anything you found changes a
  conclusion rather than just a number. The second question is the one worth answering.

## What would make this sprint a failure

A tidy pass that corrects version strings and leaves a board package quoting recall figures the
project can no longer support. The numbers are the easy half. The claims are the point.
