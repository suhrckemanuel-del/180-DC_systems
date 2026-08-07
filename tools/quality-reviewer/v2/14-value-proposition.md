# 14. Value proposition: three pitches for three audiences

What to say to a student consultant, to a project lead and to a VP or board member, in
their language, with a real example and an honest caveat for each. Nothing here claims
more than the repo can back.

Voice rules apply. No Oxford commas. No em or en dashes.

---

## A. How to use this page

Three separate pitches follow. They are not three wordings of one message. A student
worries about looking bad and losing time. A lead worries about review load and about
owning a decision the tool got wrong. A VP worries about a client relationship and about
what happens if this fails in public. Use the one that fits the room.

Two rules for anyone using this page:

- Do not merge the pitches into one slide. The caveat that reassures a student is not the
  caveat a board member needs.
- Do not upgrade the language. The status line in section G is the ceiling of what any of
  us may claim today. Everything above it must stay inside it.

The factual basis for every claim here is in [00-product-definition.md](00-product-definition.md),
[progress.md](progress.md), [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md)
and the case files in [eval-cases/](eval-cases/) and [eval-runs/](eval-runs/).

---

## B. Pitch one: the student consultant

**Why you should care.** It shows you the question your project lead is about to ask,
while you can still answer it, and it never writes the answer for you.

### What you actually get

You paste your slide text. In a couple of minutes you get back a short list, at most
three points in the quick check and at most five in the full read, of the things most
likely to get your deck sent back. Each one quotes the exact line on the exact slide, says
why it matters to the client rather than why it is untidy, asks you one question to think
about and then gives you a direction for the fix. Not the fix itself. A direction.

The tool is built so it cannot ghostwrite your deck. If you ask it to write the slide, it
refuses. In the full read the fix stays locked until you have taken a shot at the question
yourself. That is deliberate: the point is that you can do this unaided next semester.

It also opens with what is working. On the strong test deck it led with the things the team
got right and raised two small points, both of which the team could have closed in fifteen
minutes.

### Concrete: what it caught, from the made-up practice deck

Test case 01 in [eval-cases/case-01-vague-recommendation.md](eval-cases/case-01-vague-recommendation.md)
is a ten-slide deck for an invented food-redistribution charity choosing between deepening
its current region or expanding into a new one. Slide 9, the recommendation, reads:

> Expand to Region B. Scale up operations and improve partnerships to serve the new region.

Reads fine. It is not fine. There is no first action, no owner, no date and no way to know
in three months whether it worked. Slide 10 finishes with "Review progress in due course".

**Why that hurts the client.** The team leaves, the client reads the deck again in
February and has nothing to do on Monday morning. Three months of your work turns into a
sentiment. Nobody is angry with you. Nothing happens either.

**What the reviewer said.** It flagged the recommendation and the next steps together as
one issue, quoted both lines, then asked:

> If the client said yes tomorrow, what is the first thing someone does on Monday and how
> would they know in three months that it worked?

Its direction for the fix was to turn the closing slide into a sequenced first quarter
with the action, the owner, the date and the measure, and to replace "in due course" with
a real checkpoint. It did not write the slide.

**What the team does differently.** Half an hour rewriting one slide, before the lead sees
it, instead of after. And the habit is portable: the next deck you write, you will hear
that Monday-morning question in your own head. That is the actual product.

### On your three real worries

- **Does this make me look bad?** The output is yours first. You run it on your own draft
  before anyone else reads it. It is set up not to say anything about you as a person: it
  comments on the deliverable, never on individual competence, effort or motivation. Nobody
  is ranked.
- **Does it replace my thinking?** It is engineered in the opposite direction. It refuses
  to write your deck, it makes you answer before it shows you the direction, and it ends
  with one habit to build plus an exercise. If you use it as a rewrite machine it will
  disappoint you on purpose.
- **Does it cost me time?** A quick check is a two-minute paste and a two-minute read. The
  short list is a hard limit, not a suggestion, because a team that gets forty comments
  ignores all forty. Acting on the points is real work. Reading them is not.

### What is not proven yet, in your language

**Updated 2026-08-07.** It has now been run on nine real past 180DC decks, long and messy and
with several problems tangled together, so we do know roughly how it behaves on work like
yours. Two things have held every single time: it has never missed a problem serious enough to
block a deliverable, and every quote it shows you is really in your deck, checked
automatically.

