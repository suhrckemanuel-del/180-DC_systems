# Overview

## The mandate

A 180 Degrees Consulting branch runs on student teams doing pro bono strategy work for non-profits and small organizations. The realistic alternative to an AI reviewer is not a better reviewer, it is no substantive review at all. That gap is the opening.

The branch AI team owns three jobs:

1. **Quality.** Every deliverable gets a senior reviewer treatment before it reaches the client.
2. **Speed.** The work that does not need a human (first-pass screening, deck cleanup) gets faster.
3. **Teaching.** Consultants learn the principle behind each fix, so the skill compounds across projects.

The guiding line: solve the problems no one else is trying to solve, and build things the branch can actually run without us in the room.

## The principles that shape every tool

- **Quote or abstain.** A finding without a verbatim quote does not exist. This is what separates a reviewer from a plausible-sounding generator.
- **Teach, do not ghostwrite.** Tools surface the gap and the principle. They do not hand over finished slide text. The consultant does the rewrite. That is the point.
- **Rank, do not reject.** Where we screen people, the tool orders and a human draws every cutoff.
- **Deterministic contract.** The model returns one structured object. A static template owns every pixel. The two only meet through a schema. This keeps output auditable and stable.
- **Honest calibration.** A strong deliverable earns a high score and fewer findings. A reviewer that always finds three criticals is not trustworthy.

## The three tools

- **Quality Reviewer** (flagship): five criteria, quote-or-abstain, max three findings, a coaching arc that locks the fix behind the consultant's own attempt. See [../tools/quality-reviewer](../tools/quality-reviewer/).
- **HR Screener** (designed, gated): blind pass, forgiving gate, pairwise tournament, verify, three buckets. Ranks never rejects. See [../tools/hr-screening](../tools/hr-screening/).
- **Deck Transform** (methodology): a fan-out / fan-in agent workflow that lifts a deliverable toward MBB structure. See [../tools/deck-transform](../tools/deck-transform/).

## Why a repo, and why now

Two reasons. First, a portfolio: a clear record of how a branch applied AI to consulting, usable by other branches and readable by anyone. Second, a workbench: the next phase is more brainstorming than building, so the repo carries a dedicated [ideas](../ideas/) space to map and connect directions before we commit to them.

See [architecture.md](architecture.md) for how the pieces fit together.
