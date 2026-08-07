# 13. Usage guide: your first run

Adoption artifact. The page a project team reads cold, ten minutes before the first
review. It builds out the adoption design in [07-workflow.md](07-workflow.md) section D
into something a first-time consultant can follow without reading the rest of the folder.
If you read one file before running the tool, read this one, then skim
[07-workflow.md](07-workflow.md).

Voice rules apply. No Oxford commas. No em or en dashes.

---

## A. What this is, in four lines

1. It is a senior reviewer that reads your draft and tells you the three to five things
   most likely to weaken the client's decision, each pinned to a quote from your own text.
2. It is a coach: every finding comes with the principle behind it and a question you
   answer before the fix opens up.
3. It is not an approver. It never says a deliverable is ready to send. Your project lead
   does that, and owns it.
4. It is not a writer. It will not draft your slides, your titles or your recommendation,
   and it refuses if you ask.

One more line worth having in your head: the tool is designed and tested, not piloted.
Read section G before you treat any output as authoritative.

---

## B. The 10-minute first run

### B1. Where the prompt lives

The system prompt is the code block in [04-prompt-templates.md](04-prompt-templates.md)
section A. There is no app, no command and no login. The MVP runs as a Claude Project:
someone in the branch pastes that block once as the Project instructions, and adds the
calibration knowledge listed in section E of the same file (the worked case
[eval-cases/case-01.review.json](eval-cases/case-01.review.json) with its source deck and
gold label). After that, running a review is one paste into a chat inside that Project.

Do not add your live deliverable to the Project knowledge. It goes in the message, not in
the Project.

### B2. What you paste

Copy the team input template from [04-prompt-templates.md](04-prompt-templates.md) section
B and fill it in. The fields, and what a real answer looks like:

| Field | What to put |
|---|---|
| MODE | short, deep or lead. See B4. |
| CLIENT TYPE (anonymized) | the type, not the name: "small environmental non-profit, call it Client A" |
| ARTIFACT TYPE | pick one from the list: kickoff problem frame, research plan, interview guide, synthesis memo, draft deck, final recommendation deck, implementation roadmap |
| CLIENT QUESTION | the one decision the client needs help with, in one sentence |
| INTENDED AUDIENCE | who reads it, for example the client's board or the executive director |
| PROJECT STAGE | early, mid or final |
| DRAFT MATURITY | rough, working draft or near final |
| SPECIFIC FEEDBACK REQUESTED | what you most want checked |
| KNOWN CONSTRAINTS | budget, staff, timeline, capacity that any recommendation has to fit |
| WHAT THE TEAM IS UNSURE ABOUT | your own open questions, stated honestly |
| EVIDENCE AND SOURCE NOTES | where your key numbers and claims come from |
| RECOMMENDATIONS (if any) | your current recommendation in one or two lines |
| IMPLEMENTATION PLAN (if any) | your current plan in one or two lines |
| DELIVERABLE TEXT | one block per slide or section, numbered |

Two fields carry more weight than the rest. CLIENT QUESTION is the one the whole review
hangs off, and a blank one triggers the missing-context behavior: the reviewer asks you up
to three questions and drops its confidence to Low instead of guessing. EVIDENCE AND
SOURCE NOTES is what stops a sourced number being flagged as unsourced, and leaving it
blank means the review can never report High confidence.

Number your slides or sections. The reviewer quotes by location, so unnumbered text makes
every finding harder to act on.

### B3. What "sanitized" means, concretely

This is not optional and it is not a formality. Per [07-workflow.md](07-workflow.md)
section E, before anything goes in the box:

- Replace the client name everywhere with a label. Client A. Do the same for
  stakeholders, by role: Stakeholder B, the finance lead, the programme coordinator.
- Strip logos, headers and footers that identify the client. If you are pasting extracted
  text, delete the repeated footer line before you paste.
- Round or band any figure that would identify the client, and say it is banded. "Annual
  income in the 100k to 250k band" rather than the exact number.
- Never paste an interview transcript with names in it, personal member information,
  contracts, unpublished financials or confidential board discussion.
- If a slide cannot be sanitized without losing the point, do not paste it. Describe it
  instead, in your own words, and say that is what you did.

And the hard gate: while the tool is in testing, only synthetic or anonymized material
goes in at all. No real client material until a project lead has agreed the sanitization
protocol and the sign-off gate for that project.

### B4. What mode to pick

