# 01. Rubric v1 and readiness logic

Sprint 2 artifact. This is the measuring instrument. It defines the ten dimensions,
how each is scored, how readiness is decided (not by averaging), and what the reviewer
must refuse to judge. Every dimension is grounded on a verified source tracked in
[10-source-register.md](10-source-register.md).

Voice rules apply. No Oxford commas. No em or en dashes.

---

## A. How scoring works

Each dimension is scored 1 to 5 through binary sub-checks, the same mechanism v1 uses,
so the future renderer stays a superset of the current one.

- Each sub-check is a yes or no, not a judgment call.
- Each dimension has a **fixed set of four enumerated sub-checks** (listed under each
  dimension in section D), so `checksTotal` is not invented per run. It starts at four and
  falls only as specific sub-checks resolve to na for the deck under review.
- A sub-check the deck gives no basis to judge resolves to **na**, never to a pass. An na
  sub-check drops out of both `checksPassed` and `checksTotal`, so a vacuous check cannot
  inflate the score. If all four sub-checks are na, the dimension `result` is na.
- `score = 1 + 4 * checksPassed / checksTotal`, rounded to one decimal.
- `result` is `pass` if all checks pass, `partial` if some pass, `fail` if none or one
  passes.
- `diagnosticMean` averages the **full-scope** dimensions only (see the scope matrix in
  section C). Light-touch dimensions are scored and shown but excluded from the mean,
  because a light dimension is judged only where it applies and its denominator is not
  comparable across cases.
- Dimension scores are **diagnostic**. They tell the team where to look. They do not
  decide readiness. Readiness is set separately in section B.

A dimension can also be **not applicable** for the artifact type under review (section
C). A not-applicable dimension is not scored and does not drag the picture down.

## B. Readiness logic (blocking issues, not an average)

Four readiness levels:

| Level | Meaning |
|---|---|
| R0 Not ready for client review | A fatal flaw. Do not send. |
| R1 Needs substantial revision | Core problems in the argument or the recommendation. |
| R2 Needs targeted revision | Sound overall, one or more specific gaps to close. |
| R3 Nearly ready with minor edits | No blocking issue. Only polish remains. |

Readiness is the **lower** of two things: the ceiling set by any blocking issue, and
the level implied by the residual major issues. It is never the mean of the ten scores.

**Blocking rules (each sets a ceiling):**

1. An internal contradiction that the recommendation walks into, or a core
   recommendation that could mislead the client into a wrong decision. Ceiling: **R0**.
2. The client decision is unclear, or the deliverable does not answer the client's
   actual question, or the core recommendation is unsupported by the evidence. Ceiling:
   **R1**.
3. The deliverable answers the wrong problem, or the problem framing drifts (a
   different problem by the recommendation than at the start). Framing failure caps
   readiness even when the rest of the deck is polished. Ceiling: **R1**.
4. A headline number that the recommendation depends on is ungrounded (no source, no
   baseline, no method, or a literal placeholder). This fires only when the number
   actually drives the decision. A stray unsourced stat that does not change what the
   client should do stays a normal finding, not a blocker. Ceiling: **R2**.
5. A confidentiality or safety breach inside the deliverable itself (for example a
   named individual judged, or private data exposed). Ceiling: **R1**, and it is raised
   as a delivery-critical issue regardless of everything else.

**Residual level (only if no blocking rule fires).** Decided by one question, not by
counting majors. Default is **R3**. Demote to **R2** only when a single specific gap
changes the client's decision (what the client would actually do differs with the fix and
without it) and that decision is named in one sentence. When genuinely unsure between R2
and R3 with no blocker, choose R3. See the 2026-07-23 redesign note below.

**Severity, and the R2 to R3 boundary.** A finding is **major** only when the team must
close it before client submission because closing it changes the recommendation or its
defensibility. A finding is **minor** when the deck is already sound and the fix only
strengthens it (a line to add, a caveat, context for a figure). Readiness on a no-blocker
deck does NOT follow from the major or minor count: a no-blocker deck can carry one major
finding and still be R3, if closing that finding would not change what the client decides.
Manufacturing majors on a strong deck to justify R2 is a calibration failure, and it is
scored against restraint.

