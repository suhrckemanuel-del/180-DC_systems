# Client Meeting Simulator

Rehearse the hardest client conversations — a skeptical director, a scope-creep request, delivering bad news — against an AI playing the client with hidden objectives, then get a quoted, evidence-based debrief.

## Critique passes

### Pass 1 — usefulness critique
**Critique:** Roleplay tools fail in two directions: too soft (the AI politely accepts everything, teaching false confidence) or theatrically hostile (teaching people that clients are monsters). Either way, without a theory of *what makes the conversation go well*, the debrief is vibes. And one session teaches little — the value is in reps against varied pressure.
**Changes made:** (a) Every scenario is built around a **hidden objective** ("the ED will accept the delay if she hears a concrete recovery plan; she will escalate if she hears excuses") — the debrief reveals it, so each session teaches a *mechanism*, not a mood. (b) Difficulty is a dial (1: receptive, 2: busy and distracted, 3: openly skeptical) and the tool prescribes the next rep: "you passed at level 2; retry at 3 with the same scenario." (c) Debrief is limited to 2 quoted turning points + 1 technique — noise budget; nobody improves from a 15-item critique.

### Pass 2 — adoption critique
**Critique:** Solo roleplay feels awkward; nobody will do it alone at home after the workshop glow fades. And TLs — who need it most before real client moments — won't admit they need rehearsal.
**Changes made:** (a) Primary delivery is **social, scheduled, and tied to real events**: a 20-minute "sparring slot" inserted into the project calendar 2 days before every real client touchpoint, done in pairs (one drives, one observes with the debrief rubric). The trigger is the calendar, not willpower. (b) Reframed from "training for the weak" to "walkthrough" — pilots do simulator time before every flight regardless of skill; that framing goes in the how-to verbatim. (c) A library of 8 scenarios written from real branch war stories (collected from TLs in a 30-minute interview session) so every scenario feels like "this actually happened here."

### Pass 3 — implementation critique
**Critique:** Chat-based roleplay lacks the pressure of speech; voice adds realism but also latency and setup friction that kills a 20-minute slot. Persona drift over a long conversation (the AI forgetting its hidden objective, softening under pushback) is the classic failure. Debrief quality depends on the whole transcript fitting cleanly into an evaluation call.
**Changes made:** (a) Ship chat-first (zero setup, works in any room), voice as v2 — the workshop proves pressure survives text when the persona is good. (b) Persona card is re-injected via system prompt with an explicit "never reveal the hidden objective; concede only if the condition is met" rule, and sessions are capped at 12 turns — short enough to hold character and fit a sparring slot. (c) Debrief runs as a **separate call** on the transcript with the persona card + hidden objective as ground truth (same independent-verifier pattern as Reviewer V2): it grades against the known condition, not against taste.

## Prototype spec

- **Input:** scenario choice (8-scenario library), difficulty 1–3, optional real-meeting context ("I'm actually telling my real client X on Thursday" → the persona adapts).
- **Session:** 12-turn max chat; persona card with role, mood, hidden objective, concession condition, escalation triggers.
- **Debrief pipeline:** separate call → JSON (hidden objective reveal, 2 turning points with verbatim quotes, 1 technique + drill, pass/retry-at-level) → static render.
- **Build estimate:** 1 day for engine + 1 TL-interview session for scenarios.
- **Cost:** ~1.5 calls per session.
- **Non-goals:** scoring people for records (results are the user's alone), scripting exact lines to say, simulating specific real individuals by name.

## Demo script (8 minutes)

1. *(30s)* "Your first hard client conversation shouldn't be with a real client. Right now, it always is."
2. *(60s)* Recruit a volunteer. Scenario on screen: "Mid-project update. The analysis is two weeks behind because the client's own data arrived late. The ED is… let's find out. Difficulty 3."
3. *(3m)* The volunteer types/speaks; the room reads the AI's replies aloud (crowd as the client's voice — great theater). The AI pushes: "So what I'm hearing is you'll miss the board date. What exactly do I tell my board?"
4. *(2m)* End session, run debrief. Reveal the hidden objective: "She would have accepted the delay instantly given a recovery plan with a date. Recovery plan was never offered. Here's the turn where it was closest:" — quoted.
5. *(90s)* Show the prescribed next rep and the scenario library ("all eight of these happened to real teams in this branch").
6. Close: "Twenty minutes, two days before every real meeting. Walkthroughs, not remedial training."

