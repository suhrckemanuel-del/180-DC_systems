# STATUS: reviewer v2

Updated 2026-08-07. Start here. [progress.md](progress.md) is the detailed log,
[18-evidence-base.md](18-evidence-base.md) is what is actually established,
[22-trust-boundary.md](22-trust-boundary.md) is what anyone is allowed to rely on.

An AI tool that reviews a team's draft consulting deliverables, says how close to client-ready
the work is and what to fix. A lead view for project leads, a coaching view for students.

## The state, in one table

| | where it is | what that means |
|---|---|---|
| **The product** | live at https://180dc-reviewer.pages.dev | a lead can do the whole loop from a link |
| **The prompt** | `frozen-2026-08-05c`, sha `80983d7179eb950f` | implements the two axes. **Unmeasured.** |
| **The findings** | trustworthy | 0% blocking rules missed, no fabricated quote ever (A1, A2) |
| **The readiness level** | **not trustworthy** | returns R0 and R2 on identical input (A4) |
| **The scorer** | **known broken**, `mc-match-2` | 3 points better than ignoring the input (A8) |
| **The next build** | `mc-match-3`, an LLM judge | validation set already exists, 178 labelled pairs |

**One line:** the tool is live and useful, the prompt now implements the two axes that matter,
and on 2026-08-05 the measurement instrument underneath all of it was shown not to work. That
last finding is the most useful thing this project has learned. Nothing about the reviewer is
disproved by it. It means the next build is the matcher, and no prompt gets re-run until it
lands.

## When NOT to trust this tool

**Work from the findings. Do not pass on the AI's grade.** The findings carry checkable quotes
and have never missed a problem a human rated blocking; the grade has returned two different
answers on identical bytes. Never quote a recall or coverage number outside this project, and
never send a deliverable to a client on this review alone. The AI advises, a named human decides
([07-workflow.md](07-workflow.md)).

That is the summary. **The control is [22-trust-boundary.md](22-trust-boundary.md)**, and it is
where the detail now lives: who is allowed to have the tool and what has to be measurably true
before the next group gets it, what each of the four stop conditions actually trips, and the
kill switch. Two of the four are now enforced by the product rather than left for someone to
notice: nothing leaves the tab until every quote is machine-checked against the deck or the
check is waived on the record, and a readiness level cannot reach a student view, a printable or
a student pack without the view being replaced by a stop panel. The rollout was past its bar on
one count when that document was written, and section 5 says so.

## It is live

**https://180dc-reviewer.pages.dev**, deployed 2026-08-05. Redeploy steps in
[LIVE-URL.md](LIVE-URL.md). What a lead does, end to end:

1. **Opens the link** and picks a bundled review or loads their own JSON.
2. **Reads the status board**: verdict, score, effort and confidence across four tiles, the
   worst five of ten criteria in one row, and the deck timeline with callouts pinned above the
   pages they belong to.
3. **Triages every finding**: keep, turn into a question, or cut with a reason from a closed
   list of five. Keyboard throughout (`1` `2` `3` to decide, `j` `k` to move, `m` to mark the
   one it had to catch). Everything starts undecided.
4. **Pastes the deck text once**, and every quote in the review is checked as a verbatim
   substring of it. Nothing outbound unlocks until that passes or the lead waives it in writing.
5. **Sets their own readiness level.** The reviewer's answer sits beside its option labelled
   "AI guess" and is never preselected. Differing from it requires a written reason.
6. **Releases.** The note writes itself from the kept findings with quote and page attached,
   editable first. Two downloads: the note as markdown, the override record as
   `override-log-2` JSON. The student view flips to the kept set only, and the pack it travels
   in has readiness and every blocking ceiling stripped out of the payload, not just out of
   the view.

About four minutes on a five-finding deck. That is the design target being met, measured on the
synthetic cases. **It is not a saving**, because nobody has measured what this costs a lead
today, so there is no baseline to compare it against.

Two deliberate refusals. The desk does not pre-agree with the reviewer, because one that starts
fully kept and pre-set to the AI's level manufactures the agreement it exists to measure
([17-override-log.md](17-override-log.md) section 4.1). And the readiness level never reaches a
student, because A4 says it does not repeat. Since 2026-08-07 that second refusal is asserted
rather than designed in: a level string reaching a student view, a printable or a student pack
replaces the whole view with a stop panel.

## The prompt, changed 2026-08-05 and unmeasured

`frozen-2026-08-05c`, sha `80983d7179eb950f`. Both prior versions archived under
`eval-runs/prompt-archive/` and re-hash correctly, so reverting is one file copy. Full record in
[19-prompt-change-2026-08-05.md](19-prompt-change-2026-08-05.md).

Built on two axes an ex-McKinsey consultant named independently as where a consultant's return
sits, which for the first also confirmed A6 from outside the data:

- **Communication.** The rule that cut communication findings first is deleted, a reader test
  added, and readability given a slot in the priority order instead of sitting last as a QA
  artifact.
- **Interrogating numbers.** A comparator test: compared to what, so is that good, and if not
  what is it a symptom of.
- Plus a lead-with-the-point rule, so the reviewer stops burying its own conclusions.