**Redesign note, 2026-07-23.** The residual level used to read "one or more major but
non-blocking issues to R2." Run-to-run stability measurement showed that rule made a
strong deck (eval case 05, gold R3) land R2 in three of five runs, because the model would
promote one finding to major on a defensibility argument and the count rule then forced R2.
The two loopholes were "changes the recommendation or its defensibility" (almost anything
touches defensibility) and "any one major forces R2" (a knife-edge that flips run to run).
The redesign decouples no-blocker readiness from the major count entirely and routes it
through a single decision-change test with a deterministic default of R3. Rationale: the
blocking rules already cap any deck whose core is unclear, unsupported, misframed or unsafe,
so a deck that fires none of them is sound by construction and its residual findings are
refinement. This errs toward R3 (under-escalation), which the effectiveness review calls the
safer error, with the project lead as the backstop. The real-case baseline is where
under-escalation on a genuinely R2 no-blocker deck would show up, and that is the test this
trades for stability. See [11-decision-log.md](11-decision-log.md).

The reviewer states, in one sentence, the single reason readiness sits where it does,
and names what missing context could change it. A deck with clean tone, clear slides
and good sourcing but an unsupported core recommendation lands at R1, not R3. That is
the whole point of the model.

## C. Artifact-type scope matrix

The reviewer is told what artifact it is reviewing and does not penalize an artifact
for lacking something it should not yet have. F = scored in full and averaged into
`diagnosticMean`. L = light touch, scored and shown where it genuinely applies but
excluded from `diagnosticMean`. Dash = not applicable (scope na), do not penalize and
do not score. These map to the `scope` field on each dimension: F is `full`, L is
`light`, dash is `na`.

| Dimension | Kickoff problem frame | Research plan | Interview guide | Synthesis memo | Draft deck | Final rec deck | Implementation roadmap |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 1 Client decision usefulness | L | L | L | F | F | F | F |
| 2 Problem framing | F | F | F | L | F | F | L |
| 3 Storyline and pyramid logic | L | L | - | F | F | F | F |
| 4 Evidence quality | - | F | F | F | F | F | L |
| 5 Analysis and insight | L | - | - | F | F | F | L |
| 6 Recommendation specificity | - | - | - | L | F | F | F |
| 7 Feasibility and implementation | - | L | - | L | L | F | F |
| 8 Risks, assumptions and uncertainty | F | F | F | F | F | F | F |
| 9 Slide-level communication | L | L | - | L | F | F | F |
| 10 Professionalism, tone and confidentiality | F | F | F | F | F | F | F |

Dimension 8 (assumptions and uncertainty) and dimension 10 (professionalism and
confidentiality) are always in scope. An early problem frame is judged on how it frames
the problem and its assumptions, not on a missing implementation plan.

---

## D. The ten dimensions

Each dimension below gives: definition, why it matters, the 1 or 3 or 5 anchors, the
binary sub-checks, common failure patterns, example feedback language (good and bad),
red flags, and what the reviewer must abstain from judging. Grounding source in
brackets links to the source register.

### Dimension 1. Client decision usefulness [ERIP Performance, CMCE]

**Definition.** Whether the deliverable helps the client make and act on the decision
they actually face.

**Why it matters.** A pro-bono client's realistic alternative is no advice at all. A
deliverable that does not move a decision has failed regardless of how good it looks.

**Anchors.**
- 1: The reader finishes the deck unsure what decision it supports or what to do next.
- 3: A decision is implied but the reader must assemble it from scattered slides.
- 5: The decision, the recommended answer and the first action are stated plainly and
  early, and a busy client could act on them.

**Sub-checks.**
1. The deliverable names the decision the client faces.
2. It gives a clear answer to that decision.
3. The reader can tell what to do next.
4. The answer is framed for the client who must act, not for a general audience.

**Common failures.** A research report with no decision. Answering a more interesting
question than the one the client asked. Burying the answer on slide 40.

**Good feedback.** "The client asked whether to enter the catering channel. The deck
compares channels well but never states the entry decision. Name the decision and your
answer to it in the opening." **Bad feedback.** "Make it more actionable." (Generic, no
location, no principle.)

**Red flags.** No verb of decision anywhere ("should", "recommend", "do"). Executive
summary that summarizes topics not answers.

