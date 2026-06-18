# Session 01 — 180DC Pitch: Setup & Strategy
**Date:** 2026-06-05
**Purpose:** First working session — problem definition, deep research, strategic decisions, demo plan

---

## What This Project Is

A pitch to **180 Degrees Consulting (180DC)** — the world's largest student/pro-bono consulting organization — proposing an **AI-powered quality reviewer** for their client deliverables.

The pitch is being developed for **one specific 180DC branch** (not a global rollout). If successful, it scales.

The core proposition:
> Every 180DC deliverable gets a "McKinsey senior reviewer" treatment before it goes to the client — powered by Claude, grounded in MBB standards, and designed to teach consultants the principles behind each correction so they improve over time.

Evidence anchor: **BCG/Harvard 2023 study** (758 consultants, randomized) — AI assistance produced 40% higher quality output, with the weakest performers improving 43%. This is the kill-shot stat for the pitch.

---

## The Problem

180DC deliverables suffer from structural, evidence, and strategy quality gaps. Root causes from research:

- Students produce **research reports**, not strategy — describing what is known rather than prescribing what to do
- **No real feedback loop** — at most weekly review from peers; no senior practitioner embedded in the work
- **Generic frameworks** applied without tailoring (SWOT/Porter's used mechanically)
- **Weak narrative structure** — no governing insight, no SCR arc, slide dump instead of argument
- **Vague recommendations** — "improve marketing" without owner, timeline, or measurable outcome
- **Incentive misalignment** — students optimize for resume value, not client impact
- **No institutional memory** — every semester starts from zero

The best 180DC deliverables (like the VF one we studied) DO reach near-professional quality — but inconsistently and without a repeatable process.

---

## Research Conducted

6 parallel agents ran deep research. All findings stored in [research/](research/). Agents 3 and 6 hit rate limits; coverage from remaining 4 is comprehensive.

| Folder | Topic | Key Output |
|---|---|---|
| [01-deliverable-quality-anatomy/](research/01-deliverable-quality-anatomy/findings.md) | What makes a deliverable excellent | 8-dimension quality framework; arXiv 2025 benchmark rubric; BCG/HBS jagged frontier study |
| [02-failure-modes-student-consulting/](research/02-failure-modes-student-consulting/findings.md) | Why student consulting fails | 6-category failure taxonomy; root cause analysis; Tom Spencer primary source |
| [03-ai-augmented-research-workflows/](research/03-ai-augmented-research-workflows/) | AI workflows in consulting | Rate-limited — partial coverage in other files |
| [04-quality-assurance-professional-services/](research/04-quality-assurance-professional-services/findings.md) | How MBB/Big 4 enforce quality | QA mechanisms catalog; what transfers to 180DC; AI automation tiers |
| [05-training-and-knowledge-transfer/](research/05-training-and-knowledge-transfer/findings.md) | How consulting training works | Deliberate practice model; Cognitive Apprenticeship + LLMs; McKinsey Lilli |
| [06-180dc-context-and-landscape/](research/06-180dc-context-and-landscape/) | 180DC specifics | Rate-limited |

### Most Important Research Findings

1. **arXiv 2605.17554 (2025)** — The only MECE academic rubric purpose-built for consulting deliverables. Five criteria: Data Integrity, Analytical Rigor, Relevance & Focus, Execution Precision, Format & Deliverability. This is the academic backbone.

2. **BCG/HBS "Jagged Frontier" (Dell'Acqua et al., 2023)** — 40% quality boost; 43% improvement for bottom-half performers. AI compresses the quality distribution upward. Direct analogy to 180DC.

3. **ERIP model (Veres & Varga-Toldi, 2020, JBIM)** — Four dimensions of consulting service quality: Expertise, Relations, Involvement, Performance. Deliverables are necessary but not sufficient.

4. **Ericsson Deliberate Practice** — Expert performance requires immediate, specific, contextualized feedback on real work. This is the theoretical justification for why the reviewer must TEACH, not just flag.

5. **FeedbackWriter RCT** — Students receiving AI-mediated feedback produced significantly higher-quality revisions. Effect largest vs. no feedback (the realistic 180DC baseline).

6. **Tom Spencer, "Student Consulting — Does it deliver?" (2018)** — Primary source documenting structural quality failures in student consulting.

---

## The Deliverable We Studied

**"Deliverable 2 — VF.pdf"** — 180DC project for Verde Foods, a Dutch plant-based shelf-stable meal brand. September 2016 (but content is current and high quality).

Stored at: [Deliverable 2 - VF.pdf](Deliverable%202%20-%20TGT02.pdf)
Extracted text: [deliverable_text.txt](deliverable_text.txt)

**Why it's the benchmark:** 71 pages covering catering and distribution market fit for the Netherlands. Quality markers present: transparent scoring methodology, consistent company profiles, primary research (actual interview with CIRFOOD procurement manager), cited sources (annual reports, Rabobank, Wageningen University), specific financial data per company, actionable per-company conclusions.

**The demo plan:** Run this through the AI reviewer to produce an **improved "McKinsey benchmark" version** — showing what it looks like at the next level. This becomes V2 of the VF deliverable and the pitch demo centerpiece.

---

## Strategic Decisions Made

### What we're pitching
**AI Quality Reviewer** — back-end review of deliverables before they go to the client. Simple, scoped, demonstrable. Not a platform, not a research tool, not a system. One thing.

### Framing
> "Every deliverable gets a McKinsey senior reviewer treatment."

This framing:
- Is immediately legible to any consulting audience
- Links directly to the BCG/HBS evidence
- Makes the value concrete (not "AI tools" but a specific, familiar function)

### The learning loop (critical design principle)
The reviewer is NOT just a quality gate — it's a training mechanism. Each flagged issue outputs:
1. **Issue** — what's wrong, specifically
2. **Why it matters** — the principle behind it (teaches, not just corrects)
3. **Suggested fix** — specific rewrite or concrete action

Over time, consultants internalize the standards. The correction frequency drops. This maps directly to Ericsson's deliberate practice model and is the honest answer to "won't this create dependency on AI?"

### The ask for the pitch
Smallest possible yes: **run one pilot project through the reviewer this semester.** Before/after quality comparison, documented. A branch director can say yes to this in five minutes.

---

## Quality Criteria (Full Framework)

### V1 — Demo this (5 criteria, text-evaluable, highest ROI)
| # | Criterion | What it checks |
|---|---|---|
| 1 | **Action titles** | Every slide headline is a complete sentence stating a conclusion, not a topic label |
| 2 | **Governing insight** | There is one clear answer to the client's core question — readable from titles alone |
| 3 | **Recommendation specificity** | Each recommendation names a specific action, implies an owner, defines success |
| 4 | **Evidence sourcing** | Every major claim has a cited source; no unsupported assertions |
| 5 | **Actionability** | Recommendations are implementable given this specific client's constraints |

### V2 — Reference in pitch roadmap (adds depth and research-grounding)
| # | Criterion | What it checks |
|---|---|---|
| 6 | **MECE structure** | Analysis sections are mutually exclusive and collectively exhaustive |
| 7 | **SCR narrative** | Deck follows Situation → Complication → Resolution arc |
| 8 | **Methodology transparency** | Scoring criteria and evaluation approach explained before conclusions |
| 9 | **Client-contextual fit** | Recommendations reflect THIS client's specific situation, not generic best practice |
| 10 | **Primary research presence** | Evidence of original research beyond secondary sources |

### V3 — Build toward (requires track record)
- Trend tracking per consultant across projects
- Benchmarking against best past deliverables in branch knowledge base
- Personalized coaching based on recurring weaknesses
- Institutional memory layer (past deliverables as reference)

---

## Demo Plan

### Two deliverables
1. **VF deliverable (we have this)** — run through the full V1+V2 criteria → produce an improved "McKinsey benchmark" version showing what the next level looks like
2. **A second deliverable (Manuel to get from VP)** — a more typical/weaker one → run through same criteria → show the gap and the value of the review

### Political note on the second deliverable
Don't frame it as "a bad deliverable." Frame it as "a representative first draft." Consider anonymizing the client name. VPs don't love seeing their org's weak work called out — handle with care.

### Demo flow in the pitch
1. "Here's what a great deliverable looks like" → show VF highlights (benchmark)
2. "Here's what the AI reviewer found even in this great one — and here's the improved version" → shows discernment, not just rubber-stamping
3. "Here's a more typical deliverable" → run live or show pre-run output → shows real value
4. "Here's the research behind each criterion" → briefly reference BCG/HBS, arXiv rubric
5. "Here's the ask" → one pilot project this semester

---

## Open Questions / Next Steps

- [ ] Get second (weaker) deliverable from VP
- [ ] Build the AI reviewer prompt (V1 criteria, with learning loop output format)
- [ ] Run VF through it → produce improved "McKinsey benchmark" version
- [ ] Run second deliverable through it → document findings
- [ ] Decide: does the pitch include a live demo or pre-run output?
- [ ] What does the branch director need to say yes? (Decision rights, timeline, team buy-in)

---

## File Structure

```
180/
├── claude/
│   ├── session-01-setup.md          ← this file
│   ├── Deliverable 2 - VF.pdf    ← benchmark deliverable
│   ├── deliverable_text.txt          ← extracted text for AI review
│   ├── research/
│   │   ├── 01-deliverable-quality-anatomy/findings.md
│   │   ├── 02-failure-modes-student-consulting/findings.md
│   │   ├── 03-ai-augmented-research-workflows/        ← rate limited, partial
│   │   ├── 04-quality-assurance-professional-services/findings.md
│   │   ├── 05-training-and-knowledge-transfer/findings.md
│   │   └── 06-180dc-context-and-landscape/            ← rate limited, partial
│   └── diligence-memo/              ← synthesis memo (not yet written)
```

---

## Key Quotes for the Pitch

> "AI-assisted consultants completed 12.2% more tasks, worked 25.1% faster, and produced work rated 32% higher in quality by human graders. The strongest effect was on the lower half of performers: 43% quality improvement." — Dell'Acqua et al., Harvard/BCG, 2023

> "Student consulting work product is more akin to a research report than problem analysis or strategy, and in my experience, not particularly insightful." — Tom Spencer, 2018

> "Clients do not always engage consultants to provide the services they consider most valuable. 57% of clients said coaching client staff to perform project activities was the best way to deliver value." — CMCE UK Research Report

> "A partner can flip through a 50-slide deck, read only the titles, and understand your complete argument — if any title is a topic rather than a conclusion, the chain breaks." — MBB practitioner standard

---

*Session ended mid-stream. Next session: build the AI reviewer prompt, run VF through it, produce improved benchmark version.*
