# Tools

Three tools, one design pattern: the model returns a structured object, a static template owns the output, and they meet only through a schema. See [../docs/architecture.md](../docs/architecture.md).

## [quality-reviewer](quality-reviewer/)
The flagship. Reviews a deliverable against five MBB criteria and returns one JSON object that drives a coaching dashboard. Quote-or-abstain, max three findings, no ghostwriting. Working renderer with a headless test harness. Status: piloted on a real deliverable.

Run it: open `quality-reviewer/index.html`. Validate a review: `node quality-reviewer/check-review.js <file>.json`.

## [hr-screening](hr-screening/)
First-stage resume ranking for a recruiting cycle. Blind pass, forgiving gate, order-swapped pairwise tournament, verify, three buckets. It ranks, it never rejects: humans draw every cutoff. Status: designed and evidence-backed, not yet built.

## [deck-transform](deck-transform/)
A fan-out / fan-in agent workflow that lifts a deliverable toward a McKinsey-tier deck. Five specialist agents each see only their slice, a synthesis agent resolves conflicts, a writer applies the change manifest. Status: methodology proven on a deck, documented as notes.