## Workshop exercise (60 min)

- **Fishbowl round (20m):** one volunteer, room watches on projector. At 3 marked moments, pause: the room votes on the next move (A/B/C), volunteer plays the winner. Debrief reveal at the end — did the room's choices meet the hidden condition?
- **Pair rounds (25m):** everyone pairs off; driver runs the scenario, observer holds the paper debrief rubric (below). Swap after 10 minutes with a different scenario.
- **Compare (10m):** observers report: did the human observer and the AI debrief flag the same turning point?
- **Exit (5m):** everyone books one sparring slot before their next real client touchpoint — the calendar entry is the exit ticket.

## Consultant prompt pack

1. **Session runner:** "You are [persona card]. Stay in character for at most 12 turns. HIDDEN OBJECTIVE: [condition]. Concede ground only when the condition is met, and only proportionally. Never reveal the objective, never break character, never soften because the user is struggling. Open with: [scenario opening line]."
2. **Persona builder (for new scenarios):** "Here is a war story from a real team lead: [story]. Write a persona card: role, current pressure, what they fear, hidden objective (the condition under which this conversation goes well), escalation triggers, opening line. The persona must be difficult for a *reason*, never difficult as a personality trait."
3. **Debrief:** "Ground truth: [persona card + hidden objective]. Here is the transcript. Output JSON: was the condition met (yes/partly/no); the 2 turns that most moved the outcome, quoted verbatim; ONE technique that would have changed the result, with a 2-line drill; recommended next difficulty. No general praise, no lists of ten tips."
4. **Pre-meeting quick prep (no tool):** "I'm meeting [role] on [date] to discuss [topic]. Ask me, one at a time, the 3 questions they're most likely to open with. After each of my answers, tell me only whether you'd accept it in their position and why."
5. **Post-real-meeting compare:** "Here's what actually happened in the real meeting: [notes]. Compare with my simulation transcript: what did the simulation predict correctly, and what did reality do that we should encode into a new scenario?"

## Quality rubric

| Dimension | Pass bar |
|---|---|
| Persona hold | AI stays in character all 12 turns; concedes only when condition met — 10/10 test sessions |
| Realism | TLs who lived the real scenario rate it ≥4/5 "that's how it goes" |
| Mechanism teaching | Debrief names the hidden condition and quotes real turns — never generic ("be more confident") |
| Noise budget | Exactly 2 turning points + 1 technique, every session |
| Difficulty ladder | A senior member passes level 1 easily and finds level 3 genuinely hard |
| Transfer | Users report ≥1 simulator-rehearsed move used in a real meeting within a month |

## Rollout plan

1. **Week 1:** build engine; TL interview night produces 8 war-story scenarios; internal test with AI team.
2. **Week 2:** fishbowl workshop for TLs (they adopt first — their buy-in decides everything).
3. **Week 3–4:** sparring slots appear in two live projects' calendars before real touchpoints; collect the post-real-meeting compare notes.
4. **Semester point:** scenario library v2 from the semester's actual hard moments; hand facilitation to the training lead. Voice mode evaluated only after chat adoption is proven.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| AI too soft / breaks character | 12-turn cap, condition-gated concession rule, persona-hold rubric line tested per release |
| Teaches cynicism about clients | Every persona difficult *for a reason*; debrief reveals the reason; scenarios include receptive clients at level 1 |
| Solo usage never happens | Paired sparring slots tied to calendar events — social + scheduled beats willpower |
| Sessions used to judge people | Results user-private by hard norm; no logs kept; stated in how-to |
| Simulating real named individuals | Forbidden; personas are role-based composites of war stories |
| Over-scripting (people recite lines) | Debrief outputs technique + drill, never lines; teach-don't-ghostwrite applied to speech |
