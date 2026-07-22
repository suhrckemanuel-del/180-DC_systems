# Run-to-run stability, 2026-07-22

The measurement [progress.md](../../progress.md) "Next actions" item 1 has been asking for
since 2026-07-03, and which [effectiveness-review-2026-07-03.md](../../effectiveness-review-2026-07-03.md)
section 6 calls the single most important pre-pilot number. Until now it was an assumption.

Fifteen runs. Five synthetic cases, three runs each, one frozen prompt.

## A. Conditions

- **Prompt.** [04-prompt-templates.md](../../04-prompt-templates.md) section A, unchanged,
  plus the rubric and the output contract. No edits during the run.
- **Input.** One byte-identical input pack per case, built once by a script and reused
  across all three runs of that case, so nothing in the input varies between runs. The
  packs fill the section B team input template from the case metadata bullets. Every
  optional field (audience, constraints, source notes, recommendations) was left blank,
  matching the conditions of the July live runs.
- **Blindness.** Each run was a separate fresh-context instance. The case file's title and
  its "built to test" paragraph were stripped before the pack was built, so no runner could
  read the failure mode it was being tested on. Runners were instructed not to open
  eval-runs/, the gold labels, the harness, progress.md or any scoring sheet. Cases 02 to 05
  received the case-01 calibration trio, case 01 ran without it, per
  [../README.md](../README.md).
- **Model.** Claude Opus 4.8, all fifteen runs.
- **Files.** `case-0N-run-{a,b,c}.json`. Reproduce any line below with
  `node ../../check-stability.js case-0N-run-a.json case-0N-run-b.json case-0N-run-c.json`.

## B. The headline numbers

| Case | Stable core | Findings count | Blocking rules stable | diagnosticMean spread | Readiness |
|---|---|---|---|---|---|
| 01 | 7 of 12, 58% | 4, 4, 5 | 100% (2, 4) | 0.10 | stable, R1 |
| 02 | 5 of 10, 50% | 5, 4, 3 | 100% (2, 3) | 0.30 | stable, R1 |
| 03 | 5 of 11, 45% | 4, 4, 4 | 50% (rule 3 fired in 1 of 3) | 0.40 | stable, R1 |
| 04 | 7 of 9, 78% | 4, 4, 4 | 100% (1, 4) | 0.10 | stable, R0 |
| 05 | 3 of 8, 38% | 4, 3, 3 | no rules fired | 0.20 | **VARIES: R2, R3, R3** |

Read in one line: **readiness is stable on four of five cases, and roughly half the finding
set is not.**

Stable core is the share of distinct findings, identified by evidence quote, that appear in
every one of the three runs. Mean across the five cases is 54 percent. The tool that
computes it warns in its own header that quote-containment matching makes this a floor on
agreement rather than an exact measure, so the true figure is somewhat better than 54
percent. It is not dramatically better: the drifting findings listed by
check-stability.js are mostly genuinely different catches, not the same catch quoted at a
different span.

## C. What this changes

**1. The strong-deck over-escalation is not fixed. It is intermittent.** This is the
important result. Case 05 is the restraint case, gold R3, and the 2026-07-03 severity
calibration fix was made precisely because a run landed it at R2. Under the fixed prompt it
still lands R2 in one run out of three. Run a graded one finding major and reached Needs
targeted revision. Runs b and c graded everything minor and reached Nearly ready. The
single post-fix run that the green claim rested on was the majority outcome, not a settled
one. The caveat already written into progress.md, that "case 05 green rests on a single
post-fix blind run", was the right caveat and the number is now attached to it: about one
run in three over-escalates a strong deck.

**2. Readiness is robust where a blocking rule fires, fragile where none does.** Every case
that fired a blocking rule returned the same readiness three times out of three. The only
case that varied is the only case with no blocking rule, where readiness falls through to
the severity judgment. That is a structural finding, not an accident: the blocking ladder is
mechanical and holds, the severity test underneath it is a judgment call and wobbles. It
also means the reviewer is most stable exactly where the stakes are most obvious and least
stable on the decks a team is most likely to be told are fine.

**3. Case 03 shows the blocking-rule accounting is unpinned.** Rule 3 (framing drift) fired
in one run of three and rule 2 in all three, so the same deck produced one blocking issue
twice and two once. Readiness did not move, because both rules cap at the same level. The
effectiveness review already flagged that the prompt never says whether to list the binding
blocker or every applicable one. This is that defect, measured. Plan item 1.5j addresses it.

**4. The counts a team actually sees move by up to two.** Case 02 returned five findings,
then four, then three, on identical input. A team re-running the reviewer after minor edits
cannot read a change in finding count as a change in their deck.

## D. A prompt defect this run surfaced

Two of the fifteen runs set `issueType` to `analysis`, which is not one of the five values
the contract allows. Both were on case 05.

The cause is mechanical: the system prompt in 04 section A never lists the `issueType`
values. It lists the severity vocabulary, the readiness levels and the blocking rules
inline, but for `issueType` it relies entirely on the contract document being in context.
When a runner reaches for a natural label for an analytical gap, `analysis` is the obvious
guess and nothing in the prompt rules it out.

Cheap fix, and it belongs with the other pre-freeze prompt fixes in plan item 1.5i rather
than being applied silently now, because changing the prompt would invalidate these fifteen
runs. Logged in [11-decision-log.md](../../11-decision-log.md).

## E. Validator results

Thirteen of fifteen runs pass `check-review-v2.js` including the verbatim-quote check.
The two failures are both case 05:

- `case-05-run-a.json`: invalid issueType `analysis`, diagnosticMean 4.3 against a computed
  4.4, and one finding marked deliveryCritical with no blocking issue listed.
- `case-05-run-c.json`: invalid issueType `analysis`.

**These files are deliberately not corrected.** They are the measurement. An 87 percent
first-pass contract compliance rate is itself a number worth having, and case-05-run-a is
now bundled into the renderer as the demonstration that a broken review refuses to draw.

## F. What this does not establish

- **It is five short synthetic single-flaw decks.** Nothing here says anything about
  stability on a 1400-line extraction-noisy real deck. The real-case baseline is still the
  test that matters.
- **Three runs, not five.** The effectiveness review asked for three to five. Three is the
  floor. With three runs a one-in-three outcome and a one-in-five outcome look identical, so
  "about one run in three" on case 05 is a rough rate and not a measured frequency.
- **It does not compare against the July live runs.** Those ran on an earlier session with
  the model tier unrecorded. These fifteen all ran on Opus 4.8. Comparing the two sets would
  confound run-to-run variance with a possible model change, so it is not done here. The
  stability figures above are internally consistent because all fifteen runs share one model,
  one prompt and one input per case.
- **It sets no threshold.** There is no agreed pass mark for a stable core percentage and
  this sheet does not invent one. Whether 54 percent is acceptable is a judgment for the
  project owner, and the honest framing for a board is that the verdict is stable and the
  supporting detail underneath it moves.