| Mode | Who runs it | When | What you get |
|---|---|---|---|
| short | the team | between working sessions, a fast self-check | at most 3 fixes, delivery-critical only, no comments, no lead questions |
| deep | the team | before the draft goes to the project lead | at most 5 fixes, up to 8 comments total, up to 5 lead questions, the full coaching shape |
| lead | the project lead | reviewing before client delivery | readiness, blocking issues, delivery-critical findings and the questions to ask the team, coaching hidden |

For a first run, use deep on a draft deck. That is the point in the cycle where the value
is most obvious, which is why [07-workflow.md](07-workflow.md) section D says to introduce
the tool there first rather than at the kickoff stage.

Lead mode does not run a different analysis. It is the same deep review, filtered to what
a project lead needs.

### B5. What you do while it runs

Before you read a word of the output, each person on the team writes down their own answer
to one question: what is the single biggest weakness in this draft. Keep it. You will use
it in section D to decide whether the tool is telling you something or flattering you.

That is the whole first run. Two minutes to fill the template, two minutes to sanitize, a
short wait, then the read. The acting on it takes longer. The reading should not.

---

## C. What you get back

The tool returns one JSON object. Everything else is a view of that object, specified in
[03-output-contract.md](03-output-contract.md). Today there is a validator for it
(`check-review-v2.js`) and no v2 renderer, so what you actually see in the first run is the
JSON itself or a report read off it by hand. That is a real limitation, not a detail.

The blocks, in the order they matter:

**readiness.** One of four levels: Not ready for client review, Needs substantial revision,
Needs targeted revision, Nearly ready with minor edits. Plus one sentence on why it sits
there, the highest-risk issue, a confidence level and what missing context could move it.
Read by the project lead. It is not an average of the scores: it is set by whether a
blocking issue fired, so a deck with clean slides and an unsupported core recommendation
lands low on purpose. Per the two-view decision, readiness is a lead-mode output. A student
team acting on a deep review should be working the fixes, not arguing with a verdict.

**blockingIssues.** The specific rules that capped readiness, each with a verbatim quote.
Read by the lead. This is the "what exactly is stopping this from going out" list. It can
be empty, and empty is a good sign.

**findings (the priority fixes).** At most 3 in short mode, 5 in deep. Each has the issue
as a sentence, the severity, whether it is delivery-critical, the principle it violates, a
diagnosis referencing slide numbers, at least one verbatim quote, why the client loses
something, a reflect question and a directional fix. Read by the team. This is the block
you actually work from. The reflect question is a gate: answer it before you look at the
fix, because the point is that you make the call, not the tool.

**comments (evidence-linked).** Lighter than findings, at most 8 across findings and
comments combined, each with a location, the problem, why it matters and a direction. Read
by the team. These are worth doing and are not worth holding delivery for.

**strengths.** What the draft genuinely does well, quoted. Read by the team. Expected on
any review above Not ready. They exist so the review is usable, not to soften a blocker.

**questionsForLead.** At most 5. Things the text cannot settle, handed to a human instead
of asserted as findings. Read by the lead, and worth reading by the team so you know what
your lead is about to ask.

**learningNote.** One reusable lesson, the weak habit it reveals and one practice exercise.
Read by the team after the deadline, and by the training team across projects. It is
deliberately separate from the delivery list so coaching does not compete with delivery
risk.

**notAssessed.** Always present, never empty. The explicit list of what this review did not
judge. Read by everyone, and by the lead most carefully: it is the map of where human
judgment is still required.

**scorecard.** Ten dimension results plus a diagnosticMean. Diagnostic only. It tells you
where to look. It never sets readiness, and per the effectiveness review the mean is not
reliably comparable between two different reviews, so do not track it as a score.

### The two views

One engine, two audiences. The **student coaching view** shows strengths, the findings in
coaching shape with the reflect-and-fix gate, the comments and the learning note. The
**lead view** shows readiness, the blocking issues, the delivery-critical findings and the
questions for the lead, with the coaching gate hidden so a lead is never handed the fix to
pass on as an answer. Readiness lives in the lead view.

---

## D. A good first experience versus a bad one

**Good looks like this.** You open it and there are three or four items, not thirty. Each
one quotes your own text back at you, so you can find it in ten seconds. At least one of
them is the thing somebody on the team already suspected and nobody had said out loud.
None of them is "make it more actionable". You disagree with one, you can say why in one
sentence, and that sentence is now a real conversation with your lead. You spend forty
minutes fixing things and the draft is better. Total reading time: under five minutes.

