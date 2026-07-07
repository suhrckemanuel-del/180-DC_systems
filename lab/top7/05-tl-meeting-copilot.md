# TL Meeting Copilot

Fifteen minutes before every team meeting, a team lead gets a decision-led agenda, a per-member check-in note, and one coaching move — turning first-time student managers into deliberate leaders. The direct attack on "people disliking project teams or team leads."

## Critique passes

### Pass 1 — usefulness critique
**Critique:** An agenda generator is a commodity. The actual TL failure modes are relational, not organizational: not noticing a member going quiet, hoarding interesting work, avoiding a lagging-member conversation, running meetings as status theater. A tool that formats agendas nicely while missing these changes nothing. Worse, per-member "nudges" computed from thin data (meeting notes only) will be wrong often, and a wrong nudge ("bring Alex in" when Alex was sick) erodes trust in one shot.
**Changes made:** (a) The centerpiece is the **people pass**, not the agenda: for each member, the copilot reports only *observable evidence from the notes* ("has not had a speaking item in 2 meetings"; "was assigned research 3 weeks running while others got analysis") and phrases everything as a question to the TL ("is this deliberate?") — never a diagnosis. Quote-or-abstain applied to people. (b) Added the **work-distribution ledger**: who has gotten which kind of task over time — the invisible fairness data behind "disliking project teams." (c) The agenda logic is one rule enforced hard: decisions and blockers first, status last and written-not-spoken; the copilot refuses to produce a status-first agenda.

### Pass 2 — adoption critique
**Critique:** TLs are the busiest people in the branch; a tool that needs notes pasted in weekly dies in week 3. Team members who learn the TL uses an AI on "notes about them" may feel surveilled — one bad reaction and the branch bans it. And TLs who most need coaching are the least likely to seek a coaching tool.
**Changes made:** (a) Input friction to near zero: works from whatever exists — raw bullet notes, a photo of a whiteboard, a forwarded status thread; a 60-second voice memo is an explicit input path ("here's roughly what happened this week"). (b) **Radical transparency as policy:** the copilot is announced to the team at kickoff as part of branch standard ("our TLs use a prep tool so meetings waste less of your time"), and any member can see what categories of data go in (notes, tasks — never personality assessments). Secret use is banned in the how-to. (c) Distribution is via TL onboarding, not opt-in discovery: every new TL gets it in TL training (paired with Kickoff-in-a-Box) as "how TLs work here," which reaches the ones who'd never self-select.

### Pass 3 — implementation critique
**Critique:** Meeting notes are the messiest input in this whole portfolio — inconsistent, sometimes containing personal remarks, sometimes absent. Longitudinal features (quiet-for-2-meetings, task-distribution ledger) require state across weeks, which a stateless prompt can't do. Personal data retention creates real obligations.
**Changes made:** (a) State lives in a **per-project running file** (one markdown/JSON doc per team, TL-owned, in the project folder): each week's run appends a structured summary (attendance, speakers, task assignments by type, open actions); the copilot reads the file + this week's notes — longitudinal memory without a database. (b) A **sanitize-first pass** strips personal/health/interpersonal remarks from notes before the main pass sees them, and the running file schema has no free-text-about-people field — only observable event categories. (c) Retention policy is structural: the running file dies with the project folder at project close; nothing about members persists beyond the engagement.

## Prototype spec

- **Input:** this week's notes (text/photo/voice memo), the project running file, the workplan.
- **Pipeline:** sanitize pass → people pass (evidence-only observations + questions, max 3) → distribution ledger update → agenda build (decisions → blockers → coaching moment → status appendix) → post-meeting: actions with owners; running-file append.
- **Output:** one pre-meeting card (fits on a phone screen) + one post-meeting action list. JSON contract, static render.
- **Build estimate:** 1 day for the core loop; the running-file schema is the only design work.
- **Cost:** 2 short calls per week per team.
- **Non-goals:** performance evaluation, personality analysis, replacing the TL's judgment on any people call, anything kept after project close.

## Demo script (6 minutes)