What we cannot tell you is a score. We measured our own marking method in August and it turned
out to be barely better than guessing, so any "it catches X% of problems" number you might
hear from us is not one to rely on. We are rebuilding that before we quote anything.

It has also been wrong in exactly the way that would annoy you most, and this has got worse
rather than better. On practice decks that were genuinely good it invented drama: it graded
fair but small observations as serious problems and marked good work as needing fixing. On the
first real run it did that to every strong deck it saw. If your deck is good and the tool is
harsh with it, that is a known fault in the tool and not a message about your work.

One more. It cannot tell when your PDF came out badly. If a finding is built on a number from
a table, check the table first, because flattened columns have made it call a formatting
accident a contradiction.
We fixed that, and the fixed version returned the right verdict with two minor points, but
that fix has been confirmed on one run, not many. So if it tells you something is a big
problem and you think it is not, you are allowed to be right. Say so to your lead. Your
lead decides, not the tool.

---

## C. Pitch two: the project lead

**Why you should care.** It gives you a first-pass triage of a deck before you open it, so
your read starts from a list of specific quoted claims to check rather than from a blank
page at 11pm.

### What it is for you

There is a view built for you specifically. It strips out the coaching material the team
sees and shows four things: a readiness verdict, the specific issues that cap it, the
findings the team judged delivery-critical and up to five questions to ask the team. On the
contradiction test deck those questions included "Has the board seen this recommendation,
given its stated position that hiring waits on revenue growth" and "Was a lower fixed-cost
path considered and rejected, and why". Those are your questions, handed to you with the
evidence attached.

Every finding carries a verbatim quote with its slide number, or it is dropped. There is a
validator that checks each quote actually appears in the source text, and all five test
reviews pass it ([check-review-v2.js](check-review-v2.js)). So you can spot-check any
claim in seconds instead of hunting for what it is referring to.

It also lists what it did not look at. On the contradiction deck it stated plainly that it
had not assessed whether the peer comparison was factually true, whether external funding
existed, or anything visual, because only slide text was supplied. That list is where your
judgment is still the only judgment.

### Concrete: the catch you might make late, from test case 04

[eval-cases/case-04-contradiction-no-implementation.md](eval-cases/case-04-contradiction-no-implementation.md)
is a nine-slide final deck for an invented social enterprise refurbishing bicycles. Slide 3:

> Client D has no cash reserves and cannot take on new fixed costs without new income
> first. The board has been clear that hiring is not possible until revenue grows.

Slide 6:

> Open a retail shopfront within six months and hire three paid repair staff to meet
> demand.

The deck contradicts itself three slides apart. Slide 8 then calls the plan low-risk and
slide 7 says revenue will double in year one, neither with a source or a cost model.

**Why that hurts the client.** Best case, the client's board rejects it on sight and the
branch looks careless. Worst case, a charity with no reserves signs a lease on our advice.

**What the reviewer said.** It set the verdict to Not ready for client review, named the
contradiction as the reason, listed both slide 3 sentences and the slide 6 sentence as the
evidence, and wrote: "A board that already said no to hiring will reject the plan on sight,
or worse the client signs a lease it cannot cover and the advice causes real financial
harm." It did not decide whether a shop is a good idea. It said the deck breaks its own
stated constraint and has not shown what changed. Full output in
[eval-runs/case-04-review-v2-live-r2.json](eval-runs/case-04-review-v2-live-r2.json).

**What you do differently.** You go into the team meeting with one question rather than a
vague sense that something is off: what changed the board's position, and if nothing did,
which of slide 3 or slide 6 is wrong.

### On your four real worries

- **Does it reduce my load or add to it?** Honest answer: unmeasured, and it can go either
  way. What it does structurally is move issues earlier, because the team runs it on
  themselves first, and it hands you a short list rather than a long one. Whether that nets
  out to less time for you is exactly what the pilot is for. Anyone who tells you it saves
  hours is making that up.
- **Does it catch things I would miss?** On the five made-up decks it found the planted
  main issue every time, and on one deck it produced a sharp observation the human answer
  key had not written down. That is encouraging and it is a smoke test, not proof. It is
  best read as a check against the thing you would have caught on a good night and missed
  on a bad one.
