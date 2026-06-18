# Session Summary — Workflow AI-OS / 180DC McKinsey Transform

---

## What you came in with

A pre-designed fan-out/fan-in workflow prompt (`mckinsey_transform_prompt.md`) for transforming a 180 Degrees Consulting patent strategy deck for client Vantage IP into a McKinsey-tier deliverable. The design included:
- 5 parallel specialist agents, each seeing only their relevant data slice (~2K tokens each vs. 62K for the full deck)
- A synthesis agent that resolves conflicts across outputs
- A PPTX writer that applies the unified change manifest
- The core insight: fan-out forces structured JSON output; synthesis only sees those JSONs (~3K tokens total), not the raw deck

---

## What you asked me to do

1. **Run the workflow** — execute all 5 agents in parallel, synthesize, build the PPTX
2. **Open the output** in PowerPoint
3. **Run a second research fan-out** — investigate: printingpress.dev, available MCPs, real patent acquisition cost data, 180DC design standards
4. **Improve and re-run** — apply research findings to fix design and financial data
5. **Explain the methodology** — frameworks, research sources, most impactful before/after, pitch readiness assessment

---

## What I built and ran

### Phase 1 — The Transform Workflow

**5 parallel agents:**

| Agent | Task | Context load |
|---|---|---|
| Title Rewriter | Rewrote all 35 slide titles as action-insight sentences | ~2K tokens |
| Exec Summary Drafter | Wrote 2 new slides: Key Findings + Our Recommendation | ~1.5K tokens |
| Financial Framer | Built EV framework with 3 scenarios | ~1.2K tokens |
| Narrative Architect | Redesigned slide order (pyramid principle) | ~800 tokens |
| Implementation Roadmap | Wrote 90-day sprint with decision gates | ~900 tokens |

**Synthesis agent:** Merged all 5 JSON outputs into one unified change manifest. Flagged 7 conflicts/risks for human review.

**What the manifest did to the deck:**
- 27 title rewrites on existing slides
- 4 new slides inserted (Key Findings, Our Recommendation, Financial, 90-Day Roadmap)
- Recommendation moved from slide 16 → slide 4
- 8 blank/transition slides dropped
- 12 slides demoted to appendix
- Final deck: 31 slides

**Files created:**
- `180/tools/manifest.json` — the unified change manifest
- `180/tools/apply_manifest.py` — python-pptx script that applies it
- `180/claude/Deliverable 1 Slide deck - McKinsey v2.pptx` — output

---

### Phase 2 — Research Fan-Out (4 parallel agents)

**What triggered it:** The initial output had wrong colors, wrong font, guessed financial numbers, and a legal error (back-royalty window claimed 2015, correct answer is 2020).

**Agent 1 — printingpress.dev:**
- It's an open-source Claude Code skill factory that generates Go CLIs + MCP servers from any API
- 200+ pre-built CLIs in a public library at printingpress.dev
- No patent-specific CLI exists yet — buildable in ~10 min with `/printing-press` against USPTO OPS or Lens.org
- `edgar` CLI (SEC filings) and `openalex` CLI (academic research) are relevant and immediately installable

**Agent 2 — MCPs for deep research:**
- You currently have zero MCP servers installed
- Top 3 to install:
  - **CourtListener MCP** (free) — all PAE litigation dockets, PTAB decisions, federal court records. `claude mcp add --transport http courtlistener https://mcp.courtlistener.com/`
  - **Exa MCP** (~$25/month) — semantic search, surfaces Richardson Oliver reports, law journals, IAM Media
  - **pptx-xlsx-mcp** (free, Windows) — COM automation to drive live PowerPoint directly instead of python-pptx

**Agent 3 — Real patent acquisition cost data:**

| Data point | Source |
|---|---|
| Brokered market median: $106K–$125K/patent (2022–23) | Richardson Oliver Insights annual report |
| Quality portfolios with evidence-of-use: $150K–$350K/patent | Tangible IP practitioner analysis |
| Rockstar deal benchmark: ~$225K/patent (4,000 networking patents, 2014) | RPX SEC 8-K filing |
| Vantage's the original assignee acquisition: near-zero upfront, the original assignee retains 75% of revenues | Court records / litigation analysis |
| Back-royalty window: 2020, not 2015 | 35 U.S.C. § 286 — 6-year statutory limit |

Structural finding: most NPE acquisitions are not cash purchases. Standard deal = small/zero upfront + revenue share with original patent owner. The "acquisition cost" only becomes visible at settlement.

**Agent 4 — 180DC design standards:**
Found the actual brand spec embedded in slide 38 of the deck itself:
- `#4b5050` — charcoal (title text, all words except last)
- `#55b441` — green (final title word + thin top bar + accents)
- `#6e7378` — grey (body text, subtitles)
- Font: **Lato** on everything
- Every slide: thin green bar at top, ALL CAPS title, final word in green, footer with "180 Degrees Consulting" + slide number
- The original new slides (navy + McKinsey blue) were a completely different visual identity — wrong