No blocking rule, ceiling, severity definition or noise budget was touched, so any readiness
movement in a future run is noise rather than effect.

**The `b` revision, and the method worth keeping.** The prompt was handed to two blind reviewers
on a real case, who were then asked which instructions were ambiguous to *execute*. They
independently named the same four. All four are patched. This was the cheapest quality check
available and it should be routine after every prompt edit.

**Open design tension, not yet resolved.** The thesis puts ~60% of the value on communication.
The reader test is hard-capped at one finding and the comparator test at one, against a deep
budget of five, so the two new axes can occupy at most 2 of 5 slots and communication alone at
most 1 of 5. The caps exist to protect restraint and they are right. But finding count may
simply be the wrong instrument for expressing where value sits, and the rubric still carries
only one communication dimension of ten. Recorded rather than papered over.

## The measurement, and why it is the bottleneck

**Headline, 07-26 to 08-03**, both runs re-scored under `mc-match-2` so they sit on one matcher:
readiness exact **22.2% to 33.3%**, within one **55.6% to 77.8%**, over-flag **66.7% to 55.6%**,
must-catch recall **22.2% to 44.4%**, gold issue coverage **35.1% to 37.8%**. Blocking rules
missed stayed at 0%. Regression guard held. The tool used R2 for the first time ever, on
real-13, exact.

**Two of those were previously misreported.** Under the old fiction-fitted thresholds they read
must-catch 22.2% to 33.3% and coverage 21.6% to 32.4%. So the must-catch gain was *understated*,
it is twice what was claimed, and the coverage gain was *largely an artifact*: a reported +10.8
points is really +2.7. Every direction survives re-scoring. One magnitude does not.

**Then the instrument itself was measured, and it failed.** 178 gold-issue/finding pairs,
adjudicated blind by two independent agents who agreed at kappa 0.971. The matcher agreed with
them at AUC 0.718. At its best possible cut point it classifies 88% of pairs correctly, against
85% for a constant that ignores the input entirely. Thresholds were re-fitted anyway (F1 up by a
third) and precision is still 46%. Full method in
[21-scorer-refit-sprint.md](21-scorer-refit-sprint.md).

**The cause is known.** It scores vocabulary overlap; the judgement that matters is whether two
texts describe the same problem. Both adjudicators independently reported the two failure
shapes: real catches are same-complaint-different-vocabulary, false positives are
same-slides-different-problem.

## What happens next, in order

1. **Build `mc-match-3` as an LLM judge.** Everything waits on this. The sprint incidentally
   proved the approach: two LLM adjudicators agreed with each other at kappa 0.971 on exactly
   this call, against the matcher's 0.718 AUC. The validation set exists, 178 labelled pairs in
   `eval-runs/real-baseline/threshold-refit/`, so a candidate can be scored in seconds. The
   design problem is determinism: fixed prompt, low temperature, N draws with a majority vote,
   cached by pair hash so re-scoring does not re-call.
2. **Then re-run all nine cases on `frozen-2026-08-05c`**, N draws per case per A9. Not before.
   At 46% precision the numbers would move and nobody could attribute the movement.
3. **Resolve real-10 and real-11.** Both golds are internally contradictory: a critical
   must-catch issue with the blocking-rule field left as `none`. `check-gold.js` rejects both, so
   the set is 9 and not 11. A human must cite the rule that fires, lower the issue to major, or
   raise readiness. Cheapest available win.
4. **Get an ex-consultant to sanity-check its judgment**, especially the near misses where the
   matcher is conservative and a human call decides.
5. **Small pilot**, scoped once 1 and 2 have run.

Out of scope and staying that way: real-06, real-07 and real-09 have no gold.

**The ship, iterate or revert call was resolved on 2026-08-05: iterate.** The prompt was edited
on the two-axis thesis rather than on blocking rule 2, which was the option on the table before
that conversation. Rule 2 remains the binding constraint on readiness and is still the obvious
next prompt edit after the matcher lands. Revert is proven, not assumed: both archived prompts
re-hash correctly and the 07-29 run folder is untouched.

## How to reproduce a run

No API key needed. Packs exist for the 08-03 prompt
(`eval-runs/real-baseline/2026-08-02T20-40-19-subagent-packs/`) and the 07-26 baseline
(`.../2026-07-29T16-29-44-subagent-packs/`, do not overwrite, it is the comparison).

```
node run-reviews.js --emit-packs                     # packs are self-contained since 2026-08-05
# one Claude Code subagent per <case>.input.md, blind, writes <case>.review.json
node run-reviews.js --collect "<abs path to packs dir>"
node rescore.js "<abs path to packs dir>"            # only when MATCHER_VERSION has moved
node scorecard.js "<abs path to packs dir>"
```

Blindness is what makes the number honest: a reviewing agent must never see
`eval-cases-real/labeling/`, any `*.gold.md`, any worksheet, or another case's review.

`node check-docs.js` before a commit: reads the prompt version, prompt sha, matcher version,
thresholds and the override-record version out of the code, then flags any document asserting
a different value in the present tense, plus every dead link and anchor. It catches version
drift only, not stale claims of state, and it is tuned to under-flag.
