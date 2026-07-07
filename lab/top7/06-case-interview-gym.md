# Case Interview Gym

An AI interviewer that runs 20-minute practice cases tuned to 180DC-style problems, with a quoted-evidence debrief and drills — leveling the recruitment playing field and doubling as pre-onboarding training.

## Critique passes

### Pass 1 — usefulness critique
**Critique:** Case-prep AI already exists (candidates use ChatGPT for this today, badly). The gym is only worth building if it does what generic prep can't: match how *this branch* actually interviews and consults (non-profit strategy, ambiguous scope, empathy for resource-poor clients — not MBB profit trees), and produce a debrief that's evidence rather than flattery. Also, an unstructured "score 4 dimensions" debrief invites the model to grade generously and uniformly, teaching nothing.
**Changes made:** (a) Cases are **branch-written and branch-shaped**: a food bank's donor concentration problem, a youth charity's volunteer churn — with facts-to-release tables and a defined "good answer space" written by senior members. The gym's moat is the case library, not the AI. (b) Debrief is anchored to **behavioral checkpoints defined per case** ("did they ask what success means to the org?", "did they sanity-check the donor number before using it?") — the model checks observed/not-observed with the quote, rather than free-grading. (c) Every debrief dimension maps to a **drill**, and the gym's follow-up mode runs just that drill (5 minutes on hypothesis-first answers) — practice loops, not verdicts.

### Pass 2 — adoption critique
**Critique:** Two audiences with a conflict: applicants (want an edge; will use anything) and the recruitment process itself (if the gym trains applicants on branch-style cases, does it just teach the test and erase the signal interviews measure?). Meanwhile new consultants — the higher-value training audience — won't use a thing labeled "interview prep" after they're already in.
**Changes made:** (a) Embrace teaching-the-test deliberately: the branch *publishes* the gym to all applicants as part of recruitment ("we care about potential, not prior access to case-prep culture — here's the same prep for everyone"). What interviews then measure is learning slope, which is the honest signal anyway. Fairness becomes the recruitment pitch. (b) Real interviews use **held-out cases** the gym never contains; the gym trains the skill, not the answers. (c) Post-recruitment audience gets a re-skin, not a new tool: the same engine labeled "client-thinking reps" inside onboarding week, with the first case being a simplified version of each new member's *actual assigned project domain* — prep that's obviously not interview prep.

### Pass 3 — implementation critique
**Critique:** Drip-feeding case facts is where roleplay engines break: the model volunteers data too early, invents numbers not in the case pack, or loses track of what's been revealed. A 20-minute session plus debrief is long; state management matters. Voice is the realistic medium for interviews but adds friction.
**Changes made:** (a) The case pack is structured as a **locked fact table** (id, fact, release-condition); the interviewer prompt may only reveal facts by id when the candidate's question matches the release condition, and a session log tracks revealed ids — invention is detectable mechanically (any number in the transcript not traceable to a released fact id fails QA). (b) Debrief runs as a separate call on transcript + case pack + checkpoint list (the Reviewer V2 verifier pattern, third use in this portfolio). (c) Chat-first again, but with a **time-boxed structure** (the interviewer announces phase transitions: clarify → structure → analyze → recommend) so sessions end on time without a clock process; voice is a v2 upgrade after case library and QA are proven.

## Prototype spec

- **Case pack format:** brief (2 paragraphs), locked fact table (~15 facts with release conditions), behavioral checkpoints (6–8), good-answer space notes, difficulty tag. Library v0: 4 cases written by senior members in one evening workshop.
- **Session:** 4 announced phases, ~20 minutes, 25-turn cap; interviewer reveals facts only by matched release condition; session log records revealed ids.
- **Debrief pipeline:** separate call → JSON: per-checkpoint observed/not-observed + verbatim quote, 2 strengths, 2 drills (each linked to a 5-minute follow-up mode), no overall score, no pass/fail.
- **Build estimate:** 2 days engine + 1 case-writing evening. QA harness: seeded transcripts checked for fact-invention.
- **Non-goals:** pass/fail verdicts, feeding results to recruiters (hard wall — the gym never reports on applicants), MBB-clone profit cases.

## Demo script (8 minutes)

