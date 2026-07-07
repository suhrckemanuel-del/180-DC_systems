# Why Workshops Fail: The Critical Attack

Before building an education system, attack the thing every student org builds by default: the workshop — a 60–90 minute presentation, delivered once, to whoever shows up, with a feedback form at the end. Run the same three critique passes the lab uses on tools ([guide](../guide/README.md), step 4): does it teach (usefulness), does anyone come back (adoption), can it survive the org (implementation)?

Each failure mode below ends with the **design answer** now built into [the curriculum](02-curriculum.md) and [operating model](03-operating-model.md). Evidence citations refer to [research/05](../research/05-training-and-knowledge-transfer/findings.md).

## Usefulness failures — it doesn't teach

### 1. The lecture illusion
Attendance is not learning. A room nodding at slides about the Pyramid Principle retains a fraction of it by the following week; nothing was retrieved, practiced, or produced. Top firms know this: they train through apprenticeship and simulation, not classroom hours (F1), and experience without deliberate practice doesn't create expertise either (F3). A student org that lectures is imitating the *format* of teaching while skipping the mechanism.
**Design answer:** no module is more than ⅓ presentation. Every session is built around attempts: learner tries, then compares against the expert move (the reviewer's attempt-before-answer lock, generalized). Formats in [03](03-operating-model.md#formats).

### 2. Just-in-case timing
Workshops cluster at semester start, when nobody has a project to apply them to. The scoping lesson is needed in week 1 of an engagement; the chart lesson in week 6; the presentation lesson in week 9. Bolt-on training retains 20–40%; learning embedded in real work retains 70–90% (F10). Teaching everything up front guarantees the bolt-on number.
**Design answer:** the curriculum is scheduled against the **engagement lifecycle**, not the academic calendar — each module fires in the week its skill is needed, using the learner's live project as the exercise material ([02](02-curriculum.md#when-modules-fire)).

### 3. No assessment, so no feedback loop
Feedback forms measure enjoyment. Nobody measures whether anyone can *do* anything new, so content never improves and the branch can't distinguish its best module from its worst. (McKinsey runs skills-based diagnostics from day 1 — F2.)
**Design answer:** every module defines observable evidence ("can turn 5 findings into a governing thought that survives the Storyline Trainer's checks") and ends with a 5-minute exit check. Aggregate exit-check results — not ratings — decide which modules get rebuilt ([03](03-operating-model.md#the-quality-loop)).

### 4. AI taught as features, not judgment
The default "AI workshop" is a tool tour: here's the chatbot, here are ten prompts. This teaches the one thing that expires (interfaces and prompt tricks) and skips the things that compound: how models fail, how to verify output, what to delegate vs own, when *not* to use AI. The BCG study's flip side (F4/F5) is exactly this: consultants using AI outside its competence frontier did *worse* — the dangerous user is the confident one who can't check.
**Design answer:** AI literacy is taught as a **verification discipline**. Module one is not "prompting" — it's "catch the model lying": learners get AI outputs seeded with plausible errors and drill the checking habit (quote-or-abstain as a personal practice). Prompt patterns come after the distrust reflex exists ([02, Track B](02-curriculum.md#track-b--ai-literacy)).

### 5. The expert blind spot
Whoever teaches (the AI team, a senior consultant) has automated their own skill and can no longer see its steps. They teach conclusions ("make titles assertions") without the diagnostic process that produces them. Cognitive apprenticeship (F7) requires making expert thinking *visible* — the one thing slides never do.
**Design answer:** modules teach by **worked diagnosis**: the expert (or the tool — the reviewer's findings, the Red-Team CEO's questions) shows its reasoning on a real artifact, then the learner replicates the diagnosis on the next one. Tools are the scalable senior: they externalize expert reasoning on demand, which is precisely the gap in a branch with no partners in the building (F1, F7).

## Adoption failures — nobody comes back

### 6. Motivation mismatch
Students attend for job value, CV lines, and their live project — workshops offer abstractions. Session two of any series has half the attendance of session one, everywhere, always.
**Design answer:** every session produces an **artifact the learner keeps needing** (their own storyline, their murder-board answers, their case-interview debrief, a passport entry) and maps to a named career skill. The session *is* project work, done better — not time away from it.

### 7. One room, three audiences
First-semester members drown, returning members are bored, and the session aims at the median and serves no one. (Scaffolding requires teaching inside each learner's zone, not the room's average — F6.)
**Design answer:** levels are explicit. Core modules run at level 1 (first project) and level 2 (TL track); drills adapt difficulty automatically (Dojo targets ~70% success). Nobody sits through what they've already demonstrated — the evidence log (not seniority) decides placement.

### 8. Voluntary + generic = empty room by week 6
If education competes with deadlines as an optional extra, deadlines win. The people who most need training self-select out (the same finding as the TL Copilot's adoption critique).
**Design answer:** the load-bearing modules attach to **existing mandatory moments**: kickoff week (scoping module inside the Kickoff-in-a-Box session), pre-final week (Red-Team module inside the review ritual), TL onboarding, recruitment onboarding. Optional deep-dives exist, but the spine doesn't depend on volunteering.

## Implementation failures — it dies with its owner

### 9. Presenter-bound knowledge
The branch's best workshop lives in one member's head and one PowerPoint on their laptop. They graduate; the workshop dies; next year someone rebuilds a worse one. This is the institutional-memory problem ([Branch Brain](../lab/top7/04-branch-brain.md)) applied to teaching itself.
**Design answer:** **materials as code.** Every module is a markdown file in this repo: facilitator script, exercises, datasets, stumble guide, exit check, prompt pack. [Workshop Forge](../lab/demos.md#24-workshop-forge) generates the first draft; the repo carries it across generations; any member can run any module — and a member with zero prep time can paste the module file into a chatbot and get a competent co-facilitator.

### 10. Content decays toward the generic
Without a source of branch-specific truth, materials drift into recycled internet consulting tips, and learners correctly sense they could have googled it. The moat of branch education is what *this branch* actually gets wrong — and that data currently dies inside each project.
**Design answer:** the [Findings-to-Curriculum Miner](../lab/demos.md#10-findings-to-curriculum-miner) closes the loop: reviewer findings → recurring failure patterns → refreshed drills and module examples, every semester. The Quality Reviewer isn't just QA; it's the education system's sensor.

## The inversion

Read the ten answers together and the system inverts the default model on every axis:

| Standard workshop model | This system |
|---|---|
| Event | Infrastructure |
| Semester-start calendar | Engagement-lifecycle calendar |
| Lecture → maybe apply later | Attempt → compare → apply now |
| Attendance measured | Evidence measured |
| AI = tool tour | AI = verification discipline |
| Presenter owns materials | Repo owns materials |
| Generic content | Mined from this branch's own failures |
| Training vs project time | Training *is* project time, structured |
