# Run-to-run stability, 2026-07-22 (case 05 extended to five runs 2026-07-23)

The measurement [progress.md](../../progress.md) "Next actions" item 1 has been asking for
since 2026-07-03, and which [effectiveness-review-2026-07-03.md](../../effectiveness-review-2026-07-03.md)
section 6 calls the single most important pre-pilot number. Until now it was an assumption.

Seventeen runs. Five synthetic cases, one frozen prompt. Cases 01 to 04 got three runs each.
Case 05, the one case whose readiness varied, was extended to five runs on 2026-07-23 to turn
its over-escalation rate from a three-run guess into a measured five-sample frequency. That
turned out to matter: see section C point 1.

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
- **Model.** Claude Opus 4.8, all seventeen runs.
- **Files.** `case-0N-run-{a,b,c}.json`, plus `case-05-run-{d,e}.json`. Reproduce any line
  below with `node ../../check-stability.js case-0N-run-a.json case-0N-run-b.json ...`, passing
  every run file for the case.

## B. The headline numbers

| Case | Runs | Stable core | Findings count | Blocking rules stable | diagnosticMean spread | Readiness |
|---|---|---|---|---|---|---|
| 01 | 3 | 7 of 12, 58% | 4, 4, 5 | 100% (2, 4) | 0.10 | stable, R1 |
| 02 | 3 | 5 of 10, 50% | 5, 4, 3 | 100% (2, 3) | 0.30 | stable, R1 |
| 03 | 3 | 5 of 11, 45% | 4, 4, 4 | 50% (rule 3 fired in 1 of 3) | 0.40 | stable, R1 |
| 04 | 3 | 7 of 9, 78% | 4, 4, 4 | 100% (1, 4) | 0.10 | stable, R0 |
| 05 | 5 | 1 of 11, 9% | 4, 3, 3, 2, 2 | no rules fired | 0.40 | **VARIES: R2, R3, R3, R2, R2** |

Read in one line: **readiness is stable on the four cases that fire a blocking rule, and it
is not stable on the one case that does not, where the reviewer over-escalates a strong deck
more often than not.**

Stable core is the share of distinct findings, identified by evidence quote, that appear in
every run of the case. On the four blocking-rule cases it averages 58 percent. The tool that
computes it warns in its own header that quote-containment matching makes this a floor on
agreement rather than an exact measure, so the true figure is somewhat better. It is not
dramatically better: the drifting findings listed by check-stability.js are mostly genuinely
different catches, not the same catch quoted at a different span. Case 05's 9 percent is the
extreme case of this: on a strong deck with no dominant flaw the reviewer finds a nearly
different set of minor observations each run, which is itself the finding.

## C. What this changes

**1. The strong-deck over-escalation is not fixed, and it is the majority outcome.** This is
the important result and it got worse when measured properly. Case 05 is the restraint case,
gold R3, and the 2026-07-03 severity calibration fix was made precisely because a run landed
it at R2. Under the fixed prompt, across five runs, readiness came out R2, R3, R3, R2, R2:
**three of five runs over-escalate a genuinely strong deck to Needs targeted revision.** The
two R3 runs graded every finding minor. The three R2 runs each promoted one finding to major
and fell through to the escalation floor. The single post-fix run that the green claim rested
on (the committed r2 output, an R3) was not the representative outcome, it was the minority
one. Put plainly: the reviewer returns the correct readiness on this deck about two times in
five. The caveat already written into progress.md, that "case 05 green rests on a single
post-fix blind run", was the right caveat, and the number now attached to it is worse than
the three-run sample implied. Extending from three runs to five moved the reading from "over-
escalates about one run in three" to "over-escalates the majority of the time", which is why
the extra two runs were worth spending.

This does not make the 2026-07-22 scoring sheet wrong: it scored the committed output, which
is a real R3 run that exists. It means the set's green on case 05 depends on which run you
score, and on a distribution the exact-readiness-match requirement (harness section E point
1) fails for case 05 more often than it passes. That is a live pre-pilot risk, not a settled
pass. The severity test under the blocking ladder needs another pass before the freeze, or
the restraint case has to be accepted as a coin-flip and the pilot designed around it.

**2. Readiness is robust where a blocking rule fires, fragile where none does.** Every case
that fired a blocking rule returned the same readiness on every run: cases 01, 02 and 03
three of three at R1, case 04 three of three at R0. The only case that varied is the only
case with no blocking rule, where readiness falls through to the severity judgment. That is a
structural finding, not an accident: the blocking ladder is mechanical and holds, the
severity test underneath it is a judgment call and wobbles. It also means the reviewer is
most stable exactly where the stakes are most obvious and least stable on the decks a team is
most likely to be told are fine, which is the worst place for it to wobble.

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
- **Three runs on four cases, five on case 05.** The effectiveness review asked for three to
  five. Case 05 was taken to five because it was the one that varied, so its rate (three R2 in
  five) is a five-sample frequency and not a guess. The four stable cases have three runs
  each: three identical readings is strong evidence the readiness is stable there but it does
  not bound the finding-set drift tightly, and a rare fourth-run divergence is not ruled out.
  Five is still a small sample. Three of five is "the majority", not a precise probability.
- **It does not compare against the July live runs.** Those ran on an earlier session with
  the model tier unrecorded. These fifteen all ran on Opus 4.8. Comparing the two sets would
  confound run-to-run variance with a possible model change, so it is not done here. The
  stability figures above are internally consistent because all fifteen runs share one model,
  one prompt and one input per case.
- **It sets no threshold.** There is no agreed pass mark for a stable core percentage and
  this sheet does not invent one. Whether 54 percent is acceptable is a judgment for the
  project owner, and the honest framing for a board is that the verdict is stable and the
  supporting detail underneath it moves.
