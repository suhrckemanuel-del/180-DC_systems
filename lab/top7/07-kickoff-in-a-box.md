# Kickoff-in-a-Box

Feed a signed proposal; get the complete project setup — workplan, RACI, pre-seeded risk register, kickoff agenda, interview guides, folder skeleton — each artefact marked where team judgment must adapt it. Every project starts at the standard of the branch's best TL.

## Critique passes

### Pass 1 — usefulness critique
**Critique:** Template generation is the most commoditized AI trick there is; a TL can already ask ChatGPT for "a workplan for a market study." The box only earns its place if the artefacts encode *branch-specific* knowledge a generic prompt can't have: how long things actually take student teams (nights-and-weekends velocity, exam blackout weeks), which risks actually materialize here, what this client type is actually like. A generic-but-formatted kit is worse than none — it looks like planning without being planning.
**Changes made:** (a) The box's core asset is a **branch reality file** (checked into the repo): real velocity norms ("a 4-person team produces ~1 polished analysis workstream per 2 weeks"), the academic calendar with blackout weeks, client-type notes, and the historical failure patterns per project type (from the Findings-to-Curriculum Miner, demo #10, or hand-written v0). Every artefact must draw on it — the workplan schedules around the actual exam period. (b) The risk register is the flagship artefact, not the workplan: each risk pre-seeded with *this project type's* historical failure, its early-warning sign, and its week-number of typical onset. (c) Added a **feasibility check**: the box compares SOW scope against velocity norms and timeline, and says so when the math doesn't close ("this SOW implies 3 workstreams in 8 effective weeks; branch norm is 2 — cut scope or extend") — the single most valuable sentence a week-1 team can read.

### Pass 2 — adoption critique
**Critique:** The failure mode is written into the original card: rubber-stamping. A beautiful generated kit invites teams to skip the thinking the kit was supposed to provoke — worse structure-theater than no kit. Also TLs with their own systems will resent standardization, and the box is upstream of everything (needs the SOW), so a weak proposal makes a confident-looking garbage kit.
**Changes made:** (a) The `[ADAPT]` markers become **blocking questions, not markers**: each artefact ships with 3–5 questions the team must answer in their own words at the kickoff meeting ("this RACI makes Priya own client comms — why might that be wrong for this team?"), and the kit's cover page is the answer sheet. The team review isn't a checklist pass; it's the kit's real product. (b) Standardization is scoped: the six artefacts are the branch *minimum*, strong TLs may exceed and replace — the box's how-to says explicitly "this is the floor, not the ceiling." (c) Garbage-in is handled by an input gate: the box first runs the SOW against the Discovery-to-Proposal unknowns checklist (demo #2's schema); if fatal unknowns are open, it outputs the gap list instead of a kit — refusing to build on sand, and pushing adoption of the upstream tool.

### Pass 3 — implementation critique
**Critique:** Six artefacts in one generation invites mediocrity across all of them; long single calls degrade. Branch reality data doesn't exist yet in written form — the box's moat is a file nobody has written. Format churn (teams use Docs/Sheets/Notion inconsistently) can eat the value in conversion friction.
**Changes made:** (a) **One call per artefact**, each with the SOW + reality file + that artefact's template and quality bar; a final coherence pass checks cross-artefact consistency (workplan phases match RACI activities match risk-register timing). Fan-out/fan-in — the Deck Transform methodology reused. (b) The reality file v0 is produced in a **90-minute structured interview with the 2–3 most experienced TLs** (velocity, blackouts, what killed past projects) — explicitly scheduled as the first build task; the file lives in the repo and the Miner (#10) enriches it each semester. (c) Output is markdown-first (renders everywhere, converts anywhere) with the folder skeleton created as an actual folder tree by a small script — the one artefact that should be *done* rather than described.

## Prototype spec

- **Input:** signed proposal/SOW; branch reality file; artefact templates (6).
- **Pipeline:** input gate (unknowns check → gap list or proceed) → fan-out: 6 artefact calls (workplan, RACI, risk register, kickoff agenda, stakeholder interview guide, comms plan) → coherence pass → render: markdown pack + real folder tree + cover-page answer sheet with the blocking questions.
- **Feasibility check:** runs inside the workplan call; verdict line at the top of the pack (CLOSES / TIGHT / DOES NOT CLOSE with the arithmetic shown).
- **Build estimate:** 2 days + the 90-minute TL interview (the critical path).
- **Cost:** ~7 calls per project, a few times per semester.
- **Non-goals:** replacing the kickoff meeting (it feeds it), client-facing documents, enforcing tool choice beyond the minimum six.

## Demo script (7 minutes)