**Bad looks like this**, and each failure mode already has a designed defense. When the
defense fails anyway, the tool is telling you something about itself.

**Too many comments.** Twenty items and you act on none.
*Designed defense:* the noise budget is a hard product rule, not a style note. 3 fixes in
short mode, 5 in deep, 8 comments total, 5 lead questions, enforced during synthesis and
checked by the validator.
*If it happens anyway:* the review is out of contract. Do not try to action all of it. Work
the top three, and flag the run so the prompt can be fixed. A review that busts the budget
is a stop condition in [08-red-team.md](08-red-team.md), not a bonus.

**Generic feedback.** "Improve the flow." "Add more sources."
*Designed defense:* quote or abstain. Every finding must carry a verbatim quote with its
location or it is dropped, and generic advice usually has nothing to quote.
*If it happens anyway:* ignore it and say so. A finding with no location and no principle
has not earned your time. More than one unquoted finding in a review is a stop condition.

**Hallucinated quotes.** The review quotes a line that is not in your deck, or cites a
source you never gave it.
*Designed defense:* quote or abstain again, plus the validator checks every quote is a
verbatim substring of the pasted text (whitespace-normalized, so line wraps are fine).
*If it happens anyway:* stop using that review. An invented source or fact is an automatic
fail and one of the three cross-cutting stop conditions. Report it. Do not quietly work
around it.

**A verdict you disagree with.** The readiness reads Needs substantial revision and the
team thinks that is wrong.
*Designed defense:* readiness is a strong signal, never a veto. The review must state the
one reason for the level and what would change it, and the lead can overrule any finding.
*If it happens anyway:* that is not a malfunction, it is the workflow. Write down your
disagreement with the reason, take it to your lead, and the lead's call is the accountable
decision. A contested or high-stakes call escalates to a board reviewer. Expect some
disagreement: the design anticipates it and the calibration loop feeds repeated expert
disagreement back into the prompt.

**It refuses to write your slide text.** You ask for a better title and get a direction
instead.
*Designed defense:* this is the no-ghostwriting rule and it is working as intended. The fix
field is the directional move plus the principle, never pasteable text, and the printable
hides the gated fixes so it cannot become a script.
*If it happens anyway:* it is not a bug. If you find yourself trying to extract slide text,
that is the signal the coaching gate is built for. Answer the reflect question and write it
yourself. If a fix ever does come back as finished pasteable slide text, that is the
failure, and it is a stop condition too.

**An early artifact judged for what it should not yet have.** Your kickoff problem frame
gets marked down for having no implementation plan.
*Designed defense:* the artifact-type scope matrix in [01-rubric-v1.md](01-rubric-v1.md)
section C. Dimensions out of scope for your artifact type are marked not applicable and are
excluded from the diagnostic mean. Only assumptions and professionalism are always in
scope.
*If it happens anyway:* check your own input first. Nine times in ten the ARTIFACT TYPE
field was blank or wrong, and the reviewer defaulted to judging a deck. Fix the field and
re-run. If it still happens with the field correct, the finding is invalid and should be
discarded.

One more, the quietest failure: **over-escalation on good work.** A strong draft comes back
graded harsher than it deserves. This was a real, measured miss on the one strong case in
the synthetic set, and it was fixed by defining severity against whether closing the
finding changes the client's decision. It is still the failure the builders watch most
closely, because a false alarm on good work is the fastest way to lose a team's trust. If
your draft is genuinely strong and the review reads harsh, say so out loud rather than
rewriting on reflex.

---

## E. The rules that are not negotiable

1. **No real client identifiers go in.** No names, no logos, no private data, no named
   transcripts, no unpublished financials. Sanitize first, per B3. A leak here is the kind
   of thing that ends a client relationship, and it pulls the tool from use until scrubbed.
2. **A named human signs off.** No deliverable goes to a client on the AI review alone. The
   lead reads the readiness, the blocking issues and the lead questions, forms their own
   view, then signs off, sends it back or escalates. A line in the project log is enough
   of a record.
3. **The AI never approves.** It has no authority to certify anything as ready. It advises.
   A readiness of Not ready is a strong signal, not a veto, and the lead can still send
   with a documented reason.
4. **No ghostwriting.** The team does its own rewrites. The tool gives directions and
   principles. Do not try to route around the coaching gate.
5. **The tool does not judge people.** It never comments on a named individual's competence
   or motivation, and neither should the deliverable. If a review ever does, that is an
   automatic fail.

---

## F. Troubleshooting

