# Pitch Deck — Prompt + Talk Track

Five clean slides in the "one idea per slide" style (cream background, rust diamond nodes, thin connectors, big title, single bottom caption). Slide 4 is the ranking slide you already mocked up — the rest match it so the deck feels like one set.

---

## THE PROMPT

Paste into a slide/diagram AI (Gamma, Beautiful.ai, an image model run once per slide, etc.). The STYLE block is shared by every slide — keep it identical so the deck is consistent.

```
STYLE (apply to every slide, identical):
- Format: single 16:9 slide, presentation quality, lots of whitespace, minimal text.
- Background: warm off-white / cream (#FAF6F0).
- Accent color: muted rust/terracotta orange (#B8502E) — used for outlined diamond
  nodes, small icons, and the eyebrow kicker text. Diamonds are OUTLINED, not filled.
- Connectors: thin warm-grey lines and small arrowheads.
- Title: large, bold, near-black, top-left or top-center.
- Eyebrow kicker above the title: small, uppercase, letter-spaced, rust color.
- One short caption in muted grey along the bottom. No other paragraphs.
- Result panels: a thin-bordered rounded white card.
- Flat, modern, editorial. No clutter, no stock photos, no gradients.

Generate these 5 slides as one consistent set:

SLIDE 1 — OVERVIEW
  Kicker: HOW IT WORKS
  Title: "From 500 forms to a shortlist humans trust"
  Diagram (left to right): a rounded box "500 applications" → four small
  outlined-diamond step nodes in a row labeled "Blind", "Gate", "Rank", "Check"
  → a thin-bordered card labeled "Shortlist" → a small person icon labeled
  "Humans decide".
  Caption: "The system ranks and flags. It never rejects anyone."

SLIDE 2 — INTAKE
  Kicker: STEP 1 — INTAKE
  Title: "Every applicant, read fresh and blind"
  Diagram: a box "Google Form" → a card "Package = resume + motivation letter"
  → a node with a small scissors icon labeled "Blind (names off)" → a card
  "Blinded package".
  Caption: "Names come off before any AI looks. Bias can't see what isn't there."

SLIDE 3 — THE GATE
  Kicker: STEP 2 — THE GATE
  Title: "Drop only the non-starters"
  Diagram: a box "500" → a wide funnel/gate shape labeled "Gate — forgiving"
  → a smaller box "Shortlist". Beside the gate, three small rust tags:
  "current student", "working resume link", "complete application".
  Small note near the gate: "~80% pass".
  Caption: "Three checks, nothing about GPA or school. When unsure, it lets you in."

SLIDE 4 — THE RANKING
  Kicker: STEP 3 — THE RANKING
  Title: "Rank by judgment, two at a time"
  Diagram: a box "shortlist" → a tournament bracket of outlined diamond nodes
  in three columns labeled "Round 1", "Round 2", "Final", connected by thin lines,
  with tiny "fresh agent" labels under a couple of nodes → a thin-bordered card
  titled "Ranked" showing a short numbered list (1, 2, 3 … 150).
  Caption: "Pairwise comparisons. Code holds the bracket; every match is a fresh agent."

SLIDE 5 — REVIEW & HANDOFF
  Kicker: STEP 4 — REVIEW & HANDOFF
  Title: "Double-check the top, then hand it to people"
  Diagram: a card "Ranked list" → one or two nodes with a small magnifying-glass
  icon labeled "Reviewer agents" → three stacked tags "Advance", "Borderline",
  "Below the line" → a person icon labeled "Human committee".
  Caption: "A different agent checks the top. Humans draw every line."

Use a small robot icon for AI steps (Blind, Rank, Reviewer) and a gear icon for any
code/automation step. Keep every slide as sparse as the reference.
```

---

## THE TALK TRACK — what to say over each slide

### Slide 1 — Overview
"Recruiting gets around five hundred applications a cycle. Today, sorting those by hand takes days, and the person reading number four hundred is a lot more tired than the one reading number one. This system does that sorting in a few hours. It reads everyone, blinds them, drops the obvious non-starters, ranks the rest, double-checks the top, and hands over a shortlist. And the one line to remember for the whole thing: it ranks and it flags — it never rejects anyone. A human always makes the final call."

### Slide 2 — Intake
"First it reads every applicant — the resume and the motivation letter together, as one package. The letter matters more than it looks: a CV tells you what someone did, but their real reason for wanting 180DC only shows up in the letter. Then, before any AI looks at anyone, it strips the names off. We judge the work, not the person — and bias can't act on something it can't see."

### Slide 3 — The gate
"Next is a gate, and the important word is *forgiving*. It only removes genuine non-starters — someone who isn't a student, a broken resume link, a half-finished application. That's it. Three checks. Nothing about your GPA, your major, or which university you go to — because 180DC recruits across all backgrounds, and we're not going to quietly filter that out. About eighty percent pass through. When it's unsure, it lets you in, because a mistake here is the one that's permanent."

### Slide 4 — The ranking
"This is the heart of it. Instead of scoring five hundred people cold — which is noisy and drifts — it compares them two at a time: between these two, who fits the rubric better, and why? Each of those little match-ups is a fresh, independent agent that sees only those two people and then disappears, so nobody gets a tired reviewer. A sorting process turns thousands of those small, reliable judgments into one clean ranked list. And the bracket itself — the running order — is held by plain code, not the AI, so the ranking stays exact and can't drift."

### Slide 5 — Review & handoff
"Once the list settles, a second set of agents checks the top — and here's the key: it's a *different* agent than the one that made the original call. That separation is what catches mistakes instead of repeating them. It flags anyone who landed higher than they should have. Then the output isn't one long list — it's three buckets: clearly in, borderline, and below the line, each with the reasons attached. The borderline band is built wide on purpose, because that's exactly where a human should be deciding. The committee draws every line and sends every decision. The system saved them the days of sorting — it didn't take the judgment away from them."

### Closing line (optional, after slide 5)
"So it's trustworthy for a simple reason: the work is divided up. Every single judgment the system makes is small and easy to get right — and nothing it decides ever goes unchecked by a person."
