# The Education System

How the branch teaches three things — consulting craft, AI literacy, and AI-assisted consulting as a combined discipline — after critically attacking the standard workshop model and rebuilding education from its failure modes up.

This grows the [workshop-curriculum idea card](../ideas/cards/workshop-curriculum.md) from a spark into a designed system, and it is the teaching leg of the branch mandate ([docs/overview.md](../docs/overview.md)) made structural.

## What is in here

| File | What it is |
|---|---|
| [01-why-workshops-fail.md](01-why-workshops-fail.md) | The critical attack: ten failure modes of the standard workshop model, each with evidence, each with the design answer that this system builds in |
| [02-curriculum.md](02-curriculum.md) | The three-literacy curriculum: consulting craft, AI literacy, AI-assisted consulting — plus the builder track for the next AI team. Module map with formats, moments, and evidence of learning |
| [03-operating-model.md](03-operating-model.md) | The delivery engine: session formats, the semester calendar, roles, the materials pipeline, assessment, and the quality loop that makes teaching improve itself |

## The system in one paragraph

The branch stops running workshops as events and starts running education as infrastructure. Teaching happens at the **moment of need** (kickoff week teaches scoping, final week teaches red-teaming), in **short artifact-producing formats** (every session ends with something the learner keeps using), with **the tools themselves as the teachers** (the Quality Reviewer's coaching arc, the Dojo's drills, the Simulator's debriefs — embedded practice, not bolt-on lectures), assessed by **observed evidence, not attendance**, from **materials that live in this repo** and survive every presenter's graduation. AI is taught as **judgment, not features**: what to delegate, how to verify, when to abstain — because a consultant who can't check AI output is more dangerous than one who doesn't use AI at all.

## Design constraints inherited from the branch

- **Attempt before answer.** No session reveals a fix before the learner tries one (the Quality Reviewer's coaching-arc lock, generalized to all teaching).
- **Quote or abstain, taught as a personal habit** — not just a tool contract. The core AI-literacy skill is demanding evidence from a model the way the reviewer demands quotes.
- **Teach, do not ghostwrite.** The measure of every module is what the learner can do without the tool afterwards.
- **Materials as code.** Every module is a file in this repo (prompt packs included) so any member — or any chatbot they paste it into — can run it. Presenter-bound knowledge is a defect.

## How it connects

- The [lab's top-7 tools](../lab/ranking.md) are the practice surfaces: each ships with a workshop exercise and prompt pack already written ([lab/top7/](../lab/top7/)).
- The [Findings-to-Curriculum Miner](../lab/demos.md#10-findings-to-curriculum-miner) keeps content branch-specific: what this branch actually gets wrong becomes what this branch teaches.
- The evidence base is [research/05-training-and-knowledge-transfer](../research/05-training-and-knowledge-transfer/findings.md): apprenticeship + simulation over lectures (F1), deliberate practice (F3), the jagged frontier (F4), cognitive apprenticeship via LLMs (F7), and the 20–40% vs 70–90% retention gap between bolt-on and embedded learning (F10).
- [Workshop Forge](../lab/demos.md#24-workshop-forge) is the production line that turns any new tool or principle into a runnable session.