| Symptom | Likely cause | What to do |
|---|---|---|
| The reviewer asks you three questions instead of reviewing | a required input was blank, usually CLIENT QUESTION or ARTIFACT TYPE | answer them and re-run. It is designed to ask rather than guess |
| Confidence comes back Low | the missing material could change the readiness level | fill in EVIDENCE AND SOURCE NOTES and the client question, then re-run |
| Confidence never reaches High | evidence notes are missing | that is the rule, not a fault. High is unavailable without source notes |
| The output is not valid JSON, or a field is missing | a truncated or fenced model reply | re-run. Run `node check-review-v2.js <review.json> [deliverable.md]` to see the exact error list |
| A quote does not appear in your deck | quote or abstain failed | discard the review, report it. This is a stop condition, not a rounding error |
| More findings than the mode allows | the noise budget was busted | work the top three, flag the run |
| Findings are all about slide titles | the standing pull toward title hygiene, a known weakness on broken decks | ask yourself whether a time-constrained senior would spend a slot there. If not, discount it |
| Scores look inconsistent between two reviews | the diagnostic mean is not reliably comparable across reviews | do not compare means. Use the findings and the readiness |
| The review reads harsh on a strong draft | the over-escalation failure mode | check whether any finding actually changes what the client should do. If none does, say so to your lead |
| Slide numbers in findings do not match your deck | the deliverable text was pasted without numbered blocks | re-paste one block per slide with numbers |
| Extracted PDF text is garbled and quotes look broken | extraction noise, untested territory for this tool | clean the text before pasting, or paste a section at a time |

---

## G. What this guide cannot promise yet

Read this section before you tell anyone the tool works.

**Updated 2026-08-07.** Several of these limits have moved since this guide was written and
two have got sharper. The list below is current.

- **It has not been piloted.** Unchanged. No real project has used it end to end. Everything
  in this guide is a designed workflow, not an observed one. The first team to run it is
  doing a pilot whether or not it is called one.
- **It has run on real deliverables, twice.** Nine anonymised past decks with human gold
  labels, blind, on 2026-07-26 and 2026-08-03. The tool's behaviour on a long, messy,
  multi-flaw real deck is no longer unknown. The synthetic five are no longer the evidence
  base.
- **Do not quote a percentage from this project to anyone.** Not recall, not coverage, not
  must-catch. On 2026-08-05 the scoring instrument behind all of those numbers was measured
  against 178 human-adjudicated pairs: at its best possible cut point it is three percentage
  points better than a constant that ignores the input, and 46% of what it calls a catch is
  not one ([21-scorer-refit-sprint.md](21-scorer-refit-sprint.md)). The findings are not
  disproved by this. The percentages are not usable. If someone asks how good it is, the
  honest answer is "we have not measured that reliably yet".
- **The readiness level does not repeat, and you should not treat it as a verdict.** The same
  deck, same prompt, byte-identical input returned R0, R0 and R2 across three runs
  ([18-evidence-base.md](18-evidence-base.md) A4). A lead sets the readiness level. The
  tool's answer is a suggestion beside it. A student never sees one.
- **The findings do repeat, and they are the part to rely on.** One case repeated four of its
  five findings across all three draws (A3). No blocking rule has ever been missed across
  roughly thirty reviews (A1), and every quote is checked mechanically as a verbatim
  substring of your deck (A2). Those three are the tool.
- **It over-flags, worst on good work.** On the first real baseline it escalated every strong
  deck, six of six, four of them by two full readiness levels (A5). If your deck is good and
  the tool is harsh, that is the known failure mode and not a signal about your deck.
- **It does not know when your input is damaged.** PDF extraction flattens tables. The tool
  has built a headline blocking issue out of an extraction artifact and called it a
  contradiction in the work (A7). If a finding rests on a number from a table, check the
  table before you act on it.
- **The fitness verdict is companion, not oracle.** Unchanged, and now enforced rather than
  advised: the live tool gives a lead the triage and gives the student only what the lead
  kept. If you are a student team, treat the output as a strong colleague's opinion and take
  the disagreements to your lead.
- **The renderer exists.** Live at https://180dc-reviewer.pages.dev. The coaching view, the
  lead view and the printable are built. This guide's section on reading raw JSON is now the
  fallback rather than the normal path.

If any of that changes, this file should change with it, and the change should get a line
in [11-decision-log.md](11-decision-log.md). `node check-docs.js` catches version and
reference drift but it cannot catch a stale claim of state, which is what most of this
section is made of.
