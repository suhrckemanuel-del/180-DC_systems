# Paste-ready build prompt: the restrained default output

<!-- check-docs: historical -->

**Dated record, not a status report. Spent. Superseded by the live Triage Desk, which enforces restraint at the triage step rather than only in the prompt.** For current state read [STATUS.md](STATUS.md).

Paste everything below the line into a fresh chat. It is self-contained. Supersedes
NEXT-CHAT-BUILD-PROMPT.md, which belongs to an earlier phase.

---

Working in `c:\Users\User\Desktop\180dc-ai`, branch `idea/reviewer-v2`. Everything below
lives under `tools/quality-reviewer/v2/`. Build, do not write design documents.

## The problem, stated exactly

The v2 reviewer produces a review JSON that is analytically good and unreadable in
practice. A previous session rendered a real review (real-04) into a standalone HTML
viewer, validated every quote against the source deck, and it still landed as too much
information.

**The cheap explanation is wrong, and it has already been tested.** That session did not
render the full review. It rendered `mode: "short"`, already the leanest thing the contract
produces: 3 findings, 0 comments, 0 questions for lead, 2 strengths. It still read as too
much. Trimming the contract further is therefore not the fix, because the contract was
already trimmed. Both files survive, see the recovered work below, and you should read them
before writing anything.

**The density is inside each finding, not in the number of findings.** The coach view's
finding card at `index.html` lines 600 to 616 renders five labeled prose blocks per finding
(the principle, what is happening, evidence, why it matters to the client, the reflect
question), then two textareas, then a disabled button. One finding at a time, with previous
and next navigation. Three findings in short mode is still three walls of prose, and the
fix does not appear at all until the reader types an attempt that passes both a length
check and a not-merely-restating-the-question check.

That gate is deliberate teaching design, grounded in S5 and S8 of the source register, and
it is the wrong first impression. The work is to put a genuinely brief surface in front of
it, not to weaken what sits behind it. v1's output was five binary criteria, at most three
findings, one flat list. Short, and good. Get that restraint back on the default surface
while leaving v2's engine untouched underneath.

## Decisions already made. Do not reopen these.

1. **Restraint lives in the view, not the contract.** The prompt stays frozen at
   `frozen-2026-07-26` (sha `20cc7e4add709427`) and `03-output-contract.md` does not
   change shape. The model keeps computing everything. The default view shows a slice.
   Reason: touching the prompt invalidates comparability with the two real cases already
   scored, and reopens the whole baseline question.
2. **Default first screen is readiness plus the top three findings, flat.** One readiness
   line, then at most three findings as a single prioritised list, each showing its quote
   and why it matters. Everything else (the fix, the reflect gate, the ten-dimension
   scorecard, blocking issue detail, notAssessed, timeline, comments, questions for lead)
   sits behind one expand. Present, not deleted, not shown first. Step 1 explains why `fix`
   in particular is held back.
3. **The deliverable is one HTML file, produced by any model.** A person should be able to
   open a normal chat with any capable assistant, free CLI tools included, point it at a
   `RUN.md`, and get back a single finished HTML file they can double-click. No repo
   knowledge, no separate paste-into-the-renderer step, no dependency on Claude
   specifically.
4. **Quote verification is a hard gate.** No HTML is produced unless every quote in the
   review is a verified verbatim substring of the source deliverable. A finding whose quote
   fails verification is dropped, per the existing quote-or-abstain rule. The gate is
   enforced in code, not by instructions a model can skip.

## What already exists. Read before building, do not rebuild.

- `index.html`, 111 KB, single self-contained file, no network calls at all, opens from
  `file://` on a double-click. Four views switched by `setView(v)` at line 534, over the
  keys `start`, `coach`, `lead`, `print`, each bound to a `<key>View` element id. Tabs at
  lines 219 to 221. It boots into `setView('coach')` at line 531.
- The coach view (`#coachView`, lines 249 to 280) already shows strengths, findings,
  learning note and notAssessed, and already has no readiness card. Readiness lives only
  in `#leadView`.
- `renderFindingList()` at line 572 renders a severity pill at lines 577 and 595.
- `bundle-reviews.js` inlines reviews into the `<script id="bundled-reviews"
  type="application/json">` block, because a `file://` page cannot `fetch()` a sibling
  JSON. Its regex and approach are the pattern to reuse.
- `check-review-v2.js <review.json> [deliverable.md]` exits 0 and prints `VALID. ...`, or
  exits 1 and prints `INVALID (n):` with an error list. The verbatim-quote check only runs
  when the deliverable argument is supplied. Verified working: `node check-review-v2.js
  eval-runs/case-01-review-v2-live.json eval-cases/case-01-vague-recommendation.md`
  prints `VALID. 5 findings, 1 comments, readiness "Needs substantial revision", 2 blocking
  issues.`
- **No view shows `fix` without the gate.** The lead view renders `diagnosis`, `evidence`
  and `why` only, deliberately, so a lead is never handed the fix to pass on as the answer.
  The coach view shows `fix` only after the attempt gate opens. Whatever the brief view
  does with `fix` is therefore a new product decision, not a rendering detail. See build
  step 1.

## Recovered work from the previous session. Read these first.

They live outside the repo, in another session's scratchpad, and they still exist:

```
C:/Users/User/AppData/Local/Temp/claude/c--Users-User-Desktop-180dc-ai/b9d2434c-bda8-41b0-b8d2-389b62ff660c/scratchpad/
  make-viewer.js               working injector, 2 KB
  real-04.review.json          deep mode, 5 findings, 28 KB
  real-04.short.review.json    short mode, 3 findings, 14 KB
  real-04-review.html          the standalone output, 150 KB
```

