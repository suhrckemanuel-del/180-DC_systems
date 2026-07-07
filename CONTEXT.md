# CONTEXT — the one-file briefing

This file makes the whole repo legible in one read. It is written for two audiences at once: **a new team member** catching up on what has been built, and **an AI assistant** being asked to help with any part of it. If you are pasting context into a chatbot, this file alone is enough to start; paste the specific files it points to when you go deeper.

Last updated: 2026-07-07, on branch `idea/reviewer-v2`.

## 1. What this org is and what problem we solve

180 Degrees Consulting is a global student-run consultancy; branches staff teams of students who do pro bono strategy work for non-profits and small organizations. Structural realities every design decision answers to:

- **No seniors.** There is no partner reviewing work. The realistic alternative to an AI reviewer is *no substantive review at all*.
- **Total turnover.** Every person leaves within ~3 years. Institutional memory, training, and tools must survive their creators.
- **Students first.** Members are here for learning and career value. Anything that only extracts work from them fails; anything that visibly builds them succeeds.
- **Real clients, real stakes.** Deliverables go to real boards. Confidentiality and quality are not optional.

The branch AI team's mandate: (1) **Quality** — senior-reviewer treatment for every deliverable; (2) **Speed** — automate what doesn't need a human; (3) **Teaching** — the consultant learns the principle behind every fix.

## 2. The five principles (every tool obeys all five)

1. **Quote or abstain.** A claim about a document/person/org must carry verbatim evidence or state that nothing was found. This is what separates a reviewer from a plausible-sounding generator.
2. **Teach, do not ghostwrite.** Tools surface gaps and principles; the human does the rewrite. Outputs that could be forwarded unedited get blocking markers (`[ADAPT]`, `[CONFIRM]`, `[PERSONAL]`).
3. **Rank, do not reject.** Where people are evaluated, tools order and annotate; humans draw every cutoff. No pass/fail verdicts on humans.
4. **Deterministic contract.** The model returns one structured JSON object; a static template owns every pixel. Auditable, testable, demo-stable.
5. **Honest calibration.** Strong work earns a high score and few findings. Tools have noise budgets (max findings per run) and a "nothing notable" path, and get tested on known-good input.

Recurring implementation patterns: **independent verifier** (a second model call with separate context checks the first — never let a model grade its own output), **fan-out/fan-in** (one call per artifact, then a coherence pass), **eval harness** (seeded-defect test cases with known answers, written *before* the tool), **running file** (longitudinal state as a markdown/JSON file in the project folder, not a database).

## 3. Inventory — everything in the repo, with state

### Tools (`tools/`)
- **Quality Reviewer v1 — SHIPPED.** Reviews a deliverable against 5 MBB criteria; one JSON object; coaching dashboard with an attempt-before-answer lock; max 3 findings. Pilot on a real deliverable done. Entry: `tools/quality-reviewer/README.md`, contract in `SYSTEM-PROMPT.md`, validator `check-review.js`.
- **Quality Reviewer v2 — DESIGN + VALIDATION (the active workstream).** 10-dimension rubric, readiness decided by blocking issues (not averages), strict noise budget, eval harness, staged multi-agent target (reviewer → verifier → aggregate). Five synthetic eval cases passed; severity calibration fixed after an over-escalation was caught. **Real-deck gold set:** 181 past deliverables machine-triaged (sealed from labelers), 14 pseudonymised cases built (`real-01`…`real-14`), now awaiting **blind human labeling** per `eval-cases-real/labeling/PROTOCOL.md`. No gold labels exist yet; the reviewer has not run on any real case. All real-deck material — the raw intake (extracted client text, real filenames) *and* the pseudonymised case files, since they carry the full text of real client deliverables — is **local-only and gitignored**; ask Manuel for access. Only the labeling kit and specs are in the repo.
- **HR Screener — DESIGNED, gated on an HR meeting.** Blind pass → forgiving gate → pairwise tournament → verify → three buckets. Entry: `tools/hr-screening/`.
- **Deck Transform — METHODOLOGY PROVEN.** Fan-out/fan-in workflow lifting a deck toward MBB structure; source of the pptx extraction code. Entry: `tools/deck-transform/`.

### The idea pipeline (`lab/`, `guide/`, `ideas/`)
- **`lab/demos.md`** — 25 demo-able AI workflow ideas covering client acquisition, recruitment, training, project management, TL support, deliverable quality, engagement, partnerships, workshops, knowledge base. Each has 13 fields including "first demo" (the exact thing to show someone) and "how to test it."
- **`lab/ranking.md`** — all 25 scored (impact/feasibility/credibility/wow). **Top 7:** Red-Team CEO (murder-board questions on a finished deck, quote-anchored), Discovery-to-Proposal Copilot (call notes → unknowns checklist → gated SOW), Client Meeting Simulator (hidden-objective roleplay + debrief), Branch Brain (RAG over branch memory, zero-hallucination bar), TL Meeting Copilot (evidence-only people observations + decision-led agendas), Case Interview Gym (locked fact table + checkpoint debriefs), Kickoff-in-a-Box (proposal → full kickoff kit + feasibility verdict). Evidence Auditor and Chart Doctor were folded into Reviewer V2 as lenses.
- **`lab/top7/*.md`** — each top idea hardened through three critique passes (usefulness/adoption/implementation, every critique forced a design change) and specced: prototype spec, 6–8 min demo script, workshop exercise, 5-prompt pack, quality rubric, rollout plan, risks table. **These are build-ready.**
- **`guide/README.md`** — the reproducible method for the whole lab (problem inventory → 25 ideas → rank → critique → build packs → pilot), so future members can rerun it. Key lesson recorded there: the moat is never the AI, it's the unwritten branch asset (reality file, case library, war stories) — schedule those interviews first.
- **`ideas/`** — living backlog (`backlog.md`, stages: spark → shaping → ready → building → shipped → parked) and idea cards.

