# Effectiveness review: v2 as a system (2026-07-03)

A critical functionality-and-effectiveness review of the v2 reviewer, written to be read
without the session that produced it. It is deliberately not congratulatory. Where v2 is
good it gets one line, the words go to the weaknesses.

Method. An independent fresh-context scorer scored the five live outputs against the gold
labels ([eval-runs/scoring-2026-07-03.md](eval-runs/scoring-2026-07-03.md)). A separate
fresh-context contrarian read the same system cold and was told to disagree with the
builders. This document synthesizes both with the orchestrator's own read, and corrects
the contrarian where its evidence does not hold up. Voice rules apply: no Oxford commas,
no em or en dashes.

State note. This review was written just after a severity-calibration fix landed on the
prompt and rubric (the case 05 fix, see below). A blind re-run of case 05 under the revised
prompt then landed Nearly ready (R3) with two minor findings and no invented criticals, and
an independent fresh-context re-score confirmed it passes harness section E, so the set is
now green. The design weaknesses described here are the durable lessons and stand
regardless of that outcome. Where the fix changes the picture it says so.

---

## 1. Does it catch the issue that matters most, and where is the noise

Verdict: yes on all five, but the layers of the JSON do not always agree on what the top
issue is, and one communication finding is pasted across every case.

- Case 01. The must-catch (the unsourced 40% growth figure) is caught, but as finding 2.
  The top finding is the unsupported option comparison (slide 8), and blockingIssues[0] is
  rule 2, not the rule 4 that the 40% figure trips. This is defensible: gold issue 1 is
  the unsupported core recommendation, and the AI's top finding maps to it, so
  prioritization is a fair 3. But the contrarian is right that a reader who trusts the
  blockingIssues order would think the sourcing gap is secondary when the gold calls the
  40% figure the single most important issue. The finding layer and the blockingIssues
  layer rank the same deck differently. That internal disagreement is a real defect even
  when the readiness lands right.
- Case 02. The must-catch (framing drift) leads the findings list, which is correct. But
  the r2 run's blockingIssues lead with rule 2 (unsupported recommendation) and list the
  gold's actual number-one, rule 3 (framing drift), second. Both fire at the same R1
  ceiling so readiness is right, but again the blockingIssues layer mis-ranks the primary
  diagnosis. A senior's one-line verdict here is "you answered the wrong question", not
  "your closure evidence is unsourced".
- Case 03. Clean. Top finding matches the must-catch, and it surfaces that the evidence
  points to mental health without making the call for the team. Best of the five.
- Case 04. Top finding is the contradiction, R0 fires, the defining issue is caught. Good.
- Case 05. Covered in section 2. The catches are real, the severity is not.

The recurring noise. Every one of the five reviews carries a "titles are topic labels or
no early governing insight" communication item. On the broken decks it is a true but
low-yield finding, the same Minto complaint five times. On case 04 the gold explicitly
lists flagging the titles or the storyline as the top issue as a false positive to avoid,
because the SCR structure there is decent. The r2 run correctly demoted it to a comment,
which is the mootness-pruning change working. But the pattern is worth watching: a
time-constrained senior reviewing a self-contradicting deck does not spend a finding slot
on slide titles, and the tool still reaches for that slot on most decks.

Net for angle 1: top-issue detection is strong. The two soft spots are the blockingIssues
layer mis-ranking the primary diagnosis on cases 01 and 02, and a standing pull toward a
title-hygiene finding that adds little on a broken deck.

---

## 2. Severity calibration across cases

Verdict: "major" is not a stable unit, and case 05 is where that instability produced a
wrong answer. This is the single most important behavioral finding in the review.

Look at what "major" buys across the set. On case 04 a "major" is "revenue will double
stated as a certainty for a client with no reserves" and "no funded path to the fixed
costs", both able-to-harm-the-client issues. On case 02 a "major" is "recommends closing
a live youth programme with no risk named". On case 05 the three "major" findings are:
the soft launch gate sits below the assumption it validates, the 5,000 pounds is never
sized against total income, and the "conservative" label leans on an attendance rate that
does not measure willingness to pay. Those case 05 findings are genuinely sharp
observations. They are not the same severity as "this plan could bankrupt the client".