- **Do you still own the sign-off?** Completely, by design. The tool never approves
  anything. A Not ready verdict is a strong signal, not a veto: you can send the deck
  anyway with a documented reason. The recorded sign-off is yours. The workflow is in
  [07-workflow.md](07-workflow.md) section C.
- **What happens when it is wrong?** You overrule it, and that overrule is the accountable
  decision. Practically it fails in two directions. It can over-worry a good deck, which we
  have seen and fixed once. It can also present its own list in an order that disagrees with
  itself: on two test decks the issue it named as capping the verdict was not the issue its
  own top finding pointed at. Read the findings, not just the header.

### What is not proven yet, in your language

**Updated 2026-08-07.** All three of the points that used to sit here have been measured. Two
came back badly and one came back well. Here is what a lead needs.

1. **It says the same things twice. It does not give the same verdict twice.** Measured on
   2026-08-03: one deck repeated four of its five findings across all three runs, but the
   overall readiness level came back R0, R0 and R2 on byte-identical input, with different
   blocking rules firing each time. The reading is stable and the grade is not. That is
   exactly why the tool now suggests a readiness level and you set it.
2. **The test inputs are now your inputs.** Nine real past branch deliverables, long, with
   overlapping problems and PDF extraction noise, run blind. The quote-checking held: no
   fabricated quote has ever survived to a scored result.
3. **We cannot yet tell you how much it caught.** This is the one that got worse. In August we
   checked our own marking method against 178 human judgements and found it barely
   distinguishes a real catch from a miss. So the answer keys exist, the runs exist, and the
   comparison between them is not trustworthy yet. We are rebuilding it. Until then, treat
   any percentage you hear about this tool as not yet measured.
4. **The answer keys were written by one person with no second marker.** Unchanged, and it now
   matters more, because those keys are the basis for the real-case results rather than for a
   practice exercise. Two competent readers already landed at opposite ends of the scale on
   one deck.

---

## D. Pitch three: the VP or board member

**Why you should care.** The failure that damages the branch is not a typo. It is a team
confidently answering a question the client did not ask, or recommending something the
deck's own facts rule out, and nobody catching it before it is presented. This is a cheap,
repeatable second pair of eyes on exactly that class of failure, sitting under a human
sign-off that stays where it is today.

### The branch-level case

- **Consistency.** Every team currently gets the review its particular lead has time to
  give that week. This applies one written standard to every deliverable, and that standard
  is legible: ten things it looks at, four verdict levels, and a short list of faults that
  cap the verdict no matter how polished the rest is
  ([01-rubric-v1.md](01-rubric-v1.md)).
- **Learning outcomes.** Every review ends with one reusable habit and an exercise, and the
  training team can read those across projects to see which weaknesses recur and shape the
  workshop around them rather than around anecdote.
- **Confidentiality posture is designed in, not bolted on.** A written sanitization
  protocol governs what may be pasted: no client names, no logos, no unpublished financials,
  no named transcripts. During testing, synthetic material only. Rules in
  [07-workflow.md](07-workflow.md) section E.
- **Cost.** The marginal cost of a review is effectively zero: it runs as a prompt inside an
  existing Claude workspace with no infrastructure to buy or maintain. The real cost is our
  own time building and validating it, which is already spent, plus the pilot time we are
  asking for.

### Concrete: the reputational near-miss, from test case 02

[eval-cases/case-02-problem-framing-drift.md](eval-cases/case-02-problem-framing-drift.md)
is an invented youth-education charity. Slide 2 states the brief:

> The board has asked how to grow individual giving.

Slide 8 delivers the recommendation:

> Close the mentoring scheme. Reinvest the freed budget in tutoring. This improves overall
> programme efficiency.

The analysis in between is competent. It answers a different question. Nowhere does the
deck return to donations, and the one genuinely on-brief finding, that donors said they
would give more if they saw impact updates, is raised on slide 4 and then dropped.

**Why that hurts the branch.** A client board sits down expecting an answer to its
fundraising question and is instead advised, by unpaid students, to close a live youth
programme it never asked about. Every hour we spent is a cost to them. That is the kind of
meeting that ends a client relationship and gets described to other charities.