**Abstain from.** Whether the client will accept the recommendation. Client politics.
Whether the decision is the right one commercially if that needs facts not in the
deliverable.

### Dimension 2. Problem framing [Failure taxonomy B, Shi and Omachonu gaps]

**Definition.** Whether the problem, scope, success criteria, stakeholders and
constraints are stated and stable.

**Why it matters.** The most common student failure is solving the stated problem
without checking it is the real one, or drifting between problems across the deck.

**Anchors.**
- 1: No problem statement, or the deck addresses a different problem by the end than at
  the start.
- 3: A problem statement exists but scope or success criteria are vague.
- 5: A specific problem, a bounded scope, explicit success criteria and named
  stakeholders and constraints, held consistently throughout.

**Sub-checks.**
1. The problem statement is specific, not a topic.
2. Scope (what is in and out) is stated.
3. Success criteria are defined.
4. The deck addresses one problem consistently, without drift.

**Common failures.** Accepting the client's stated problem uncritically. Scope so broad
nothing decisive is produced. No definition of what success would look like.

**Good feedback.** "Slide 2 frames the problem as growth strategy. Slide 18 pivots to a
cost problem. Decide which question the client needs answered and hold it." **Bad
feedback.** "The problem could be clearer."

**Red flags.** The word "strategy" with no bounded question. Different framings on the
title slide and the recommendation slide.

**Abstain from.** Whether the client's stated problem is the correct strategic priority
for their organization. That is a human judgment call.

### Dimension 3. Storyline and pyramid logic [Minto, SCR]

**Definition.** Whether the deck has a governing insight and a coherent argument that
flows problem to evidence to insight to recommendation.

**Why it matters.** A partner reading only the titles in order should be able to
reconstruct the whole argument. When they cannot, the chain is broken.

**Anchors.**
- 1: Titles are topic labels. There is no single answer readable from the top.
- 3: A governing insight exists but appears late, or some sections do not support it.
- 5: One defensible governing sentence appears early and every section demonstrably
  supports it. The titles alone tell the story.

**Sub-checks.**
1. A single governing insight appears in the first few slides.
2. Reading the titles in order reconstructs the argument.
3. Each section supports the governing insight rather than sitting beside it.
4. The path from problem to evidence to insight to recommendation is unbroken.

**Common failures.** A list of findings with no so-what. Sections that are topics, not
arguments. The answer assembled only in the reader's head.

**Good feedback.** "Slides 4 to 9 read as separate findings. State the one insight they
add up to, then let each defend it." **Bad feedback.** "Improve the flow."

**Red flags.** Titles like "Market overview" or "Analysis". A recommendation that does
not follow from the preceding evidence.

**Abstain from.** Visual design and layout beyond what the text supports. Confidence
should be set to Medium when only extracted text is available.

### Dimension 4. Evidence quality [ERIP Performance, quote or abstain]

**Definition.** Whether claims are supported, sourced, relevant and honest about their
limits.

**Why it matters.** One wrong or unsourced number destroys client trust in the whole
deck. Evidence is where a student report is most often thin.

**Anchors.**
- 1: Major claims and headline numbers have no source. Primary and secondary evidence
  are indistinguishable.
- 3: Most claims are sourced but some headline figures are not, or limitations are
  missing.
- 5: Every major claim and every financial figure traces to a named source, primary is
  distinguished from secondary, and limitations are stated.

**Sub-checks.**
1. Every major factual claim has a named source.
2. Every financial figure traces to a named source.
3. Primary research is distinguished from secondary.
4. Limitations of the evidence are stated where they matter.

**Common failures.** Confident percentages with no citation. Treating one interview as
the market. Google-depth secondary research presented as primary insight.

**Good feedback.** "The 30% growth figure on slide 11 has no source. Cite it or mark it
as an assumption. An unsourced headline number reads as invented." **Bad feedback.**
"Add more sources." (Which claim, and why does it matter.)

**Red flags.** Placeholders (x, TBD, template text). "Studies show" with no study.

**Abstain from.** Whether an external source is factually true when the source is not
provided in the material. The reviewer flags that a source is missing, it does not
adjudicate facts it cannot see.

### Dimension 5. Analysis and insight [Failure taxonomy C, jagged frontier]

