# 180DC AI

AI tooling and methodology for a 180 Degrees Consulting branch, built by the branch AI team. The thesis is simple: every student deliverable should get an MBB senior reviewer treatment before it reaches a client, the work that does not need a human should be faster, and the consultant should learn the principle behind every fix rather than just receive the answer.

This repo is two things at once:

1. A working toolkit a branch can actually run (the quality reviewer, the HR screener, the deck transform).
2. A portfolio of how we think about applying AI to consulting, with the research and the design decisions behind each tool.

## What is here

| Area | What it is |
|---|---|
| [tools/quality-reviewer](tools/quality-reviewer/) | Reviews a deliverable against five MBB criteria, returns one JSON object, renders a coaching dashboard. Quote-or-abstain, max three findings, no ghostwriting. |
| [tools/hr-screening](tools/hr-screening/) | First-stage resume ranking for a recruiting cycle. Ranks, never rejects: humans draw every cutoff. Design and evidence base. |
| [tools/deck-transform](tools/deck-transform/) | Fan-out / fan-in workflow that lifts a deliverable toward a McKinsey-tier deck. Methodology and notes. |
| [research/](research/) | The evidence base behind the methodology: six research angles plus the verification record. |
| [ideas/](ideas/) | The brainstorming and idea-linkage space. Diagrams first. This is where the next phase of work lives. |
| [docs/](docs/) | Mission, architecture and operating guides. |

## Quick start

- **Quality reviewer:** open [tools/quality-reviewer/index.html](tools/quality-reviewer/index.html) in a browser. Press Run review for the scripted demo, or load one of the [examples](tools/quality-reviewer/examples/). The contract and methodology are in [SYSTEM-PROMPT.md](tools/quality-reviewer/SYSTEM-PROMPT.md). Validate any review with `node check-review.js <file>.json`.
- **Read the thinking:** start with [docs/overview.md](docs/overview.md) for the mission, then [docs/architecture.md](docs/architecture.md) for how the pieces fit.

## How we work right now

The near-term focus is less building and more thinking: mapping directions, connecting ideas and pressure-testing them before we commit to building. The [ideas/](ideas/) space is built for that. It keeps every idea as a small card and links them in a single visual map so two people can brainstorm against the same picture. See [ideas/idea-map.md](ideas/idea-map.md).

When we do build, [docs/workflow.md](docs/workflow.md) is the rule: `main` always works, every experiment lives on its own branch, and versions are tagged so we can always roll back. A bad experiment never touches the working tool. Pushes are tracked in [CHANGELOG.md](CHANGELOG.md).

## Confidentiality

Every example in this repo is anonymized. Real client deliverables, names and slide decks are never committed. Pseudonyms (for example "Vantage IP", "Verde Foods", "Riverside Project") stand in for real clients, and the worked examples are illustrative. If you add a new example, anonymize it first.

## Maintainers

The branch AI team (two co-heads). Built on the Claude Agent SDK toolchain.