**What the reviewer said.** It set the verdict to Needs substantial revision because the
deck answers a question the client did not ask, quoted the brief and the recommendation
side by side, and pointedly did not endorse the programme cut on its merits. Its note to the
team: "The first duty of a deck is to answer the question the client asked. A better
question found along the way is raised with the client, not substituted silently." Output in
[eval-runs/case-02-review-v2-live-r2.json](eval-runs/case-02-review-v2-live-r2.json).

**What we would do differently.** The team raises the reframing with the client mid-project
instead of surprising them with it at the final presentation.

### On your risk questions

- **Client risk.** Nothing changes about who is accountable. The tool cannot approve a
  deliverable, it advises and a named human signs off. It cannot rank or assess individual
  members. And no real client material touches it until a lead has agreed the sanitization
  on the first case.
- **What if it fails publicly.** The realistic public failure is not a leak, it is a team
  citing "the AI said it was ready" for something that was not, or a lead deferring to a
  confident wrong verdict. The mitigation is structural rather than promised: the tool never
  issues an approval, so there is no verdict to hide behind, and the sign-off line in the
  project log names a person. The residual risk is a tired lead rubber-stamping a plausible
  review. That is a real risk and we should watch for it in the pilot, not deny it.
- **Reputation if we say we use AI.** We can describe this accurately and it stands up: a
  documented review standard, applied by a tool, checked and signed off by a human, with
  written rules about what may be uploaded. The claim to avoid is any suggestion that the AI
  quality-assures our work.

### What is not proven yet, in your language

**Updated 2026-08-07.**

This is a built and internally tested instrument. It is not a piloted one. It is now live and
it has been run blind on nine real past branch deliverables against human-written answer keys,
so the "no evidence about real deliverables" line above is no longer true. What is still true,
and what you should hold us to:

- **We cannot give you a performance percentage.** In August we measured our own scoring
  method against 178 human judgements and found it barely better than a coin weighted the
  right way. Any recall or coverage figure from this project is unusable until we replace it.
  We would rather say that than quote you one.
- **Two things have held across roughly thirty reviews and neither depends on that scoring
  method.** It has never missed a problem serious enough to block a deliverable, and it has
  never produced a quote that was not in the deck. Both are checked mechanically.
- **Its overall readiness verdict is not repeatable.** The same deck ran three times and came
  back with two different verdicts. A named human sets that verdict now and the tool only
  suggests. No student ever sees one.
- **It over-worries good work.** On the first real run it escalated every strong deck. That is
  the failure mode most likely to demoralize a team and it is not closed.
- **No evidence on lead workload or member learning.** Unchanged. Neither has been measured
  and neither will be until a pilot runs.

Approving this means approving a small pilot with a named exit test, not adopting a validated
system. We are not asking for that pilot yet, because we would rather fix the measurement
first than run a pilot we cannot score.

---

## E. The three strongest objections, and the honest answer

**1. It teaches students to outsource their judgment.**

This is the objection we take most seriously because it attacks the point of the branch.
The honest answer is that the design fights it and the design is unproven. The tool refuses
to write deliverable text, the fix in the student view unlocks only after the consultant
attempts the question themselves, and the fixes are directions rather than pasteable
sentences. But a determined team can still treat five findings as a checklist to close
rather than a lesson to learn, and we have no data showing they do not. This is a thing to
measure in the pilot, by asking leads whether second and third drafts get better on their
own, not something to declare solved.

**2. There is no evidence it works, so every claim here is a design claim.**

Largely correct and we should say so first, not last. What exists is: five synthetic
single-flaw decks with in-house answer keys, one live run per case, independently scored by
a fresh reviewer, all five clearing the internal acceptance bar after a calibration fix
([eval-runs/scoring-2026-07-03.md](eval-runs/scoring-2026-07-03.md)). What does not exist:
any run on a real deliverable, any measurement of run-to-run stability, any second marker on
the answer keys and any lead or student feedback. Our own effectiveness review calls the
current evidence a smoke test rather than a validation, and that is the right word.

**3. A confident, well-written, wrong review is worse than no review.**