---

### Phase 3 — Fixes Applied

**Design rewrite:**
- New color palette: DC_CHARCOAL, DC_GREEN, DC_GREY replacing navy/blue
- `add_chrome()` function: thin green bar + ALL CAPS title with final word green + footer on every new slide
- Lato font applied to every text run
- All 4 new slide builders rewritten

**Financial data update:**
- Replaced [VERIFY] guesses with citable public sources (Richardson Oliver, RPX 8-K, Tangible IP)
- Corrected back-royalty window: 2020 not 2015
- Scenario ranges revised: Conservative $15M–$120M, Base $80M–$400M, Upside $200M–$600M+

**Bug fixes:**
- Original slide title overflow: font size capped at 14pt Lato so long titles don't crash into body content
- EXEC_B patent block parser: fixed pairing logic, added 0.5" bottom margin so 3rd block never clips

---

## Key frameworks the system applies

**1. Pyramid Principle** *(Barbara Minto / McKinsey)*
Answer first, evidence second. Original deck: recommendation at slide 16. After: recommendation at slide 4. The reader should know what to conclude before they've seen any evidence. Structurally, this means reordering every section so the "so what" comes before the "how we got there."

**2. Action Titles / Assertion Headlines** *(Minto; standard BCG/Bain/McKinsey)*
Every title must be a complete sentence stating the finding, not a topic label. The reader should be able to read only the titles and understand the full argument without reading the body. "Scoring Framework" → "Video streaming and RTC score perfect marks — both are Tier 1 priorities." This is the highest-leverage single change per slide.

**3. Citation over estimation** *(litigation consulting / expert witness standard)*
Financial claims sourced from public records (Richardson Oliver, SEC filings, court verdicts), not modeled from assumptions. One wrong number destroys credibility with a sophisticated IP client. The system flags unverifiable claims explicitly rather than hiding uncertainty.

---

## Most impactful before/after — slide 9 title

| | Text |
|---|---|
| **Before** | *"Favorable shifts in patent law and enforcement environment"* |
| **After** | *"Courts now favor patent holders: damages hit $4.3B in 2024 alone"* |

Same slide, same layout, purely a title change. Before: topic label, zero information, reader must read the body. After: complete assertion with a defensible data point — reader understands the finding before looking at a single chart. This one slide demonstrates all three frameworks simultaneously and is the cleanest visual for a demo.

The structural before/after (recommendation at slide 16 → slide 4) is arguably bigger but harder to show in a single image.

---

## Human review flags before any client delivery

1. **Back-royalty window** — now shows 2020 (§ 286 six-year cap). Verify exact date with Delaware counsel.
2. **$4.3B 2024 damages figure** — cited in Key Findings. Needs attributed source (PwC Patent Litigation Study or Docket Navigator) before presenting.
3. **Federated learning pre-dates Google claim** — slide 19 title. No filing dates cited. Verify before keeping.
4. **All EV scenario ranges** — illustrative only. Must be reviewed by litigation counsel before client presentation.
5. **the original assignee 75% revenue share** — sourced from court records. Confirm exact percentage from Vantage's own records.
6. **IPR rejection rate 40% (2025)** — forward-looking, may be stale. Confirm with current PTAB statistics.

---

## What's still open

**Infrastructure (future versions):**
- No USPTO patent CLI in the printing press library yet — buildable with `/printing-press` against OPS API
- CourtListener MCP would let future research agents pull live PAE verdict data in real time
- Exa MCP would surface Richardson Oliver and IAM Media reports dynamically instead of relying on agent training data

**PPTX design (manual work remaining):**
- 4 slides have no standard title placeholder (slides 1, 4, 16, 35) — titles on those need manual edits in PowerPoint
- Bubble chart redesign (slide 25) requires human in PowerPoint
- Section divider slides and 3-column box layouts need manual visual treatment

---

## Demo readiness verdict

**The improvement feature is demonstrable now.** What you have:
- A real deliverable (not a toy example)
- A working fan-out pipeline with actual output files
- Clear before/after (slide 9 title is the cleanest visual proof)
- Token efficiency argument: 310K tokens → ~8K tokens for equivalent analytical work
- Three named frameworks with research origins you can cite in a pitch

**The one thing worth doing before the pitch:** one comparison slide — slide 9 before/after, with the three framework labels annotated. That turns "look what it outputs" into "here is the defensible methodology." That's the delta between a feature demo and a pitch for a system.

---

## Files produced this session

| File | What it is |
|---|---|
| `180/tools/mckinsey_transform_prompt.md` | The original workflow design (you brought this in) |
| `180/tools/manifest.json` | Unified change manifest output by synthesis agent |
| `180/tools/apply_manifest.py` | python-pptx script that applies the manifest to the deck |
| `180/tools/session_summary.md` | This document |
| `180/claude/Deliverable 1 Slide deck - McKinsey v2.pptx` | Final transformed output |