### People systems (`education/`)
- **`education/01-why-workshops-fail.md`** — ten failure modes of the standard workshop model (lecture illusion, just-in-case timing, no assessment, AI-taught-as-features, expert blind spot, motivation mismatch, mixed audiences, voluntarism, presenter-bound knowledge, generic drift), each with the design answer built into the system.
- **`education/02-curriculum.md`** — three literacies: Track A consulting craft (8 modules), Track B AI literacy (5 modules, starts with "catch the model lying," not prompting), Track C AI-assisted consulting (4 modules, the fusion), Track D builder/succession (4 modules). Modules fire on the **engagement lifecycle** (kickoff week teaches scoping, final weeks teach the murder board), not the academic calendar.
- **`education/03-operating-model.md`** — five session formats (clinic/drill/sparring/sprint/self-serve, none >⅓ presentation), three turnover-proof roles, the materials pipeline (Workshop Forge drafts → module files in repo → miner refreshes content from real branch failures), evidence-log assessment (not attendance), and a cold-start plan (six spine modules first).

### Research (`research/`)
Evidence base behind everything: deliverable quality anatomy, student-consulting failure modes, professional QA practice, and training/knowledge transfer (key findings: top firms train by apprenticeship + simulation, not lectures; deliberate practice beats experience; the BCG "jagged frontier" — AI helps inside its competence zone and actively harms outside it; bolt-on training retains 20–40% vs 70–90% embedded).

## 4. Current state and immediate next steps

1. **Reviewer V2 gold set:** blind human labeling of the 14 real cases per `PROTOCOL.md` (two labelers, stop rule on disagreement). Then: run the v2 reviewer on the real cases against gold; measure; iterate. This is the critical path to a defensible reviewer.
2. **Lab top-7:** Red-Team CEO is the designated first build (highest wow ÷ build cost, 1–2 days on existing code). Each pack's rollout plan starts with a ~1-week validation step.
3. **Education:** write the six spine module files (B1, B2, B4, A1, A5, C1) and run onboarding week with them.
4. **Open decisions:** HR screener is gated on the HR meeting; Branch Brain needs an "archive day" to exist; the education system needs a training lead named.

## 5. Where help is needed

- **Human labeling** (no AI skills needed): label the 14 real decks per the protocol — the single highest-value contribution right now.
- **Builders:** pick any `lab/top7/` pack and execute its prototype spec; each is self-contained.
- **TL knowledge:** 90-minute interviews to create the "reality file" (velocity norms, blackout weeks, historical failures) and the simulator's war-story scenarios — the unwritten assets several tools depend on.
- **Facilitators:** adapt and run the six spine education modules.
- **Skeptics:** sit in on critique passes; the adoption critique is best run by the least AI-enthusiastic senior member available.

## 6. Rules for working here (humans and AIs)

- **Confidentiality:** real client names, deliverables, decks and extracted text never enter the repo or any prompt outside branch-controlled accounts. Pseudonymize first, then grep for the real name before committing. The v2 intake machinery (`eval-cases-real/intake-work/`) is gitignored — keep it that way.
- **Gold labels are human-only.** Machine triage is sealed away from labelers (`SEALED-do-not-read-before-labeling`). Never show a labeler the machine's opinion.
- **Workflow:** `main` always works; experiments live on branches; changes logged in `CHANGELOG.md`.
- **The handoff test:** nothing is "shipped" until someone outside the AI team runs it without its builder in the room.
- **For AI assistants specifically:** obey the five principles in your outputs here — anchor claims in quoted evidence, don't ghostwrite deliverable content when the task is teaching, return structured output when a schema exists, and say "I don't know" over inventing branch history.

## 7. Glossary

- **Blocking issue / readiness:** v2 verdict logic — a deliverable's readiness is set by its worst blocking finding, never an average.
- **Noise budget:** hard cap on findings per run (v1: three) so signal stays trusted.
- **Coaching arc:** reviewer UX that locks the suggested fix until the consultant submits their own attempt.
- **Murder board:** Red-Team CEO output — 10 quote-anchored hostile questions, then answers graded holds/weak/exposed.
- **Gold set:** eval cases with trusted human labels; the standard the reviewer is measured against.
- **Sealed triage:** machine quality ratings of the real decks, hidden from human labelers to keep labels independent.
- **Reality file:** written branch facts (team velocity, exam blackouts, historical failure patterns) that make generated plans branch-specific.
- **Miner:** Findings-to-Curriculum Miner — clusters reviewer findings into the branch's recurring failure patterns; feeds training content and the kickoff risk register.
- **Lens:** a specialist review pass (evidence audit, chart integrity) inside Reviewer V2 rather than a standalone tool.
