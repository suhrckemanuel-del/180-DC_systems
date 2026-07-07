# 180DC AI

AI tooling, methodology and education systems for a 180 Degrees Consulting branch, built by the branch AI team. The thesis: every student deliverable should get an MBB senior-reviewer treatment before it reaches a client, the work that does not need a human should be faster, and the consultant should learn the principle behind every fix rather than just receive the answer.

**New here — teammate or collaborator?** Read [CONTEXT.md](CONTEXT.md) first. It is a single self-contained briefing of everything in this repo: what exists, why, in what state, and what help is needed. It is deliberately written so you can also paste it (or this whole repo) into an AI assistant and immediately work with full context.

## The map

The repo is four layers: **principles → tools → idea pipeline → people systems.**

### 1. Principles and evidence — *why we build the way we build*

| Where | What |
|---|---|
| [docs/overview.md](docs/overview.md) | The mission and the five principles every tool must obey (quote-or-abstain, teach-don't-ghostwrite, rank-don't-reject, deterministic contract, honest calibration) |
| [docs/architecture.md](docs/architecture.md), [docs/workflow.md](docs/workflow.md) | How the pieces fit; how we branch, version and ship |
| [research/](research/) | The evidence base: deliverable quality anatomy, student-consulting failure modes, professional QA practice, training and knowledge transfer |

### 2. Tools — *what is built or designed*

| Tool | State | What it is |
|---|---|---|
| [tools/quality-reviewer](tools/quality-reviewer/) | **Shipped (v1)**, pilot run on a real deliverable | Reviews a deliverable against five MBB criteria, one JSON object, coaching dashboard. Quote-or-abstain, max three findings, no ghostwriting |
| [tools/quality-reviewer/v2](tools/quality-reviewer/v2/) | **Design + validation phase** (branch `idea/reviewer-v2`) | The serious version: 10-dimension rubric, blocking-issue readiness, eval harness, and a real-deck gold set — 14 pseudonymised real deliverables prepared for blind human labeling |
| [tools/hr-screening](tools/hr-screening/) | **Designed**, gated on HR meeting | First-stage application ranking. Ranks, never rejects; humans draw every cutoff |
| [tools/deck-transform](tools/deck-transform/) | **Methodology proven** | Fan-out/fan-in agent workflow that lifts a deck toward MBB structure |

### 3. The idea pipeline — *what could be built next, already pressure-tested*

| Where | What |
|---|---|
| [lab/](lab/) | The AI workflow lab output: **25 demo-able workflow ideas** ([demos.md](lab/demos.md)), ranked ([ranking.md](lab/ranking.md)), with the **top 7 built out to full packs** ([top7/](lab/top7/)) — each with three critique passes, prototype spec, demo script, workshop exercise, prompt pack, quality rubric, rollout plan and risks |
| [guide/](guide/) | **The method to reproduce the lab** — how a future member runs the whole pipeline (problem inventory → 25 ideas → ranking → critiques → build packs) without the current AI team in the room |
| [ideas/](ideas/) | The living backlog and idea map; every idea is a card with a stage |

The top 7, in rank order: [Red-Team CEO](lab/top7/01-red-team-ceo.md) · [Discovery-to-Proposal Copilot](lab/top7/02-discovery-to-proposal.md) · [Client Meeting Simulator](lab/top7/03-client-meeting-simulator.md) · [Branch Brain](lab/top7/04-branch-brain.md) · [TL Meeting Copilot](lab/top7/05-tl-meeting-copilot.md) · [Case Interview Gym](lab/top7/06-case-interview-gym.md) · [Kickoff-in-a-Box](lab/top7/07-kickoff-in-a-box.md).

### 4. People systems — *how the branch learns*

| Where | What |
|---|---|
| [education/](education/) | The education system: a [critical attack on the standard workshop model](education/01-why-workshops-fail.md) (ten failure modes, each with a design answer), a [three-literacy curriculum](education/02-curriculum.md) (consulting craft, AI literacy, AI-assisted consulting, plus a builder/succession track), and the [operating model](education/03-operating-model.md) (formats, roles, materials pipeline, evidence-based assessment) |

## Quick start

- **See a tool work:** open [tools/quality-reviewer/index.html](tools/quality-reviewer/index.html) in a browser; press *Run review* for the scripted demo. Validate any review with `node check-review.js <file>.json`.
- **Understand the thinking:** [docs/overview.md](docs/overview.md), then [CONTEXT.md](CONTEXT.md).
- **Pick something up:** [CONTEXT.md § Where help is needed](CONTEXT.md#where-help-is-needed) lists the open workstreams with entry points.

## How we work

`main` always works; every experiment lives on its own branch; versions are tagged; pushes are tracked in [CHANGELOG.md](CHANGELOG.md). See [docs/workflow.md](docs/workflow.md). Current active branch: `idea/reviewer-v2` (Reviewer V2 design + real-deck gold set + the lab and education systems).

## Confidentiality

Every example in this repo is anonymized or pseudonymized. Real client deliverables, names and decks are never committed; the raw real-deck intake material stays local and gitignored ([.gitignore](.gitignore)). Pseudonyms ("Vantage IP", "Client R03"…) stand in for real clients. If you add material, anonymize first — then run a search for the real name before committing.

## Maintainers

The branch AI team (two co-heads). Built on the Claude Agent SDK toolchain.