**Definition.** Whether the deliverable interprets its evidence and draws implications,
rather than only describing what is known.

**Why it matters.** The signature weakness of student consulting is description dressed
as analysis. The client can find facts. They are paying for the so-what.

**Anchors.**
- 1: The deck describes facts and stops. No implications, no comparison.
- 3: Some interpretation, but findings and the recommendation are only loosely
  connected.
- 5: Evidence is interpreted into clear implications, alternatives are compared where
  relevant, and each finding visibly feeds the recommendation.

**Sub-checks.**
1. Findings are interpreted, not just reported.
2. Each major finding states its implication.
3. Alternatives are compared where the decision needs it.
4. Findings connect explicitly to the recommendation.

**Common failures.** A wall of market facts with no "therefore". Segmentation missing
where it would change the answer. Analysis that never reaches the decision.

**Good feedback.** "Slide 14 lists competitor prices. Add the implication: what does
this pricing mean for the client's entry position." **Bad feedback.** "Go deeper."

**Red flags.** No "therefore", "which means", "so" anywhere in the findings section.

**Abstain from.** Proposing new analysis the team did not do as if it were required
truth. The reviewer names the missing analytical question, it does not invent the
answer.

### Dimension 6. Recommendation specificity [Actionability]

**Definition.** Whether each recommendation names a specific action, an owner, a
timeframe and a measurable outcome.

**Why it matters.** "Improve marketing" cannot be acted on. A recommendation without an
owner and a success signal is a wish, not advice.

**Anchors.**
- 1: Recommendations are vague directions ("grow the brand", "be more efficient").
- 3: Actions are specific but owner, timing or success measure is missing.
- 5: Each recommendation names the action, the owner or clear implied owner, a
  timeframe or trigger, and a measurable outcome.

**Sub-checks.**
1. Each recommendation names a specific action.
2. Each names or clearly implies an owner.
3. Each gives a timeframe or a trigger.
4. Each gives a measurable outcome or success signal.

**Common failures.** A menu of options with no priority. Verbs like "improve",
"enhance", "optimize" with no object. No sense of who does it or by when.

**Good feedback.** "Recommendation 2 says to expand distribution. Name which channel
first, who owns it and the metric that says it worked." **Bad feedback.** "Be more
specific."

**Red flags.** Bulleted abstractions. A ranking of options presented without a decision.

**Abstain from.** Committing the client to resources or budgets the deliverable does not
establish. The reviewer flags the gap, it does not fill in numbers.

### Dimension 7. Feasibility and implementation [ERIP Involvement, pro-bono translation]

**Definition.** Whether recommendations fit this client's real constraints and say how
to execute, with sequence, dependencies, risks and a pilot path where relevant.

**Why it matters.** Corporate-grade recommendations dropped on a resource-constrained
non-profit do not get implemented. Feasibility is where pro-bono advice most often
fails.

**Anchors.**
- 1: Recommendations ignore the client's size, capital or capacity.
- 3: Feasible in principle but no sequence, dependencies or first step.
- 5: Recommendations fit the client's constraints, say how to execute, sequence the
  steps, name dependencies and risks and offer a minimum viable pilot where sensible.

**Sub-checks.**
1. Recommendations fit the client's stated constraints (size, stage, capital,
   timeline).
2. The deliverable says how to execute, not only what.
3. Steps are sequenced with dependencies named.
4. A first concrete step or a pilot is identified.

**Common failures.** A five-year transformation for a ten-person non-profit. No
sequencing. No acknowledgement of what the client can actually resource.

**Good feedback.** "The three initiatives assume a dedicated team the client does not
have. Sequence them and name a pilot the current staff could run in one quarter."
**Bad feedback.** "Consider feasibility."

**Red flags.** No mention of cost, capacity or time to implement. Everything framed as
equally urgent.

**Abstain from.** Judging feasibility against constraints that are not stated in the
material or the input. Lower confidence and ask instead.

### Dimension 8. Risks, assumptions and uncertainty [ERIP, evidence grounding]

**Definition.** Whether key assumptions are marked, risks and tradeoffs acknowledged
and uncertainty stated honestly.

