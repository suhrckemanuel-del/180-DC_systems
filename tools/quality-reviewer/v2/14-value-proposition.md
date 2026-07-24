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

It has never once been run on a real 180DC deliverable. Everything we know about it comes
from five short made-up decks that we wrote ourselves, each one built around a single
obvious flaw, all of them clean typed text rather than a PDF that came out of PowerPoint
sideways. Your deck will be longer, messier and will have three problems tangled together.
We do not know yet how it behaves there.

It has also been wrong in exactly the way that would annoy you most. On the one practice
deck that was genuinely good, an early version invented drama: it graded three fair but
small observations as serious problems and marked the deck as needing work when it did not.
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

Three things you should know before you commit a team to this.

1. **We have not measured whether it says the same thing twice.** Every test case has been
   run once per prompt version. The verdict level is probably stable because those decks
   are unambiguous, but the finding list, the confidence label and the accounting of what
   caps the deck have never been run repeatedly under a frozen prompt. This is the single
   biggest hole in the evidence and it is the next thing on the list.
2. **The test inputs were nothing like your inputs.** Five short decks, one planted flaw
   each, written by the same people who built the tool, pasted as clean text. Real decks are
   thirty slides with three overlapping problems and text extracted out of a PDF with the
   columns scrambled. The quote-checking that makes it safe is untested against that.
3. **The answer keys were written in-house with no second marker.** So "the AI matched the
   gold" partly measures whether the AI learned the same conventions as the person who wrote
   the gold. A fourteen-case set built from real past deliverables now exists in
   [eval-cases-real/](eval-cases-real/), but it is unlabeled and the reviewer has never been
   run on any of it.

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

This is a designed and internally tested instrument. It is not a piloted one. We have no
evidence about real deliverables, no evidence about consistency across teams, no evidence
about lead workload and no evidence about member learning, because none of those have been
measured. The entire evidence base is five short decks we wrote ourselves, each containing
one deliberate flaw, and our own honest internal review of that exercise concluded the tool
is fit today as a companion for an expert or a project lead and not yet as something handed
straight to students. Our own tests also found it over-worrying a genuinely good deck,
which is the failure mode most likely to demoralize a team, and although the fix worked it
has been confirmed once. Approving this means approving a small pilot with a named exit
test, not adopting a validated system.

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

**The project lead** changes their mind on three numbers we do not have yet. First, a
false-positive log across two or three real projects: of everything the tool flagged, what
share did the lead agree with. Second, a stability result: the same deck run three to five
times, showing whether the verdict and the finding list hold. Third, their own before and
after read time on a deck they would have reviewed anyway. The pilot exit condition already
written into [09-roadmap.md](09-roadmap.md) is that leads say it saves time and the
false-positive rate is acceptable, and neither half of that is knowable without their own
projects in it.

**The VP or board member** changes their mind on the fourteen real past deliverables now
sitting unlabeled in [eval-cases-real/](eval-cases-real/). The sequence is: humans write the
answer keys blind, then the tool runs on the same decks, then we compare. That is the first
result in this project that will not be self-graded, because the decks are real branch work
with real extraction noise and the keys are written before anyone sees the output. Add to
that a full project cycle run without a confidentiality breach or a disputed sign-off, and
the case is made or broken on evidence rather than on design intent.

---

## G. The honest status line

Quotable by any of the three, in a client meeting, a team kickoff or a board update. It
does not overclaim and it does not undersell.

> We have built an AI reviewer that checks a consulting deliverable against a written
> ten-point standard before it reaches a client, quotes the exact text behind every point it
> raises, keeps its list short on purpose and hands the final judgment to a named human who
> signs off. It is designed to coach rather than to rewrite: it will not produce slide text
> for a team. It has been tested on five short scenarios we wrote ourselves, each built
> around one deliberate flaw, where an independent scorer confirmed it found the intended
> main issue in every case and stayed appropriately quiet on the one deck that was already
> good. It has never been run on a real deliverable, we have not yet measured how much its
> output varies between runs, and a set of fourteen real past decks is built but not yet
> marked up by humans. So today it is a strong first-pass assistant for a project lead or an
> experienced reviewer, and we are asking for a small pilot to find out whether it is more
> than that.