1. *(45s)* "Case interviews measure whether you grew up around consulting culture. We'd rather measure potential. So we give every applicant the same coach."
2. *(3m)* Volunteer does a compressed live case (pre-shortened: clarify + structure phases only). The room watches the interviewer refuse a fishing question — "What would you like to know that for?" — and release a fact when properly earned.
3. *(2m)* Debrief renders: checkpoints with quotes — "Asked what success means to the org: OBSERVED — 'before anything, what does the food bank consider a win?'... Sanity-checked the donor figure: NOT OBSERVED — the 40% number was used unchecked at turn 9."
4. *(90s)* Show the drill link: tap "sanity-check drill" → a 5-minute follow-up session starts with three numbers to gut-check. "The debrief isn't a grade. It's a workout plan."
5. *(45s)* Close on the policy: "Published to every applicant. Interviews use cases the gym has never seen. What we end up measuring is who learns — which is who we want."

## Workshop exercise (55 min)

- **For recruitment team / senior members — the case-writing workshop (this doubles as content production):**
- **Round 1 (10m):** dissect one existing case pack: brief, fact table, release conditions, checkpoints. Name why each checkpoint exists.
- **Round 2 (20m):** pairs write a new case from a provided real-world seed (a local non-profit's public annual report): brief, 10 facts with release conditions, 5 checkpoints.
- **Round 3 (15m):** pairs swap and playtest each other's case against the gym engine; note where the fact table leaks or starves.
- **Round 4 (10m):** the two best cases are adopted into the library on the spot; authors credited in the pack.
- **For applicants, the workshop is simpler:** everyone runs a 15-minute case simultaneously, swaps debriefs with a neighbor, and checks the quotes are fair — teaching both case skills and healthy skepticism of AI graders.

## Consultant prompt pack

1. **Interviewer:** "Run case pack [X]. Announce phases: clarify, structure, analyze, recommend. Reveal a fact ONLY when the candidate's question matches its release condition; reveal by restating the fact exactly. If asked something not in the fact table, say the client doesn't have that data. Push back once on any unstructured answer ('what's your hypothesis before we look?'). Never teach during the session."
2. **Debrief:** "Ground truth: case pack + checkpoint list + session log of revealed fact ids. From the transcript: mark each checkpoint OBSERVED/NOT OBSERVED with the verbatim quote or the turn where it should have happened; 2 strengths with quotes; 2 drills chosen from the drill catalog. No overall score. Flag any number in the candidate's reasoning not traceable to a revealed fact id."
3. **Drill runner:** "Run drill [sanity-check / hypothesis-first / so-what / synthesis-under-time]: 5 minutes, 3 reps, one line of feedback per rep, harder each rep."
4. **Case writer:** "From this annual report, draft a case pack: 2-paragraph brief with a genuine tension, 10-fact locked table (each with a release condition phrased as 'candidate asks about…'), 5 behavioral checkpoints a strong candidate would hit, good-answer space (2–3 defensible recommendations and why each could be right)."
5. **Self-serve (no engine):** "Interview me on a case about [org type] facing [problem]. Make me earn every fact. After 15 minutes, tell me the three questions I never asked."

## Quality rubric

| Dimension | Pass bar |
|---|---|
| Fact integrity | 0 invented numbers across 10 QA transcripts (mechanical check vs fact ids) |
| Release discipline | ≥90% of reveals match their release condition on audit |
| Checkpoint fidelity | Debrief quotes are verbatim and correctly located — 10/10 sessions |
| Discrimination | 3 members of known different skill levels produce visibly different checkpoint profiles |
| No verdicts | Zero pass/fail or overall-score language in any output |
| Drill loop | ≥50% of pilot users run at least one follow-up drill unprompted |

## Rollout plan

1. **Week 1–2:** engine + QA harness; case-writing evening produces 4 packs; discrimination test with 3 members.
2. **Week 3–4:** pilot with current members as "client-thinking reps"; fix fact-table leaks found in playtesting.
3. **Recruitment cycle:** publish to all applicants with the fairness framing; interviews switch to held-out cases; measure — did interview performance spread narrow (access gap closing) while learning-slope signal held?
4. **Post-recruitment:** onboarding re-skin with project-domain cases; case library grows one pack per semester via the workshop (which is also how case-writing skill propagates).

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Model invents case facts | Locked fact table + mechanical id-trace QA; hard fail in rubric |
| Gym results leak into selection | Hard wall stated publicly: the gym never reports on applicants; no accounts, no logs tied to names |
| Teaching the test erases interview signal | Held-out cases for real interviews; published-to-everyone policy makes remaining signal = learning slope |
| Debrief flattery | Checkpoint-anchored grading, not free scoring; discrimination test in rubric |
| Case library staleness/leakage | One new pack per semester via workshop; retire packs used in >2 cycles |
| Applicants over-trusting the AI's drills | No-verdict rule; debrief footer: "this measures this session, not you" |
