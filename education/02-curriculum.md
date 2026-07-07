# The Curriculum: Three Literacies + a Builder Track

What the branch teaches, organized as three literacies that build on each other, plus a small track that keeps the system alive after the current AI team graduates. Every module lists: format, the moment it fires, the artifact it produces, and the evidence that it worked. Formats are defined in [03-operating-model.md](03-operating-model.md#formats).

The design bet, stated plainly: **craft and AI literacy are taught separately first, then fused.** Teaching AI-assisted consulting to someone with neither is how you get confident garbage at machine speed (the jagged-frontier failure, [research/05 F4–F5](../research/05-training-and-knowledge-transfer/findings.md)).

## Track A — Consulting craft

The skills that make a consultant, taught tool-assisted but valuable with no AI at all.

| # | Module | What it teaches | Format / moment | Artifact produced | Evidence of learning |
|---|---|---|---|---|---|
| A1 | Problem before answer | Problem statements, the unknowns discipline, challenging the client's framing | Kickoff-week clinic, uses the team's live SOW ([Discovery-to-Proposal](../lab/top7/02-discovery-to-proposal.md) exercise) | The team's real scoping memo | Catches ≥4/5 buried gaps in the test transcript |
| A2 | Storyline first | Governing thought, key-line logic, vertical/horizontal tests | Mid-project clinic at storyboard time ([Storyline Trainer](../lab/demos.md#8-storyline-trainer)) | The team's real one-page storyline | Storyline survives the trainer's named tests; orphan findings identified |
| A3 | Evidence discipline | Claims, citations, internal consistency; quote-or-abstain as personal standard | Drill session, week 4–5 (Evidence Auditor exercise from [demos #17](../lab/demos.md#17-evidence-auditor)) | Claims register of their own draft | Finds 3/3 seeded flaws in the practice one-pager |
| A4 | Charts that don't lie | Message-title match, chart-type choice, axis honesty | "Chart crimes" gallery drill (Chart Doctor exercise, [demos #16](../lab/demos.md#16-chart-doctor)) | Fixed exhibits from their own deck | Diagnoses ≥7/10 gallery flaws before the tool reveal |
| A5 | Surviving the room | Anticipating hostile questions, defending under pressure | Pre-final murder board ([Red-Team CEO](../lab/top7/01-red-team-ceo.md) workshop) | Answered murder-board sheet | ≥⅔ of answers graded HOLDS on second pass |
| A6 | Client conversations | Update meetings, scope pushback, bad news | Sparring slots, 2 days before real touchpoints ([Client Meeting Simulator](../lab/top7/03-client-meeting-simulator.md)) | Debrief card + one drilled technique | Hidden-objective condition met at difficulty 2 |
| A7 | Feedback that lands | SBI structure, hard conversations | TL track + open drill (Feedback Phrasebook exercise, [demos #15](../lab/demos.md#15-feedback-phrasebook)) | Delivered practice feedback, partner-scored | Partner rates it actionable + fair, blind |
| A8 | Case thinking | Structure, hypothesis discipline, quant comfort | Self-serve reps ([Case Interview Gym](../lab/top7/06-case-interview-gym.md)), onboarding + pre-recruitment | Session debriefs, drill streaks | Checkpoint profile improves across 3 sessions |

## Track B — AI literacy

The judgment layer. Deliberately starts with distrust, ends with fluency. No client data in any Track B exercise.

| # | Module | What it teaches | Format / moment | Artifact produced | Evidence of learning |
|---|---|---|---|---|---|
| B1 | Catch the model lying | Failure modes: hallucination, sycophancy, plausible-wrong answers, confident miscitation | Onboarding week drill: learners fact-check 6 AI outputs, 3 seeded with realistic errors | Personal "verification checklist" they wrote | Catches 3/3 seeded errors; can name *why* each was plausible |
| B2 | Quote or abstain, by hand | Demanding evidence from a model; structured outputs; making AI show its work | Drill: same task run twice — freeform vs evidence-anchored prompt — learners diff the trustworthiness | Their own evidence-anchored prompt template | Rewrites a freeform prompt so every claim carries a source |
| B3 | Delegate, direct, verify | What to hand AI (drafts, critique, options) vs own (judgment, client contact, final words); the centaur workflow | Clinic with live project tasks sorted into delegate/direct/verify columns | A personal delegation map for their current role | Correctly sorts 8/10 task cards, defends the hard two |
| B4 | Confidentiality reflexes | What never enters a prompt; anonymization habit; branch policy as muscle memory | 20-min drill inside onboarding, repeated at kickoff: anonymize a realistic doc against the clock | Anonymized practice doc | Zero identifying details survive their pass (peer-checked) |
| B5 | Prompt patterns that survive | The branch pattern library: role+evidence+schema+abstain-path; iteration discipline | Self-serve + drill; patterns from the [top-7 prompt packs](../lab/top7/) | 2 reusable prompts for their actual role | Their prompt produces evidence-anchored output on first run |

## Track C — AI-assisted consulting (the fusion)

Where the branch's actual edge lives: running the tools *as a discipline*, on real work. Prerequisite: A-module for the craft + B1–B3.

| # | Module | What it teaches | Format / moment | Artifact produced | Evidence of learning |
|---|---|---|---|---|---|
| C1 | The reviewed consultant | Working with the Quality Reviewer: reading findings, attempting fixes, defending disagreements (a finding is a claim, not a verdict) | First-project ritual, at draft 1 | Their revision + a logged disagreement (if any) | Fix attempt addresses the principle, not just the instance |
| C2 | The full quality stack | Sequencing the tools across an engagement: scoping memo → kickoff box → storyline → evidence audit → murder board | TL track clinic, tabletop on a fictional engagement | A quality plan for their real project | Plan places each tool at the right week with the right owner |
| C3 | Centaur deliverable sprint | Producing a section with AI as junior: AI drafts/critiques, human structures/verifies/owns | Half-day sprint, mid-semester, real project material | A shipped deliverable section + a process log | Section passes the reviewer with ≤1 major finding; log shows verification steps |
| C4 | When not to use AI | Recognizing the frontier's far side: novel client context, thin data, relationship judgment, anything you can't verify | Case discussion: 6 real scenarios, some where AI use was the mistake | Personal "red lines" list | Correctly identifies the 2 trap scenarios and says why |

## Track D — Builder track (succession)

For the 2–3 members who will *be* the AI team next. Small by design.

| # | Module | What it teaches | Artifact produced |
|---|---|---|---|
| D1 | Run the lab | The [guide](../guide/README.md): problem inventory → ideas → ranking → critique passes → build packs | One new idea card taken through all three critique passes |
| D2 | Build a tool | Deterministic contract, schema validation, static rendering, eval harness (the [Reviewer V2 pattern](../tools/quality-reviewer/v2/)) | A working micro-tool with a 10-case eval |
| D3 | Teach a module | Facilitation from the stumble guide; Workshop Forge as co-author | One module run solo, exit-check scored |
| D4 | Keep the memory | Branch Brain ingestion, the miner, the handoff test ("shipped = runs without you in the room") | A completed project handover interview + one module refreshed from mined findings |

## When modules fire

The calendar is the engagement lifecycle, not the semester ([why](01-why-workshops-fail.md#2-just-in-case-timing)):

```
Onboarding week      B1 B2 B4 A8        (before touching any project)
Project week 1-2     A1 C1-intro B3     (kickoff clinic, live SOW)
Project week 3-5     A2 A3 B5           (storyboard + evidence clinics, live draft)
Project week 6-7     A4 C3              (exhibits + centaur sprint)
Final 2 weeks        A5 A6              (murder board + sparring slots)
TL track (parallel)  A7 C2 C4           (+ TL Copilot and Kickoff-in-a-Box onboarding)
Recruitment season   A8 published to applicants
Semester close       D4: miner refresh, handovers, module retro
```

A first-semester member touches ~8 modules totalling under 10 hours, almost all of it spent on their own live project. That is the point.