True, and this is the sharpest version of the risk. It is exactly what happened on the one
good test deck: three fair observations were graded far too severely, which mechanically
dragged a sound deck down a level. The defenses are that every finding must quote real text
that a validator checks, that the tool must list what it did not assess, that it must lower
confidence rather than guess when inputs are missing, and that a human always signs. The
severity rules were rewritten after that failure and the re-run came back correct. One
run. Not a guarantee.

---

## F. What would change each audience's mind

Different evidence convinces different people. This is what to build in the pilot.

**The student consultant** changes their mind when they run it on their own real draft,
keep the output, then compare it with what their lead actually wrote back, and find the
overlap is high and the extra points are fair. The convincing evidence is personal and
immediate: it told me the thing my lead was going to tell me, and one thing my lead missed,
and it did not tell me anything stupid. A second test they will apply without being asked:
does it stay quiet when the work is good. Show them the strong-deck case coming back with
two small points rather than five invented ones.

**The project lead** changes their mind on three numbers. **Updated 2026-08-07: one of the
three now exists and it came back badly.** The stability result was measured on 2026-08-03:
the finding list holds across runs and the verdict does not, which is why readiness is now
theirs to set. The two still missing are the ones only a pilot produces. First, a
false-positive log across two or three real projects: of everything the tool flagged, what
share did the lead agree with. The live tool was built to collect exactly this as a byproduct
of a lead doing their normal triage ([17-override-log.md](17-override-log.md)), so it is
cheap now in a way it was not before. Second, their own before and after read time on a deck
they would have reviewed anyway. The pilot exit condition in
[09-roadmap.md](09-roadmap.md) is that leads say it saves time and the false-positive rate is
acceptable, and neither half of that is knowable without their own projects in it.

**The VP or board member** changed their mind on the fourteen real past deliverables. **Updated
2026-08-07: that sequence has run, and it produced a different lesson than the one this
paragraph expected.** Humans wrote answer keys blind for 11 of the 14, the tool ran blind on
the 9 that survived a consistency check, and the two were compared. The comparison is the part
that failed: the software that decides whether a finding matches a key turned out to be
barely better than guessing, so the first result in this project that was not self-graded is
still not gradeable. What survived the sequence intact is worth more than the number would
have been: across every run, the tool has never missed a blocking problem and has never
invented a quote, and neither claim depends on the broken comparison. A board member should
change their mind on those two, on a full project cycle run without a confidentiality breach
or a disputed sign-off, and on a repaired measurement. Not on a percentage.

---

## G. The honest status line

Quotable by any of the three, in a client meeting, a team kickoff or a board update. It
does not overclaim and it does not undersell.

**Rewritten 2026-08-07.** This paragraph exists to be repeated verbatim, which makes it the
single most dangerous sentence in this folder to leave stale. The version below is current.
The version underneath it is what was quotable until today, kept so the change is visible.

> We have built an AI reviewer that checks a consulting deliverable against a written
> ten-point standard before it reaches a client, quotes the exact text behind every point it
> raises, keeps its list short on purpose and hands the final judgment to a named human who
> signs off. It is designed to coach rather than to rewrite: it will not produce slide text
> for a team. It is live and a project lead can run the whole loop from a link. It has been
> run blind on nine real past branch deliverables with human-written answer keys, and two
> things have held every time: it has never missed a problem serious enough to block a
> deliverable, and it has never invented a quote. What we cannot yet tell you is how good it
> is as a number. We measured our own scoring method in August and it barely beats guessing,
> so any percentage we could give you would be made up in a way that matters. We also know
> its overall readiness verdict is not repeatable, which is why a human sets that and the
> tool only suggests. So today it is a strong first-pass assistant for a project lead, we
> are rebuilding the measurement before we ask for a pilot, and we would rather tell you
> that than quote you a number we cannot stand behind.

The 2026-07-22 version, no longer accurate and no longer quotable:

> ...It has been tested on five short scenarios we wrote ourselves, each built around one
> deliberate flaw, where an independent scorer confirmed it found the intended main issue in
> every case and stayed appropriately quiet on the one deck that was already good. It has
> never been run on a real deliverable, we have not yet measured how much its output varies
> between runs, and a set of fourteen real past decks is built but not yet marked up by
> humans. So today it is a strong first-pass assistant for a project lead or an experienced
> reviewer, and we are asking for a small pilot to find out whether it is more than that.