Both the scorer and the contrarian, reading independently, reached the same verdict: on
case 05 the reviewer found real texture then over-escalated all of it, grading three
minors as majors and marking two delivery-critical, which mechanically dragged a
no-blocker deck from R3 to R2. The gold is not deflating. None of the three findings is a
hidden critical the gold missed. The adjudication is recorded in
[eval-cases/case-05.gold.md](eval-cases/case-05.gold.md) and
[11-decision-log.md](11-decision-log.md): over-escalation, gold stays R3, the fix is
calibration not content.

Why it happened. The prompt set readiness by "Needs targeted revision when any finding is
major, Nearly ready when only minor" but never defined major versus minor for a
non-blocking finding, and gave no floor against demoting a strong deck. So the entire
R2-versus-R3 boundary rested on an uncalibrated word, and on a deck with budget to fill
the model reached for that word. The tool was more trustworthy on broken decks than on
good ones, which is backwards: the good-deck case is exactly where a false positive most
erodes a student team's trust.

The fix applied this session. The prompt now defines critical, major and minor by whether
closing the finding changes the client's decision, defaults a no-blocker deck's findings
to minor, forbids deliveryCritical true on a no-blocker deck except for the single finding
that is itself the reason readiness is not Nearly ready, and forbids demoting below Nearly
ready without naming a specific decision-changing gap. The rubric carries the same
definition. This is a general calibration change, not a case 05 patch: on the four decks
that fired a blocking rule it is a no-op, so it cannot regress them. The blind re-run of
case 05 under the revised prompt landed R3 with two minor findings, both deliveryCritical
false, and kept the genuine materiality observation while grading it minor. An independent
re-score confirmed restraint 3 and a section E pass. So the set is now green. The fix held
without over-correcting to zero findings. One caveat carries forward: this is a single
post-fix run, and stability across repeated runs is still unmeasured (see section 3).

One more unresolved point. diagnosticMean on case 05 was 4.4 with readiness R2, while
case 04 was 2.5 with readiness R0. The rubric is right that readiness is not the mean. But
a 4.4-mean deck landing at R2 with delivery-critical findings is a signal the severity
layer and the scorecard layer are telling different stories, and no rule reconciles them.
The fix above couples them for the no-blocker case. It does not couple them in general.

---

## 3. Prompt ambiguities and reproducibility

Verdict: two of the four flagged ambiguities are real risks to trust, two are closer to
cosmetic. And the headline "run-to-run variance" evidence is weaker than it looks.

First, a correction to the contrarian read. The contrarian cited the differences between
the original case 02 and 04 runs and their r2 re-runs as direct evidence of
non-reproducibility on "the same prompt". That is not accurate. The original runs used the
pre-revision prompt and the r2 runs used the revised prompt (see
[eval-runs/README.md](eval-runs/README.md) and the decision log). The finding-count drop
(02 from 5 to 4, 04 from 5 to 3) was the deliberate mootness-pruning change, and the
confidence shift on case 02 from Low to Medium was the deliberate partial-input confidence
rule. Most of that "variance" is the intended effect of the prompt edits, not
nondeterminism. So the specific evidence does not stand. The underlying concern does: we
have exactly one run per case per prompt version, so we have measured nothing about
run-to-run stability, and single-call LLM output is known to vary. The right move is to
run every case three to five times under the frozen prompt and report the variance in
findings, confidence and blocking-rule sets, not just the mode. That is untested and it is
the biggest hole in the evidence base after construct validity.

- (a) Light-touch "L" dimension scoring has no mechanical rule. REAL risk. Case 01 scored
  Feasibility as checksPassed 0 of checksTotal 2, inventing a two-check denominator, while
  cases 02 and 03 scored the same light-touch dimension out of 4. The denominator itself
  is chosen on the fly, so diagnosticMean is not comparable across cases or reviewers, and
  the rubric's own exit test (two scorers within one point on eight of ten dimensions) is
  neither demonstrated nor mechanically achievable while L is a judgment call. This is the
  ambiguity most worth fixing, because it quietly corrupts the one number the report
  presents as objective.
