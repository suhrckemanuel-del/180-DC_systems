# The Operating Model: How Education Actually Runs

The delivery engine behind the [curriculum](02-curriculum.md): formats, roles, the materials pipeline, assessment, and the loop that makes the system improve itself. Designed against the ten failure modes in [01-why-workshops-fail.md](01-why-workshops-fail.md) and the branch's hardest constraint: **everyone who runs this graduates.**

## Formats

Five formats, each with a fixed shape so anyone can run them. No format exceeds ⅓ presentation.

| Format | Length | Shape | Used for |
|---|---|---|---|
| **Clinic** | 50–60 min | Hook demo (5) → humans attempt on live project material (20) → tool/expert comparison (10) → apply to own work (20) → exit check (5) | A1, A2, C2 — the moment-of-need modules |
| **Drill** | 15–25 min | Attempt → reveal → principle → next rep, difficulty adapting (~70% success target) | A3, A4, B1, B2, B4 — skills that need reps |
| **Sparring slot** | 20 min, paired | Scenario run + observer rubric + debrief compare | A6, A5 defense round |
| **Sprint** | Half day | Real deliverable section, AI-as-junior, process log mandatory | C3 |
| **Self-serve** | Any | Module file + prompt pack, run alone or pasted into a chatbot as co-facilitator | A8, B5, refreshers of anything |

Every format ends with an artifact the learner keeps ([failure mode 6](01-why-workshops-fail.md#6-motivation-mismatch)) and an exit check (failure mode 3).

## Roles

Three roles, defined so they survive turnover. Each has a one-page how-to; the handoff test applies: the role isn't real until someone new runs it without its designer in the room.

- **Training lead** (exec role): owns the calendar, schedules modules against project lifecycles, reads the quality loop, decides what gets rebuilt. ~2 hrs/week.
- **Facilitators** (any member, Track D3 graduates preferred): run clinics and drills *from the module file*. The stumble guide in each module is what makes this possible — facilitation is a taught skill here, not a personality.
- **Memory keeper** (shared with [Branch Brain](../lab/top7/04-branch-brain.md)): runs the semester-close miner refresh so content stays branch-specific, and ingests module retros.

Deliberately absent: a single "workshop person." That's [failure mode 9](01-why-workshops-fail.md#9-presenter-bound-knowledge) with a name tag.

## The materials pipeline

```
new tool or principle
      │
      ▼
Workshop Forge draft ──► facilitator adapts ──► module file lands in education/modules/
      ▲                                              │
      │                                              ▼
Findings-to-Curriculum Miner                    runs each cycle
(semester refresh: real branch                       │
 failure patterns → new drills,                      ▼
 updated examples)                              exit checks + retro notes
      ▲                                              │
      └──────────────────────────────────────────────┘
```

Module file standard (one markdown file per module, `education/modules/<id>-<slug>.md`):
front-matter (id, track, format, moment, prerequisites) → learning objective → facilitator script beats → exercises with datasets → stumble guide → exit check → prompt pack. The file must be complete enough that **a member with zero prep can run the session from it, and a member with zero facilitator can paste it into a chatbot and be coached through it solo.** That double bar is the whole standard.

## Assessment: the evidence log

Attendance is not tracked; evidence is. Each member accumulates a light evidence log (the [Skill Passport](../lab/demos.md#20-skill-passport)'s minimum viable version): module exit checks passed, drills at level, artifacts produced (their storyline, their murder-board sheet, their debriefs).

- Member-owned and private by default; the member chooses what becomes CV material.
- Placement (level 1 vs 2, TL-track eligibility) reads the log, not seniority.
- Nothing here gates membership or staffing by itself — rank-don't-reject applies to learning too.

## The quality loop

1. **Exit checks** per session → module hit-rate (what % demonstrated the evidence).
2. **Transfer checks** downstream: does the reviewer see fewer of the failure pattern the module teaches? (The Miner measures exactly this — teaching effectiveness read from real deliverable quality, the only metric that matters.)
3. **Semester retro**: bottom module by hit-rate gets rebuilt or killed; top module's pattern gets copied. In writing, in this repo.

## Confidentiality rules for teaching

- Track B exercises never use client data — synthetic and public material only.
- Clinics use the team's *own* live project material, inside that team.
- Anything that becomes shared teaching material (gallery examples, drill content) goes through the anonymization pass first, same standard as [the repo policy](../README.md#confidentiality).

## Cold-start plan (first semester of the system)

1. Write module files for the spine only: B1, B2, B4 (onboarding), A1 (kickoff clinic), A5 (murder board), C1 (reviewer ritual). Six files. Workshop Forge drafts, humans adapt.
2. Run onboarding week with B1/B2/B4 for the new cohort; run A1 and A5 on the semester's real projects at their natural moments.
3. Track exit checks manually (a spreadsheet is fine).
4. Semester close: first miner run, first retro, write the next 4 modules from what the data says the branch actually needs — not from this document's guesses.

The rest of the curriculum table is a map, not a mandate. Build modules when their moment approaches, never in advance stockpiles ([failure mode 2](01-why-workshops-fail.md#2-just-in-case-timing), applied to ourselves).