1. *(45s)* "Team leads here are 20-year-olds managing peers for the first time. Nobody trained them. Here's a real-shaped week." Show messy bullet notes + a whiteboard photo on screen.
2. *(90s)* Run it. Show the pre-meeting card: agenda leading with the two decisions; status demoted to a written appendix. "Meeting just got 20 minutes shorter."
3. *(90s)* The people pass: "Priya has not had a speaking item in two meetings — deliberate? Jonas has drawn formatting tasks three weeks running while analysis went elsewhere — rotate?" Pause: "Notice it never diagnoses. It shows the TL what the notes show, and asks."
4. *(60s)* The coaching moment: "Sarah's competitor analysis was the strongest work this week — have her walk the client through it Thursday." "That sentence is how you keep a good consultant for another semester."
5. *(45s)* Post-meeting: rough closing notes in → owner-and-date action list out, running file updated.
6. *(30s)* Close: "Fifteen minutes a week. The teams don't get a robot TL — they get a TL who noticed."

## Workshop exercise (50 min, TL training session)

- **Setup:** a 4-week fictional project pack: workplan + 4 weeks of increasingly problematic notes (one member going quiet, tasks skewing, a decision repeatedly deferred).
- **Round 1 (15m):** TLs read week 4's notes cold and plan the meeting by hand. Share: what would you do?
- **Round 2 (10m):** run the copilot on the full pack. Compare its people pass with the room's reads — who caught the quiet member? Who caught the task skew? (Almost nobody catches the skew; the ledger is the reveal.)
- **Round 3 (15m):** pairs roleplay the check-in conversation with the quiet member — the copilot suggested the question, the human must have the conversation (bridges to the [Client Meeting Simulator](03-client-meeting-simulator.md) and Feedback Phrasebook patterns).
- **Exit (10m):** each TL sets up their real project's running file before leaving the room.

## Consultant prompt pack

1. **Sanitize:** "From these raw notes, remove anything about health, personal life, or interpersonal conflict characterizations. Keep observable work events: who attended, who presented, what was assigned to whom, what was decided, what was deferred. Output the cleaned notes only."
2. **People pass:** "Using the running file and this week's cleaned notes, list up to 3 member observations. RULES: only observable patterns with the evidence stated ('assigned research in weeks 2, 3, 4'); each ends as a question to me, never a conclusion; if nothing notable, say so — no manufactured concerns."
3. **Agenda build:** "Build a 45-minute agenda: decisions needed first (with the options as stated in the notes), blockers second, one coaching/recognition moment third, status as a written appendix. Refuse to put status first. Flag any decision that has now appeared in 2+ consecutive weeks undecided."
4. **Post-meeting:** "From my closing notes, extract actions as owner + verb + deadline. Anything ownerless gets flagged, not assigned. Append this week's structured summary to the running file schema."
5. **Hard-conversation prep (bridge):** "The check-in question you suggested about [member] — give me an opening line that is curious, not accusatory, and the two most likely honest answers I should be ready for."

## Quality rubric

| Dimension | Pass bar |
|---|---|
| Evidence-only people pass | 100% of observations cite note-visible events; zero trait language ("lazy", "disengaged") across 10 test weeks |
| No manufactured concerns | On a healthy-team test pack, the people pass says "nothing notable" |
| Agenda discipline | Status never leads; deferred decisions flagged by week 2 of deferral — 10/10 test runs |
| Ledger accuracy | Task-distribution ledger matches a hand count on the 4-week test pack |
| Sanitizer recall | 100% of seeded personal remarks removed in test notes |
| TL time | Full weekly loop ≤15 minutes including reading, self-reported |

## Rollout plan

1. **Week 1:** build; validate rubric on the fictional 4-week pack.
2. **Week 2–5:** pilot with 2 volunteer TLs (one strong, one new — different failure modes), teams informed at the pilot's start. Weekly 10-minute feedback with both.
3. **Week 6:** anonymous team pulse on pilot teams ("meetings are useful", "my work mix is fair", "I feel noticed") vs non-pilot teams.
4. **Next semester:** into TL onboarding as standard practice, paired with [Kickoff-in-a-Box](07-kickoff-in-a-box.md) (the box creates the running file; the copilot maintains it). Transparency policy in the TL handbook.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Members feel surveilled | Announced-at-kickoff transparency policy; observable-events-only schema; secret use banned in how-to |
| Wrong nudge burns trust | Everything phrased as evidence + question; TL judgment mandatory; no-manufactured-concerns rubric line |
| Personal data retention | Running file dies at project close; sanitize pass; no free-text-about-people fields |
| TL reads nudges verbatim to the team | Training round 3 drills the human conversation; copilot outputs intent, not lines |
| Input friction kills the habit | Voice-memo path, photo path; ≤15-minute loop as a tested rubric line |
| Becomes a leadership surveillance channel | Running files are TL-owned and project-local; exec never has read access — stated in how-to |