- (b) Vacuous sub-checks. REAL but smaller. Case 01 says outright that the financial-figure
  check "passes only because no financial figure is present". A check that scores a pass
  for the absence of content inflates the diagnostic mean. It did not change readiness, but
  it is undefined in the prompt and it should resolve to not-applicable, not pass.
- (c) Timeline tile-state semantics. Mostly cosmetic, but undefined and internally
  inconsistent. Slide-level "critical" tiles use the same word as finding-level "critical"
  severity with no mapping between them (case 01 slide 9 is a critical tile under a major
  finding). The timeline is a decoration and the only enforced rule is that the tile count
  equals the slide count, so trust risk is low, but the vocabulary clash should be cleaned
  up before the renderer ships.
- (d) Missing-context Low versus Medium boundary. REAL. The confidence rule is a judgment
  call, and the pre and post revision runs of case 02 sat on opposite sides of it. The
  partial-input rule added this session is meant to settle it (Medium when readiness rests
  on quotable text, Low when the missing material could change the level, never High
  without evidence notes), but it is still a judgment the model applies by hand, and
  confidence is precisely what a lead uses to decide how far to trust the review. Worth a
  worked example or two in the calibration knowledge.

Net: readiness level is reproducible on these five by construction, because the cases are
unambiguous. The finding set, the confidence, the blocking-rule accounting and the
scorecard mean are not demonstrated to be reproducible at all. The builders should stop
treating "readiness matched" as the headline stability result.

---

## 4. Construct validity of the eval

Verdict: passing this eval proves the tool can process five clean, single-flaw,
insider-authored 9 to 10 slide text decks built to contain exactly one signature issue
each. It proves little about a real pilot. Passing is necessary and nowhere near
sufficient.

The holes, in the order they should worry the builders:

- The cases are tells. Each deck is engineered so one dominant flaw carries it, and the
  file names announce the flaw. Real 30-slide decks have three overlapping flaws, redundant
  slides and no single dominant issue. A reviewer tuned to find the one planted flaw has
  not been tested on triaging five competing flaws under a fixed budget, which is the
  actual pro-bono job. Case 05 is the partial exception and it is instructive: it has no
  single flaw, and it is the case the tool failed.
- Insider-written gold, n equals 5, no inter-rater check. The same team wrote the tool, the
  cases and the gold. Rubric section F demands a two-rater agreement check on the gold
  itself and it does not exist. So "the AI matched the gold" partly measures whether the AI
  absorbed the same conventions as the gold's author. With five cases and one per failure
  mode, a single miss is 20 percent of the set and there is no power to separate skill from
  luck.
- No PDF extraction noise. Every input is hand-clean markdown. The verbatim-quote rule is
  the tool's central safety mechanism, and against garbled multi-column PDF text where
  slide boundaries are lost it will start failing or forcing abstention. Untested, and the
  pilot's inputs will all look like that.
- Possible eval-awareness and overfitting. The case 01 worked review is in the Project
  calibration knowledge, so case 01 is weak evidence of generalization. And the calibration
  fix this session was driven by one case, which is exactly the single-case tuning the
  harness section G warns against. The defense is that the fix is general and was
  re-validated by a blind re-run, but the risk is real and should be named.
- One point cutting the other way. The case 05 materiality catch (5,000 pounds never sized
  against total income) is not in the gold. The tool found a real analytical angle the gold
  author did not write down. So the tool is more capable than the eval demands, which also
  means the eval is not measuring the tool's real ceiling or its real failure surface.

A skeptic's summary: this is a smoke test, not a validation. It should be labeled as one.

---

## 5. Is the four-level readiness model plus blocking rules the right instrument

Verdict: the shape is right and genuinely better than averaging, but the machinery
manufactures false precision in two spots.