**Why it matters.** A deck that hides its assumptions looks confident and is fragile.
Naming assumptions is what lets a client stress-test the advice.

**Anchors.**
- 1: No assumptions marked, no risks, false certainty throughout.
- 3: Some risks noted but key assumptions behind the recommendation are unstated.
- 5: The load-bearing assumptions are explicit, risks and tradeoffs are named and
  uncertainty is stated where it is real.

**Sub-checks.**
1. Load-bearing assumptions are stated as assumptions.
2. Key risks of the recommendation are named.
3. Tradeoffs between options are acknowledged.
4. Uncertainty is expressed honestly, not hidden.

**Common failures.** Point forecasts with no range. A single recommended path with no
downside named. Assumptions smuggled in as facts.

**Good feedback.** "The plan assumes the grant renews. Mark that as an assumption and
say what happens if it does not." **Bad feedback.** "Address risks."

**Red flags.** Absolute language throughout. No "if", "assuming", "risk" anywhere.

**Abstain from.** Estimating probabilities of risks the material does not support.

### Dimension 9. Slide-level communication [Minto action titles]

**Definition.** Whether individual slides communicate: action titles, one message per
slide, and support that matches the title.

**Why it matters.** Action titles are the unit of the pyramid. A slide whose title is a
topic forces the reader to do the work the consultant should have done.

**Anchors.**
- 1: Titles are labels. Slides carry several messages or none.
- 3: Most titles are sentences but some are topics, or some slides are overloaded.
- 5: Titles are complete-sentence assertions, each slide makes one point, and the
  content on the slide supports its title.

**Sub-checks.**
1. Most content-slide titles are complete-sentence assertions.
2. No content title is a bare topic label.
3. Each slide carries one clear message.
4. The content on a slide supports its title.

**Common failures.** "Overview", "Findings", "Next steps" as titles. Slides doing three
jobs. A chart whose title does not match what the chart shows.

**Good feedback.** "Slide 7 is titled Market Size. State the takeaway instead: what
about the market size matters for the decision." **Bad feedback.** "Fix the titles."

**Red flags.** Noun-phrase titles. Slides with more than one takeaway.

**Abstain from.** Visual design, color, font and layout. This dimension judges the
message, not the aesthetics, and only what the text supports.

### Dimension 10. Professionalism, tone and confidentiality [safety and GDPR posture]

**Definition.** Whether the deliverable is professional in tone and free of
confidentiality or safety problems, including any judgment of named individuals.

**Why it matters.** A single confidentiality slip or a careless line about a named
person can end a client relationship and expose the branch. This dimension is always in
scope.

**Anchors.**
- 1: Confidential data exposed, or a named individual judged, or tone unfit for a
  client.
- 3: Professional overall but with lapses (an unverified aside, an informal section).
- 5: Consistently professional, no confidentiality or safety issue, individuals treated
  by role not by judgment.

**Sub-checks.**
1. No confidential or personal data is exposed inappropriately.
2. No named individual is evaluated on competence or motivation.
3. Tone is fit for a client audience throughout.
4. Claims are stated with appropriate, not false, certainty.

**Common failures.** A slide naming a staff member as the problem. Pasting raw
interview quotes with names. An internal joke left in.

**Good feedback.** "Slide 22 names an employee as underperforming. Reframe to the role
or the process. The deliverable should never judge a named person." **Bad feedback.**
"Watch the tone."

**Red flags.** Real names next to judgments. Salary or health data. Anything that would
embarrass the client if leaked.

**Abstain from.** This dimension is where the reviewer is strictest and least willing to
guess. If unsure whether something is confidential, it flags it for human review rather
than deciding.

---

## E. What this rubric does not do

- It does not average into readiness. See section B.
- It does not judge visual design, only the message the text supports.
- It does not verify external facts it cannot see. It flags missing sources.
- It does not evaluate people. Dimension 10 forbids it.
- It does not fill gaps with invented content. It names the gap and asks.

## F. Calibration note

The exit test for this rubric: two people scoring the same synthetic case should land
on the same readiness level and within one point on at least eight of the ten
dimensions. If they do not, the anchors or the sub-checks are ambiguous and get
tightened before the rubric is used in a prompt. The synthetic cases are built in
Sprint 4 in [eval-cases/](eval-cases/).