`make-viewer.js` already solves two of the things step 2 needs. It reuses
`bundle-reviews.js`'s `<script id="bundled-reviews">` regex to inject a review, and at
lines 41 to 43 it appends a `load(...)` call after the picker so the file boots straight
into the review instead of stopping on a file picker. Promote and generalise it. Do not
rebuild it from scratch, and do not lose the auto-load trick.

## Build, in this order

### 1. The brief view

Add a fifth view, `brief`, and boot into it instead of `coach`. It renders:

- one readiness line, level plus the one-sentence `mainReason`
- at most three findings, flat and prioritised, delivery-critical first. Per finding show
  only the verbatim quote with its slide number, and `why` it matters. **All of it visible
  at once, no card-at-a-time navigation, no textarea, no gate.**
- one control that opens the full analysis

Per finding that is two blocks, against the coach card's five blocks plus two textareas
plus a locked button. That reduction is the entire point of this view. Do not carry
`principle`, `diagnosis`, `reflect` or the navigation into it.

`fix` is deliberately excluded above, so the brief view does not become the ghostwriting
bypass. Reading it should tell you what is wrong and why it costs the client, and send you
into the coach view to work out what to do. If Manuel says otherwise, add `fix` and note
the change in the decision log, but do not make that call yourself.

Nothing else above the fold. Keep the existing `coach`, `lead` and `print` views exactly as
they are and reachable, they are the full analysis. Follow the existing `setView` pattern
rather than inventing a new mechanism.

While you are in `renderFindingList()`: suppress the severity pill (lines 577 and 595) in
the student-facing coach view only. It stays in the JSON, the validator still enforces
`severityLabel` matching `severity` at line 417, and the lead view still shows it. Replace
it in the coach view with `issueType`, which is descriptive rather than evaluative.

Known limit, write it into `03-output-contract.md` rather than fixing it: findings are
still sorted by severity, so a miscalibrated severity still shapes what a student sees,
silently. That is accepted for now.

### 2. `make-viewer.js`, promoted into the repo, with the gate built in

Start from the recovered file listed above, do not write a new one. Generalise it from
hardcoded real-04 paths to arguments, keep the injection regex and keep the auto-load.

`node make-viewer.js <review.json> <deliverable.md> [--out <file.html>]`

It must:

1. shell out to `check-review-v2.js` with both arguments and refuse to write anything if it
   exits non-zero, printing the validator's own error list
2. drop any finding whose quote does not verify, rather than passing it through
3. inject the surviving review into a standalone copy of `index.html` using the same
   `<script id="bundled-reviews">` replacement `bundle-reviews.js` uses
4. write one self-contained HTML file that opens from `file://` with no server

The gate has to be structural. A model following `RUN.md` must not be able to produce an
HTML file with an unverified quote in it, even if it ignores the instructions.

### 3. `RUN.md`

Short. Written for a competent assistant with no knowledge of this repo, running any model.
It states: what to paste in, what sanitisation is required before pasting anything real,
which command to run, what the single output file is, and what to do when the validator
rejects the review. Assume the reader has Node and nothing else.

### 4. Wire the real cases in

Make it work on the two real reviews in
`eval-runs/real-baseline/2026-07-29T16-29-44-subagent-packs/`, `real-04.review.json` and
`real-12.review.json`, against their case files in `eval-cases-real/`. Also bring the
recovered `real-04.short.review.json` into the repo alongside them, since it is the only
short-mode review that exists and it is the direct before-and-after for this work. If a
path or a field does not line up, say so plainly rather than adjusting the data to fit.

## Acceptance tests. Run these, paste the actual output, do not assert them.

1. `node check-review-v2.js` still passes on all five synthetic reviews in `eval-runs/`,
   unchanged from before your edits.
2. The brief view renders every bundled review without a console error, and shows at most
   three findings on each.
3. `make-viewer.js` on the verified pair (`eval-runs/case-01-review-v2-live.json` with
   `eval-cases/case-01-vague-recommendation.md`) writes one HTML file that opens from
   `file://` and shows the same readiness and findings as the repo `index.html` does.
4. **The gate test.** Copy a valid review, corrupt one quote so it is no longer a substring
   of the deliverable, run `make-viewer.js` on it, and confirm that no HTML file is written
   and the validator's error naming that finding is printed. This is the test that matters
   most. If it passes silently, the gate is not real.
5. The lead view still shows readiness and severity. The coach view shows neither.
6. **The before-and-after.** Render the recovered `real-04.short.review.json` in the brief
   view and in the coach view, and report the count of labeled prose blocks a reader meets
   before their first scroll in each. If brief is not markedly smaller, it has failed and
   you should say so rather than shipping it.

## Hard constraints

- Never put a real client name or identifier into any artifact.
- No AI-written or AI-suggested gold labels for real cases, ever.
- Do not touch the frozen prompt, `01-rubric-v1.md`, or the shape of
  `03-output-contract.md`. Recording the known limit from step 1 is the only doc edit in
  scope.
- Voice rules in every file you write: no Oxford commas, no em or en dashes.
- Do not invent a file path, a line number, a field name or a command. Read the file and
  confirm. If something contradicts this prompt, the repo wins, and say so out loud.
- Commit only once something runs and is better than what came before. Ask before pushing.

## Start

Tell me in five lines what you are building first and why, then build it. Do not restate
this prompt back to me.