1. *(45s)* "Week one of every project is reinvented from scratch. Whether a team starts well currently depends on whether their TL happens to have done this before. Here's a one-page signed proposal."
2. *(90s)* Run it. Show the pack landing: six artefacts, folder tree created live in the file explorer. Then immediately: "But the interesting part is the top line." Show the feasibility verdict: "TIGHT: 3 workstreams, 9 calendar weeks minus exam blackout = 7 effective. Branch norm says 2.5. Recommend cutting workstream 3 to a desk review."
3. *(2m)* Open the risk register: "Market-study for a non-profit — the box knows what killed the last three of these here: client data arriving late (typical onset: week 3, early sign: unanswered email #2). This isn't a generic risk list. It's this branch's scar tissue, organized."
4. *(90s)* Show the cover page: the blocking questions. "The kit is deliberately unfinished. The team must answer these at kickoff, in their own words. The box does the formatting so the team does the thinking — not the other way around."
5. *(45s)* Close: "Ninety seconds of generation, one kickoff meeting of adaptation, and every project starts at the standard of our best TL — including the ones led by someone doing it for the first time."

## Workshop exercise (50 min, TL training — pairs with the TL Meeting Copilot session)

- **Round 1 (10m):** teams get the same one-page proposal and 15 minutes of planning materials; plan week 1 by hand. (Time pressure is deliberate — that's real life.)
- **Round 2 (10m):** generate the kit. Teams diff their plan against it: what did the box catch that they missed (usually: the exam blackout, the data-dependency risk)? What did *they* have that the box didn't (client-specific nuance — the point of `[ADAPT]`)?
- **Round 3 (20m):** the kickoff simulation — teams answer the cover page's blocking questions in their own words, then defend one adaptation to the room.
- **Exit (10m):** each TL runs the input gate against their real project's SOW; anyone whose SOW fails the gate leaves with the gap list and a plan to close it — the workshop's most valuable possible outcome.

## Consultant prompt pack

1. **Input gate:** "Check this SOW against the unknowns checklist [schema from Discovery-to-Proposal]. If any FATAL unknown is open (no success metric, no decision-maker, no data-access agreement), output only the gap list and stop. Do not generate a kit on an unscoped project."
2. **Workplan:** "Using the SOW, the reality file (velocity norms, academic calendar), build a phase plan. Schedule around blackout weeks explicitly. Top line: feasibility verdict with the arithmetic. Every phase ends in a named artefact, not an activity."
3. **Risk register:** "For a [project type] engagement, seed risks from the reality file's historical failures: each with early-warning sign, typical onset week, owner, and the pre-agreed response. Add max 2 project-specific risks from the SOW. No generic risks ('scope creep may occur') without this project's specific version of it."
4. **RACI + blocking questions:** "Draft the RACI from the SOW's workstreams and team roster. Then write 3 questions that attack your own draft's most contestable assignments, phrased for the team to answer at kickoff."
5. **Coherence pass:** "Here are all six artefacts. List every cross-artefact contradiction (phase names, dates, owners, activities that appear in one and not another). Fix nothing — report only."

## Quality rubric

| Dimension | Pass bar |
|---|---|
| Reality grounding | Workplan reflects blackout weeks and velocity norms — checked against the reality file, 5/5 test runs |
| Feasibility honesty | On a deliberately overstuffed test SOW, verdict says DOES NOT CLOSE with correct arithmetic |
| Risk specificity | Zero generic risks; every seeded risk has onset week + early-warning sign |
| Gate integrity | Kit refuses to generate on a test SOW with a fatal unknown |
| Coherence | Zero cross-artefact contradictions surviving the coherence pass |
| Anti-rubber-stamp | Pilot teams' answer sheets show ≥3 substantive adaptations (not "looks good") — reviewed by hand |
| TL verdict | Experienced TLs rate the kit ≥ their own historical week-1 setup |

## Rollout plan

1. **Week 1:** the 90-minute TL interview → reality file v0 (this is the critical path and the most reusable asset in the whole portfolio); build pipeline.
2. **Week 2:** back-test on last semester's proposals; the TLs who ran those projects review the kits against what they actually built and what actually went wrong ("would this risk register have warned you?").
3. **Next project start:** live pilot; the AI team sits in the kickoff meeting to watch the blocking-questions session work or not.
4. **Semester point:** reality file enriched from the semester's Miner output (#10); box becomes standard at engagement approval — exec approves a project *with* its feasibility verdict attached, which quietly makes the input gate (and therefore good scoping) mandatory branch-wide.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Rubber-stamping | Blocking questions with team-written answer sheet; anti-rubber-stamp rubric line; kickoff simulation in TL training |
| Generic kit (no moat) | Reality file as mandatory input; risk-specificity rubric line; back-test against real TLs' judgment |
| Garbage in (weak SOW) | Input gate refuses; pushes upstream adoption of Discovery-to-Proposal |
| Reality file never written / rots | Scheduled as build task #1 with named interviewees; Miner enrichment each semester; lives in the repo |
| Standardization resentment | "Floor, not ceiling" policy in the how-to; strong TLs replace artefacts freely |
| Feasibility verdict ignored under pitch pressure | Verdict attached to exec engagement approval — visibility at the decision moment, not just in the team folder |