The core idea is sound and is the tool's best design choice. Case 04 landing R0 on a
contradiction despite a 2.5 mean, and the principle that a clean-looking deck with an
unsupported recommendation is R1 not R3, are exactly right. Keep the ladder. The cracks:

- "Major but non-blocking" was doing undefined work. The R2-versus-R3 rule read "R2 if any
  major", but nothing separated a major residual from a minor one, and section 2 shows
  "major" was not stable. A precise-looking rule sitting on an imprecise input is the
  definition of false precision, and case 05 is the proof. The fix this session defines the
  input. It does not make the definition mechanical, it still rests on the model's judgment
  of whether the client's decision changes, so this is improved not solved.
- blockingIssues lists more than the binding constraint. On case 01 the model lists rule 2
  (R1) and rule 4 (R2), and on case 04 the earlier run listed rules 1, 2 and 4, two of them
  on overlapping evidence. Readiness is the lowest ceiling so the extra rules are
  decorative, but they add surface area for a lead to misread which single thing caps the
  deck. The prompt does not say whether to list the binding blocker or every blocker that
  could fire. This is unresolved and was deliberately left out of the case 05 fix to avoid
  regressing case 01, whose gold itself cites two rules. It is a clean next change: report
  the binding blocker as primary and any others as secondary.
- An edge case the cases never exercise: two blocking rules at different ceilings where the
  model non-deterministically fires only one. Given we have not measured run-to-run
  stability, this is not hypothetical, and it would flip readiness. None of the five decks
  has two competing dominant blockers, so it is untested.

Net: right instrument, but the readiness output is only as reproducible as the severity
word underneath it and the blocking-rule accounting around it, and neither is fully pinned
down yet.

---

## 6. The single most important fix, and is v2 fit to ship

The single most important fix before a pilot. Calibrate "major" and re-prove restraint on
the strong-deck case, then measure stability. The severity fix landed this session. It is
not done until case 05 returns R3 with at most two minor findings stably across at least
three independent runs, and until the same three-to-five-run stability check runs on all
five cases so the finding-set and confidence variance is a measured number rather than an
assumption. Over-escalation on good work is the behavior most likely to burn a student
team on day one, and it is downstream of the severity vocabulary. Everything else in this
review is secondary to that.

Fitness verdict: expert-reviewer companion, not yet a direct student-facing tool. This is
not "not yet at all". The tool genuinely catches the dominant flaw on broken decks, its
quote-or-abstain discipline is real, it does not ghostwrite and it does not bless scope
switches or judge people. Cases 03 and 04 are strong. But it over-escalates on good work,
its finding set and confidence are not demonstrated to be reproducible, and its scorecard
mean is not comparable across cases. In front of a student team those flaws teach the
wrong lessons, over-fear and over-rewriting, and the variance undermines its authority. In
front of an expert or a project lead who reads it as a first-pass triage to sanity-check,
it is useful today. Pilot it as an assistant to a human who owns severity and readiness,
before it renders directly to students.

The three biggest doubts the builders may be underweighting.

1. Stability is unmeasured and is being masked by "readiness matched". Readiness is the
   most robust output by construction because the cases are unambiguous. The finding set,
   the confidence and the blocking-rule accounting underneath it have never been run twice
   under a frozen prompt. Measure the variance before the pilot, do not assume it.
2. The tool is least trustworthy exactly where trust matters most, on good work. The case
   05 over-escalation is not a rough edge, it was the central designed test and the tool
   failed it before the fix. Confirm the fix holds under repeated blind runs, not one.
3. The eval cannot see the pilot's real inputs. Five clean, single-flaw, insider-written,
   extraction-noise-free decks with self-announcing names prove the happy path. The pilot
   will feed long, messy, multi-flaw, PDF-extracted decks with no dominant issue. The
   verbatim-quote safety mechanism, the noise budget and the find-the-one-top-fix behavior
   are all untested against that reality, and the insider gold with no inter-rater check
   means even the five passes are partly self-graded.
</content>
</invoke>
